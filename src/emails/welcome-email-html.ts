/**
 * Welcome email template as plain HTML string.
 * Mirrors the design from WelcomeNewsletter.tsx but avoids JSX/React
 * dependencies in Vercel API functions (pnpm doesn't hoist @react-email/* sub-packages).
 */
export function renderWelcomeEmail(email: string): string {
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /></head>
<body style="background-color:#0d1117;font-family:'Outfit','Helvetica Neue',Arial,sans-serif;margin:0;padding:40px 0;">
  <div style="max-width:560px;margin:0 auto;background-color:#111827;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);">

    <!-- Header -->
    <div style="padding:28px 40px 24px;background-color:#0d1117;">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="display:inline-flex;width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#6366f1,#a78bfa);align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff;text-align:center;line-height:32px;">A</span>
        <span style="font-size:18px;font-weight:700;color:#f8fafc;letter-spacing:-0.02em;">Arkeonix Labs</span>
      </div>
    </div>

    <!-- Gradient bar -->
    <div style="height:2px;background:linear-gradient(90deg,transparent,#6366f1,#a78bfa,#6366f1,transparent);"></div>

    <!-- Content -->
    <div style="padding:40px 40px 32px;">
      <h1 style="font-size:28px;font-weight:800;color:#f8fafc;letter-spacing:-0.03em;line-height:1.2;margin:0 0 20px;">Welcome to the lab.</h1>

      <p style="font-size:15px;line-height:1.7;color:rgba(248,250,252,0.75);margin:0 0 16px;">
        You're now part of <strong>Arkeonix Labs</strong> &mdash; a technical publication focused on in-depth analysis, product reviews, and infrastructure guides crafted with precision.
      </p>

      <p style="font-size:15px;line-height:1.7;color:rgba(248,250,252,0.75);margin:0 0 16px;">
        Here's what you'll receive in your inbox:
      </p>

      <!-- Feature list -->
      <div style="margin:24px 0;padding:20px 24px;background-color:rgba(99,102,241,0.08);border-radius:12px;border:1px solid rgba(99,102,241,0.2);">
        <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">
          <span style="color:#818cf8;font-size:10px;margin-top:4px;flex-shrink:0;">&#9670;</span>
          <p style="font-size:14px;line-height:1.6;color:rgba(248,250,252,0.8);margin:0;"><strong>Technical deep-dives</strong> &mdash; CPU reviews, server builds, hardware benchmarks</p>
        </div>
        <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">
          <span style="color:#818cf8;font-size:10px;margin-top:4px;flex-shrink:0;">&#9670;</span>
          <p style="font-size:14px;line-height:1.6;color:rgba(248,250,252,0.8);margin:0;"><strong>Lab experiments</strong> &mdash; infrastructure guides, deployment walkthroughs</p>
        </div>
        <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:0;">
          <span style="color:#818cf8;font-size:10px;margin-top:4px;flex-shrink:0;">&#9670;</span>
          <p style="font-size:14px;line-height:1.6;color:rgba(248,250,252,0.8);margin:0;"><strong>Tech news</strong> &mdash; curated and analyzed under the Arkeonix standard</p>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin:32px 0;">
        <a href="https://www.arkeonixlabs.com/blog" style="background-color:#6366f1;color:#fff;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;display:inline-block;letter-spacing:-0.01em;">Read the latest analysis &rarr;</a>
      </div>

      <hr style="border-color:rgba(255,255,255,0.08);margin:24px 0;" />

      <p style="font-size:12px;line-height:1.6;color:rgba(248,250,252,0.35);margin:0 0 8px;">
        You subscribed with <a href="mailto:${email}" style="color:#818cf8;text-decoration:underline;">${email}</a>.
        If this was a mistake, you can ignore this email &mdash; you won't receive any further messages until confirmed.
      </p>

      <p style="font-size:12px;color:rgba(248,250,252,0.25);margin:0;letter-spacing:0.02em;">
        &copy; ${year} Arkeonix Labs &middot; Built with precision
      </p>
    </div>

  </div>
</body>
</html>`;
}
