export type TechRole =
  | "frontend"
  | "backend"
  | "qa_manual"
  | "qa_automation"
  | "devops"
  | "data_analyst"
  | "cybersecurity"
  | "product";

export const TECH_ROLES: TechRole[] = [
  "frontend",
  "backend",
  "qa_manual",
  "qa_automation",
  "devops",
  "data_analyst",
  "cybersecurity",
  "product",
];

export interface QuizAnswer {
  key: string;
  scores: Record<TechRole, number>;
}

export interface QuizQuestion {
  key: string;
  answers: QuizAnswer[];
}

export interface RoadmapStep {
  titleKey: string;
  descKey: string;
}

export interface ResourceLink {
  titleKey: string;
  descKey: string;
  url: string;
}

export interface RoleResult {
  roleKey: string;
  descriptionKey: string;
  skillsKeys: string[];
  roadmap: RoadmapStep[];
  mistakesKeys: string[];
  resources: ResourceLink[];
}

export const questions: QuizQuestion[] = [
  {
    key: "role_quiz_q1",
    answers: [
      {
        key: "role_quiz_q1_a1",
        scores: {
          frontend: 5,
          backend: 0,
          qa_manual: 0,
          qa_automation: 0,
          devops: 0,
          data_analyst: 0,
          cybersecurity: 0,
          product: 2,
        },
      },
      {
        key: "role_quiz_q1_a2",
        scores: {
          frontend: 0,
          backend: 5,
          qa_manual: 0,
          qa_automation: 0,
          devops: 2,
          data_analyst: 0,
          cybersecurity: 2,
          product: 0,
        },
      },
      {
        key: "role_quiz_q1_a3",
        scores: {
          frontend: 0,
          backend: 0,
          qa_manual: 4,
          qa_automation: 3,
          devops: 0,
          data_analyst: 0,
          cybersecurity: 1,
          product: 0,
        },
      },
      {
        key: "role_quiz_q1_a4",
        scores: {
          frontend: 0,
          backend: 0,
          qa_manual: 0,
          qa_automation: 0,
          devops: 3,
          data_analyst: 5,
          cybersecurity: 0,
          product: 0,
        },
      },
      {
        key: "role_quiz_q1_a5",
        scores: {
          frontend: 0,
          backend: 0,
          qa_manual: 0,
          qa_automation: 0,
          devops: 0,
          data_analyst: 0,
          cybersecurity: 5,
          product: 0,
        },
      },
      {
        key: "role_quiz_q1_a6",
        scores: {
          frontend: 0,
          backend: 0,
          qa_manual: 2,
          qa_automation: 0,
          devops: 0,
          data_analyst: 0,
          cybersecurity: 0,
          product: 5,
        },
      },
    ],
  },
  {
    key: "role_quiz_q2",
    answers: [
      {
        key: "role_quiz_q2_a1",
        scores: {
          frontend: 0,
          backend: 0,
          qa_manual: 1,
          qa_automation: 0,
          devops: 0,
          data_analyst: 0,
          cybersecurity: 0,
          product: 2,
        },
      },
      {
        key: "role_quiz_q2_a2",
        scores: {
          frontend: 1,
          backend: 1,
          qa_manual: 1,
          qa_automation: 1,
          devops: 1,
          data_analyst: 1,
          cybersecurity: 1,
          product: 1,
        },
      },
      {
        key: "role_quiz_q2_a3",
        scores: {
          frontend: 2,
          backend: 2,
          qa_manual: 2,
          qa_automation: 2,
          devops: 2,
          data_analyst: 2,
          cybersecurity: 2,
          product: 2,
        },
      },
      {
        key: "role_quiz_q2_a4",
        scores: {
          frontend: 3,
          backend: 3,
          qa_manual: 3,
          qa_automation: 3,
          devops: 4,
          data_analyst: 3,
          cybersecurity: 4,
          product: 3,
        },
      },
    ],
  },
  {
    key: "role_quiz_q3",
    answers: [
      {
        key: "role_quiz_q3_a1",
        scores: {
          frontend: 5,
          backend: 0,
          qa_manual: 0,
          qa_automation: 0,
          devops: 0,
          data_analyst: 0,
          cybersecurity: 0,
          product: 3,
        },
      },
      {
        key: "role_quiz_q3_a2",
        scores: {
          frontend: 0,
          backend: 5,
          qa_manual: 0,
          qa_automation: 0,
          devops: 2,
          data_analyst: 2,
          cybersecurity: 2,
          product: 0,
        },
      },
      {
        key: "role_quiz_q3_a3",
        scores: {
          frontend: 0,
          backend: 0,
          qa_manual: 0,
          qa_automation: 0,
          devops: 0,
          data_analyst: 5,
          cybersecurity: 0,
          product: 0,
        },
      },
      {
        key: "role_quiz_q3_a4",
        scores: {
          frontend: 0,
          backend: 0,
          qa_manual: 0,
          qa_automation: 0,
          devops: 0,
          data_analyst: 0,
          cybersecurity: 5,
          product: 0,
        },
      },
      {
        key: "role_quiz_q3_a5",
        scores: {
          frontend: 0,
          backend: 0,
          qa_manual: 4,
          qa_automation: 3,
          devops: 0,
          data_analyst: 0,
          cybersecurity: 0,
          product: 0,
        },
      },
    ],
  },
  {
    key: "role_quiz_q4",
    answers: [
      {
        key: "role_quiz_q4_a1",
        scores: {
          frontend: 0,
          backend: 0,
          qa_manual: 3,
          qa_automation: 2,
          devops: 2,
          data_analyst: 0,
          cybersecurity: 0,
          product: 0,
        },
      },
      {
        key: "role_quiz_q4_a2",
        scores: {
          frontend: 1,
          backend: 1,
          qa_manual: 1,
          qa_automation: 1,
          devops: 1,
          data_analyst: 1,
          cybersecurity: 1,
          product: 1,
        },
      },
      {
        key: "role_quiz_q4_a3",
        scores: {
          frontend: 2,
          backend: 2,
          qa_manual: 0,
          qa_automation: 0,
          devops: 0,
          data_analyst: 0,
          cybersecurity: 2,
          product: 0,
        },
      },
      {
        key: "role_quiz_q4_a4",
        scores: {
          frontend: 0,
          backend: 0,
          qa_manual: 0,
          qa_automation: 0,
          devops: 0,
          data_analyst: 0,
          cybersecurity: 0,
          product: 2,
        },
      },
    ],
  },
  {
    key: "role_quiz_q5",
    answers: [
      {
        key: "role_quiz_q5_a1",
        scores: {
          frontend: 0,
          backend: 2,
          qa_manual: 0,
          qa_automation: 5,
          devops: 4,
          data_analyst: 0,
          cybersecurity: 0,
          product: 0,
        },
      },
      {
        key: "role_quiz_q5_a2",
        scores: {
          frontend: 0,
          backend: 2,
          qa_manual: 0,
          qa_automation: 3,
          devops: 3,
          data_analyst: 0,
          cybersecurity: 0,
          product: 0,
        },
      },
      {
        key: "role_quiz_q5_a3",
        scores: {
          frontend: 1,
          backend: 1,
          qa_manual: 1,
          qa_automation: 1,
          devops: 1,
          data_analyst: 1,
          cybersecurity: 1,
          product: 1,
        },
      },
      {
        key: "role_quiz_q5_a4",
        scores: {
          frontend: 0,
          backend: 0,
          qa_manual: 2,
          qa_automation: 0,
          devops: 0,
          data_analyst: 0,
          cybersecurity: 0,
          product: 1,
        },
      },
    ],
  },
  {
    key: "role_quiz_q6",
    answers: [
      {
        key: "role_quiz_q6_a1",
        scores: {
          frontend: 3,
          backend: 1,
          qa_manual: 0,
          qa_automation: 0,
          devops: 0,
          data_analyst: 0,
          cybersecurity: 0,
          product: 4,
        },
      },
      {
        key: "role_quiz_q6_a2",
        scores: {
          frontend: 0,
          backend: 0,
          qa_manual: 4,
          qa_automation: 3,
          devops: 2,
          data_analyst: 0,
          cybersecurity: 0,
          product: 0,
        },
      },
      {
        key: "role_quiz_q6_a3",
        scores: {
          frontend: 0,
          backend: 3,
          qa_manual: 0,
          qa_automation: 2,
          devops: 0,
          data_analyst: 0,
          cybersecurity: 4,
          product: 0,
        },
      },
      {
        key: "role_quiz_q6_a4",
        scores: {
          frontend: 0,
          backend: 2,
          qa_manual: 0,
          qa_automation: 0,
          devops: 1,
          data_analyst: 5,
          cybersecurity: 0,
          product: 0,
        },
      },
      {
        key: "role_quiz_q6_a5",
        scores: {
          frontend: 0,
          backend: 3,
          qa_manual: 0,
          qa_automation: 0,
          devops: 5,
          data_analyst: 0,
          cybersecurity: 0,
          product: 0,
        },
      },
    ],
  },
];

