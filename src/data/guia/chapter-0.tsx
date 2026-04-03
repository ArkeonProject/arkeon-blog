export default function Chapter0() {
  return (
    <div className="max-w-3xl mx-auto space-y-14">
      {/* ═══ PORTADA ═══ */}
      <section className="text-center space-y-6 py-10">
        <span className="inline-block bg-accent/10 text-accent text-sm font-bold tracking-widest uppercase px-4 py-1.5 rounded-full">
          Guía gratuita · 2026
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
          Guía para juniors: qué hacer después de tu curso de programación en España
        </h1>
        <p className="text-muted-foreground text-xl max-w-xl mx-auto leading-relaxed">
          Descubre qué puestos existen, cuánto se cobra y qué camino seguir en tus primeros 30 días sin perder el tiempo.
        </p>
      </section>

      {/* ═══ SOBRE EL AUTOR ═══ */}
      <section className="border border-border rounded-xl p-8 bg-surface/50">
        <p className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-3">Sobre el autor</p>
        <p className="text-xl font-semibold text-foreground mb-3">David López</p>
        <p className="text-base text-muted-foreground leading-relaxed">
          QA Automation Tester con especialización en el departamento de DevOps. Trabajo en una consultora, donde lidero proyectos para clientes de alto impacto. En paralelo, desarrollo proyectos personales en el ámbito de Web, SaaS y DevOps.
        </p>
        <p className="text-base text-muted-foreground leading-relaxed mt-3">
          Esta guía nace de las preguntas reales que me hacen los juniors en cada charla: las que nadie resuelve en clase, en el bootcamp ni en la universidad.
        </p>
      </section>

      {/* ═══ PÁGINA 2: PERFILES ═══ */}
      <section className="space-y-8">
        <div>
          <p className="text-sm font-bold tracking-widest uppercase text-accent mb-2">¿A quién va dirigida?</p>
          <h2 className="text-3xl font-display font-bold text-foreground">Esto es para ti si…</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            'Has terminado o estás estudiando FP (DAM o DAW), universidad, bootcamp o un curso intensivo de programación.',
            'No tienes claro qué puesto elegir — frontend, backend, QA, fullstack...',
            'Sientes que sabes programar pero no sabes qué hacer con ello.',
            'Has hecho cursos pero sigues sin sentirte preparado para presentar.',
            'No sabes cuánto se cobra ni qué pedir en un trabajo.',
            'Te asusta la idea de ir a una entrevista técnica.',
            'Estás a punto de terminar tus estudios y no sabes qué esperar del mercado laboral.',
            'Has intentado preparar entrevistas pero te sientes perdido con lo que piden.',
          ].map((text, i) => (
            <div key={i} className="relative bg-surface/50 border border-border rounded-xl p-5 pl-6 before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-accent before:rounded-l-xl">
              <p className="text-base text-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
        <div className="bg-foreground text-background rounded-xl p-8">
          <p className="text-sm font-bold tracking-widest uppercase text-background/60 mb-4">Esto NO es para ti si</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-base text-background/80"><span className="text-accent font-bold text-lg">✕</span>Ya tienes más de 2 años de experiencia profesional.</li>
            <li className="flex items-start gap-3 text-base text-background/80"><span className="text-accent font-bold text-lg">✕</span>Buscas un curso técnico profundo de programación.</li>
          </ul>
        </div>
      </section>

      {/* ═══ PÁGINA 3: 16 PREGUNTAS ═══ */}
      <section className="space-y-8">
        <div>
          <p className="text-sm font-bold tracking-widest uppercase text-accent mb-2">16 preguntas</p>
          <h2 className="text-3xl font-display font-bold text-foreground">Las preguntas que nadie te responde</h2>
          <p className="text-base text-muted-foreground mt-3 leading-relaxed">Antes de que sigas perdiendo tiempo, aquí van las preguntas que de verdad me hacen los juniors. Las que nadie resuelve en clase, en el bootcamp ni en la universidad.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { num: '01', q: '¿De qué puedo trabajar realmente?', a: 'No todo lo que estudias tiene demanda directa. El mercado pide cosas muy concretas y no siempre coinciden con lo que te han enseñado.' },
            { num: '02', q: '¿Cuánto se cobra de media?', a: 'Menos de lo que piensas si miras foros antiguos. Más de lo que te ofrecerán en tu primera entrevista.' },
            { num: '03', q: '¿Estoy preparado o no?', a: 'Depende de a qué te presentes. Si no has practicado con algo real, probablemente no lo estés.' },
            { num: '04', q: '¿Qué debería aprender ahora?', a: 'Diez cursos sin dirección no te acercan al trabajo. Necesitas uno con propósito claro.' },
            { num: '05', q: '¿Cómo consigo prácticas sin contactos?', a: 'No es imposible. Pero requiere estrategia, no esperar a que llamen.' },
            { num: '06', q: '¿Qué pasa después de las prácticas?', a: 'Nadie te cuenta esto tampoco. Y importa más de lo que crees.' },
            { num: '07', q: '¿Estoy perdiendo el tiempo?', a: 'Solo si sigues haciendo lo mismo de siempre sin esperar resultados distintos.' },
            { num: '08', q: '¿Cómo uso la IA sin hacer trampa y sin quedarme atrás?', a: 'De ti depende usarla para aprender de verdad o para que haga todo y tú te quedes fuera.' },
            { num: '09', q: '¿Debería salir de España para trabajar?', a: 'Hay opciones fuera. Pero no es para todos y no siempre es la mejor decisión.' },
            { num: '10', q: '¿Universidad o bootcamp?', a: 'Depende de tu situación. La carrera da base, el bootcamp da velocidad. Ninguno garantiza trabajo.' },
            { num: '11', q: '¿Puedo cobrar en prácticas?', a: 'Sí, hay mínimas legales. Y se puede negociar por encima. Casi nadie lo sabe.' },
            { num: '12', q: '¿Cuánto tardaré en encontrar trabajo?', a: 'Depende de tu dedicación, tu perfil y el mercado. No hay fechas exactas, pero sí rangos realistas.' },
            { num: '13', q: '¿Necesito inglés para trabajar?', a: 'Necesitas nivel para leer documentación y comunicarte. No perfeccionismo, pero sí funcionalidad.' },
            { num: '14', q: '¿Fullstack o especializarme?', a: 'Especialízate. Fullstack como junior suele significar malo en ambos. Elige uno y domínalo.' },
            { num: '15', q: '¿Qué lenguaje o tecnología elijo primero?', a: 'El que tenga demanda en tu zona, que te mole y en el que puedas construir algo enseñable.' },
            { num: '16', q: '¿Cómo hago un buen CV sin experiencia?', a: 'No necesitas cinco años. Necesitas proyectos reales, formación con propósito y saber contarlo bien en una página.' },
          ].map((item) => (
            <div key={item.num} className="border-b border-border pb-4">
              <p className="text-sm font-bold text-accent tracking-wider">{item.num}</p>
              <h3 className="text-base font-semibold text-foreground mt-1">{item.q}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PÁGINA 4: MAPA DEL SECTOR ═══ */}
      <section className="space-y-8">
        <div>
          <p className="text-sm font-bold tracking-widest uppercase text-accent mb-2">El mapa del sector</p>
          <h2 className="text-3xl font-display font-bold text-foreground">El sector tiene más roles de los que te cuentan</h2>
          <p className="text-base text-muted-foreground mt-3 leading-relaxed">Te los ordeno por dificultad real de entrada para un junior. No por lo que ponen en las ofertas, sino por lo que se necesita de verdad.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { tag: 'Fácil entrada', bar: 'bg-green-500', tagBg: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', title: 'QA / Testing', desc: 'El camino menos saturado y con demanda constante. Puedes empezar haciendo pruebas manuales y crecer hacia automatización. Nadie explica bien este puesto en los cursos.' },
            { tag: 'Fácil entrada', bar: 'bg-green-500', tagBg: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', title: 'Frontend', desc: 'Mucha demanda, pero también mucha competencia. Entras bien si tienes proyectos reales que mostrar.' },
            { tag: 'Dificultad media', bar: 'bg-amber-500', tagBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', title: 'Backend', desc: 'Menos competencia que frontend, pero exige más fundamentos. Si te gusta pensar en lógica y estructuras, hay sitio.' },
            { tag: 'Dificultad media', bar: 'bg-amber-500', tagBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', title: 'Fullstack', desc: 'Parece atractivo, pero ser bueno en ambos cuesta. Para entrar como junior es más difícil que especializarse primero.' },
            { tag: 'Difícil entrada', bar: 'bg-red-500', tagBg: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', title: 'DevOps', desc: 'Necesitas experiencia en sistemas, redes y herramientas específicas. Entrar sin experiencia previa es complicado.' },
            { tag: 'Difícil entrada', bar: 'bg-red-500', tagBg: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', title: 'Data (analista, ingeniero)', desc: 'Suele requerir formación más específica y conocimientos de SQL, estadística o Python avanzados.' },
            { tag: 'Difícil entrada', bar: 'bg-red-500', tagBg: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', title: 'Mobile', desc: 'Mercado más pequeño en España. Menos ofertas, más especialización.' },
            { tag: 'Difícil entrada', bar: 'bg-red-500', tagBg: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', title: 'Ciberseguridad', desc: 'Prácticamente inaccesible sin experiencia previa. No es un camino de entrada para juniors.' },
          ].map((role) => (
            <div key={role.title} className="relative bg-surface/50 border border-border rounded-xl p-5 pt-6 overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${role.bar}`} />
              <span className={`inline-block text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded mb-3 ${role.tagBg}`}>{role.tag}</span>
              <h3 className="text-lg font-semibold text-foreground mb-2">{role.title}</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{role.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-accent/10 border-l-4 border-accent rounded-r-xl p-6">
          <h4 className="text-base font-bold text-foreground mb-2">La verdad que nadie cuenta</h4>
          <p className="text-base text-muted-foreground leading-relaxed">Lo que realmente importa es lo que desempeñes en tus prácticas. El puesto inicial importa menos de lo que crees. Muchas personas entran como juniors en un rol y acaban especializándose en otro completamente diferente tras las prácticas. Lo que la empresa te deja hacer y aprender durante ese periodo define más tu camino que el título del puesto.</p>
        </div>
        <div className="bg-foreground text-background rounded-xl p-6">
          <h4 className="text-base font-bold text-background mb-2">Un aviso sobre "fullstack"</h4>
          <p className="text-base text-background/80 leading-relaxed">No es un puesto de entrada. Es una combinación que las empresas piden a alguien con experiencia. Si empiezas diciendo "soy fullstack junior", probablemente no seas bueno en ninguna de las dos. Especialízate primero.</p>
        </div>
      </section>

      {/* ═══ PÁGINA 5: SALARIOS ═══ */}
      <section className="space-y-8">
        <div>
          <p className="text-sm font-bold tracking-widest uppercase text-accent mb-2">Dinero real</p>
          <h2 className="text-3xl font-display font-bold text-foreground">Cuánto se cobra de verdad</h2>
          <p className="text-base text-muted-foreground mt-3 leading-relaxed">Rangos orientativos para juniors en España (bruto anual, 2026). Fuente: Glassdoor.es.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="bg-foreground text-background">
                <th className="text-left px-4 py-3 text-sm font-bold uppercase tracking-wider">Rol</th>
                <th className="text-left px-4 py-3 text-sm font-bold uppercase tracking-wider">Rango habitual</th>
                <th className="text-right px-4 py-3 text-sm font-bold uppercase tracking-wider">Media</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['QA junior (manual)', '18.000 € — 23.000 €', '19.000 €'],
                ['QA junior (automatizado)', '19.000 € — 30.000 €', '23.000 €'],
                ['Frontend junior', '18.000 € — 28.000 €', '22.000 €'],
                ['Backend junior', '20.000 € — 29.000 €', '24.000 €'],
                ['Fullstack junior', '18.000 € — 48.000 €', '25.000 €'],
                ['DevOps junior', '22.000 € — 30.000 €', '25.000 €'],
                ['Data junior', '23.000 € — 26.000 €', '25.000 €'],
                ['Mobile junior', '27.000 € — 43.000 €', '33.000 €'],
                ['Ciberseguridad junior', '25.000 € — 31.000 €', '28.000 €'],
              ].map(([rol, rango, media], i) => (
                <tr key={rol} className={i % 2 === 1 ? 'bg-surface/50' : ''}>
                  <td className="px-4 py-2.5 border-b border-border">{rol}</td>
                  <td className="px-4 py-2.5 border-b border-border text-muted-foreground">{rango}</td>
                  <td className="px-4 py-2.5 border-b border-border text-right font-bold text-foreground">{media}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground italic">Fuente: Glassdoor.es. Estos salarios son muy orientativos. Cambian según localización, tipo de empresa, idiomas y modalidad.</p>
        <div>
          <p className="text-sm font-bold tracking-widest uppercase text-accent mb-4">Por qué varían tanto</p>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ['Empresa de producto', 'Crean su propio software: suelen pagar más, mayor estabilidad.'],
              ['Consultora', 'Trabajan para clientes: pueden pagar menos pero dan experiencia diversa.'],
              ['Startup', 'Empresas pequeñas en crecimiento: pagan poco pero dan responsabilidad y aprendizaje rápido.'],
              ['Corporación', 'Empresas grandes: medianos a buenos, procesos lentos.'],
            ].map(([title, desc]) => (
              <div key={title} className="bg-surface/50 border border-border rounded-lg p-4">
                <p className="text-base font-semibold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-base text-muted-foreground leading-relaxed">Remoto suele pagar mejor que presencial en muchas empresas. Híbrido está entre ambos. Si dominas inglés, los rangos suben considerablemente en casi todos los roles.</p>
        <div className="bg-surface/50 border border-border rounded-lg p-5">
          <p className="text-base text-foreground leading-relaxed"><span className="text-accent font-bold">→ </span><strong>El salario no es solo el número.</strong> Hay cosas que se negocian aparte: tickets restaurante, seguro médico, días de vacaciones extra, retribución flexible. Dos ofertas con el mismo salario bruto pueden tener diferencias grandes en lo que realmente ganas.</p>
        </div>
        <div className="bg-surface/50 border border-border rounded-lg p-5">
          <p className="text-base text-foreground leading-relaxed"><span className="text-accent font-bold">→ </span><strong>La primera oferta no es la final.</strong> Siempre se negocia. Si te ofrecen 20.000 €, puedes pedir 22.000-23.000 € y terminar en 21.000-22.000 €. No lo hacen y pierden dinero desde el día uno.</p>
        </div>
      </section>

      {/* ═══ PÁGINA 6: EL ERROR ═══ */}
      <section className="space-y-8">
        <div>
          <p className="text-sm font-bold tracking-widest uppercase text-accent mb-2">El problema real</p>
          <h2 className="text-3xl font-display font-bold text-foreground">El error que te está frenando</h2>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">Has hecho cursos. Muchos cursos. HTML, CSS, JavaScript, Python, React, Node, TypeScript, bases de datos... Y cuando miras una oferta de trabajo, sigues sin saber qué pedir.</p>
        <div className="bg-surface/50 border border-border rounded-xl p-8">
          <p className="italic text-lg text-muted-foreground mb-2">«Es que las empresas están pidiendo mucho stack.»</p>
          <p className="italic text-lg text-muted-foreground mb-2">«Es que con tantas cosas no sé por dónde tirar ni qué aprender.»</p>
          <p className="italic text-lg text-muted-foreground">«¿Debería masterizar algo o aprender varias cosas y frameworks?»</p>
          <p className="text-base text-muted-foreground mt-4">— Esto me lo escucho en cada charla que doy.</p>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-3">¿Por qué pasa?</h3>
            <p className="text-base text-muted-foreground leading-relaxed">No te falta inteligencia. Te falta dirección.</p>
            <p className="text-base text-muted-foreground leading-relaxed mt-2">El mercado no busca a alguien que sepa mucho. Busca a alguien que sepa hacer una cosa bien y pueda demostrarlo.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-3">El otro error: pensar que más cursos te acercan al trabajo</h3>
            <p className="text-base text-muted-foreground leading-relaxed">Hacer el curso 15 de Python no te hace más empleable. Construir algo que se pueda ver, sí.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-3">¿Qué significa esto?</h3>
            <p className="text-base text-muted-foreground leading-relaxed">Lo primero es decidir qué es lo que más te gusta. Pero ten en cuenta que las prácticas pueden desviarte de ese camino. Puedes pivotar después, sí, pero muchas empresas te pagarán lo mínimo porque no tendrás experiencia en la nueva dirección.</p>
            <div className="bg-accent/10 border-l-4 border-accent rounded-r-lg p-5 mt-4">
              <p className="text-base text-foreground leading-relaxed">Lo importante de todo es la práctica. El error. La frustración. Pensar en cómo solucionar un problema. Eso es lo que te forma de verdad.</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-3">Un aviso sobre la IA</h3>
            <p className="text-base text-muted-foreground leading-relaxed">La IA está muy bien, pero de ti depende usarla para aprender y progresar, o dejar que haga todo y estancarte. La diferencia entre ambos caminos se nota en la entrevista técnica.</p>
          </div>
        </div>
      </section>

      {/* ═══ PÁGINA 7: PLAN 30 DÍAS ═══ */}
      <section className="space-y-8">
        <div>
          <p className="text-sm font-bold tracking-widest uppercase text-accent mb-2">Tu plan de 30 días</p>
          <h2 className="text-3xl font-display font-bold text-foreground">Qué hacer ahora</h2>
          <p className="text-base text-muted-foreground mt-3 leading-relaxed">Cuatro semanas para pasar de perdidos a actuar. Sin rodeos.</p>
        </div>
        {[
          { week: 'Semana 1', title: 'Elige tu dirección', desc: 'Dedica esta semana a investigar qué puesto te gusta más. No a aprender, a investigar. Mira ofertas reales en LinkedIn, InfoJobs, Indeed, Glassdoor. Anota qué pide cada puesto, qué tecnologías mencionan, qué salario ofrecen. El objetivo de esta semana: saber hacia dónde vas. Sin eso, todo lo demás es ruido.' },
          { week: 'Semana 2', title: 'Refuerza los fundamentos', desc: 'Ya sabes hacia dónde vas. Ahora asegura que dominas la base de eso que has elegido. Frontend: HTML, CSS, JavaScript funcional. Backend: Un lenguaje de servidor y SQL básico. QA: Pensamiento lógico y una herramienta de testing. Mobile: El framework de tu plataforma y fundamentos de interfaz. No necesitas dominarlo todo. Necesitas dominar lo suficiente para no bloquearte en una entrevista.' },
          { week: 'Semana 3', title: 'Construye algo que se pueda ver', desc: 'Un proyecto personal, pequeño, que puedas poner en GitHub y enseñar. No hace falta que sea original. Tiene que demostrar que sabes hacer algo de principio a fin: ideación, desarrollo, resultado. La diferencia entre alguien que hizo 20 cursos y alguien que construyó algo real la ves en dos minutos de conversación.' },
          { week: 'Semana 4', title: 'Prepara tu CV y aplica', desc: 'Con lo que tienes, ya puedes presentar solicitudes. No hace falta esperar a estar "listo". Las prácticas no esperan.' },
        ].map((w) => (
          <div key={w.week} className="relative border-2 border-border rounded-xl p-6 pt-7 break-inside-avoid">
            <span className="absolute -top-3.5 left-5 bg-accent text-white text-sm font-bold tracking-wider uppercase px-4 py-1 rounded-full">{w.week}</span>
            <h3 className="text-xl font-bold text-foreground mb-2 mt-1">{w.title}</h3>
            <p className="text-base text-muted-foreground leading-relaxed">{w.desc}</p>
          </div>
        ))}
      </section>

      {/* ═══ PÁGINA 8: CONSEJOS PRÁCTICOS ═══ */}
      <section className="space-y-8">
        <div>
          <p className="text-sm font-bold tracking-widest uppercase text-accent mb-2">Consejos prácticos</p>
          <h2 className="text-3xl font-display font-bold text-foreground">Lo que marca la diferencia</h2>
          <p className="text-base text-muted-foreground mt-3 leading-relaxed">Pequeños detalles que separan a quien consigue entrevistas de quien envía CVs al vacío.</p>
        </div>
        {[
          { title: 'Dónde buscar', items: ['LinkedIn e InfoJobs son los grandes, pero no son los únicos. Indeed, Glassdoor, Jooble y plataformas locales tienen ofertas que no aparecen en los grandes.', 'Aplica directamente en las páginas de las empresas: el contacto es más directo y sabe que has ido a buscarles a ellos.'] },
          { title: 'Tu red en LinkedIn', items: ['Sigue a recruiters y a gente de la comunidad. Cuantos más contactos tengas, más oportunidades aparecerán.', 'Envía solicitudes de conexión con mensaje personalizado. Preséntate y di por qué te interesa conectar. Sin mensaje se va directo a la papelera.'] },
          { title: 'Lleva un registro', items: ['Anota empresa, fecha, persona de contacto, puesto. Sin control repites cv a la misma empresa o pierdes oportunidades de seguimiento.', 'No esperes respuesta. La mayoría no contestarán. No significa que tu cv esté mal. Sigue enviando.'] },
          { title: 'Tu presencia online', items: ['GitHub con al menos un proyecto terminado y bien documentado. Un README limpio dice más que diez certificados. Es lo primero que miran muchos recruiters técnicos.', 'Un perfil de LinkedIn completo con foto profesional, titular claro y descripción de lo que buscas. Sin esto, no existes para el 90% de las ofertas.'] },
          { title: 'Antes de la entrevista', items: ['Investiga la empresa: qué hacen, qué tecnologías usan, quién te entrevista. Llegar sin saber nada es la forma más rápida de descartarte.', 'Prepara preguntas para ellos. Una entrevista no es un examen, es una conversación. Preguntar demuestra interés real y te ayuda a filtrar empresas que no te convienen.'] },
        ].map((tip) => (
          <div key={tip.title} className="bg-surface/50 border border-border rounded-xl p-6">
            <h4 className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-4">{tip.title}</h4>
            <ul className="space-y-3">
              {tip.items.map((item, i) => (
                <li key={i} className="text-base text-muted-foreground leading-relaxed relative pl-5 before:content-['—'] before:absolute before:left-0 before:text-accent before:font-bold">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* ═══ PÁGINA 9: LOOP ABIERTO ═══ */}
      <section className="space-y-8">
        <div>
          <p className="text-sm font-bold tracking-widest uppercase text-accent mb-2">Pero eso no es todo</p>
          <h2 className="text-3xl font-display font-bold text-foreground">Lo que no estás viendo todavía</h2>
          <p className="text-base text-muted-foreground mt-3 leading-relaxed">Todo lo que has leído hasta aquí es el comienzo. Pero hay cosas que no están en ningún curso, en ningún bootcamp y que solo aprendes cuando alguien te las cuenta.</p>
        </div>
        <ul className="space-y-5">
          {[
            { icon: '→', title: 'Cómo elegir bien tu camino', desc: 'No vale cualquier camino, hay uno que encaja mejor con cómo piensas y qué te gusta.' },
            { icon: '→', title: 'Qué aprender exactamente según el puesto que elijas', desc: 'Nada de aprender por aprender, cada línea de estudio con un propósito.' },
            { icon: '→', title: 'Cómo conseguir prácticas de verdad', desc: 'Estrategia paso a paso sin contactos previos.' },
            { icon: '→', title: 'Cómo pasar la entrevista técnica', desc: 'Qué preguntan de verdad, cómo responder, qué valoran las empresas.' },
            { icon: '→', title: 'Qué hacer cuando consigues tu primer trabajo', desc: 'Cómo no cagarla los primeros meses y empezar a construir reputación.' },
            { icon: '→', title: 'Universidad, bootcamp o curso intensivo', desc: 'Qué vale más la pena según tu situación y tus objetivos.' },
            { icon: '→', title: '¿Cuánto tardaré en encontrar trabajo?', desc: 'Expectativas realistas según tu perfil y el mercado actual.' },
            { icon: '→', title: '¿Debería cobrar en prácticas?', desc: 'Lo que dice la ley y cómo se negocia sin quedarte corto.' },
            { icon: '→', title: 'IA en el aprendizaje y en el trabajo', desc: 'Cómo usarla para avanzar sin quedarte atrás y sin depender de ella.' },
          ].map((item) => (
            <li key={item.title} className="flex items-start gap-5 pb-5 border-b border-border">
              <span className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent font-bold flex-shrink-0 text-lg">{item.icon}</span>
              <div>
                <p className="text-base font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="bg-foreground text-background text-center rounded-xl p-8">
          <p className="text-xl text-background/85">Si esto te suena, <strong className="text-background">estás en el lugar correcto.</strong></p>
        </div>
      </section>

      {/* ═══ PÁGINA 10: CTA PREMIUM ═══ */}
      <section className="space-y-8">
        <div className="text-center">
          <p className="text-sm font-bold tracking-widest uppercase text-accent mb-3">Guía premium</p>
          <h2 className="text-3xl font-display font-bold text-foreground">¿Quieres el plan completo?</h2>
          <p className="text-base text-muted-foreground mt-3 leading-relaxed">Todo lo del free y mucho más. Seleccionado por puesto, semana a semana, sin relleno.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ['Test de perfil', 'Descubre qué puesto encaja contigo según tu forma de pensar.'],
            ['Roadmap detallado por puesto', 'Qué aprender y en qué orden, sin ruido ni cursos innecesarios.'],
            ['Plan de 90 días personalizado', 'Semana a semana, qué hacer y qué resultado esperar.'],
            ['Plantillas de CV y portfolio', 'Revisadas y adaptadas a lo que buscan de verdad en las empresas.'],
            ['Guía de negociación salarial', 'Cómo leer ofertas y qué pedir sin quedarte corto desde el primer día.'],
            ['Mapa de carrera completo', 'De junior a senior, tech lead, arquitecto o manager.'],
            ['Plantillas de email para recruiters', 'Scripts reales para escribir sin sonar genérico.'],
            ['Preguntas reales de entrevista', 'Las que se preguntan de verdad, no las teóricas.'],
            ['Análisis de ofertas reales', 'Cómo leer una oferta, qué significa y qué preguntarte antes de aplicar.'],
            ['Qué hacer cuando te rechazan', 'Cómo reaccionar sin bloquearte y seguir adelante.'],
            ['Acceso a comunidad privada', 'Grupo donde resolver dudas concretas y compartir experiencias y ofertas.'],
            ['Novedades del mercado', 'Si el mercado cambia, la guía se actualiza sin coste adicional.'],
          ].map(([title, desc]) => (
            <div key={title} className="relative bg-surface/50 border border-border rounded-lg p-4 pl-5 overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-accent before:rounded-l-lg">
              <h4 className="text-base font-bold text-foreground">{title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{desc}</p>
            </div>
          ))}
          <div className="md:col-span-2 relative bg-accent/10 border border-accent rounded-lg p-4 pl-5 overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-accent before:rounded-l-lg">
            <h4 className="text-base font-bold text-foreground">Guía específica de QA para juniors</h4>
            <p className="text-sm text-muted-foreground mt-1">El día a día real, herramientas que se usan, cómo preparar una entrevista de testing. Algo que nadie más ofrece.</p>
          </div>
        </div>
        <div className="bg-foreground text-background rounded-xl p-10 text-center">
          <p className="text-4xl font-display font-black text-background tracking-tight">Desde 2,99 €/mes</p>
          <p className="text-base text-background/60 mt-2">O pago único vitalicio desde 9 €</p>
          <a href="/guia-junior" className="inline-block mt-6 bg-accent text-white text-lg font-bold px-10 py-4 rounded-full no-underline hover:opacity-90 transition-opacity">
            Accede aquí
          </a>
        </div>
      </section>
    </div>
  );
}
