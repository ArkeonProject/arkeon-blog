-- ============================================
-- Guía Junior Developer - Seed Chapters (FULL CONTENT)
-- ============================================

-- CAPÍTULO 1: Test de perfil + Roadmaps + Guía QA
INSERT INTO guia_chapters (slug, title, content, is_free, "order") VALUES (
  'puestos-existentes',
  'Capítulo 1 — El sector: qué puestos existen de verdad',
  '{
    "sections": [
      {
        "type": "header",
        "label": "Sección 01 — Test de perfil",
        "title": "¿Qué rol encaja contigo?",
        "intro": "Cada respuesta suma a un perfil: Frontend, Backend, QA o DevOps. Al final verás tu encaje con un output concreto. No es un test de personalidad. Es un punto de partida accionable."
      },
      {
        "type": "quiz",
        "questions": [
          {
            "num": "1",
            "title": "Cómo procesas los problemas",
            "subtitle": "Cuando tienes un problema que resolver, lo primero que haces es…",
            "options": [
              { "letter": "A", "text": "Lo visualizas: te imaginas cómo debería verse el resultado.", "profile": "Frontend" },
              { "letter": "B", "text": "Lo divides en partes y atacas cada una por separado.", "profile": "Backend" },
              { "letter": "C", "text": "Buscas primero qué puede salir mal.", "profile": "QA" },
              { "letter": "D", "text": "Buscas si hay una forma de que no tengas que hacerlo manualmente la próxima vez.", "profile": "DevOps" }
            ]
          },
          {
            "num": "2",
            "title": "Qué te frustra más",
            "subtitle": "De estas cuatro cosas, ¿cuál te molesta más encontrar en un proyecto?",
            "options": [
              { "letter": "A", "text": "Una interfaz que es horrible de usar o de ver.", "profile": "Frontend" },
              { "letter": "B", "text": "Código sin lógica clara, difícil de seguir.", "profile": "Backend" },
              { "letter": "C", "text": "Algo que falla sin que nadie lo haya probado antes.", "profile": "QA" },
              { "letter": "D", "text": "Un proceso manual que nadie ha automatizado todavía.", "profile": "DevOps" }
            ]
          },
          {
            "num": "3",
            "title": "Qué tipo de reto te atrae",
            "subtitle": "¿Cuál de estos proyectos te llama más la atención?",
            "options": [
              { "letter": "A", "text": "Rediseñar la app de tu banco para que sea fácil de usar.", "profile": "Frontend" },
              { "letter": "B", "text": "Construir la API que procesa millones de transacciones al día.", "profile": "Backend" },
              { "letter": "C", "text": "Asegurarte de que ningún bug llega al usuario antes del lanzamiento.", "profile": "QA" },
              { "letter": "D", "text": "Montar la infraestructura que aguanta todo eso sin caerse.", "profile": "DevOps" }
            ]
          },
          {
            "num": "4",
            "title": "Tu reacción ante una app rota",
            "subtitle": "Cuando usas una app y algo no funciona bien, lo primero que piensas es…",
            "options": [
              { "letter": "A", "text": "\"Esto podría estar mejor diseñado.\"", "profile": "Frontend" },
              { "letter": "B", "text": "\"El backend está mal hecho.\"", "profile": "Backend" },
              { "letter": "C", "text": "\"Esto nunca debió llegar a producción así.\"", "profile": "QA" },
              { "letter": "D", "text": "\"El sistema de despliegue falló en algún punto.\"", "profile": "DevOps" }
            ]
          },
          {
            "num": "5",
            "title": "Qué te daría más satisfacción",
            "subtitle": "¿Cuál de estos resultados te haría sentir más orgulloso?",
            "options": [
              { "letter": "A", "text": "Que alguien diga \"esta app es la más intuitiva que he usado.\"", "profile": "Frontend" },
              { "letter": "B", "text": "Que un sistema tuyo procese 10 millones de registros sin fallar.", "profile": "Backend" },
              { "letter": "C", "text": "Encontrar un bug crítico antes de que llegue al usuario.", "profile": "QA" },
              { "letter": "D", "text": "Que un deploy en producción tarde 2 minutos en lugar de 2 horas.", "profile": "DevOps" }
            ]
          },
          {
            "num": "6",
            "title": "Cómo aprendes mejor",
            "subtitle": "Si tuvieras que aprender algo nuevo mañana, preferirías…",
            "options": [
              { "letter": "A", "text": "Ver el resultado final e ir construyendo hacia atrás.", "profile": "Frontend" },
              { "letter": "B", "text": "Entender la lógica y la teoría antes de escribir código.", "profile": "Backend" },
              { "letter": "C", "text": "Usarlo tú mismo primero y luego buscar todos los fallos posibles.", "profile": "QA" },
              { "letter": "D", "text": "Montarlo en un entorno real y ver qué pasa.", "profile": "DevOps" }
            ]
          }
        ]
      },
      {
        "type": "results",
        "title": "Resultados — tu perfil y tu primer paso",
        "profiles": [
          { "profile": "Mayoría A → Frontend", "desc": "Piensas visualmente. Tu primer paso: HTML, CSS y JavaScript. Proyecto para empezar: clona la interfaz de una app que uses y publícala en GitHub Pages." },
          { "profile": "Mayoría B → Backend", "desc": "Prefieres la lógica a la estética. Tu primer paso: elige Python o Node.js y construye una API REST. Proyecto: gestor de tareas con base de datos y auth básica." },
          { "profile": "Mayoría C → QA", "desc": "Tu cabeza busca fallos donde otros ven que funciona. Tu primer paso: testing manual y Postman. Proyecto: documenta casos de prueba para una app real y compártelos en LinkedIn." },
          { "profile": "Mayoría D → DevOps", "desc": "Piensas en sistemas y automatización. El rol más escaso y mejor pagado en junior. Tu primer paso: Docker y GitHub Actions. Proyecto: pipeline de CI/CD para una app simple." }
        ],
        "note": "Si hay empate entre dos perfiles, elige el que resuena más. No hay perfil incorrecto."
      },
      {
        "type": "header",
        "label": "Sección 02 — Roadmap detallado por puesto",
        "title": "Aprender con dirección",
        "intro": "Aprender sin orden es perder el tiempo. Aquí va lo que necesitas, en el orden en que lo necesitas, con el tiempo realista que lleva cada fase y el proyecto con el que lo demuestras. Busca tu rol y sigue el orden."
      },
      {
        "type": "roadmaps",
        "items": [
          {
            "role": "QA — Roadmap de 4 meses",
            "months": [
              { "month": "Mes 1", "title": "Testing manual", "desc": "Aprende a escribir casos de prueba, reportar bugs con toda la información (pasos, evidencia, severidad, entorno) y trabaja con Jira o TestRail. Tiempo: 4–6h/semana." },
              { "month": "Mes 2", "title": "Automatización básica", "desc": "Empieza con Cypress o Playwright (más modernos que Selenium para empezar). Aprende a escribir los primeros tests sobre una web real. No necesitas dominar el lenguaje, necesitas entender la lógica." },
              { "month": "Mes 3", "title": "API Testing", "desc": "Postman para probar APIs REST. Aprende qué es una petición HTTP, diferencia entre GET, POST, PUT y DELETE, y cómo documentar los resultados." },
              { "month": "Mes 4", "title": "CI básico", "desc": "Integra tus tests en un pipeline de GitHub Actions para que se ejecuten automáticamente. Esto ya te diferencia del 80% de los juniors de QA." }
            ],
            "project": "Suite de tests automatizados sobre una web pública (e-commerce de prueba), README explicando qué cubre y por qué, pipeline corriendo en GitHub."
          },
          {
            "role": "Frontend — Roadmap de 4 meses",
            "months": [
              { "month": "Mes 1", "title": "HTML y CSS sólido", "desc": "Layouts, responsive, Flexbox y Grid. No el CSS de hace 10 años. El que usan las empresas ahora. Al final del mes deberías poder maquetar cualquier diseño." },
              { "month": "Mes 2", "title": "JavaScript funcional", "desc": "DOM, eventos, fetch, promesas y async/await. No hace falta aprender todo JavaScript. Hace falta entender cómo manipular la página y comunicarse con una API." },
              { "month": "Mes 3", "title": "React", "desc": "Componentes, props, estado con useState y useEffect. Context API para estado global. Es el framework más pedido en ofertas junior en España." },
              { "month": "Mes 4", "title": "Proyecto final", "desc": "Una aplicación completa que consuma una API real, tenga al menos 3 vistas y esté desplegada online. Puede ser el tiempo, películas o algo propio." }
            ],
            "project": "Portfolio personal + mini-app con API externa, desplegada en Vercel, con código limpio en GitHub."
          },
          {
            "role": "Backend — Roadmap de 4 meses",
            "months": [
              { "month": "Mes 1", "title": "Lenguaje + HTTP básico", "desc": "Elige Python (FastAPI o Django) o Node.js (Express). Aprende cómo funciona HTTP: peticiones, respuestas, códigos de estado. No cambies de lenguaje a mitad." },
              { "month": "Mes 2", "title": "Base de datos", "desc": "SQL básico con PostgreSQL o MySQL. SELECT, INSERT, UPDATE, DELETE, JOIN. Entiende qué es un índice. El 90% de los backends tienen una base de datos relacional." },
              { "month": "Mes 3", "title": "API REST completa", "desc": "CRUD, manejo de errores, validación de datos y autenticación con JWT. Documéntala con Swagger o Postman." },
              { "month": "Mes 4", "title": "Deploy", "desc": "Sube tu API a Render o Railway (gratuitos para empezar). Aprende variables de entorno y por qué no subes el .env a GitHub." }
            ],
            "project": "API REST documentada con Swagger, con autenticación, base de datos real y desplegada. README con decisiones técnicas."
          },
          {
            "role": "Fullstack — Roadmap de 6 meses",
            "months": [
              { "month": "Meses 1–2", "title": "Frontend", "desc": "Sigue el roadmap de Frontend hasta React básico." },
              { "month": "Meses 3–4", "title": "Backend", "desc": "Sigue el roadmap de Backend hasta API REST completa." },
              { "month": "Meses 5–6", "title": "Conexión", "desc": "Conecta ambas partes. Frontend consumiendo tu propia API. Deploy del stack completo." }
            ],
            "project": "App con frontend en React, backend en Node o Python y base de datos real. No tiene que ser original. Tiene que funcionar y estar documentado."
          },
          {
            "role": "DevOps — Roadmap de 4 meses",
            "months": [
              { "month": "Mes 1", "title": "Linux y bash", "desc": "Comandos básicos, scripting, gestión de procesos y permisos. Si no te sientes cómodo en una terminal, no puedes hacer DevOps." },
              { "month": "Mes 2", "title": "Docker", "desc": "Qué es un contenedor, por qué resuelve el \"en mi máquina funciona\", Docker Compose para múltiples servicios." },
              { "month": "Mes 3", "title": "CI/CD", "desc": "GitHub Actions para automatizar tests, builds y deploys. Flujo completo: commit → test → build → deploy." },
              { "month": "Mes 4", "title": "Cloud básico", "desc": "AWS o GCP con el free tier. Sube una app a la nube, configura un servidor básico, entiende IAM y permisos." }
            ],
            "project": "Pipeline completo que buildea, corre los tests y despliega automáticamente en la nube con cada push a main. Documenta cada paso."
          }
        ]
      },
      {
        "type": "header",
        "label": "Sección 11 — Guía específica de QA para juniors",
        "title": "El puesto que nadie explica bien",
        "intro": "Esta sección no existe en ningún bootcamp ni en ningún curso. Es lo que realmente pasa cuando trabajas como QA en España: qué herramientas usas, cómo es una entrevista técnica de testing y por qué QA es uno de los mejores puntos de entrada al sector."
      },
      {
        "type": "list_block",
        "title": "El día a día real de un QA en España",
        "items": [
          ["Testing manual", "La mayoría del tiempo en juniors. Ejecutar casos de prueba definidos, encontrar bugs, documentarlos en Jira con pasos reproducibles, evidencias y severidad."],
          ["Reuniones de equipo", "Daily standup (15 minutos), sprint planning, retrospectiva. En junior principalmente escuchas y preguntas."],
          ["Regresiones", "Antes de cada release, vuelves a probar las funcionalidades que han tocado para asegurarte de que nada se ha roto."],
          ["Comunicación con desarrollo", "Cuando reportas un bug tienes que dar suficiente info para que el dev pueda reproducirlo sin preguntarte nada más."],
          ["Automatización (mid-senior)", "Al principio es marginal. Conforme creces, es cada vez más el núcleo del rol."]
        ]
      },
      {
        "type": "list_block",
        "title": "Herramientas que se usan de verdad en proyectos reales",
        "items": [
          ["Jira + Confluence", "Gestión de tareas y documentación. Casi universal en empresas con más de 10 personas."],
          ["Postman", "Testing de APIs REST. Imprescindible desde el primer día si hay backend."],
          ["Cypress o Playwright", "Los dos frameworks de automatización más demandados ahora mismo. Playwright está ganando terreno rápido."],
          ["Selenium", "Más antiguo, todavía muy presente en empresas con sistemas legacy. No es urgente para empezar."],
          ["Git + GitHub", "Para versionar los scripts de automatización. Aprende Git básico antes de nada."],
          ["BrowserStack", "Testing en diferentes navegadores y dispositivos. Lo usan empresas medianas y grandes."],
          ["k6 o JMeter", "Testing de rendimiento y carga. No lo necesitas de entrada, pero conocerlo es un diferenciador."]
        ]
      },
      {
        "type": "list_block",
        "title": "Cómo es una entrevista técnica de QA",
        "items": [
          ["Casos de prueba en vivo", "Te pedirán escribir casos de prueba en el momento. \"Escribe los casos de prueba para el buscador de Google.\" Practica esto antes. Incluye casos positivos, negativos y de borde."],
          ["Manual vs automatizado", "Preguntas sobre testing manual vs. automatizado. Cuándo automatizar, qué criterios usas, qué tiene sentido mantener manual."],
          ["Bug irreproducible", "\"¿Qué harías si un usuario reporta un error que no puedes reproducir?\" Tienen que ver tu proceso de investigación, no la respuesta mágica."],
          ["Ejercicio técnico", "En posiciones con automatización, es posible que te pidan un ejercicio corto para hacer en casa o en vivo."],
          ["Proceso ágil", "Qué es un sprint, qué es la definición de done, cómo priorizas cuando hay demasiado que probar."]
        ]
      },
      {
        "type": "list_block",
        "title": "Cómo demostrar experiencia sin haber trabajado",
        "items": [
          ["Suite de tests en GitHub", "Crea una suite de tests sobre una web real que conozcas bien. Documenta los casos de prueba en Notion. Ponlo en GitHub."],
          ["Vídeo reportando bugs", "Graba un vídeo corto reportando un bug real que encuentres en cualquier app. Muéstralo en LinkedIn. Es más real que cualquier certificado."],
          ["Open source como tester", "Contribuye a proyectos open source como tester. Muchos proyectos pequeños no tienen QA y agradecen el feedback estructurado."],
          ["Certificación ISTQB", "Certifícate en ISTQB Foundation si quieres un título reconocido. En España se pide bastante, especialmente en consultoras."]
        ]
      },
      {
        "type": "callout_dark",
        "title": "Tu ventaja competitiva real",
        "paragraphs": [
          "Hay menos gente apuntando a QA que a Frontend o Backend. La competencia es menor. El acceso al primer trabajo es más rápido si tienes los proyectos bien trabajados.",
          "El sueldo junior es comparable al de otros roles. Y la progresión hasta QA Senior o QA Lead con automatización te lleva a rangos de 35.000–50.000€ con 4-6 años de experiencia.",
          "Además: entender cómo se rompen los sistemas te hace mejor ingeniero/a en cualquier disciplina. Hay QAs que con el tiempo se convierten en los técnicos más completos del equipo."
        ]
      }
    ]
  }'::jsonb,
  false,
  1
);