export const roleResults: Record<TechRole, RoleResult> = {
  frontend: {
    roleKey: "role_result_frontend_title",
    descriptionKey: "role_result_frontend_desc",
    skillsKeys: [
      "role_result_frontend_skill1",
      "role_result_frontend_skill2",
      "role_result_frontend_skill3",
      "role_result_frontend_skill4",
    ],
    roadmap: [
      { titleKey: "role_result_frontend_rm1_title", descKey: "role_result_frontend_rm1_desc" },
      { titleKey: "role_result_frontend_rm2_title", descKey: "role_result_frontend_rm2_desc" },
      { titleKey: "role_result_frontend_rm3_title", descKey: "role_result_frontend_rm3_desc" },
      { titleKey: "role_result_frontend_rm4_title", descKey: "role_result_frontend_rm4_desc" },
    ],
    mistakesKeys: [
      "role_result_frontend_mist1",
      "role_result_frontend_mist2",
      "role_result_frontend_mist3",
    ],
    resources: [
      { titleKey: "role_result_frontend_res1_title", descKey: "role_result_frontend_res1_desc", url: "https://developer.mozilla.org/es/" },
      { titleKey: "role_result_frontend_res2_title", descKey: "role_result_frontend_res2_desc", url: "https://www.freecodecamp.org/" },
      { titleKey: "role_result_frontend_res3_title", descKey: "role_result_frontend_res3_desc", url: "https://www.frontendmentor.io/" },
    ],
  },
  backend: {
    roleKey: "role_result_backend_title",
    descriptionKey: "role_result_backend_desc",
    skillsKeys: [
      "role_result_backend_skill1",
      "role_result_backend_skill2",
      "role_result_backend_skill3",
      "role_result_backend_skill4",
    ],
    roadmap: [
      { titleKey: "role_result_backend_rm1_title", descKey: "role_result_backend_rm1_desc" },
      { titleKey: "role_result_backend_rm2_title", descKey: "role_result_backend_rm2_desc" },
      { titleKey: "role_result_backend_rm3_title", descKey: "role_result_backend_rm3_desc" },
      { titleKey: "role_result_backend_rm4_title", descKey: "role_result_backend_rm4_desc" },
    ],
    mistakesKeys: [
      "role_result_backend_mist1",
      "role_result_backend_mist2",
      "role_result_backend_mist3",
    ],
    resources: [
      { titleKey: "role_result_backend_res1_title", descKey: "role_result_backend_res1_desc", url: "https://www.theodinproject.com/" },
      { titleKey: "role_result_backend_res2_title", descKey: "role_result_backend_res2_desc", url: "https://sqlbolt.com/" },
      { titleKey: "role_result_backend_res3_title", descKey: "role_result_backend_res3_desc", url: "https://nodejs.org/en/docs/" },
    ],
  },
  qa_manual: {
    roleKey: "role_result_qa_manual_title",
    descriptionKey: "role_result_qa_manual_desc",
    skillsKeys: [
      "role_result_qa_manual_skill1",
      "role_result_qa_manual_skill2",
      "role_result_qa_manual_skill3",
      "role_result_qa_manual_skill4",
    ],
    roadmap: [
      { titleKey: "role_result_qa_manual_rm1_title", descKey: "role_result_qa_manual_rm1_desc" },
      { titleKey: "role_result_qa_manual_rm2_title", descKey: "role_result_qa_manual_rm2_desc" },
      { titleKey: "role_result_qa_manual_rm3_title", descKey: "role_result_qa_manual_rm3_desc" },
      { titleKey: "role_result_qa_manual_rm4_title", descKey: "role_result_qa_manual_rm4_desc" },
    ],
    mistakesKeys: [
      "role_result_qa_manual_mist1",
      "role_result_qa_manual_mist2",
      "role_result_qa_manual_mist3",
    ],
    resources: [
      { titleKey: "role_result_qa_manual_res1_title", descKey: "role_result_qa_manual_res1_desc", url: "https://www.guru99.com/software-testing.html" },
      { titleKey: "role_result_qa_manual_res2_title", descKey: "role_result_qa_manual_res2_desc", url: "https://www.ministryoftesting.com/" },
      { titleKey: "role_result_qa_manual_res3_title", descKey: "role_result_qa_manual_res3_desc", url: "https://www.istqb.org/" },
    ],
  },
  qa_automation: {
    roleKey: "role_result_qa_automation_title",
    descriptionKey: "role_result_qa_automation_desc",
    skillsKeys: [
      "role_result_qa_automation_skill1",
      "role_result_qa_automation_skill2",
      "role_result_qa_automation_skill3",
      "role_result_qa_automation_skill4",
    ],
    roadmap: [
      { titleKey: "role_result_qa_automation_rm1_title", descKey: "role_result_qa_automation_rm1_desc" },
      { titleKey: "role_result_qa_automation_rm2_title", descKey: "role_result_qa_automation_rm2_desc" },
      { titleKey: "role_result_qa_automation_rm3_title", descKey: "role_result_qa_automation_rm3_desc" },
      { titleKey: "role_result_qa_automation_rm4_title", descKey: "role_result_qa_automation_rm4_desc" },
    ],
    mistakesKeys: [
      "role_result_qa_automation_mist1",
      "role_result_qa_automation_mist2",
      "role_result_qa_automation_mist3",
    ],
    resources: [
      { titleKey: "role_result_qa_automation_res1_title", descKey: "role_result_qa_automation_res1_desc", url: "https://www.selenium.dev/documentation/" },
      { titleKey: "role_result_qa_automation_res2_title", descKey: "role_result_qa_automation_res2_desc", url: "https://www.cypress.io/" },
      { titleKey: "role_result_qa_automation_res3_title", descKey: "role_result_qa_automation_res3_desc", url: "https://testautomationu.applitools.com/" },
    ],
  },
  devops: {
    roleKey: "role_result_devops_title",
    descriptionKey: "role_result_devops_desc",
    skillsKeys: [
      "role_result_devops_skill1",
      "role_result_devops_skill2",
      "role_result_devops_skill3",
      "role_result_devops_skill4",
    ],
    roadmap: [
      { titleKey: "role_result_devops_rm1_title", descKey: "role_result_devops_rm1_desc" },
      { titleKey: "role_result_devops_rm2_title", descKey: "role_result_devops_rm2_desc" },
      { titleKey: "role_result_devops_rm3_title", descKey: "role_result_devops_rm3_desc" },
      { titleKey: "role_result_devops_rm4_title", descKey: "role_result_devops_rm4_desc" },
    ],
    mistakesKeys: [
      "role_result_devops_mist1",
      "role_result_devops_mist2",
      "role_result_devops_mist3",
    ],
    resources: [
      { titleKey: "role_result_devops_res1_title", descKey: "role_result_devops_res1_desc", url: "https://linuxjourney.com/" },
      { titleKey: "role_result_devops_res2_title", descKey: "role_result_devops_res2_desc", url: "https://docs.docker.com/get-started/" },
      { titleKey: "role_result_devops_res3_title", descKey: "role_result_devops_res3_desc", url: "https://aws.amazon.com/free/" },
    ],
  },
  data_analyst: {
    roleKey: "role_result_data_analyst_title",
    descriptionKey: "role_result_data_analyst_desc",
    skillsKeys: [
      "role_result_data_analyst_skill1",
      "role_result_data_analyst_skill2",
      "role_result_data_analyst_skill3",
      "role_result_data_analyst_skill4",
    ],
    roadmap: [
      { titleKey: "role_result_data_analyst_rm1_title", descKey: "role_result_data_analyst_rm1_desc" },
      { titleKey: "role_result_data_analyst_rm2_title", descKey: "role_result_data_analyst_rm2_desc" },
      { titleKey: "role_result_data_analyst_rm3_title", descKey: "role_result_data_analyst_rm3_desc" },
      { titleKey: "role_result_data_analyst_rm4_title", descKey: "role_result_data_analyst_rm4_desc" },
    ],
    mistakesKeys: [
      "role_result_data_analyst_mist1",
      "role_result_data_analyst_mist2",
      "role_result_data_analyst_mist3",
    ],
    resources: [
      { titleKey: "role_result_data_analyst_res1_title", descKey: "role_result_data_analyst_res1_desc", url: "https://www.kaggle.com/learn" },
      { titleKey: "role_result_data_analyst_res2_title", descKey: "role_result_data_analyst_res2_desc", url: "https://sqlbolt.com/" },
      { titleKey: "role_result_data_analyst_res3_title", descKey: "role_result_data_analyst_res3_desc", url: "https://wesmckinney.com/book/" },
    ],
  },
  cybersecurity: {
    roleKey: "role_result_cybersecurity_title",
    descriptionKey: "role_result_cybersecurity_desc",
    skillsKeys: [
      "role_result_cybersecurity_skill1",
      "role_result_cybersecurity_skill2",
      "role_result_cybersecurity_skill3",
      "role_result_cybersecurity_skill4",
    ],
    roadmap: [
      { titleKey: "role_result_cybersecurity_rm1_title", descKey: "role_result_cybersecurity_rm1_desc" },
      { titleKey: "role_result_cybersecurity_rm2_title", descKey: "role_result_cybersecurity_rm2_desc" },
      { titleKey: "role_result_cybersecurity_rm3_title", descKey: "role_result_cybersecurity_rm3_desc" },
      { titleKey: "role_result_cybersecurity_rm4_title", descKey: "role_result_cybersecurity_rm4_desc" },
    ],
    mistakesKeys: [
      "role_result_cybersecurity_mist1",
      "role_result_cybersecurity_mist2",
      "role_result_cybersecurity_mist3",
    ],
    resources: [
      { titleKey: "role_result_cybersecurity_res1_title", descKey: "role_result_cybersecurity_res1_desc", url: "https://tryhackme.com/" },
      { titleKey: "role_result_cybersecurity_res2_title", descKey: "role_result_cybersecurity_res2_desc", url: "https://www.hackthebox.com/" },
      { titleKey: "role_result_cybersecurity_res3_title", descKey: "role_result_cybersecurity_res3_desc", url: "https://www.cybrary.it/" },
    ],
  },
  product: {
    roleKey: "role_result_product_title",
    descriptionKey: "role_result_product_desc",
    skillsKeys: [
      "role_result_product_skill1",
      "role_result_product_skill2",
      "role_result_product_skill3",
      "role_result_product_skill4",
    ],
    roadmap: [
      { titleKey: "role_result_product_rm1_title", descKey: "role_result_product_rm1_desc" },
      { titleKey: "role_result_product_rm2_title", descKey: "role_result_product_rm2_desc" },
      { titleKey: "role_result_product_rm3_title", descKey: "role_result_product_rm3_desc" },
      { titleKey: "role_result_product_rm4_title", descKey: "role_result_product_rm4_desc" },
    ],
    mistakesKeys: [
      "role_result_product_mist1",
      "role_result_product_mist2",
      "role_result_product_mist3",
    ],
    resources: [
      { titleKey: "role_result_product_res1_title", descKey: "role_result_product_res1_desc", url: "https://www.productschool.com/" },
      { titleKey: "role_result_product_res2_title", descKey: "role_result_product_res2_desc", url: "https://www.reforge.com/" },
      { titleKey: "role_result_product_res3_title", descKey: "role_result_product_res3_desc", url: "https://www.nocodemb.com/" },
    ],
  },
};

export function calculateRole(answers: number[]): TechRole {
  const totals: Record<TechRole, number> = {
    frontend: 0,
    backend: 0,
    qa_manual: 0,
    qa_automation: 0,
    devops: 0,
    data_analyst: 0,
    cybersecurity: 0,
    product: 0,
  };

  for (let i = 0; i < answers.length; i++) {
    const question = questions[i];
    const answerIndex = answers[i];
    if (!question || answerIndex < 0 || answerIndex >= question.answers.length) continue;
    const answer = question.answers[answerIndex];
    for (const role of TECH_ROLES) {
      totals[role] += answer.scores[role] ?? 0;
    }
  }

  let bestRole: TechRole = "frontend";
  let bestScore = -Infinity;

  for (const role of TECH_ROLES) {
    if (totals[role] > bestScore) {
      bestScore = totals[role];
      bestRole = role;
    }
  }

  if (bestScore === -Infinity || answers.length === 0) {
    console.warn("[techRoleQuiz] calculateRole called with empty or invalid answers; returning fallback role.", { answers, bestScore });
  }

  return bestRole;
}
