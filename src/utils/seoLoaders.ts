import type { LabPostListItem } from "@/types/lab";
import type { PostListItem } from "@/types/post";

export const POST_LIST_SELECT = "id, title, slug, excerpt, cover_image, published_at, language, category, product_category, status";
export const LAB_LIST_SELECT = "id, title, slug, excerpt, cover_image, published_at, language, tags, difficulty";

export type ContentLanguage = "ES" | "EN";

type QueryError = { message?: string } | null;

type QueryResult<T> = {
  data: T[] | null;
  error: QueryError;
  count: number | null;
};

type QueryBuilder<T> = {
  eq(column: string, value: string): QueryBuilder<T>;
  order(column: string, options: { ascending: boolean }): QueryBuilder<T>;
  range(from: number, to: number): Promise<QueryResult<T>>;
  ilike?(column: string, pattern: string): QueryBuilder<T>;
  contains?(column: string, value: string[]): QueryBuilder<T>;
};

export type SupabaseListClient<T> = {
  from(table: string): {
    select(columns: string, options: { count: "exact" }): QueryBuilder<T>;
  };
};

export type ListLoaderData<T> = {
  posts: T[];
  totalCount: number;
  language: ContentLanguage;
};

export function getContentLanguageFromRequest(request: Pick<Request, "headers">): ContentLanguage {
  const cookieHeader = request.headers.get("Cookie") || "";
  return cookieHeader.includes("arkeonix_locale=en") ? "EN" : "ES";
}

export async function loadBlogListData(
  request: Pick<Request, "headers">,
  client: SupabaseListClient<PostListItem> | null,
  pageSize: number,
): Promise<ListLoaderData<PostListItem>> {
  const language = getContentLanguageFromRequest(request);

  if (!client) {
    return { posts: [], totalCount: 0, language };
  }

  const { data, error, count } = await client
    .from("posts")
    .select(POST_LIST_SELECT, { count: "exact" })
    .eq("language", language)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(0, pageSize - 1);

  if (error) {
    console.error("Error preloading blog posts:", error);
    return { posts: [], totalCount: 0, language };
  }

  return { posts: data ?? [], totalCount: count ?? 0, language };
}

export async function loadLabListData(
  request: Pick<Request, "headers">,
  client: SupabaseListClient<LabPostListItem> | null,
  pageSize: number,
): Promise<ListLoaderData<LabPostListItem>> {
  const language = getContentLanguageFromRequest(request);

  if (!client) {
    return { posts: [], totalCount: 0, language };
  }

  const { data, error, count } = await client
    .from("lab_posts")
    .select(LAB_LIST_SELECT, { count: "exact" })
    .eq("language", language)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(0, pageSize - 1);

  if (error) {
    console.error("Error preloading lab posts:", error);
    return { posts: [], totalCount: 0, language };
  }

  return { posts: data ?? [], totalCount: count ?? 0, language };
}