-- CAPÍTULO 2: Salarios + Negociación + Mapa de carrera
INSERT INTO guia_chapters (slug, title, content, is_free, "order") VALUES (
  'salarios',
  'Capítulo 2 — El dinero: cuánto se cobra y por qué',
  '{
    "sections": [
      {
        "type": "header",
        "label": "Sección 05 — Negociación salarial",
        "title": "Lo que vale una oferta",
        "intro": "El primer trabajo no se negocia igual que el quinto. Pero eso no significa que tengas que aceptar lo primero que te ofrezcan. Esta sección te enseña a leer una oferta, a pedir más cuando tiene sentido y a saber qué vale más allá del bruto anual."
      },
      {
        "type": "salary_table",
        "title": "Rangos salariales reales — juniors en España (2025–2026)",
        "rows": [
          ["QA Engineer Junior", "18.000 – 22.000 €"],
          ["Frontend Developer Junior", "18.000 – 24.000 €"],
          ["Backend Developer Junior", "20.000 – 26.000 €"],
          ["Fullstack Developer Junior", "20.000 – 27.000 €"],
          ["DevOps Junior", "22.000 – 30.000 €"]
        ],
        "note": "Fuentes: Glassdoor, InfoJobs, Talent.com. Madrid y Barcelona están en el extremo alto; otras ciudades pueden estar 2.000–4.000€ por debajo."
      },
      {
        "type": "list_block",
        "title": "Preguntas que tienes que hacer en la entrevista",
        "items": [
          ["\"¿Cuál es la banda salarial para esta posición?\"", "No es incómoda. Es una pregunta normal."],
          ["\"¿Hay revisión salarial al cabo de 6 meses, o el ajuste es solo anual?\"", ""],
          ["\"¿Cuál es la política de teletrabajo? ¿Días fijos o flexible?\"", ""],
          ["\"¿Cómo es el proceso de onboarding para alguien que empieza?\"", ""]
        ]
      },
      {
        "type": "callout",
        "title": "Script que funciona",
        "text": "\"Gracias por la oferta. He investigado el mercado y para este rol en [ciudad] el rango habitual está entre [X] y [Y]. Teniendo en cuenta mi formación en [tecnología o proyecto concreto], me gustaría plantear [número]. ¿Hay margen para ajustarlo?\"",
        "note": "Lo que lo hace funcionar: tiene tiempo, tiene logros, tiene datos. No es una queja. Es una conversación adulta sobre valor."
      },
      {
        "type": "list_block",
        "title": "Más allá del número — qué incluye una buena oferta",
        "items": [
          ["Vacaciones", "22 es el mínimo legal. 25+ es bueno. Más de 27 es excelente."],
          ["Teletrabajo", "Cuántos días, si son fijos o flexibles."],
          ["Formación", "¿Pagan cursos o certificaciones? ¿Hay horas de trabajo para formarte?"],
          ["Beneficios", "Ticket restaurante (≈1.500–2.000€/año en valor real), seguro médico, guardería."],
          ["Plan de carrera", "¿Hay un proceso claro de promoción? ¿Cuánto tiempo para pasar a mid?"]
        ]
      },
      {
        "type": "callout",
        "text": "Regla práctica: Un ticket restaurante de 11€/día son ~2.200€ al año libres de IRPF. Dos días de teletrabajo pueden ser 100–200€/mes ahorrados en transporte. El bruto es solo una parte del cálculo."
      },
      {
        "type": "header",
        "label": "Sección 06 — Mapa de carrera completo",
        "title": "De junior a donde quieras llegar",
        "intro": "Nadie te dice de verdad qué se espera en cada nivel, cuándo dar el paso o cómo prepararte para él. Aquí va el mapa completo desde el primer día como junior."
      },
      {
        "type": "career_levels",
        "levels": [
          {
            "level": "Junior (0–2 años) · 18.000–26.000€",
            "expects": "Aprender rápido. Hacer buenas preguntas (no las mismas dos veces). Entregar lo que prometes aunque sea pequeño. Pedir ayuda antes de perder 3 horas atascado.",
            "wrong": "Esperar a tener todo claro antes de preguntar. Asumir que \"para eso están los seniors\". El equipo prefiere que preguntes a que te bloquees en silencio.",
            "signal": "Te asignan tareas sin supervisión constante y las entregas. Puedes explicar las decisiones técnicas que tomaste."
          },
          {
            "level": "Mid (2–4 años) · 26.000–40.000€",
            "expects": "Autonomía. Mentorizar a juniors informalmente. Tomar decisiones técnicas en tu área sin escalarlo todo. Pensar en el mantenimiento del código, no solo en que funcione.",
            "wrong": "Seguir esperando que les digan qué hacer. El paso de junior a mid no es de tiempo, es de actitud y responsabilidad.",
            "signal": "Resuelves problemas sin escalarlos. Otros del equipo te piden opinión. El equipo no nota tu ausencia un día, pero sí una semana."
          },
          {
            "level": "Senior (4–8 años) · 36.000–58.000€",
            "expects": "Decisiones de arquitectura. Código limpio, mantenible y bien documentado. Revisión de código de otros. Anticipar problemas antes de que ocurran. Comunicación clara con el negocio sobre impacto técnico.",
            "wrong": "",
            "signal": "Tu opinión cambia las decisiones del equipo. Puedes elegir: seguir creciendo técnicamente (arquitecto) o hacia gestión de personas (lead/manager)."
          }
        ]
      },
      {
        "type": "advanced_roles",
        "roles": [
          { "role": "Tech Lead · 45.000–72.000€", "desc": "Mitad técnico, mitad gestión de equipo. Defines estándares, revisas código, desbloqueas a tu equipo y hablas con producto. No es para todos: hay gente excelente técnicamente que odia la gestión de personas. Saber eso antes es muy valioso." },
          { "role": "Arquitecto · 55.000–90.000€", "desc": "El camino técnico sin gestión de personas. Diseñas sistemas, tomas decisiones de stack, defines cómo se integran los componentes. Alta especialización. Menos posiciones, pero muy bien pagadas y con mucha autonomía." },
          { "role": "Engineering Manager · 55.000–95.000€", "desc": "Tu trabajo ya no es código, es personas: contratación, crecimiento del equipo, retención, procesos. Supone dejar de programar el día a día. Hay que quererlo de verdad." },
          { "role": "CTO / VP Engineering · 90.000–150.000€+", "desc": "En empresas grandes, casi pura estrategia. En startups, todavía hay código. Es el resultado de años construyendo reputación, no de seguir un plan lineal." }
        ]
      },
      {
        "type": "callout_dark",
        "title": "Lo que nadie te dice",
        "paragraphs": [
          "El salario sube con cada cambio de empresa más que con las promociones internas. Los mejores saltos salariales ocurren cuando cambias de trabajo, no cuando te ascienden. No es deslealtad. Es cómo funciona el mercado.",
          "Un senior que lleva 5 años en la misma empresa puede ganar menos que un mid que acaba de entrar. Tener ese dato cambia cómo negocias y cuándo decides moverte."
        ]
      },
      {
        "type": "list_block",
        "title": "Cuándo dar cada paso",
        "items": [
          ["De junior a mid", "Cuando llevas 12–18 meses entregando bien y sin necesitar supervisión constante en la mayoría de tareas."],
          ["De mid a senior", "Cuando decides de forma autónoma en tu área y los demás te buscan para resolver los problemas difíciles."],
          ["De senior a lead/arquitecto", "Cuando tienes claro qué rama quieres (técnica o personas) y hay una oportunidad real en tu empresa o en el mercado."],
          ["El cambio de empresa", "Cuando llevas más de 2 años sin crecimiento real (salarial o técnico) y el mercado te ofrece significativamente más. Valorar en frío, no por frustración."]
        ]
      }
    ]
  }'::jsonb,
  false,
  2
);

