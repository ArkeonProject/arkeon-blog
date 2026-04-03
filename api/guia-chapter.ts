import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Missing slug parameter' }), { status: 400 });
    }

    // Get the session cookie from the request
    const cookie = req.headers.get('cookie') || '';
    const sessionMatch = cookie.match(/sb-[^=]+=([^;]+)/);
    const accessToken = sessionMatch ? decodeURIComponent(sessionMatch[1]) : null;

    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    // Verify the user's session
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401 });
    }

    // Fetch the chapter
    const { data: chapter, error: chapterError } = await supabaseAdmin
      .from('guia_chapters')
      .select('slug, title, content, is_free, "order"')
      .eq('slug', slug)
      .single();

    if (chapterError || !chapter) {
      return new Response(JSON.stringify({ error: 'Chapter not found' }), { status: 404 });
    }

    // If chapter is free, return it
    if (chapter.is_free) {
      return new Response(JSON.stringify({ chapter }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For premium chapters, check user access
    const { data: access } = await supabaseAdmin
      .from('user_access')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', 'guia_junior')
      .eq('status', 'active')
      .single();

    if (!access) {
      return new Response(JSON.stringify({ error: 'Access denied. Premium content requires active subscription.' }), { status: 403 });
    }

    return new Response(JSON.stringify({ chapter }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chapter API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
