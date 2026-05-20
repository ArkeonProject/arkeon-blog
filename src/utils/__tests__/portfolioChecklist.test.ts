import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateScore,
  categories,
  generateMarkdown,
  getAllItemKeys,
  getCategoryScore,
  getPriorityImprovements,
  maxScore,
} from "../portfolioChecklist";

test("maxScore equals 100", () => {
  assert.strictEqual(maxScore, 100);
});

test("getAllItemKeys returns 29 unique keys", () => {
  const keys = getAllItemKeys();
  assert.strictEqual(keys.length, 29);
  const unique = new Set(keys);
  assert.strictEqual(unique.size, 29);
});

test("calculateScore with empty set returns 0 and needs_work level", () => {
  const result = calculateScore(new Set());
  assert.strictEqual(result.score, 0);
  assert.strictEqual(result.percentage, 0);
  assert.strictEqual(result.level.levelKey, "portfolio_level_needs_work");
  assert.strictEqual(result.improvements.length, 3);
});

test("calculateScore with all items checked returns 100 and professional level", () => {
  const all = new Set(getAllItemKeys());
  const result = calculateScore(all);
  assert.strictEqual(result.score, 100);
  assert.strictEqual(result.percentage, 100);
  assert.strictEqual(result.level.levelKey, "portfolio_level_professional");
  assert.strictEqual(result.improvements.length, 0);
});

test("calculateScore level boundaries", () => {
  const all = new Set(getAllItemKeys());

  // Score 0 → percentage 0 → needs_work
  assert.strictEqual(calculateScore(new Set()).level.levelKey, "portfolio_level_needs_work");

  // Score 40 → percentage 40 → needs_work
  // 7 items of 5pts (35) + linkedin_profile (3) + linkedin_activity (2) = 40
  const s40 = new Set([
    "portfolio_item_deployed_url",
    "portfolio_item_deployed_works",
    "portfolio_item_deployed_domain",
    "portfolio_item_testing_unit",
    "portfolio_item_testing_e2e",
    "portfolio_item_cicd_workflow",
    "portfolio_item_cicd_auto",
    "portfolio_item_linkedin_profile",
    "portfolio_item_linkedin_activity",
  ]);
  assert.strictEqual(calculateScore(s40).level.levelKey, "portfolio_level_needs_work");

  // Score 41 → percentage 41 → basic
  // 7 items of 5pts (35) + readme_exists (3) + readme_install (3) = 41
  const s41 = new Set([
    "portfolio_item_deployed_url",
    "portfolio_item_deployed_works",
    "portfolio_item_deployed_domain",
    "portfolio_item_testing_unit",
    "portfolio_item_testing_e2e",
    "portfolio_item_cicd_workflow",
    "portfolio_item_cicd_auto",
    "portfolio_item_readme_exists",
    "portfolio_item_readme_install",
  ]);
  assert.strictEqual(calculateScore(s41).level.levelKey, "portfolio_level_basic");

  // Score 50 → percentage 50 → basic
  // all 5pt (35) + all 4pt (12) + github_profile (3) = 50
  const s50 = new Set([
    ...Array.from(all).filter((k) => k.includes("deployed") || k.includes("testing") || k.includes("cicd")),
    "portfolio_item_design_responsive",
    "portfolio_item_docs_architecture",
    "portfolio_item_cv_pdf",
    "portfolio_item_github_profile",
  ]);
  assert.strictEqual(calculateScore(s50).level.levelKey, "portfolio_level_basic");

  // Score 62 → percentage 62 → acceptable
  // all 5pt (35) + all 4pt (12) + 5 items of 3pts (15) = 62
  const s62 = new Set([
    ...Array.from(all).filter((k) => k.includes("deployed") || k.includes("testing") || k.includes("cicd")),
    "portfolio_item_design_responsive",
    "portfolio_item_docs_architecture",
    "portfolio_item_cv_pdf",
    "portfolio_item_design_consistency",
    "portfolio_item_design_states",
    "portfolio_item_docs_contribute",
    "portfolio_item_docs_changelog",
    "portfolio_item_cv_spelling",
  ]);
  assert.strictEqual(calculateScore(s62).level.levelKey, "portfolio_level_acceptable");

  // Score 81 → percentage 81 → professional
  // all items except those summing to 19: remove 3 items of 5pts + 1 item of 4pts = 100-19 = 81
  const s81 = new Set(Array.from(all));
  s81.delete("portfolio_item_deployed_url");
  s81.delete("portfolio_item_deployed_works");
  s81.delete("portfolio_item_deployed_domain");
  s81.delete("portfolio_item_design_responsive");
  assert.strictEqual(calculateScore(s81).level.levelKey, "portfolio_level_professional");

  // Score 100 → percentage 100 → professional
  assert.strictEqual(calculateScore(all).level.levelKey, "portfolio_level_professional");
});

