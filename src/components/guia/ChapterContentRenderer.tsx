// @ts-nocheck - Dynamic content renderer with loose JSON types from Supabase

interface Section {
  type: string;
  [key: string]: unknown;
}

interface ChapterContent {
  sections: Section[];
}

export default function ChapterContentRenderer({ content }: { content: ChapterContent }) {
  if (!content?.sections) return null;

  return (
    <div className="space-y-10">
      {content.sections.map((section, i) => (
        <SectionRenderer key={i} section={section} />
      ))}
    </div>
  );
}

function SectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case 'header': return <HeaderSection section={section} />;
    case 'quiz': return <QuizSection section={section} />;
    case 'results': return <ResultsSection section={section} />;
    case 'roadmaps': return <RoadmapsSection section={section} />;
    case 'list_block': return <ListBlockSection section={section} />;
    case 'callout': return <CalloutSection section={section} />;
    case 'callout_dark': return <CalloutDarkSection section={section} />;
    case 'salary_table': return <SalaryTableSection section={section} />;
    case 'career_levels': return <CareerLevelsSection section={section} />;
    case 'advanced_roles': return <AdvancedRolesSection section={section} />;
    case 'plan_90': return <Plan90Section section={section} />;
    case 'cv_table': return <CvTableSection section={section} />;
    case 'cv_examples': return <CvExamplesSection section={section} />;
    case 'good_bad': return <GoodBadSection section={section} />;
    case 'checklist': return <ChecklistSection section={section} />;
    case 'interview_questions': return <InterviewQuestionsSection section={section} />;
    case 'resources': return <ResourcesSection section={section} />;
    case 'youtubers': return <YoutubersSection section={section} />;
    case 'faq': return <FaqSection section={section} />;
    case 'text_block': return <TextBlockSection section={section} />;
    case 'git_flow': return <GitFlowSection section={section} />;
    case 'email_scripts': return <EmailScriptsSection section={section} />;
    default: return null;
  }
}

function s(v: unknown): string {
  return v != null ? String(v) : '';
}

function HeaderSection({ section }: { section: Section }) {
  return (
    <section className="space-y-4">
      {section.label && <p className="text-xs font-bold tracking-widest uppercase text-accent">{s(section.label)}</p>}
      {section.title && <h2 className="text-2xl font-display font-bold text-foreground">{s(section.title)}</h2>}
      {section.intro && <p className="text-sm text-muted-foreground">{s(section.intro)}</p>}
    </section>
  );
}

