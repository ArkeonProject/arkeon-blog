import { getRutaBySlug, rutas } from "../data/rutas";
import type { RutaMeta } from "../types/ruta";

type SeoLocale = "es" | "en";

type RutaSeoEntry = {
  title: string;
  description: string;
};

type RutaSeoByLocale = Record<SeoLocale, RutaSeoEntry>;

const RUTA_SEO_BY_SLUG: Record<string, RutaSeoByLocale> = {
  "primer-empleo-tech": {
    es: {
      title: "Ruta primer empleo tech | Arkeonix Labs",
      description: "Plan ordenado para conseguir tu primer empleo tech: roles, aprendizaje, portfolio, CV, LinkedIn y aplicaciones.",
    },
    en: {
      title: "First tech job roadmap | Arkeonix Labs",
      description: "A structured plan to land your first tech job: roles, learning, portfolio, CV, LinkedIn, and applications.",
    },
  },
  "qa-automation": {
    es: {
      title: "Ruta QA Automation | Arkeonix Labs",
      description: "Camino práctico para aprender QA Automation con Java, Selenium, API testing, CI/CD y buenas prácticas.",
    },
    en: {
      title: "QA Automation roadmap | Arkeonix Labs",
      description: "A practical path to learn QA Automation with Java, Selenium, API testing, CI/CD, and best practices.",
    },
  },
  "java-selenium": {
    es: {
      title: "Ruta Java Selenium | Arkeonix Labs",
      description: "Aprende automatización de pruebas con Java, Selenium, Page Object Model, Cucumber y pipelines CI/CD.",
    },
    en: {
      title: "Java Selenium roadmap | Arkeonix Labs",
      description: "Learn test automation with Java, Selenium, Page Object Model, Cucumber, and CI/CD pipelines.",
    },
  },
  "portfolio-junior": {
    es: {
      title: "Ruta portfolio junior | Arkeonix Labs",
      description: "Construye un portfolio junior sólido con proyectos, README, testing, CI/CD, documentación y presentación profesional.",
    },
    en: {
      title: "Junior portfolio roadmap | Arkeonix Labs",
      description: "Build a strong junior portfolio with projects, README files, testing, CI/CD, documentation, and professional presentation.",
    },
  },
  "ci-cd-basico": {
    es: {
      title: "Ruta CI/CD básico | Arkeonix Labs",
      description: "Aprende CI/CD desde cero con GitHub Actions, validaciones automáticas, despliegues y buenas prácticas.",
    },
    en: {
      title: "Basic CI/CD roadmap | Arkeonix Labs",
      description: "Learn CI/CD from scratch with GitHub Actions, automated checks, deployments, and best practices.",
    },
  },
  "crear-saas": {
    es: {
      title: "Ruta crear SaaS | Arkeonix Labs",
      description: "Ruta para crear un SaaS desde cero: idea, arquitectura, autenticación, pagos, despliegue y operación.",
    },
    en: {
      title: "Build a SaaS roadmap | Arkeonix Labs",
      description: "A roadmap to build a SaaS from scratch: idea, architecture, authentication, payments, deployment, and operations.",
    },
  },
};

export function getRutaSeoCoverageSlugs(): string[] {
  return Object.keys(RUTA_SEO_BY_SLUG);
}

export function getRutaSeoMeta(slug: string, locale: SeoLocale = "es"): RutaSeoEntry | null {
  const ruta = getRutaBySlug(slug);
  if (!ruta) return null;

  return RUTA_SEO_BY_SLUG[slug]?.[locale] ?? {
    title: `${ruta.titleKey} | Arkeonix Labs`,
    description: ruta.descKey,
  };
}

export function getRutaHowToSteps(ruta: RutaMeta, t: (key: string) => string, slug: string) {
  return ruta.sections.map((section, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: t(section.titleKey),
    text: t(section.contentKey).split("\n\n").filter(Boolean).join(" "),
    url: `https://arkeonixlabs.com/rutas/${slug}#${section.id}`,
  }));
}

export function getMissingRutaSeoSlugs(): string[] {
  const covered = new Set(getRutaSeoCoverageSlugs());
  return rutas.map((ruta) => ruta.slug).filter((slug) => !covered.has(slug));
}
