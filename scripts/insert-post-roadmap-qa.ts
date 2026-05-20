import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Load .env.local ────────────────────────────────────────────────
const envPath = resolve(__dirname, "../.env.local");
if (existsSync(envPath)) {
  const envFile = readFileSync(envPath, "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join("=").trim();
      }
    }
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables. Check .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Post content ────────────────────────────────────────────────────

const content = `<p>Playwright lidera los frameworks E2E, el 77% de los equipos de testing ya usa IA de alguna forma, y los salarios QA en España van de 20.000 a 55.000 euros brutos anuales.</p>

<p>Eso en cuanto a los titulares. Si trabajas en QA en España, lo que vives en el día a día es algo más matizado: las consultoras grandes siguen en Selenium + Java + Cucumber (que es lo que usa la mayoría de proyectos en banca, seguros o farmacéutica) y las empresas de producto llevan un par de años pasándose a Playwright + TypeScript. Dos mercados corriendo en paralelo. El stack donde empieces define qué aprendes primero, con quién trabajas y cuánto cobras.</p>

<h2>El mercado QA en España</h2>

<p>La Guía Salarial Manfred 2026 describe la situación como "un punto complicado": hay empresas donde los developers han absorbido el testing, empresas que lo automatizan al máximo y algunas que esperan a ver qué hacen los agentes de IA. Tres frentes distintos, ninguno resuelto.</p>

<p>Las cifras de empleo no muestran caída. Tecnoempleo tenía 107 ofertas activas de QA en abril de 2026; Indeed España supera las 500 para "test automation". El volumen aguanta, pero el perfil que piden ha cambiado. Las ofertas ya no buscan a alguien que ejecute scripts, sino a alguien que diseñe la estrategia de testing, trabaje con autonomía en equipos ágiles y sepa integrar IA en su flujo.</p>

<p>El World Quality Report 2025 de Capgemini: el 89% de las organizaciones ya pilota o despliega flujos con GenAI, aunque solo el 15% lo tiene a escala real. Las consultoras van más despacio que las empresas de producto, principalmente porque sus clientes tienen proyectos legacy que no cambian de stack por moda. Esa diferencia de velocidad tiene un precio en el recibo del sueldo.</p>

<h2>Las herramientas</h2>

<h3>El estado real de los frameworks E2E</h3>

<p>Playwright domina. Sus descargas npm semanales llegaron a 44,9 millones; Cypress tiene 7,4 millones; la versión JavaScript de Selenium, 2,1 millones. En GitHub supera las 85.600 estrellas y el State of JS 2025 le da un 91% de satisfacción y un 94% de retención.</p>

<p>En ofertas de empleo españolas aparece como requisito principal en la mayoría de las nuevas publicaciones: Julius Baer Madrid pide "Playwright, TypeScript, Java"; EdgeTier Barcelona busca "Playwright TypeScript"; Lognext ofrece 50.000-70.000 € en remoto con Playwright como herramienta central. Cypress sigue presente en empresas con stacks JavaScript puros.</p>

<table>
  <thead>
    <tr>
      <th>Framework</th>
      <th>Descargas npm/semana</th>
      <th>GitHub Stars</th>
      <th>Adopción global</th>
      <th>Satisfacción</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Playwright</td><td>44,9 M</td><td>85.674</td><td>45,1%</td><td>91%</td></tr>
    <tr><td>Cypress</td><td>7,4 M</td><td>49.605</td><td>14,4%</td><td>72%</td></tr>
    <tr><td>Selenium (JS)</td><td>2,1 M</td><td>34.184</td><td>22,1%</td><td>—</td></tr>
  </tbody>
</table>

<p>Ojo con las cifras: Selenium tiene más de 31.000 empresas verificadas usándolo, pero su ecosistema principal es Java y Python, no npm. En banca, seguros, farmacéutica y administración pública, Selenium + Java + Cucumber sigue siendo el stack real porque los proyectos legacy y los entornos regulados no cambian de herramienta porque algo tenga más estrellas en GitHub. El 74,6% de los equipos QA usa dos o más frameworks en paralelo.</p>

<h3>API, performance, mobile</h3>

<p>En API testing, Postman es la herramienta más pedida: 35 millones de usuarios y aparece en prácticamente todas las ofertas. REST Assured domina en equipos Java; Supertest tiene un nicho en Node.js. Playwright también puede hacer API testing nativamente si quieres consolidar todo en un solo framework.</p>

<p>En performance, k6 ha superado a JMeter en comunidad (29.900 vs 9.200 estrellas en GitHub) y la versión v1.0 de mayo de 2025 incorpora TypeScript nativo consumiendo un 70% menos de CPU. JMeter sigue siendo más pedido en banca española por su soporte de protocolos legacy (JDBC, JMS, SOAP).</p>

<p>En mobile, Appium es el estándar cross-platform (9.800+ empresas globales), aunque la demanda de mobile testing en España es claramente menor que la de web.</p>

<p>Dos áreas que están entrando con fuerza en el rol QA: <strong>seguridad</strong> (OWASP ZAP, Burp Suite) y <strong>accesibilidad</strong> (axe-core, Lighthouse). La European Accessibility Act, en vigor desde junio de 2025, obliga a las empresas de la UE a cumplir estándares de accesibilidad web. Ofertas en Tecnoempleo ya piden explícitamente "pruebas de accesibilidad" y "pruebas de seguridad con Burp Suite y OWASP".</p>

<h2>Qué hace cada nivel</h2>

<h3>Junior (0-2 años)</h3>

<p>Ejecuta pruebas manuales y automatiza scripts básicos bajo supervisión. Selenium o Playwright a nivel elemental, Postman, bugs en Jira, ceremonias ágiles. La autonomía es poca. Muchas consultoras contratan juniors con un bootcamp completado.</p>

<p>Rango salarial: 20.000-27.000 € brutos anuales, mediana cerca de 23.000 €. Viewnext y Accenture pagan entre 17.000 y 23.000 € para perfiles QA Tester generales; el junior de automation queda un poco por encima.</p>

<h3>Mid (2-5 años)</h3>

<p>Diseña frameworks de automatización, implementa Page Object Model, integra tests en pipelines CI/CD y empieza a mentorizar juniors. Se espera autonomía alta y participación en decisiones técnicas.</p>

<p>Ofertas reales: CAPITOLE en Madrid pide "Cypress/Playwright/WebDriverIO, POM, API REST, lifecycle QA, inglés B2"; Serem ofrece 36.000-42.000 € para un QA Automation Selenium-Java en banca remoto. El rango está entre 27.000 y 42.000 €, mediana alrededor de 34.000 €.</p>

<h3>Senior (5+ años)</h3>

<p>Define la estrategia de calidad, elige el stack y lidera QA en equipos multidisciplinares. EPAM en Madrid busca "Senior QA Automation Engineer (Java)" en servicios financieros; HAYS en Barcelona pide "diseño de frameworks Playwright (TypeScript/C#), IaC en Azure, CI/CD GitLab".</p>

<p>Rango: 38.000-55.000 €, con QA Leads llegando a 66.000 € y QA Managers a 76.000 € según Glassdoor.</p>

<h3>Lo que pide cada tipo de empresa</h3>

<p>Las consultoras grandes (Capgemini, Indra, Sopra Steria, EPAM, Krell) piden principalmente Selenium + Java + Cucumber + JUnit/TestNG. Se mueven despacio porque sus clientes tienen proyectos legacy extensos. Las empresas de producto van con Playwright + TypeScript, Python + Pytest para backend y k6 para performance. Las startups usan stacks más ligeros y buscan perfiles híbridos dev+QA.</p>

<p>En lenguajes, Java lidera en volumen absoluto por el peso de las consultoras. JavaScript/TypeScript crece rápido en empresas de producto. Python avanza de forma sostenida en backend testing y API automation.</p>

<h3>De QA manual a automation: el tiempo real</h3>

<p>La transición lleva entre 6 y 24 meses. Un bootcamp de 20 semanas da nivel básico funcional, pero rendir bien como QA mid requiere 12-24 meses de experiencia real. La ruta típica: dominar un lenguaje → framework E2E → Page Object Model → CI/CD → API testing automatizado. "El perfil híbrido tiene una demanda brutal", resume Testing para Todos. Es lo que más se pide ahora mismo.</p>

<h2>Certificaciones</h2>

<p>ISTQB ha superado el millón de certificaciones en 130+ países. En España aparece en unas 95 ofertas en LinkedIn y 77 en Indeed. Está en el 38% de las ofertas senior QA en sectores regulados (banca, salud, gobierno), pero solo en el 12% en empresas de producto y startups. ALTEN Academy es el único Global Partner ISTQB acreditado para todos los niveles en España.</p>

<p>El <strong>ISTQB Foundation Level</strong> tiene el mejor retorno para juniors: entre 200 y 250 € el examen (143 € con tarifa de estudiante en ITI Valencia), 40-80 horas de estudio, y das el vocabulario estándar que las consultoras valoran. El syllabus v4.0 incluye Agile, DevOps y testing exploratorio. El Advanced Level tiene sentido si apuntas a liderazgo en consultoras o banca; cuesta entre 500 y 3.500 € por módulo con formación incluida.</p>

<p>No existen certificaciones oficiales de Playwright, Cypress ni Selenium. Las de mayor impacto salarial para un perfil QA+DevOps son las de AWS o Azure, especialmente AZ-400 Azure DevOps Engineer Expert (~165 USD), que empresas como BBVA y Santander valoran bastante.</p>

<p>Un hiring manager con más de 100 candidatos evaluados: "ISTQB en un CV me dice que el candidato tiene familiaridad básica con vocabulario de testing. La correlación entre tener la certificación y ser bueno en el trabajo es demasiado débil para darle mucho peso". La combinación que funciona: ISTQB Foundation + portfolio en GitHub con tests reales en CI/CD + experiencia demostrable. Ninguno de los tres por separado es suficiente.</p>

<h2>La IA en testing</h2>

<h3>Lo que ya está en producción</h3>

<p>El State of Testing 2026 (PractiTest, 13ª edición) registra un 76,8% de adopción de IA en actividades de testing, desde el 54% del año anterior. Las tareas con más penetración: generación de test cases (40,58% de los testers), datos de test realistas (34,7%) y mantenimiento de scripts con self-healing. GitHub Copilot, con 15+ millones de usuarios, escribe aproximadamente el 46% del código promedio del developer con una tasa de aceptación del 76% para código boilerplate de tests.</p>

<p>Herramientas que ya están en producción real: GitHub Copilot (bueno para tests unitarios y de integración), Testim ahora Tricentis (creación y mantenimiento automático de tests), Mabl (agents autónomos), Applitools Eyes (visual testing con IA) y Katalon (all-in-one con free tier, útil para QAs en transición).</p>

<p>Playwright MCP permite que LLMs interactúen con sesiones de navegador y generen tests desde instrucciones en lenguaje natural. Compatible con VS Code, Cursor, Claude Desktop y GitHub Copilot. Funciona bien para exploratory testing y smoke tests; para suites de regresión estables, el código determinístico sigue siendo más fiable.</p>

<h3>El efecto que nadie esperaba</h3>

<p>Los developers generan un 76% más de código que hace dos años gracias a los copilots de IA, pero los incidentes por pull request han subido un 23,5% y los change failure rates aproximadamente un 30%. Más código generado más rápido es también más bugs posibles. El QA no desaparece, cambia de función: de ejecutar scripts a decidir qué se testa, cómo se arquitecta la suite y cómo se usa la IA sin que se convierta en un problema de calidad en sí misma.</p>

<p>Oleg Sadikov, CEO de DeviQA (Forbes): "La IA no va a devorar nuestros trabajos; los transformará de maneras que pocos anticiparon". Los roles de ejecución manual están en declive real. Los QA que entienden desarrollo, CI/CD y AI tooling tienen cada vez más peso.</p>

<h3>Qué aprender ahora si no quieres quedarte atrás</h3>

<p>Prompt engineering para testing: escribir prompts que generen buenos test cases, datos de test y escenarios edge. Revisar esos tests con criterio, no de cualquier manera: el 60% de las organizaciones reportan problemas con alucinaciones y los knowledge workers gastan 4,3 horas semanales verificando outputs de IA. QA de sistemas de IA (testing adversarial, evaluation pipelines para modelos ML) es la habilidad que más valor va a tener en los próximos dos años. Y Python, que está entrando con fuerza en el stack QA.</p>

<h2>Los salarios reales en España</h2>

<p>La Guía Salarial Manfred 2026 y Glassdoor España (321 salarios de QA Automation Engineer, febrero 2026):</p>

<table>
  <thead>
    <tr>
      <th>Nivel</th>
      <th>Rango bruto anual</th>
      <th>Mediana</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Junior (0-2 años)</td><td>20.000-27.000 €</td><td>~23.000 €</td></tr>
    <tr><td>Mid (2-5 años)</td><td>27.000-42.000 €</td><td>~34.000 €</td></tr>
    <tr><td>Senior (5-10 años)</td><td>38.000-55.000 €</td><td>~44.000 €</td></tr>
    <tr><td>QA Lead</td><td>36.625-54.750 €</td><td>~42.850 €</td></tr>
    <tr><td>QA Manager</td><td>42.000-76.000 €</td><td>~53.000 €</td></tr>
  </tbody>
</table>

<p>Las consultoras pagan sensiblemente menos que las empresas de producto. Glassdoor: Viewnext entre 17.000 y 19.000 €; Accenture entre 17.000 y 23.000 €; Capgemini alrededor de 21.000-22.000 €; Sopra Steria entre 18.000 y 24.000 €. Las empresas de producto pagan un 15-30% más: Second Window paga 36.000-45.000 € a QA Engineers; las ofertas remotas con Playwright/TypeScript de empresas internacionales llegan a 50.000-70.000 €. Los puestos presenciales pagan aproximadamente un 20% más.</p>

<p>Madrid concentra el mayor volumen de ofertas (media 37.200 €); Barcelona paga un poco más (39.500 € de media); Málaga crece con salarios un 10-15% por debajo de Madrid. El trabajo remoto está difuminando estas diferencias.</p>

<p>Un 35-45% de las ofertas en portales españoles son 100% remoto, un 35-40% son híbridas y un 15-25% exigen presencialidad total. Comparado con Europa occidental, España está en la franja baja: un 57% del salario alemán (64.500 €) y un 74% del francés (50.000 €). Las posiciones remotas para empresas europeas tienen una media de 70.481 €/año, que es el número que debería hacer reflexionar a cualquier QA con nivel de inglés decente.</p>

<h2>Por dónde empezar según tu nivel</h2>

<p>Si estás empezando: ISTQB Foundation (~200 €) para el vocabulario, Playwright + TypeScript como framework principal, un portfolio en GitHub con tests reales en CI/CD y Postman para API testing. Aprende a usar Copilot para generar tests, pero revisa cada línea antes de hacer commit. Las alucinaciones en código de tests son especialmente traicioneras porque los tests pasan y dan una falsa sensación de seguridad.</p>

<p>Si llevas 2-5 años y quieres subir: la diferencia está en diseñar frameworks (no solo usarlos) y en tener criterio para revisar los tests que genera la IA. CI/CD avanzado también abre bastantes puertas.</p>

<p>Si eres senior: la parte estratégica tiene cada vez más valor que la técnica pura. Qué se testa y por qué, cómo se arquitecta la calidad en la organización y cómo se integra la IA en el flujo sin crear nuevos puntos de fallo. Es un cambio de rol real. Los QA que siguen haciendo lo mismo que hace cinco años lo tienen cada vez más difícil.</p>`;