-- CAPÍTULO 3: Plan 90 días + CV + Entrevista
INSERT INTO guia_chapters (slug, title, content, is_free, "order") VALUES (
  'practicas-cv-portfolio',
  'Capítulo 3 — Las prácticas: CV, portfolio y entrevista',
  '{
    "sections": [
      {
        "type": "header",
        "label": "Sección 03 — Plan de 90 días",
        "title": "Tu plan hasta el trabajo",
        "intro": "El plan de 30 días de la guía free te da el arranque. Este te lleva hasta el final: con CV actualizada, proyectos en GitHub y solicitudes enviadas. Una semana, un objetivo. Sin ambigüedad."
      },
      {
        "type": "callout",
        "text": "Cómo usar este plan: Cada semana tiene un objetivo concreto y un entregable. Si no tienes el entregable, no pasas a la siguiente semana. Eso es lo que lo hace funcionar."
      },
      {
        "type": "plan_90",
        "weeks": [
          { "week": "Semana 1", "title": "Define el destino", "desc": "Haz el test de perfil. Lee el roadmap de tu rol. Marca el proyecto que vas a construir. Configura tu entorno de desarrollo.", "deliverable": "Rol elegido + proyecto definido + entorno listo" },
          { "week": "Semana 2", "title": "Domina los fundamentos base", "desc": "Entra de lleno en el mes 1 de tu roadmap. Los fundamentos son lo primero que te preguntan en una entrevista.", "deliverable": "Ejercicios básicos completados y subidos a GitHub" },
          { "week": "Semana 3", "title": "Construye algo pequeño que funcione", "desc": "Aplica lo aprendido en un mini-proyecto. No tiene que ser bonito ni original. Tiene que funcionar de principio a fin.", "deliverable": "Repo en GitHub con código funcionando y README básico" },
          { "week": "Semana 4", "title": "LinkedIn y GitHub activos", "desc": "Perfil de LinkedIn con foto, titular claro y descripción de lo que buscas. GitHub con al menos un proyecto visible. Sin esto no existes.", "deliverable": "Perfil LinkedIn completo + GitHub público con proyecto" },
          { "week": "Semana 5", "title": "Proyecto principal — fase 1", "desc": "Empieza el proyecto del portfolio. Esta semana: estructura, decisiones técnicas, primeras funciones. Abre el repo desde el primer día.", "deliverable": "Repo creado con estructura inicial y primer commit real" },
          { "week": "Semana 6", "title": "Proyecto principal — fase 2", "desc": "Continúa el proyecto. Esta semana: las funcionalidades principales. Sin perfeccionar. Sin estancarte en detalles. Avanza.", "deliverable": "Funcionalidades core completadas" },
          { "week": "Semana 7", "title": "Proyecto principal — terminar y documentar", "desc": "Cierra el proyecto. README con capturas, descripción de qué hace, tecnologías usadas y cómo correrlo. Publicado y accesible.", "deliverable": "Proyecto publicado con README completo y enlace funcional" },
          { "week": "Semana 8", "title": "CV y portfolio listos", "desc": "Aplica la plantilla de CV de esta guía. Adapta el texto a tu rol. Pide feedback a alguien. Corrige. Publica tu portfolio si tienes web propia.", "deliverable": "CV revisada y lista para enviar" },
          { "week": "Semana 9", "title": "Primeras solicitudes — tanda de 10", "desc": "Aplica a 10 ofertas. No las mejores 10. Las 10 que encuentres ese día. El objetivo es arrancar el proceso, no esperar la oferta perfecta.", "deliverable": "10 solicitudes enviadas con registro de empresa, fecha y contacto" },
          { "week": "Semana 10", "title": "Prepara las entrevistas técnicas", "desc": "Revisa las preguntas reales de esta guía para tu rol. Practica en voz alta. El objetivo no es memorizar respuestas, es no bloquearte.", "deliverable": "5 preguntas técnicas practicadas + respuesta preparada para \"cuéntame sobre ti\"" },
          { "week": "Semana 11", "title": "10 solicitudes más + seguimientos", "desc": "Segunda tanda de 10 solicitudes. Haz seguimiento a las de la semana 9 que no contestaron: un mensaje corto y directo en LinkedIn.", "deliverable": "20 solicitudes acumuladas + seguimientos enviados" },
          { "week": "Semana 12", "title": "Proceso en marcha", "desc": "Si has seguido el plan, tienes proyectos en GitHub, CV lista, 20+ solicitudes enviadas y posiblemente alguna entrevista en marcha. Si no hay respuestas todavía, sigue enviando. El volumen gana.", "deliverable": "Registro de todas las solicitudes + al menos una entrevista agendada o en proceso" }
        ]
      },
      {
        "type": "header",
        "label": "Sección 04 — Plantillas CV y portfolio",
        "title": "El CV de un junior no tiene que impresionar",
        "intro": "Tiene que ser claro, honesto y demostrar que sabes lo que buscas. Aquí van las plantillas que funcionan, qué poner en cada sección y los errores que comete todo el mundo."
      },
      {
        "type": "cv_table",
        "title": "Estructura base — aplica a todos los roles",
        "rows": [
          ["Titular", "\"QA Engineer Jr. | Testing Manual y Automatizado\" — específico y con keywords del rol", "\"Apasionado de la tecnología\" — no dice nada"],
          ["Resumen", "3 líneas: qué eres, qué sabes hacer y qué buscas. Sin adjetivos.", "Párrafos largos sobre tu motivación personal"],
          ["Proyectos", "Nombre + enlace + qué problema resuelve + tecnologías + métrica si la hay", "\"Proyecto personal de práctica\" sin link"],
          ["Skills", "Solo lo que dominas o has usado en un proyecto real. Por categoría.", "30 tecnologías que viste en tutoriales"],
          ["Formación", "Nombre del curso/bootcamp, fechas y qué aprendiste", "Todos los certificados de Udemy en lista"]
        ]
      },
      {
        "type": "cv_examples",
        "examples": [
          {
            "role": "QA",
            "title": "\"QA Engineer Jr. | Testing Manual · Cypress · Postman\"",
            "summary": "Formación en testing de software con experiencia práctica en pruebas manuales y automatización con Cypress. He documentado más de 80 casos de prueba para proyectos propios y detectado errores en APIs con Postman. Busco mi primera posición como QA en un equipo ágil.",
            "project": "Suite de tests automatizados para [nombre web] — 40 tests E2E con Cypress cubriendo flujo de compra, autenticación y gestión de usuario. Pipeline activo en GitHub Actions. [enlace]",
            "why": "Es específico, tiene números y tiene enlace. El recruiter puede comprobarlo directamente."
          },
          {
            "role": "Frontend",
            "title": "\"Frontend Developer Jr. | React · JavaScript · CSS\"",
            "summary": "Desarrollo interfaces web con React y JavaScript desde hace 6 meses. Tres proyectos publicados en producción. Sólida base en HTML semántico, CSS responsive y consumo de APIs REST. Busco un equipo donde seguir creciendo técnicamente.",
            "project": "MovieSearch App — Búsqueda de películas con React, API de TMDB y diseño responsive. Desplegada en Vercel. Más de 15 commits documentados. [enlace]"
          },
          {
            "role": "Backend",
            "title": "\"Backend Developer Jr. | Node.js · Python · PostgreSQL\"",
            "summary": "Desarrollo APIs REST con Node.js y Express. Experiencia con PostgreSQL, autenticación JWT y despliegue en Railway. He construido dos APIs propias documentadas con Swagger. Busco una posición donde trabajar con datos y lógica de negocio compleja.",
            "project": "Task Manager API — API REST con autenticación JWT, CRUD completo y base de datos PostgreSQL. Documentada con Swagger UI. Desplegada en Railway. [enlace al repo y al Swagger]",
            "why": "Muestra que sabes hacer lo que hace un backend junior real: API, base de datos, autenticación, deploy y documentación."
          }
        ]
      },
      {
        "type": "good_bad",
        "bad": "\"Tengo muchas ganas de aprender y me adapto bien a los cambios.\" Esto no le dice nada a nadie. Cualquier candidato del mundo escribe esto.",
        "good": "\"He construido [X] con [tecnología] en [tiempo]. Puedes verlo en [enlace].\" Concreto, verificable, sin adjetivos vacíos."
      },
      {
        "type": "checklist",
        "title": "Checklist de portfolio",
        "items": [
          "Al menos un proyecto publicado y accesible (no solo en local).",
          "README claro: qué hace, cómo se usa, tecnologías y decisiones técnicas principales.",
          "Código en GitHub sin archivos sensibles (.env, credenciales, builds innecesarios).",
          "Si tienes web propia: diseño limpio, sección de proyectos con capturas y enlace al código.",
          "No hace falta ser original. Hace falta que funcione y que puedas explicarlo en una entrevista."
        ]
      },
      {
        "type": "callout",
        "text": "El error más común: Tener proyectos que \"casi funcionan\" o que solo corren en local. Si no puedes enviar un enlace, no existe. Despliega antes de aplicar."
      },
      {
        "type": "header",
        "label": "Sección 07 — Plantillas de email para recruiters",
        "title": "Mensajes que consiguen respuesta",
        "intro": "La diferencia entre un mensaje que se ignora y uno que consigue respuesta no es el tono. Es la especificidad. Copia, adapta los corchetes y úsalos."
      },
      {
        "type": "email_scripts",
        "scripts": [
          {
            "label": "Script 1 — Contactar recruiter en LinkedIn",
            "text": "Hola [nombre],\n\nHe visto que trabajas con empresas de [sector: ej. \"tecnología en Madrid\" o \"startups de fintech\"]. Estoy buscando mi primera posición como [rol] con formación en [tecnología principal o nombre del bootcamp].\n\nSi tienes algo que pueda encajar, me gustaría saberlo. ¿Estarías abierto/a a una conversación breve?\n\nGracias, [tu nombre]"
          },
          {
            "label": "Script 2 — Responder a una oferta sin sonar genérico",
            "text": "Hola [nombre],\n\nGracias por contactarme. La posición en [empresa] me llama la atención por [razón concreta: ej. \"el stack con React y Node que usáis\" o \"el sector de edtech\"].\n\nEstaría encantado/a de saber más sobre el rol y el equipo. ¿Cuándo podríamos hablar?\n\nUn saludo, [tu nombre]"
          },
          {
            "label": "Script 3 — Seguimiento después de una entrevista",
            "text": "Hola [nombre],\n\nQuería escribirte para agradecerte la entrevista del [día]. La conversación sobre [tema concreto que tocaron] me resultó especialmente interesante.\n\nSigo muy interesado/a en la posición. ¿Tienes alguna actualización sobre los próximos pasos?\n\nGracias, [tu nombre]"
          },
          {
            "label": "Script 4 — Rechazar una oferta con educación",
            "text": "Hola [nombre],\n\nQuería escribirte para agradecerte el tiempo y el proceso. He decidido no continuar porque [razón directa: \"he aceptado otra oferta\" o \"el rol no encaja con lo que busco en este momento\"].\n\nHa sido una experiencia muy buena y espero que podamos coincidir en el futuro.\n\nUn saludo, [tu nombre]"
          }
        ]
      },
      {
        "type": "callout",
        "text": "Regla de oro: Menciona siempre algo específico. Un detalle real —el nombre del recruiter, un dato de la empresa, algo de la oferta— convierte una plantilla en un mensaje humano. Los mensajes genéricos se reconocen en dos segundos."
      },
      {
        "type": "header",
        "label": "Sección 08 — Preguntas reales de entrevista",
        "title": "Las que se preguntan de verdad",
        "intro": "No son las preguntas teóricas de un libro. Lo que diferencia una buena respuesta de una mala no suele ser el conocimiento técnico: es si demuestras que lo has aplicado o solo lo has leído."
      },
      {
        "type": "interview_questions",
        "sections": [
          {
            "role": "QA",
            "questions": [
              "\"¿Cómo priorizarías los casos de prueba si el tiempo es limitado antes de un release?\"",
              "\"Hay un bug que solo se reproduce una de cada diez veces. ¿Cómo lo documentas y qué haces con él?\"",
              "\"¿Cuál es la diferencia entre un test de regresión y un test de humo?\"",
              "\"Dame un ejemplo de algo que automatizarías y algo que dejarías manual. ¿Por qué?\"",
              "\"Escribe casos de prueba para el formulario de login de LinkedIn.\" (ejercicio en vivo)"
            ]
          },
          {
            "role": "Frontend",
            "questions": [
              "\"¿Cómo optimizarías el rendimiento de una web que tarda 4 segundos en cargar?\"",
              "\"Explícame el event loop de JavaScript como si no supiera programar.\"",
              "\"¿Cuándo usarías useState y cuándo useReducer en React?\"",
              "\"¿Qué es el virtual DOM y por qué existe?\"",
              "\"Revisa este componente y dime qué cambiarías.\" (ejercicio en vivo con código)"
            ]
          },
          {
            "role": "Backend",
            "questions": [
              "\"Diseña el modelo de base de datos para un sistema de pedidos online. Dime las tablas y las relaciones.\"",
              "\"¿Cuándo usarías SQL y cuándo NoSQL? ¿Qué factores te influyen?\"",
              "\"¿Cómo manejas los errores en una API REST? ¿Qué devuelves cuando algo falla?\"",
              "\"Explícame cómo funciona JWT. ¿Qué problema resuelve?\"",
              "\"¿Qué es un índice en una base de datos y cuándo lo añadirías?\""
            ]
          }
        ]
      },
      {
        "type": "good_bad",
        "bad": "Pregunta: \"¿Tienes experiencia con React?\" — \"Sí, lo he aprendido en un curso de Udemy y en el bootcamp.\"",
        "good": "Pregunta: \"¿Tienes experiencia con React?\" — \"He construido dos proyectos con React. Uno es una app de búsqueda de películas con la API de TMDB y el otro un gestor de tareas con estado global en Context. Puedo mostrarte el código.\""
      },
      {
        "type": "list_block",
        "title": "Preguntas de comportamiento — método STAR",
        "items": [
          ["STAR", "Situación, Tarea, Acción, Resultado. No improvises. Prepara 3 historias reales antes de cada entrevista."],
          ["\"Cuéntame un momento en el que te atascaste en un problema técnico y cómo lo resolviste.\"", ""],
          ["\"¿Cómo reaccionas cuando recibes feedback negativo sobre tu trabajo?\"", ""],
          ["\"Dame un ejemplo de algo que aprendiste solo porque necesitabas resolver un problema.\"", ""],
          ["\"¿Cómo organizas tu tiempo cuando tienes varias tareas a la vez?\"", ""]
        ]
      },
      {
        "type": "list_block",
        "title": "Preguntas que DEBES hacer tú al final",
        "items": [
          ["\"¿Cómo es el proceso de onboarding? ¿Con quién trabajaré más directamente los primeros meses?\"", ""],
          ["\"¿Cuál es el mayor reto técnico que está afrontando el equipo ahora mismo?\"", ""],
          ["\"¿Cómo funciona el proceso de code review en el equipo?\"", ""],
          ["\"¿Qué herramientas usa el equipo en el día a día? ¿Cómo es el flujo de despliegue?\"", ""],
          ["\"¿Hay presupuesto o tiempo dedicado a la formación?\"", ""]
        ]
      },
      {
        "type": "callout",
        "text": "Por qué preguntar importa: No es solo para parecer interesado. Es para saber si quieres trabajar ahí. Una empresa que no puede responder \"¿cómo es el proceso de code review?\" está diciéndote algo sobre cómo trabajan."
      },
      {
        "type": "header",
        "label": "Sección 09 — Análisis de ofertas reales",
        "title": "Cómo leer lo que no dice la oferta",
        "intro": "Una oferta de trabajo no dice la verdad entera. Hay que saber leerla entre líneas: qué significa realmente \"3 años de experiencia\", cuándo un requisito es negociable y qué señales de alerta no debes ignorar."
      },
      {
        "type": "list_block",
        "title": "Lo que las frases comunes significan en realidad",
        "items": [
          ["\"3 años de experiencia requeridos\"", "Si tienes proyectos sólidos y 1-2 años de formación, aplica igualmente. El 80% de los años de experiencia son años de wishlist."],
          ["\"Se valorará experiencia con X\"", "No es obligatorio. Es lo ideal. Si no tienes X pero tienes el resto, aplica."],
          ["\"Entorno dinámico y startup\"", "Puede ser equipo ágil o puede ser caos sin procesos. Pregúntalo."],
          ["\"Persona polivalente\"", "Probablemente harás más cosas de las que pone en el título. Puede ser bueno para aprender o explotación encubierta. Pregunta qué haría el día a día."],
          ["\"Gran empresa tecnológica consolidada\"", "Más estabilidad, procesos más definidos, crecimiento más lento e impacto individual menor. No es ni mejor ni peor."]
        ]
      },
      {
        "type": "list_block",
        "title": "5 señales de alerta que no debes ignorar",
        "items": [
          ["No aparece el nombre de la empresa", "¿Por qué se esconde?"],
          ["Piden 8-10 tecnologías distintas para un rol junior", "No buscan a alguien, buscan a cinco personas."],
          ["No pone rango salarial ni siquiera aproximado", "Señal de que van a pagar lo mínimo."],
          ["El texto tiene errores o está copiado de otra oferta", "Claramente cambiado el nombre."],
          ["\"Proceso ágil de selección\" sin fases definidas", "Puede significar que no tienen proceso definido."]
        ]
      },
      {
        "type": "list_block",
        "title": "Preguntas que hacerte antes de aplicar",
        "items": [
          ["¿Cumplo el 60% o más de los requisitos?", "Si sí, aplica. Si no, aplica igualmente y mira qué pasa."],
          ["¿La empresa existe en LinkedIn?", "¿Tiene perfil activo y empleados reales?"],
          ["¿Hay reviews en Glassdoor?", "¿Qué dicen los que se fueron?"],
          ["¿Sé con qué equipo trabajaría?", "¿Qué tecnología usaría el día a día?"]
        ]
      },
      {
        "type": "callout",
        "text": "Ejercicio práctico: Busca 3 ofertas reales en LinkedIn para tu perfil. Por cada una: marca qué requisito es obligatorio y cuál es wishlist. Apunta qué no dice la oferta pero debería. Eso te prepara para la entrevista mejor que cualquier curso."
      },
      {
        "type": "header",
        "label": "Sección 10 — Qué hacer cuando te rechazan",
        "title": "Va a pasar. Muchas veces.",
        "intro": "No es una señal de que algo va mal. Es el proceso normal de buscar trabajo. Esta sección no es motivacional. Es práctica: qué haces exactamente después de un rechazo."
      },
      {
        "type": "text_block",
        "title": "La regla del 80",
        "paragraphs": [
          "En una búsqueda normal de trabajo junior en España, 8 de cada 10 aplicaciones no van a tener respuesta. No es personal. Es volumen: hay decenas o cientos de candidatos por oferta y no tienen capacidad para contestar a todos.",
          "Necesitas enviar muchas solicitudes. No 5. No 10. Treinta, cuarenta, cincuenta. Quien más envía, más oportunidades crea."
        ]
      },
      {
        "type": "list_block",
        "title": "El protocolo después de un rechazo",
        "items": [
          ["No lo proceses el primer día", "Las primeras horas son las peores para sacar conclusiones. Déjalo pasar 24h."],
          ["Anota en qué punto del proceso llegaste", "¿Fue en el CV? ¿En la primera llamada? ¿En la técnica? El patrón es información."],
          ["Si llegaste a entrevista, pide feedback", "\"Si pudieras darme algún feedback para mejorar, te lo agradecería.\" Simple. Sin insistir si no contestan."],
          ["Si no te lo dan, analiza tú", "¿Qué pregunta no contestaste bien? ¿Faltaba algo en el proyecto? ¿El CV no encajaba?"],
          ["Sigue enviando", "El proceso no se pausa por un rechazo. Ese mismo día, aplica a otra."]
        ]
      },
      {
        "type": "good_bad",
        "bad": "Que no sirves para este trabajo. Que el sector está cerrado. Que hiciste todo mal. Que no encuentras trabajo nunca.",
        "good": "Que había un candidato con más proyectos. Que el CV no pasó el filtro automático. Que el equipo buscaba otro perfil cultural. Que fue mala suerte de timing."
      },
      {
        "type": "list_block",
        "title": "Cuándo volver a aplicar a la misma empresa",
        "items": [
          ["Si te rechazaron en el CV", "Puedes intentarlo en 2-3 meses si la oferta sigue activa o sale una nueva. Cambia el ángulo."],
          ["Si llegaste a entrevista", "Espera al menos 6 meses. Cambia algo: proyecto nuevo, más formación, diferente presentación del CV."],
          ["Si el rechazo fue final", "A veces no es el momento, no el candidato. En 6-12 meses con más experiencia, merece la pena intentarlo."]
        ]
      }
    ]
  }'::jsonb,
  false,
  3
);

