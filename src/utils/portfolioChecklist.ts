export interface ChecklistItem {
  key: string;
  points: number;
}

export interface ChecklistCategory {
  key: string;
  items: ChecklistItem[];
}

export interface ScoreLevel {
  minScore: number;
  maxScore: number;
  levelKey: string;
  descriptionKey: string;
  colorClass: string;
}

export interface Improvement {
  itemKey: string;
  categoryKey: string;
  points: number;
}

export interface ChecklistResult {
  score: number;
  maxScore: number;
  percentage: number;
  level: ScoreLevel;
  improvements: Improvement[];
}

export const categories: ChecklistCategory[] = [
  {
    key: "portfolio_cat_github",
    items: [
      { key: "portfolio_item_github_profile", points: 3 },
      { key: "portfolio_item_github_pinned", points: 3 },
      { key: "portfolio_item_github_contributions", points: 3 },
      { key: "portfolio_item_github_descriptions", points: 3 },
      { key: "portfolio_item_github_repos", points: 3 },
    ],
  },
  {
    key: "portfolio_cat_readme",
    items: [
      { key: "portfolio_item_readme_exists", points: 3 },
      { key: "portfolio_item_readme_install", points: 3 },
      { key: "portfolio_item_readme_badges", points: 2 },
      { key: "portfolio_item_readme_screenshots", points: 2 },
    ],
  },
  {
    key: "portfolio_cat_deployed",
    items: [
      { key: "portfolio_item_deployed_url", points: 5 },
      { key: "portfolio_item_deployed_works", points: 5 },
      { key: "portfolio_item_deployed_domain", points: 5 },
    ],
  },
  {
    key: "portfolio_cat_testing",
    items: [
      { key: "portfolio_item_testing_unit", points: 5 },
      { key: "portfolio_item_testing_e2e", points: 5 },
    ],
  },
  {
    key: "portfolio_cat_cicd",
    items: [
      { key: "portfolio_item_cicd_workflow", points: 5 },
      { key: "portfolio_item_cicd_auto", points: 5 },
    ],
  },
  {
    key: "portfolio_cat_design",
    items: [
      { key: "portfolio_item_design_responsive", points: 4 },
      { key: "portfolio_item_design_consistency", points: 3 },
      { key: "portfolio_item_design_states", points: 3 },
    ],
  },
  {
    key: "portfolio_cat_docs",
    items: [
      { key: "portfolio_item_docs_architecture", points: 4 },
      { key: "portfolio_item_docs_contribute", points: 3 },
      { key: "portfolio_item_docs_changelog", points: 3 },
    ],
  },
  {
    key: "portfolio_cat_linkedin",
    items: [
      { key: "portfolio_item_linkedin_profile", points: 3 },
      { key: "portfolio_item_linkedin_activity", points: 2 },
    ],
  },
  {
    key: "portfolio_cat_cv",
    items: [
      { key: "portfolio_item_cv_pdf", points: 4 },
      { key: "portfolio_item_cv_spelling", points: 3 },
      { key: "portfolio_item_cv_projects", points: 3 },
    ],
  },
  {
    key: "portfolio_cat_demo",
    items: [
      { key: "portfolio_item_demo_video", points: 3 },
      { key: "portfolio_item_demo_screenshots", points: 2 },
    ],
  },
];

export const maxScore = categories.reduce(
  (total, cat) => total + cat.items.reduce((sum, item) => sum + item.points, 0),
  0
);

export const scoreLevels: ScoreLevel[] = [
  {
    minScore: 0,
    maxScore: 40,
    levelKey: "portfolio_level_needs_work",
    descriptionKey: "portfolio_level_needs_work_desc",
    colorClass: "bg-red-500/10 border-red-500/30 text-red-600",
  },
  {
    minScore: 41,
    maxScore: 60,
    levelKey: "portfolio_level_basic",
    descriptionKey: "portfolio_level_basic_desc",
    colorClass: "bg-amber-500/10 border-amber-500/30 text-amber-600",
  },
  {
    minScore: 61,
    maxScore: 80,
    levelKey: "portfolio_level_acceptable",
    descriptionKey: "portfolio_level_acceptable_desc",
    colorClass: "bg-sky-500/10 border-sky-500/30 text-sky-600",
  },
  {
    minScore: 81,
    maxScore: 100,
    levelKey: "portfolio_level_professional",
    descriptionKey: "portfolio_level_professional_desc",
    colorClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600",
  },
];

export function calculateScore(checkedItems: Set<string>): ChecklistResult {
  let score = 0;
  for (const cat of categories) {
    for (const item of cat.items) {
      if (checkedItems.has(item.key)) {
        score += item.points;
      }
    }
  }

  const percentage = Math.round((score / maxScore) * 100);

  const level =
    scoreLevels.find((l) => percentage >= l.minScore && percentage <= l.maxScore) ??
    scoreLevels[0];

  const improvements = getPriorityImprovements(checkedItems);

  return { score, maxScore, percentage, level, improvements };
}

export function getPriorityImprovements(checkedItems: Set<string>): Improvement[] {
  const unchecked: Improvement[] = [];
  for (const cat of categories) {
    for (const item of cat.items) {
      if (!checkedItems.has(item.key)) {
        unchecked.push({ itemKey: item.key, categoryKey: cat.key, points: item.points });
      }
    }
  }
  return unchecked.sort((a, b) => b.points - a.points).slice(0, 3);
}

export function getAllItemKeys(): string[] {
  return categories.flatMap((cat) => cat.items.map((item) => item.key));
}

export function generateMarkdown(
  checkedItems: Set<string>,
  result: ChecklistResult,
  t: (key: string) => string
): string {
  const lines: string[] = [
    `# ${t("portfolio_checklist_download_title")}`,
    "",
    `**${t("portfolio_checklist_score")}:** ${result.score}/${result.maxScore} (${result.percentage}%)`,
    `**${t("portfolio_checklist_level")}:** ${t(result.level.levelKey)}`,
    `**${t("portfolio_checklist_date")}:** ${new Date().toLocaleDateString()}`,
    "",
    "---",
    "",
  ];

  for (const cat of categories) {
    lines.push(`## ${t(cat.key)}`);
    for (const item of cat.items) {
      const checked = checkedItems.has(item.key);
      lines.push(`- [${checked ? "x" : " "}] ${t(item.key)} (+${item.points} pts)`);
    }
    lines.push("");
  }

  if (result.improvements.length > 0) {
    lines.push(`## ${t("portfolio_checklist_improvements_title")}`);
    for (const imp of result.improvements) {
      lines.push(`1. ${t(imp.itemKey)} (${t(imp.categoryKey)}) — +${imp.points} pts`);
    }
    lines.push("");
  }

  lines.push("---");
  lines.push(t("portfolio_checklist_download_footer"));

  return lines.join("\n");
}

export function downloadChecklist(
  checkedItems: Set<string>,
  result: ChecklistResult,
  t: (key: string) => string
): void {
  const markdown = generateMarkdown(checkedItems, result, t);
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "portfolio-checklist-junior.md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