// ─── Post metadata ───────────────────────────────────────────────────

const post = {
  title: "Roadmap QA automation 2026: qué aprender y en qué orden",
  slug: "roadmap-qa-automation-2026",
  excerpt:
    "Playwright domina, la IA ya está en el 77% de los equipos de testing y los salarios QA en España van de 20.000 a 55.000 €. Guía completa con datos reales del mercado español: herramientas, niveles, certificaciones y salarios.",
  content,
  author: "David López",
  published_at: new Date().toISOString(),
  language: "ES",
  category: "Carrera",
  product_category: null,
  status: "published",
  cover_image: "",
};

// ─── Insert ─────────────────────────────────────────────────────────

async function run() {
  console.log(`\n📝 Insertando post: "${post.title}"`);
  console.log(`   Slug: ${post.slug}`);

  // Check if slug already exists
  const { data: existing } = await supabase
    .from("posts")
    .select("id, slug")
    .eq("slug", post.slug)
    .single();

  if (existing) {
    console.error(`\n❌ Ya existe un post con el slug "${post.slug}" (id: ${existing.id})`);
    console.log("   Para actualizar en lugar de insertar, usa UPDATE en lugar de INSERT.");
    process.exit(1);
  }

  const { data, error } = await supabase.from("posts").insert(post).select().single();

  if (error) {
    console.error("\n❌ Error al insertar:", error.message);
    process.exit(1);
  }

  console.log(`\n✅ Post publicado correctamente`);
  console.log(`   ID: ${(data as { id: number }).id}`);
  console.log(`   URL: /blog/${post.slug}`);
}

void run();