-- CAPÍTULO 4: Recursos + Youtubers + FAQ
INSERT INTO guia_chapters (slug, title, content, is_free, "order") VALUES (
  'que-aprender',
  'Capítulo 4 — El camino: qué aprender y en qué orden',
  '{
    "sections": [
      {
        "type": "header",
        "label": "Bonus — Recursos curados",
        "title": "Lo que de verdad merece la pena",
        "intro": "No todos los cursos son iguales. Estos son los que más se repiten entre juniors que han conseguido trabajo, organizados por perfil. Sin precios fijos porque cambian constantemente."
      },
      {
        "type": "resources",
        "categories": [
          {
            "category": "QA",
            "resources": [
              ["Playwright", "Documentación oficial (playwright.dev) es la mejor fuente. Completa y siempre actualizada."],
              ["Cypress", "Documentación oficial + Testing Bootcamp de Udemy (busca el de Vishwanath Gowda o similar)."],
              ["API Testing", "Postman Learning Center (gratuito, muy completo, cubre desde cero hasta automatización)."],
              ["Certificación", "ISTQB Foundation Courseware, gratuito en muchos sitios. Se pide mucho en consultoras españolas."]
            ]
          },
          {
            "category": "Frontend",
            "resources": [
              ["Base completa", "The Odin Project (gratuito, excelente base HTML/CSS/JS/React, con proyectos reales)."],
              ["JavaScript", "javascript.info (gratuito, el mejor recurso técnico de JS que existe)."],
              ["React", "Documentación oficial de React (la nueva, con hooks). Sin excusas para no leerla."],
              ["CSS", "Kevin Powell en YouTube. El mejor recurso de CSS avanzado, con diferencia."]
            ]
          },
          {
            "category": "Backend",
            "resources": [
              ["Node.js / Express", "Documentación oficial + curso de Maximilian Schwarzmüller en Udemy (el más completo)."],
              ["Python", "Tutorial oficial de Python + documentación de FastAPI."],
              ["SQL", "SQLZoo (gratuito, interactivo) + Mode SQL Tutorial para análisis real."],
              ["Git (todos los perfiles)", "Pro Git (libro gratuito oficial en español). El definitivo."]
            ]
          },
          {
            "category": "DevOps y fundamentos generales",
            "resources": [
              ["Docker", "Documentación oficial + TechWorld with Nana en YouTube."],
              ["CI/CD", "GitHub Actions documentation oficial (muy completa y con ejemplos)."],
              ["Fundamentos", "CS50 de Harvard (gratuito en edX). El mejor punto de entrada para cualquier perfil técnico."]
            ]
          }
        ]
      },
      {
        "type": "header",
        "label": "Bonus — YouTubers de referencia",
        "title": "Canales que realmente aportan",
        "intro": "Máximo tres por área. Los que más se repiten cuando se pregunta a juniors que ya trabajan qué les ayudó de verdad. Empieza por los de español si el inglés todavía te frena."
      },
      {
        "type": "youtubers",
        "channels": [
          { "name": "MiduDev", "desc": "Frontend, fullstack, React, entrevistas técnicas en directo. El canal en español más completo del sector. Muy enfocado en lo práctico y en el mundo laboral real." },
          { "name": "Hola Mundo (Nicolás Schürmann)", "desc": "Carrera, consejos reales, startups, productividad. Directo y sin filtros. Muy útil para entender cómo funciona el mundo del trabajo en tech más allá del código." },
          { "name": "Gentleman Programming", "desc": "Clean Code, patrones, arquitectura. Para cuando ya tienes la base técnica y quieres entender cómo se estructura código de verdad. Bueno para mid y avanzando." },
          { "name": "Fireship", "desc": "Tendencias y conceptos en menos de 10 minutos. Excelente para mantenerse al día. Inglés, pero muy visual y fácil de seguir. El canal que más juniors mencionan." },
          { "name": "Traversy Media", "desc": "Tutoriales de stack completo muy prácticos. HTML, CSS, JS, React, Node, Python. Muy buena base para Frontend y Fullstack. Inglés claro y bien explicado." },
          { "name": "TechWorld with Nana", "desc": "DevOps, Docker, Kubernetes. La referencia del sector para quien quiera ir por esa rama. Explica con claridad conceptos que suelen ser muy densos en la documentación oficial." }
        ]
      },
      {
        "type": "callout",
        "text": "Cómo usarlos bien: YouTube sirve para entender conceptos y ver aplicaciones reales, no para sustituir la práctica. Limítate a 1-2 horas de vídeo por cada hora de código. Si llevas más de 40 minutos viendo sin haber abierto el editor, para y escribe algo."
      },
      {
        "type": "list_block",
        "title": "Otros canales que merece la pena conocer",
        "items": [
          ["CodelyTV", "Arquitectura, DDD, patrones. Nivel avanzado. Para cuando ya trabajas y quieres ir más allá de que \"funcione\"."],
          ["The Primeagen", "Opiniones sin filtro sobre el mundo del desarrollo. Bueno para perspectiva real del sector. Inglés."],
          ["Continuous Delivery (Dave Farley)", "Software engineering de fondo. Para entender por qué las cosas se hacen como se hacen."]
        ]
      },
      {
        "type": "header",
        "label": "Bonus — FAQ completa",
        "title": "Las preguntas de todas las charlas",
        "intro": "Estas son las preguntas que se repiten en cada charla presencial. Respondidas sin rodeos."
      },
      {
        "type": "faq",
        "items": [
          { "q": "¿Vale la pena aprender IA ahora?", "a": "Sí, pero como herramienta, no como sustituto. Aprende a usarla para entender código que no conoces, depurar más rápido y explorar opciones técnicas. No para que escriba código que no entiendes. En la entrevista técnica eso se nota en dos preguntas." },
          { "q": "¿Bootcamp o universidad?", "a": "Depende de tu situación. La carrera da bases más sólidas y tarda 4 años. El bootcamp da velocidad y tarda 6–12 meses. Ninguno garantiza trabajo solo por tenerlo. Lo que garantiza trabajo son los proyectos y la actitud. Si puedes hacer ambos, haz ambos. Si tienes que elegir: el bootcamp es más rápido para acceder al primer trabajo, la carrera es mejor para el largo plazo técnico." },
          { "q": "¿Necesito inglés para trabajar en España?", "a": "Para leer documentación, sí es imprescindible desde el día uno. Para comunicarte con el equipo, depende de la empresa. Para acceder a mejores oportunidades y salarios más altos, el inglés funcional abre muchas más puertas. Si el inglés te frena ahora, no pares por eso. Ve mejorándolo en paralelo." },
          { "q": "¿Qué hacer si no consigo prácticas?", "a": "Primero: analiza dónde está el problema. ¿Es el CV (keywords, formato)? ¿Es la candidatura (oferta muy competida)? ¿Es la entrevista (preparación insuficiente)? Después: amplía el radio — otras ciudades, empresas que no están en el primer resultado de búsqueda, proyectos open source para construir historial visible. La media está en 40–80 solicitudes antes del primer sí. Sigue enviando." },
          { "q": "¿Cuándo estoy listo para buscar trabajo?", "a": "Cuando tengas un proyecto en GitHub que funcione de principio a fin y sepas explicarlo. No cuando hayas terminado todos los cursos. Eso no ocurre nunca. La preparación perfecta no existe. Aplica antes de sentirte listo. Las entrevistas también son práctica." },
          { "q": "¿Qué hacer después de las prácticas?", "a": "Tres opciones: te quedas si la empresa es buena y el rol te da aprendizaje real. Cambias si el sueldo es muy bajo respecto al mercado o si dejaste de aprender. Pides referencia en cualquier caso — una buena palabra de un manager vale más que cualquier certificado. No salgas sin tener la siguiente oportunidad ya encaminada." }
        ]
      }
    ]
  }'::jsonb,
  false,
  4
);

