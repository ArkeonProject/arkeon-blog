import type { RutaMeta } from "@/types/ruta";

export const rutas: RutaMeta[] = [
  {
    slug: "primer-empleo-tech",
    titleKey: "ruta_primer_empleo_tech_title",
    descKey: "ruta_primer_empleo_tech_desc",
    sections: [
      {
        id: "roles",
        titleKey: "ruta_primer_empleo_tech_section_roles_title",
        contentKey: "ruta_primer_empleo_tech_section_roles_content",
        links: [
          { labelKey: "ruta_link_test_roles", url: "/herramientas/test-rol-tech" },
        ],
      },
      {
        id: "aprender",
        titleKey: "ruta_primer_empleo_tech_section_aprender_title",
        contentKey: "ruta_primer_empleo_tech_section_aprender_content",
        links: [
          { labelKey: "ruta_link_guia_junior", url: "/recursos/guia-junior" },
        ],
      },
      {
        id: "proyecto",
        titleKey: "ruta_primer_empleo_tech_section_proyecto_title",
        contentKey: "ruta_primer_empleo_tech_section_proyecto_content",
        links: [
          { labelKey: "ruta_link_ruta_portfolio", url: "/rutas/portfolio-junior" },
        ],
      },
      {
        id: "cv",
        titleKey: "ruta_primer_empleo_tech_section_cv_title",
        contentKey: "ruta_primer_empleo_tech_section_cv_content",
      },
      {
        id: "linkedin",
        titleKey: "ruta_primer_empleo_tech_section_linkedin_title",
        contentKey: "ruta_primer_empleo_tech_section_linkedin_content",
      },
      {
        id: "aplicar",
        titleKey: "ruta_primer_empleo_tech_section_aplicar_title",
        contentKey: "ruta_primer_empleo_tech_section_aplicar_content",
      },
      {
        id: "errores",
        titleKey: "ruta_primer_empleo_tech_section_errores_title",
        contentKey: "ruta_primer_empleo_tech_section_errores_content",
      },
    ],
  },
  {
    slug: "qa-automation",
    titleKey: "ruta_qa_automation_title",
    descKey: "ruta_qa_automation_desc",
    sections: [
      {
        id: "intro",
        titleKey: "ruta_qa_automation_section_intro_title",
        contentKey: "ruta_qa_automation_section_intro_content",
        links: [
          { labelKey: "ruta_link_test_roles", url: "/herramientas/test-rol-tech" },
        ],
      },
      {
        id: "java",
        titleKey: "ruta_qa_automation_section_java_title",
        contentKey: "ruta_qa_automation_section_java_content",
      },
      {
        id: "selenium",
        titleKey: "ruta_qa_automation_section_selenium_title",
        contentKey: "ruta_qa_automation_section_selenium_content",
      },
      {
        id: "cucumber",
        titleKey: "ruta_qa_automation_section_cucumber_title",
        contentKey: "ruta_qa_automation_section_cucumber_content",
      },
      {
        id: "pom",
        titleKey: "ruta_qa_automation_section_pom_title",
        contentKey: "ruta_qa_automation_section_pom_content",
      },
      {
        id: "api",
        titleKey: "ruta_qa_automation_section_api_title",
        contentKey: "ruta_qa_automation_section_api_content",
      },
      {
        id: "cicd",
        titleKey: "ruta_qa_automation_section_cicd_title",
        contentKey: "ruta_qa_automation_section_cicd_content",
        links: [
          { labelKey: "ruta_link_ruta_cicd", url: "/rutas/ci-cd-basico" },
        ],
      },
      {
        id: "practicas",
        titleKey: "ruta_qa_automation_section_practicas_title",
        contentKey: "ruta_qa_automation_section_practicas_content",
      },
      {
        id: "proyecto",
        titleKey: "ruta_qa_automation_section_proyecto_title",
        contentKey: "ruta_qa_automation_section_proyecto_content",
        links: [
          { labelKey: "ruta_link_checklist_portfolio", url: "/herramientas/checklist-portfolio-junior" },
        ],
      },
    ],
  },
  {
    slug: "java-selenium",
    titleKey: "ruta_java_selenium_title",
    descKey: "ruta_java_selenium_desc",
    sections: [
      {
        id: "intro",
        titleKey: "ruta_java_selenium_section_intro_title",
        contentKey: "ruta_java_selenium_section_intro_content",
      },
      {
        id: "java",
        titleKey: "ruta_java_selenium_section_java_title",
        contentKey: "ruta_java_selenium_section_java_content",
      },
      {
        id: "webdriver",
        titleKey: "ruta_java_selenium_section_webdriver_title",
        contentKey: "ruta_java_selenium_section_webdriver_content",
      },
      {
        id: "testng",
        titleKey: "ruta_java_selenium_section_testng_title",
        contentKey: "ruta_java_selenium_section_testng_content",
      },
      {
        id: "frameworks",
        titleKey: "ruta_java_selenium_section_frameworks_title",
        contentKey: "ruta_java_selenium_section_frameworks_content",
      },
      {
        id: "practicas",
        titleKey: "ruta_java_selenium_section_practicas_title",
        contentKey: "ruta_java_selenium_section_practicas_content",
      },
      {
        id: "cicd",
        titleKey: "ruta_java_selenium_section_cicd_title",
        contentKey: "ruta_java_selenium_section_cicd_content",
        links: [
          { labelKey: "ruta_link_ruta_cicd", url: "/rutas/ci-cd-basico" },
        ],
      },
      {
        id: "proyecto",
        titleKey: "ruta_java_selenium_section_proyecto_title",
        contentKey: "ruta_java_selenium_section_proyecto_content",
        links: [
          { labelKey: "ruta_link_ruta_portfolio", url: "/rutas/portfolio-junior" },
        ],
      },
    ],
  },
  {
    slug: "portfolio-junior",
    titleKey: "ruta_portfolio_junior_title",
    descKey: "ruta_portfolio_junior_desc",
    sections: [
      {
        id: "debe-tener",
        titleKey: "ruta_portfolio_junior_section_debe_title",
        contentKey: "ruta_portfolio_junior_section_debe_content",
        links: [
          { labelKey: "ruta_link_checklist_portfolio", url: "/herramientas/checklist-portfolio-junior" },
        ],
      },
      {
        id: "mvp",
        titleKey: "ruta_portfolio_junior_section_mvp_title",
        contentKey: "ruta_portfolio_junior_section_mvp_content",
      },
      {
        id: "readme",
        titleKey: "ruta_portfolio_junior_section_readme_title",
        contentKey: "ruta_portfolio_junior_section_readme_content",
      },
      {
        id: "deploy",
        titleKey: "ruta_portfolio_junior_section_deploy_title",
        contentKey: "ruta_portfolio_junior_section_deploy_content",
      },
      {
        id: "testing",
        titleKey: "ruta_portfolio_junior_section_testing_title",
        contentKey: "ruta_portfolio_junior_section_testing_content",
      },
      {
        id: "cicd",
        titleKey: "ruta_portfolio_junior_section_cicd_title",
        contentKey: "ruta_portfolio_junior_section_cicd_content",
        links: [
          { labelKey: "ruta_link_ruta_cicd", url: "/rutas/ci-cd-basico" },
        ],
      },
      {
        id: "capturas",
        titleKey: "ruta_portfolio_junior_section_capturas_title",
        contentKey: "ruta_portfolio_junior_section_capturas_content",
      },
      {
        id: "errores",
        titleKey: "ruta_portfolio_junior_section_errores_title",
        contentKey: "ruta_portfolio_junior_section_errores_content",
      },
    ],
  },
  {
    slug: "ci-cd-basico",
    titleKey: "ruta_ci_cd_basico_title",
    descKey: "ruta_ci_cd_basico_desc",
    sections: [
      {
        id: "que-es",
        titleKey: "ruta_ci_cd_basico_section_que_es_title",
        contentKey: "ruta_ci_cd_basico_section_que_es_content",
      },
      {
        id: "github-actions",
        titleKey: "ruta_ci_cd_basico_section_github_actions_title",
        contentKey: "ruta_ci_cd_basico_section_github_actions_content",
      },
      {
        id: "pipelines",
        titleKey: "ruta_ci_cd_basico_section_pipelines_title",
        contentKey: "ruta_ci_cd_basico_section_pipelines_content",
      },
      {
        id: "testing",
        titleKey: "ruta_ci_cd_basico_section_testing_title",
        contentKey: "ruta_ci_cd_basico_section_testing_content",
      },
      {
        id: "deploy",
        titleKey: "ruta_ci_cd_basico_section_deploy_title",
        contentKey: "ruta_ci_cd_basico_section_deploy_content",
      },
      {
        id: "monitoring",
        titleKey: "ruta_ci_cd_basico_section_monitoring_title",
        contentKey: "ruta_ci_cd_basico_section_monitoring_content",
      },
    ],
  },
  {
    slug: "crear-saas",
    titleKey: "ruta_crear_saas_title",
    descKey: "ruta_crear_saas_desc",
    sections: [
      {
        id: "idea",
        titleKey: "ruta_crear_saas_section_idea_title",
        contentKey: "ruta_crear_saas_section_idea_content",
      },
      {
        id: "stack",
        titleKey: "ruta_crear_saas_section_stack_title",
        contentKey: "ruta_crear_saas_section_stack_content",
      },
      {
        id: "mvp",
        titleKey: "ruta_crear_saas_section_mvp_title",
        contentKey: "ruta_crear_saas_section_mvp_content",
      },
      {
        id: "auth",
        titleKey: "ruta_crear_saas_section_auth_title",
        contentKey: "ruta_crear_saas_section_auth_content",
      },
      {
        id: "deploy",
        titleKey: "ruta_crear_saas_section_deploy_title",
        contentKey: "ruta_crear_saas_section_deploy_content",
      },
      {
        id: "marketing",
        titleKey: "ruta_crear_saas_section_marketing_title",
        contentKey: "ruta_crear_saas_section_marketing_content",
        links: [
          { labelKey: "ruta_link_boilerplate", url: "/recursos/saas-boilerplate" },
        ],
      },
    ],
  },
];

export function getRutaBySlug(slug: string) {
  return rutas.find((r) => r.slug === slug);
}

function getRutaIndex(slug: string) {
  return rutas.findIndex((r) => r.slug === slug);
}

export function getAdjacentRutas(slug: string) {
  const index = getRutaIndex(slug);
  if (index === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: index > 0 ? rutas[index - 1] : null,
    next: index < rutas.length - 1 ? rutas[index + 1] : null,
  };
}
