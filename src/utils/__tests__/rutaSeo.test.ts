import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { rutas } from "../../data/rutas";
import {
  getMissingRutaSeoSlugs,
  getRutaHowToSteps,
  getRutaSeoMeta,
} from "../rutaSeo";

describe("ruta SEO helpers", () => {
  test("all rutas have explicit SEO metadata", () => {
    assert.deepStrictEqual(getMissingRutaSeoSlugs(), []);
  });

  test("getRutaSeoMeta returns Spanish and English metadata", () => {
    const es = getRutaSeoMeta("qa-automation", "es");
    const en = getRutaSeoMeta("qa-automation", "en");

    assert.ok(es);
    assert.ok(en);
    assert.match(es.title, /QA Automation/);
    assert.match(en.title, /QA Automation/);
    assert.notStrictEqual(es.description, en.description);
  });

  test("getRutaSeoMeta returns null for unknown slug", () => {
    assert.strictEqual(getRutaSeoMeta("no-existe"), null);
  });

  test("getRutaHowToSteps renders one full-text step per ruta section", () => {
    const ruta = rutas[0];
    const steps = getRutaHowToSteps(
      ruta,
      (key) => (key.endsWith("_content") ? "Primer párrafo.\n\nSegundo párrafo." : key),
      ruta.slug,
    );

    assert.strictEqual(steps.length, ruta.sections.length);
    assert.strictEqual(steps[0]["@type"], "HowToStep");
    assert.strictEqual(steps[0].position, 1);
    assert.strictEqual(steps[0].text, "Primer párrafo. Segundo párrafo.");
    assert.ok(steps[0].url.endsWith(`#${ruta.sections[0].id}`));
  });
});