-- CAPÍTULO 5: Buenas prácticas
INSERT INTO guia_chapters (slug, title, content, is_free, "order") VALUES (
  'buenas-practicas',
  'Capítulo 5 — Las buenas prácticas que nadie enseña',
  '{
    "sections": [
      {
        "type": "header",
        "label": "Capítulo 5 — Lo que no te enseñan en clase",
        "title": "Buenas prácticas reales",
        "intro": "Ningún curso de programación te enseña cómo trabajar en un equipo real. Git, código limpio, comunicación y code review son las habilidades que separan a quien se integra bien de quien cuesta más de lo que aporta los primeros meses."
      },
      {
        "type": "list_block",
        "title": "Git en el mundo real",
        "items": [
          ["Commits semánticos", "feat:, fix:, docs:, refactor:, test:. No \"cambios varios\" o \"arreglos\". Cada commit explica qué cambia y por qué. Los equipos miran el historial de commits para entender el código. El tuyo tiene que ser legible."],
          ["Ramas", "Nunca trabajes directamente en main. Crea ramas con nombre descriptivo: feature/login-page, fix/null-pointer-dashboard. Cada tarea es una rama. Cada rama es un pull request."],
          ["Pull requests", "Título claro, descripción de qué cambia y cómo probarlo, capturas si hay cambio visual. No abras un PR con \"cambios\" como título. El revisor lo aparcará indefinidamente."],
          ["Resolver conflictos", "Cuando dos personas tocan el mismo archivo, Git no sabe qué versión conservar. Tu trabajo es entender el cambio de la otra persona, no solo elegir el tuyo. \"Aceptar los míos siempre\" rompe el trabajo de otros."]
        ]
      },
      {
        "type": "git_flow",
        "title": "El flujo habitual en un equipo real",
        "flow": "main (producción) → develop (integración) → feature/xxx (tu trabajo)",
        "steps": [
          "Creas tu rama desde develop",
          "Trabajas en tu rama con commits semánticos",
          "Abres un Pull Request a develop con descripción clara",
          "Alguien del equipo revisa y deja comentarios",
          "Corriges, se aprueba y se hace merge",
          "Periódicamente se mergea develop a main para ir a producción"
        ]
      },
      {
        "type": "list_block",
        "title": "Código limpio sin ser purista",
        "items": [
          ["Nombres que dicen lo que hacen", "getUserById no getUser. isEmailValid no check. Un nombre que necesita comentario es un nombre que necesita cambiarse."],
          ["Funciones que hacen una sola cosa", "Si tu función tiene dos \"y\" en su nombre (obtenerYformatearUsuario), es dos funciones."],
          ["Comentarios para el \"por qué\", no para el \"qué\"", "El código dice qué hace. El comentario explica por qué lo hace así. \"// Workaround porque la API de X devuelve fechas en formato incorrecto\" es útil. \"// Suma uno al contador\" no lo es."],
          ["Lo que importa en code review", "Que el código sea mantenible, que los nombres sean claros y que los errores estén manejados. La elegancia es completamente secundaria."]
        ]
      },
      {
        "type": "good_bad",
        "bad": "\"Tengo un error con el fetch.\"",
        "good": "\"Estoy haciendo un GET a /api/users y recibo un 403. El token está en el header y la URL es correcta. Código: [código]. ¿Qué puede estar fallando?\""
      },
      {
        "type": "callout",
        "text": "La diferencia: contexto, lo que ya probaste, evidencia. Así la persona que te ayuda no necesita interrogarte para entender el problema."
      },
      {
        "type": "list_block",
        "title": "Code review: cómo dar y recibir feedback",
        "items": [
          ["Dar feedback útil", "Específico (\"esta función debería devolver null en lugar de undefined porque...\"), sobre el código no la persona (\"este nombre no es descriptivo\" no \"esto está mal puesto\"), y siempre con una sugerencia de mejora."],
          ["Recibir feedback", "No es personal. Es el código, no tú. Pregunta si no entiendes la sugerencia. Si te repiten el mismo comentario en varios PRs, toma nota: es un patrón a mejorar."],
          ["Actitud correcta", "El code review no es un examen. Es la forma en que el equipo garantiza que el código sea mantenible para todos. Cuanto antes lo internalices, antes dejarás de sentirlo como un ataque."]
        ]
      }
    ]
  }'::jsonb,
  false,
  5
);