function QuizSection({ section }: { section: Section }) {
  const questions = section.questions as Array<{ num: string; title: string; subtitle: string; options: Array<{ letter: string; text: string; profile: string }> }>;
  if (!questions) return null;
  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <div key={q.num} className="bg-surface border border-border rounded-xl p-5">
          <p className="text-xs font-bold text-accent tracking-wider mb-2">Pregunta {q.num}</p>
          <h3 className="text-base font-semibold text-foreground mb-1">{q.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{q.subtitle}</p>
          <ul className="space-y-2">
            {q.options.map((opt) => (
              <li key={opt.letter} className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">{opt.letter}.</span> {opt.text} <em className="text-accent text-xs">{'\u2192'} {opt.profile}</em>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ResultsSection({ section }: { section: Section }) {
  const profiles = section.profiles as Array<{ profile: string; desc: string }>;
  if (!profiles) return null;
  return (
    <div className="mt-8">
      {section.title && <p className="text-xs font-bold tracking-widest uppercase text-accent mb-4">{s(section.title)}</p>}
      <div className="grid gap-3 md:grid-cols-2">
        {profiles.map((p) => (
          <div key={p.profile} className="bg-surface border border-border rounded-xl p-4 pl-5 relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-accent before:rounded-l-xl">
            <h4 className="text-sm font-bold text-foreground mb-1">{p.profile}</h4>
            <p className="text-xs text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>
      {section.note && <p className="text-xs text-muted-foreground italic mt-3">{s(section.note)}</p>}
    </div>
  );
}

function RoadmapsSection({ section }: { section: Section }) {
  const items = section.items as Array<{ role: string; months: Array<{ month: string; title: string; desc: string }>; project: string }>;
  if (!items) return null;
  return (
    <div className="space-y-4">
      {items.map((roadmap) => (
        <div key={roadmap.role} className="bg-surface border border-border rounded-xl p-5">
          <h3 className="text-base font-bold text-foreground mb-3">{roadmap.role}</h3>
          <ul className="space-y-3">
            {roadmap.months.map((m) => (
              <li key={m.month} className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">{m.month} - {m.title}:</span> {m.desc}
              </li>
            ))}
          </ul>
          <div className="bg-accent/10 border-l-4 border-accent rounded-r-lg p-3 mt-4">
            <p className="text-sm text-foreground"><strong>Proyecto:</strong> {roadmap.project}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ListBlockSection({ section }: { section: Section }) {
  const items = section.items as Array<[string, string]>;
  if (!items) return null;
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      {section.title && <h3 className="text-sm font-bold text-foreground mb-3">{s(section.title)}</h3>}
      <ul className="space-y-2">
        {items.map(([title, desc], i) => (
          <li key={i} className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">{title}:</span> {desc}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CalloutSection({ section }: { section: Section }) {
  return (
    <div className="bg-accent/10 border-l-4 border-accent rounded-r-xl p-4">
      {section.title && <p className="text-sm text-foreground mb-1"><strong>{s(section.title)}</strong></p>}
      {section.text && <p className="text-sm text-foreground">{s(section.text)}</p>}
      {section.note && <p className="text-xs text-muted-foreground mt-2">{s(section.note)}</p>}
    </div>
  );
}

function CalloutDarkSection({ section }: { section: Section }) {
  const paragraphs = section.paragraphs as string[];
  return (
    <div className="bg-foreground text-background rounded-xl p-5">
      {section.title && <h3 className="text-sm font-bold text-background mb-3">{s(section.title)}</h3>}
      {paragraphs?.map((p, i) => (
        <p key={i} className="text-sm text-background/70 leading-relaxed mb-2 last:mb-0">{p}</p>
      ))}
    </div>
  );
}

function SalaryTableSection({ section }: { section: Section }) {
  const rows = section.rows as Array<[string, string]>;
  if (!rows) return null;
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      {section.title && <h3 className="text-sm font-bold text-foreground mb-3">{s(section.title)}</h3>}
      <div className="space-y-2">
        {rows.map(([role, salary]) => (
          <div key={role} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
            <span className="text-sm font-semibold text-foreground">{role}</span>
            <span className="text-sm font-bold text-foreground">{salary}</span>
          </div>
        ))}
      </div>
      {section.note && <p className="text-xs text-muted-foreground mt-3 italic">{s(section.note)}</p>}
    </div>
  );
}

function CareerLevelsSection({ section }: { section: Section }) {
  const levels = section.levels as Array<{ level: string; expects: string; wrong: string; signal: string }>;
  if (!levels) return null;
  return (
    <div className="space-y-4">
      {levels.map((level) => (
        <div key={level.level} className="bg-surface border border-border rounded-xl p-5">
          <h3 className="text-base font-bold text-foreground mb-3">{level.level}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2"><span className="font-semibold text-foreground">Que se espera de ti:</span> {level.expects}</p>
          {level.wrong && <p className="text-sm text-muted-foreground leading-relaxed mb-2"><span className="font-semibold text-foreground">Lo que muchos hacen mal:</span> {level.wrong}</p>}
          <div className="bg-accent/10 border-l-4 border-accent rounded-r-lg p-3 mt-3">
            <p className="text-sm text-foreground"><span className="font-semibold">Senal de que estas listo:</span> {level.signal}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdvancedRolesSection({ section }: { section: Section }) {
  const roles = section.roles as Array<{ role: string; desc: string }>;
  if (!roles) return null;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {roles.map((r) => (
        <div key={r.role} className="bg-surface border border-border rounded-xl p-4">
          <h4 className="text-sm font-bold text-foreground mb-1">{r.role}</h4>
          <p className="text-xs text-muted-foreground">{r.desc}</p>
        </div>
      ))}
    </div>
  );
}

function Plan90Section({ section }: { section: Section }) {
  const weeks = section.weeks as Array<{ week: string; title: string; desc: string; deliverable: string }>;
  if (!weeks) return null;
  return (
    <div className="space-y-4">
      {weeks.map((w) => (
        <div key={w.week} className="relative border-2 border-border rounded-xl p-5 pt-6 break-inside-avoid">
          <span className="absolute -top-3 left-4 bg-accent text-white text-xs font-bold tracking-wider uppercase px-3 py-0.5 rounded-full">{w.week}</span>
          <h3 className="text-lg font-bold text-foreground mb-1 mt-1">{w.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
          <span className="inline-block mt-2 bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded">Entregable: {w.deliverable}</span>
        </div>
      ))}
    </div>
  );
}

function CvTableSection({ section }: { section: Section }) {
  const rows = section.rows as Array<[string, string, string]>;
  if (!rows) return null;
  return (
    <div className="bg-surface border border-border rounded-xl p-5 overflow-x-auto">
      {section.title && <h3 className="text-sm font-bold text-foreground mb-3">{s(section.title)}</h3>}
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-foreground text-background">
            <th className="text-left px-3 py-2 text-xs font-bold uppercase tracking-wider">Seccion</th>
            <th className="text-left px-3 py-2 text-xs font-bold uppercase tracking-wider">Que poner</th>
            <th className="text-left px-3 py-2 text-xs font-bold uppercase tracking-wider">Que NO poner</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([sec, yes, no], i) => (
            <tr key={sec} className={i % 2 === 1 ? 'bg-surface' : ''}>
              <td className="px-3 py-2 border-b border-border font-semibold text-foreground">{sec}</td>
              <td className="px-3 py-2 border-b border-border text-muted-foreground">{yes}</td>
              <td className="px-3 py-2 border-b border-border text-muted-foreground">{no}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CvExamplesSection({ section }: { section: Section }) {
  const examples = section.examples as Array<{ role: string; title: string; summary: string; project: string }>;
  if (!examples) return null;
  return (
    <div className="space-y-4">
      {examples.map((ex) => (
        <div key={ex.role} className="bg-surface border border-border rounded-xl p-5">
          <h3 className="text-sm font-bold text-foreground mb-3">CV {ex.role} - Titular y textos especificos</h3>
          <p className="text-sm text-foreground mb-2"><strong>Titular:</strong> {ex.title}</p>
          <p className="text-sm text-muted-foreground mb-2"><strong>Resumen:</strong> {ex.summary}</p>
          <p className="text-sm text-muted-foreground"><strong>Proyecto:</strong> {ex.project}</p>
        </div>
      ))}
    </div>
  );
}

function GoodBadSection({ section }: { section: Section }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <p className="text-xs font-bold text-red-600 dark:text-red-400 tracking-wider uppercase mb-2">Error clasico</p>
        <p className="text-sm text-red-700 dark:text-red-300">{s(section.bad)}</p>
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
        <p className="text-xs font-bold text-green-600 dark:text-green-400 tracking-wider uppercase mb-2">Lo que funciona</p>
        <p className="text-sm text-green-700 dark:text-green-300">{s(section.good)}</p>
      </div>
    </div>
  );
}

function ChecklistSection({ section }: { section: Section }) {
  const items = section.items as string[];
  if (!items) return null;
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      {section.title && <h3 className="text-sm font-bold text-foreground mb-3">{s(section.title)}</h3>}
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground leading-relaxed relative pl-4 before:content-['✓'] before:absolute before:left-0 before:text-accent before:font-bold">{item}</li>
        ))}
      </ul>
    </div>
  );
}

function InterviewQuestionsSection({ section }: { section: Section }) {
  const sections = section.sections as Array<{ role: string; questions: string[] }>;
  if (!sections) return null;
  return (
    <div className="space-y-4">
      {sections.map((s) => (
        <div key={s.role} className="bg-surface border border-border rounded-xl p-5">
          <h3 className="text-sm font-bold text-foreground mb-3">Preguntas tecnicas - {s.role}</h3>
          <ul className="space-y-2">
            {s.questions.map((q, i) => (
              <li key={i} className="text-sm text-muted-foreground leading-relaxed relative pl-4 before:content-['—'] before:absolute before:left-0 before:text-accent before:font-bold">{q}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ResourcesSection({ section }: { section: Section }) {
  const categories = section.categories as Array<{ category: string; resources: Array<[string, string]> }>;
  if (!categories) return null;
  return (
    <div className="space-y-4">
      {categories.map((cat) => (
        <div key={cat.category} className="bg-surface border border-border rounded-xl p-5">
          <h3 className="text-base font-bold text-foreground mb-3">{cat.category}</h3>
          <ul className="space-y-2">
            {cat.resources.map(([name, desc]) => (
              <li key={name} className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">{name}:</span> {desc}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function YoutubersSection({ section }: { section: Section }) {
  const channels = section.channels as Array<{ name: string; desc: string }>;
  if (!channels) return null;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {channels.map((ch) => (
        <div key={ch.name} className="bg-surface border border-border rounded-xl p-4">
          <h4 className="text-sm font-bold text-foreground mb-1">{ch.name}</h4>
          <p className="text-xs text-muted-foreground">{ch.desc}</p>
        </div>
      ))}
    </div>
  );
}

function FaqSection({ section }: { section: Section }) {
  const items = section.items as Array<{ q: string; a: string }>;
  if (!items) return null;
  return (
    <div className="space-y-4">
      {items.map((faq) => (
        <div key={faq.q} className="bg-surface border border-border rounded-xl p-5">
          <h3 className="text-base font-bold text-foreground mb-2">{faq.q}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
        </div>
      ))}
    </div>
  );
}

function TextBlockSection({ section }: { section: Section }) {
  const paragraphs = section.paragraphs as string[];
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      {section.title && <h3 className="text-sm font-bold text-foreground mb-3">{s(section.title)}</h3>}
      {paragraphs?.map((p, i) => (
        <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-2 last:mb-0">{p}</p>
      ))}
    </div>
  );
}

function GitFlowSection({ section }: { section: Section }) {
  const steps = section.steps as string[];
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      {section.title && <h3 className="text-sm font-bold text-foreground mb-3">{s(section.title)}</h3>}
      {section.flow && <p className="text-sm text-muted-foreground mb-3">{s(section.flow)}</p>}
      <ol className="space-y-2">
        {steps?.map((step, i) => (
          <li key={i} className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">{i + 1}.</span> {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

function EmailScriptsSection({ section }: { section: Section }) {
  const scripts = section.scripts as Array<{ label: string; text: string }>;
  if (!scripts) return null;
  return (
    <div className="space-y-4">
      {scripts.map((script) => (
        <div key={script.label} className="bg-gray-50 dark:bg-gray-800/50 border border-border rounded-r-xl p-4 border-l-4 border-l-accent">
          <p className="text-xs font-bold text-accent tracking-wider mb-2">{script.label}</p>
          <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{script.text}</p>
        </div>
      ))}
    </div>
  );
}
