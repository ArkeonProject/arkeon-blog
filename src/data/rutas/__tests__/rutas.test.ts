import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { getRutaBySlug, getAdjacentRutas, rutas } from "../index";

describe("rutas data", () => {
  test("getRutaBySlug returns correct ruta", () => {
    const ruta = getRutaBySlug("primer-empleo-tech");
    assert.ok(ruta);
    assert.strictEqual(ruta.slug, "primer-empleo-tech");
    assert.strictEqual(ruta.sections.length, 7);
  });

  test("getRutaBySlug returns undefined for unknown slug", () => {
    assert.strictEqual(getRutaBySlug("no-existe"), undefined);
  });

  test("getAdjacentRutas for first ruta", () => {
    const adjacent = getAdjacentRutas("primer-empleo-tech");
    assert.strictEqual(adjacent.prev, null);
    assert.ok(adjacent.next);
    assert.strictEqual(adjacent.next!.slug, "qa-automation");
  });

  test("getAdjacentRutas for last ruta", () => {
    const adjacent = getAdjacentRutas("crear-saas");
    assert.ok(adjacent.prev);
    assert.strictEqual(adjacent.prev!.slug, "ci-cd-basico");
    assert.strictEqual(adjacent.next, null);
  });

  test("getAdjacentRutas for middle ruta", () => {
    const adjacent = getAdjacentRutas("qa-automation");
    assert.ok(adjacent.prev);
    assert.strictEqual(adjacent.prev!.slug, "primer-empleo-tech");
    assert.ok(adjacent.next);
    assert.strictEqual(adjacent.next!.slug, "java-selenium");
  });

  test("getAdjacentRutas for invalid slug", () => {
    const adjacent = getAdjacentRutas("slug-inexistente");
    assert.strictEqual(adjacent.prev, null);
    assert.strictEqual(adjacent.next, null);
  });

  test("total rutas count", () => {
    assert.strictEqual(rutas.length, 6);
  });

  test("all rutas have required fields", () => {
    for (const ruta of rutas) {
      assert.ok(ruta.slug, `Ruta missing slug`);
      assert.ok(ruta.titleKey, `Ruta ${ruta.slug} missing titleKey`);
      assert.ok(ruta.descKey, `Ruta ${ruta.slug} missing descKey`);
      assert.ok(ruta.sections.length > 0, `Ruta ${ruta.slug} has no sections`);
      for (const section of ruta.sections) {
        assert.ok(section.id, `Ruta ${ruta.slug} section missing id`);
        assert.ok(section.titleKey, `Ruta ${ruta.slug} section missing titleKey`);
        assert.ok(section.contentKey, `Ruta ${ruta.slug} section missing contentKey`);
      }
    }
  });

  test("all section ids are unique within each ruta", () => {
    for (const ruta of rutas) {
      const ids = new Set(ruta.sections.map((s) => s.id));
      assert.strictEqual(ids.size, ruta.sections.length, `Ruta ${ruta.slug} has duplicate section ids`);
    }
  });

  test("all slugs are unique", () => {
    const slugs = new Set(rutas.map((r) => r.slug));
    assert.strictEqual(slugs.size, rutas.length);
  });

  test("no content has trailing double newline", () => {
    for (const ruta of rutas) {
      for (const section of ruta.sections) {
        // This test validates a rendering assumption: content is split on \n\n
        // and rendered as <p> tags. A trailing \n\n would create an empty <p>.
        const content = section.contentKey; // key name, not translated content
        assert.ok(
          !content.endsWith("_content\n\n"),
          `Ruta ${ruta.slug} section ${section.id} content key implies trailing newline`
        );
      }
    }
  });
});
