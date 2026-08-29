import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { buildSitemapXml } from "../sitemap";

describe("dynamic sitemap", () => {
  test("includes static pages and deduplicated published post routes", () => {
    const xml = buildSitemapXml({
      now: new Date("2026-08-29T12:00:00Z"),
      posts: [
        { slug: "building-software-is-easy-selling-it-is-hard", published_at: "2026-08-29T12:52:00+00:00" },
        { slug: "building-software-is-easy-selling-it-is-hard", published_at: "2026-08-29T12:52:00+00:00" },
      ],
      labPosts: [{ slug: "homelab", published_at: "2026-04-26T00:00:00+00:00" }],
    });

    assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
    assert.match(xml, /<loc>https:\/\/arkeonixlabs\.com\/blog<\/loc>/);
    assert.match(xml, /<loc>https:\/\/arkeonixlabs\.com\/post\/building-software-is-easy-selling-it-is-hard<\/loc>/);
    assert.match(xml, /<lastmod>2026-08-29<\/lastmod>/);
    assert.match(xml, /<loc>https:\/\/arkeonixlabs\.com\/lab\/homelab<\/loc>/);
    assert.equal((xml.match(/building-software-is-easy-selling-it-is-hard/g) ?? []).length, 1);
  });
});