-- CAPÍTULO 6: Primer empleo
INSERT INTO guia_chapters (slug, title, content, is_free, "order") VALUES (
  'primer-empleo',
  'Capítulo 6 — El primer empleo: sobrevivir y crecer',
  '{
    "sections": [
      {
        "type": "header",
        "label": "Capítulo 6 — El primer trabajo",
        "title": "Qué esperar y cómo sobrevivir",
        "intro": "Los primeros tres meses son los más intensos. Nuevo entorno, nueva gente, nueva base de código, nuevas herramientas. Esto es normal. No es una señal de que elegiste mal ni de que no eres suficientemente bueno."
      },
      {
        "type": "text_block",
        "title": "El síndrome del impostor es universal",
        "paragraphs": [
          "Todo el mundo siente que sabe menos de lo que debería. En el primer trabajo, en el segundo y a veces en el quinto. La diferencia entre quien supera esa sensación y quien se queda atascado no es el nivel técnico: es cómo gestionan la incertidumbre.",
          "Regla práctica: pregunta antes de perder más de 30 minutos atascado. No es señal de debilidad. Es señal de que usas bien el tiempo del equipo."
        ]
      },
      {
        "type": "list_block",
        "title": "Los primeros 30 días: escucha y observa",
        "items": [
          ["Entiende el negocio", "Qué problema resuelve el producto, quiénes son los usuarios, qué parte del sistema vas a tocar."],
          ["Aprende el flujo de trabajo", "Cómo se gestiona el código, cómo se despliega, qué proceso siguen los tickets."],
          ["Hazte visible de forma útil", "Entrega tareas pequeñas y bien hechas. Un PR limpio con descripción clara dice más que uno grande lleno de errores."],
          ["Anota las preguntas", "Anota las preguntas que haces y las respuestas que recibes. No repitas la misma pregunta dos veces."]
        ]
      },
      {
        "type": "list_block",
        "title": "Los meses 2 y 3: empiezas a rendir",
        "items": [
          ["Ya conoces el sistema", "Ahora te asignan tareas con menos supervisión."],
          ["Toma iniciativa", "Si ves algo que mejorar, dilo. No hace falta que lo implementes tú. Señalarlo ya es un aporte."],
          ["Comunica tu progreso", "Comunica tu progreso proactivamente: \"Terminé la tarea, la tengo en QA, espero feedback para el PR.\""],
          ["Pide feedback antes del momento formal", "\"¿Qué puedo mejorar de cómo estoy trabajando?\" en una conversación informal vale más que el feedback anual."]
        ]
      },
      {
        "type": "text_block",
        "title": "De junior a mid: no es de tiempo, es de actitud",
        "paragraphs": [
          "La diferencia entre junior y mid no es cuántos años llevas. Es cuánta autonomía tienes. Cuando empiezas a hacer estas cosas sin que te lo pidan, estás haciendo trabajo de mid:",
          "Señal de que estás listo: cuando la respuesta a \"¿en qué necesitas ayuda?\" sea regularmente \"en nada, lo gestiono yo\"."
        ]
      },
      {
        "type": "checklist",
        "title": "Señales de que estás haciendo trabajo de mid",
        "items": [
          "Anticipas problemas antes de que ocurran.",
          "Tu código no solo funciona: es fácil de mantener para los demás.",
          "Puedes explicar y defender las decisiones técnicas que tomaste.",
          "Bloqueas menos al equipo y desbloqueas más a los que te rodean.",
          "Mentorizas informalmente a los que vienen detrás."
        ]
      },
      {
        "type": "list_block",
        "title": "Cuándo pedir un aumento — y cuándo no",
        "items": [
          ["Cuándo tiene sentido", "Llevas más de 12 meses, has completado proyectos con responsabilidad clara, tu rol real ha crecido más que tu salario, tienes datos de mercado que respaldan la petición (Glassdoor, InfoJobs, Talent.com)."],
          ["Cuándo NO es el momento", "Acabas de entrar (menos de 6 meses), hay freeze de contrataciones, o tu rendimiento reciente no ha sido tu mejor momento."]
        ]
      },
      {
        "type": "callout",
        "title": "Script que funciona",
        "text": "\"Quería hablar contigo sobre mi compensación. Llevo [X] meses en el equipo y en ese tiempo he [logro concreto: liderado X, mejorado Y, asumido Z]. He mirado el mercado y para este nivel en [ciudad] el rango habitual está entre [X] y [Y]. Me gustaría plantear una revisión a [número]. ¿Qué te parece?\"",
        "note": "Lo que lo hace funcionar: tiene tiempo, tiene logros, tiene datos. No es una queja. Es una conversación adulta sobre valor."
      },
      {
        "type": "callout_dark",
        "title": "La realidad del mercado",
        "paragraphs": [
          "Los mejores saltos salariales ocurren cuando cambias de empresa, no cuando te ascienden. Un senior que lleva 4 años en la misma empresa puede ganar menos que un mid que acaba de entrar.",
          "Lealtad está bien. Pero tiene un coste económico que debes medir de vez en cuando."
        ]
      }
    ]
  }'::jsonb,
  false,
  6
);
