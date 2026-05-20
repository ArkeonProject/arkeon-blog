import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  LAB_LIST_SELECT,
  POST_LIST_SELECT,
  getContentLanguageFromRequest,
  loadBlogListData,
  loadLabListData,
} from "../seoLoaders";
import type { LabPostListItem } from "@/types/lab";
import type { PostListItem } from "@/types/post";

type QueryResult<T> = {
  data: T[] | null;
  error: { message: string } | null;
  count: number | null;
};

function requestWithCookie(cookie: string) {
  return new Request("https://arkeonixlabs.com/blog", {
    headers: { Cookie: cookie },
  });
}

function createListClient<T>(result: QueryResult<T>) {
  const calls: string[] = [];

  const builder = {
    eq(column: string, value: string) {
      calls.push(`eq:${column}:${value}`);
      return builder;
    },
    order(column: string, options: { ascending: boolean }) {
      calls.push(`order:${column}:${String(options.ascending)}`);
      return builder;
    },
    range(from: number, to: number) {
      calls.push(`range:${from}:${to}`);
      return Promise.resolve(result);
    },
    ilike(column: string, pattern: string) {
      calls.push(`ilike:${column}:${pattern}`);
      return builder;
    },
    contains(column: string, value: string[]) {
      calls.push(`contains:${column}:${value.join(",")}`);
      return builder;
    },
  };

  return {
    calls,
    client: {
      from(table: string) {
        calls.push(`from:${table}`);
        return {
          select(columns: string, options: { count: "exact" }) {
            calls.push(`select:${columns}:${options.count}`);
            return builder;
          },
        };
      },
    },
  };
}

describe("seo list loaders", () => {
  test("getContentLanguageFromRequest resolves EN cookie and defaults to ES", () => {
    assert.strictEqual(getContentLanguageFromRequest(requestWithCookie("arkeonix_locale=en")), "EN");
    assert.strictEqual(getContentLanguageFromRequest(requestWithCookie("theme=dark")), "ES");
  });

  test("loadBlogListData selects listing fields without content", async () => {
    const post: PostListItem = {
      id: 1,
      title: "Post",
      slug: "post",
      excerpt: "Excerpt",
      published_at: "2026-05-20",
      language: "ES",
      category: "QA",
    };
    const { calls, client } = createListClient<PostListItem>({ data: [post], error: null, count: 1 });

    const result = await loadBlogListData(requestWithCookie(""), client, 9);

    assert.deepStrictEqual(result, { posts: [post], totalCount: 1, language: "ES" });
    assert.ok(calls.includes("from:posts"));
    assert.ok(calls.includes(`select:${POST_LIST_SELECT}:exact`));
    assert.ok(!POST_LIST_SELECT.includes("content"));
    assert.ok(calls.includes("eq:language:ES"));
    assert.ok(calls.includes("eq:status:published"));
    assert.ok(calls.includes("range:0:8"));
  });

  test("loadBlogListData fails closed on query error", async () => {
    const originalError = console.error;
    console.error = () => undefined;
    try {
      const { client } = createListClient<PostListItem>({ data: null, error: { message: "boom" }, count: null });

      const result = await loadBlogListData(requestWithCookie("arkeonix_locale=en"), client, 9);

      assert.deepStrictEqual(result, { posts: [], totalCount: 0, language: "EN" });
    } finally {
      console.error = originalError;
    }
  });

  test("loadLabListData selects lab listing fields and respects EN cookie", async () => {
    const post: LabPostListItem = {
      id: 1,
      title: "Lab",
      slug: "lab",
      excerpt: "Excerpt",
      published_at: "2026-05-20",
      language: "EN",
      tags: ["server"],
      difficulty: "beginner",
    };
    const { calls, client } = createListClient<LabPostListItem>({ data: [post], error: null, count: 1 });

    const result = await loadLabListData(requestWithCookie("arkeonix_locale=en"), client, 6);

    assert.deepStrictEqual(result, { posts: [post], totalCount: 1, language: "EN" });
    assert.ok(calls.includes("from:lab_posts"));
    assert.ok(calls.includes(`select:${LAB_LIST_SELECT}:exact`));
    assert.ok(calls.includes("eq:language:EN"));
    assert.ok(calls.includes("range:0:5"));
  });
});