test("getPriorityImprovements returns top 3 unchecked items by points", () => {
  const empty = new Set<string>();
  const improvements = getPriorityImprovements(empty);
  assert.strictEqual(improvements.length, 3);
  // Top 3 should all be 5-point items
  assert.ok(improvements.every((imp) => imp.points === 5));
});

test("getPriorityImprovements with all checked returns empty array", () => {
  const all = new Set(getAllItemKeys());
  const improvements = getPriorityImprovements(all);
  assert.strictEqual(improvements.length, 0);
});

test("getPriorityImprovements with nearly all checked returns remaining items", () => {
  const all = new Set(getAllItemKeys());
  all.delete("portfolio_item_deployed_url");
  all.delete("portfolio_item_readme_exists");
  const improvements = getPriorityImprovements(all);
  assert.strictEqual(improvements.length, 2);
  assert.strictEqual(improvements[0].itemKey, "portfolio_item_deployed_url");
  assert.strictEqual(improvements[0].points, 5);
  assert.strictEqual(improvements[1].itemKey, "portfolio_item_readme_exists");
  assert.strictEqual(improvements[1].points, 3);
});

test("getCategoryScore returns correct sum for a category", () => {
  const githubCat = categories.find((c) => c.key === "portfolio_cat_github")!;
  const checked = new Set(["portfolio_item_github_profile", "portfolio_item_github_pinned"]);
  assert.strictEqual(getCategoryScore(githubCat, checked), 6);

  const empty = new Set<string>();
  assert.strictEqual(getCategoryScore(githubCat, empty), 0);

  const allGithub = new Set(githubCat.items.map((i) => i.key));
  assert.strictEqual(getCategoryScore(githubCat, allGithub), 15);
});

test("generateMarkdown includes all expected sections", () => {
  const mockT = (key: string) => {
    const map: Record<string, string> = {
      portfolio_checklist_download_title: "Portfolio Checklist",
      portfolio_checklist_score: "Score",
      portfolio_checklist_level: "Level",
      portfolio_checklist_date: "Date",
      portfolio_checklist_improvements_title: "Priority Improvements",
      portfolio_checklist_download_footer: "Generated by Arkeonix",
      portfolio_cat_github: "GitHub",
      portfolio_item_github_profile: "Complete profile",
    };
    return map[key] ?? key;
  };

  const checked = new Set(["portfolio_item_github_profile"]);
  const result = calculateScore(checked);
  const md = generateMarkdown(checked, result, mockT);

  assert.ok(md.includes("# Portfolio Checklist"));
  assert.ok(md.includes("Score:"));
  assert.ok(md.includes("Level:"));
  assert.ok(md.includes("Date:"));
  assert.ok(md.includes("## GitHub"));
  assert.ok(md.includes("- [x] Complete profile"));
  assert.ok(md.includes("Generated by Arkeonix"));

  // Verify numbered improvements
  if (result.improvements.length > 0) {
    assert.ok(md.match(/1\./));
  }
});

test("getPriorityImprovements tie-breaking is deterministic", () => {
  // All 5-point items are first in the categories array (deployed, testing, cicd).
  // Mark all items except the three 5-point deployed items.
  const all = new Set(getAllItemKeys());
  all.delete("portfolio_item_deployed_url");
  all.delete("portfolio_item_deployed_works");
  all.delete("portfolio_item_deployed_domain");
  const improvements = getPriorityImprovements(all);
  assert.strictEqual(improvements.length, 3);
  assert.strictEqual(improvements[0].itemKey, "portfolio_item_deployed_url");
  assert.strictEqual(improvements[1].itemKey, "portfolio_item_deployed_works");
  assert.strictEqual(improvements[2].itemKey, "portfolio_item_deployed_domain");
});

test("calculateScore ignores unknown keys in checked set", () => {
  const setWithUnknown = new Set([
    "portfolio_item_github_profile",
    "unknown_fake_key_123",
    "portfolio_item_github_pinned",
  ]);
  const result = calculateScore(setWithUnknown);
  assert.strictEqual(result.score, 6); // 3 + 3 = 6
  assert.strictEqual(result.percentage, 6);
});

test("generateMarkdown falls back to key name when translation is missing", () => {
  const mockT = (key: string) => {
    const map: Record<string, string> = {
      portfolio_checklist_download_title: "Portfolio Checklist",
      portfolio_checklist_score: "Score",
      portfolio_checklist_level: "Level",
      portfolio_checklist_date: "Date",
      portfolio_checklist_download_footer: "Generated by Arkeonix",
    };
    return map[key] ?? key;
  };

  const checked = new Set(["portfolio_item_github_profile"]);
  const result = calculateScore(checked);
  const md = generateMarkdown(checked, result, mockT);

  // Missing translation should fall back to the raw key name
  assert.ok(md.includes("portfolio_item_github_profile"));
  assert.ok(md.includes("portfolio_cat_github"));
});
