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

const content = `<p>La mayoría de los tutoriales de multi-tenancy en Next.js se quedan en la capa de routing: te muestran cómo configurar subdominios o rutas dinámicas y pasan a otro tema. En producción, el routing es la parte fácil. Lo que realmente importa es la lógica de negocio: dos capas de roles que no se mezclan, invitaciones con expiración y límites por plan, y audit logs que sobreviven al borrado de usuarios sin violar el GDPR.</p>

<p>Este artículo cubre todo eso con código real del boilerplate de Arkeonix Labs — Next.js 15 App Router, Auth.js v5, Prisma 5, Vercel.</p>

<h2>Por qué rutas en lugar de subdominios</h2>

<p>Antes de escribir una línea de código, la decisión más importante es cómo el tenant se refleja en la URL: <code>empresa.app.com</code> (subdominios) o <code>app.com/empresa</code> (rutas). Esta decisión afecta a la infraestructura, la autenticación y el desarrollo local.</p>

<h3>Linear, Dub.co y Plane eligieron rutas</h3>

<p>Linear usa <code>linear.app/{workspace-slug}/team/{key}</code>. Dub.co usa <code>app.dub.co/(dashboard)/[slug]</code> — construido por un ex-ingeniero de Vercel con Next.js. Plane usa <code>app.plane.so/{workspace-slug}/projects/</code>. GitHub usa <code>github.com/{org}/{repo}</code>. Notion usa rutas para su app interna; los subdominios solo aparecen en Notion Sites publicados externamente.</p>

<p>El patrón es consistente: <strong>rutas para SaaS B2B</strong> donde usuarios autenticados navegan entre organizaciones dentro de una sola app.</p>

<h3>La complejidad oculta de wildcard domains en Vercel</h3>

<p>Los subdominios en Vercel requieren transferir el control DNS a sus nameservers para que puedan generar certificados TLS wildcard. La propagación DNS toma 24-48 horas. Las preview URLs multi-tenant son exclusivas del plan Enterprise. Los certificados SSL custom también son Enterprise-only.</p>

<p>La autenticación también se complica. Las cookies son host-only por defecto — una cookie en <code>app.example.com</code> no se envía a <code>tenant1.example.com</code>. Para compartir sesiones hay que establecer el dominio de la cookie a <code>.example.com</code>, exponiéndola a todos los subdominios. Auth.js v5 tiene documentados problemas de <code>state_mismatch</code> en flujos OAuth cross-subdomain. Safari ITP añade otra capa de complejidad. Con rutas, <strong>una cookie en un dominio</strong> maneja todo, sin configuración especial.</p>

<h3>Cuándo sí usar subdominios</h3>

<p>Los subdominios son la opción correcta cuando el tenant <em>es</em> el producto público: Shopify (<code>mystore.myshopify.com</code>), Hashnode (<code>username.hashnode.dev</code>), Cal.com para booking pages externos. Si los clientes del tenant van a visitar una URL de marca, usa subdominios. Si usuarios autenticados navegan dentro de tu app, usa rutas.</p>

<h2>El middleware no resuelve el tenant — y por qué eso es correcto</h2>

<p>El archivo <code>middleware.ts</code> de Next.js corre en Edge Runtime — V8 isolates, no Node.js completo. Esta arquitectura tiene implicaciones directas para multi-tenancy.</p>

<h3>Las tres limitaciones del Edge Runtime con Prisma</h3>

<p><strong>Sin APIs de red TCP.</strong> Los V8 isolates no pueden abrir conexiones TCP, que es el protocolo que PostgreSQL usa. Prisma usa un query engine en Rust que requiere conexiones TCP al servidor de base de datos. Error exacto: <code>PrismaClient is unable to run in Vercel Edge Functions or Edge Middleware</code>.</p>

<p><strong>Límite de bundle ~1MB.</strong> El binario del query engine de Prisma excede este límite por sí solo.</p>

<p><strong>Sin módulos nativos.</strong> Los binarios compilados en Rust no pueden ejecutarse en el sandbox de V8.</p>

<p>La solución no es forzar Prisma en el middleware. La solución es que el middleware haga solo lo que puede hacer eficientemente: rate limiting con Redis, verificación JWT y protección de rutas. El tenant se resuelve en <code>layout.tsx</code>.</p>

<pre><code class="language-typescript">// middleware.ts — responsabilidades correctas
// ✅ Rate limiting por IP con Upstash Redis
// ✅ Verificación de sesión JWT (Auth.js v5)
// ✅ Protección de rutas: /dashboard/*, /org, /settings, /billing
// ✅ RBAC de plataforma para /admin/* (requiere ADMIN o SUPER_ADMIN)
// ❌ NO resuelve el tenant actual — eso es responsabilidad de layout.tsx

export default auth(async function middleware(request: NextRequest) {
  // Solo maneja auth y rate limiting
  // No tiene acceso a Prisma ni a qué org está activa
})</code></pre>

<h3>El patrón: layout.tsx como boundary de tenant</h3>

<p>En Next.js 15, <code>params</code> es una <code>Promise</code> que debe ser awaited. El layout del segmento dinámico es el lugar correcto para resolver el tenant y verificar que el usuario tiene acceso:</p>

<pre><code class="language-typescript">// app/org/[slug]/layout.tsx
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise&lt;{ slug: string }&gt;
}) {
  const { slug } = await params
  const session = await auth()

  const org = await prisma.organization.findUnique({
    where: { slug },
    include: {
      members: {
        where: { userId: session?.user?.id },
        select: { role: true },
      },
    },
  })

  // Si la org no existe o el usuario no es miembro → 404
  if (!org || org.members.length === 0) notFound()

  return &lt;&gt;{children}&lt;/&gt;
}</code></pre>

<p>No existe un equivalente de React Context para Server Components — la documentación oficial de Next.js lo confirma. Las páginas hijas re-leen <code>params</code> de sus props o reciben datos del layout vía props.</p>

<h2>Dos capas de roles que ningún tutorial explica</h2>

<p>La confusión más común en sistemas multi-tenant es mezclar los roles de plataforma con los roles de organización. Son dos conceptos distintos que viven en dos lugares distintos del schema.</p>

<h3>Roles de plataforma vs roles de organización</h3>

<p><strong>Roles de plataforma</strong> (campo <code>role</code> en el modelo <code>User</code>): controlan el acceso a la administración global. Un <code>SUPER_ADMIN</code> puede acceder a <code>/admin</code> e impersonar cualquier organización. Un <code>USER</code> normal no puede. El middleware verifica este rol directamente desde el JWT, sin query a la base de datos.</p>

<p><strong>Roles de organización</strong> (campo <code>role</code> en <code>OrganizationMember</code>): controlan los permisos dentro de un tenant específico. Un <code>OWNER</code> puede cambiar roles y eliminar miembros. Un <code>MEMBER</code> solo puede ver el contenido de su organización. Los Server Actions verifican este rol con una query explícita.</p>

<pre><code class="language-typescript">// Helper para verificar permisos dentro de una org
async function requireOrgAdmin(userId: string, organizationId: string) {
  const membership = await db.organizationMember.findFirst({
    where: { userId, organizationId, role: { in: ['OWNER', 'ADMIN'] } },
  })
  if (!membership) throw new Error('You do not have permission to manage this organization.')
  return membership
}</code></pre>

<h3>El schema Prisma que soporta ambas capas</h3>

<pre><code class="language-prisma">model User {
  id    String @id @default(cuid())
  email String @unique
  role  Role   @default(USER)          // ← Rol de PLATAFORMA

  memberships OrganizationMember[]
  @@map("users")
}

model Organization {
  id   String @id @default(cuid())
  name String
  slug String @unique                  // ← /org/[slug]
  plan Plan   @default(FREE)

  members     OrganizationMember[]
  invitations OrgInvitation[]
  @@map("organizations")
}

model OrganizationMember {
  id             String  @id @default(cuid())
  userId         String  @map("user_id")
  organizationId String  @map("organization_id")
  role           OrgRole @default(MEMBER)  // ← Rol de ORGANIZACIÓN

  @@unique([userId, organizationId])
  @@index([organizationId])   // Índice manual — PostgreSQL no los auto-genera
  @@index([userId])
  @@map("organization_members")
}

enum Role    { USER  ADMIN  SUPER_ADMIN }  // Plataforma
enum OrgRole { OWNER ADMIN  MEMBER      }  // Organización</code></pre>

<p>Dos enums distintos, dos modelos distintos. Mezclarlos es el error que más tarde cuesta deshacer en un sistema en producción.</p>

<h2>Invitaciones con token, expiración y límites por plan</h2>

<h3>El flujo completo</h3>

<p>El flujo de invitación tiene dos ramas según si el invitado ya tiene cuenta:</p>

<p><strong>Si el usuario existe</strong> → se añade directamente como <code>MEMBER</code> y se registra en el audit log. No hay email pendiente porque ya tiene acceso inmediato.</p>

<p><strong>Si el usuario no existe</strong> → se crea un <code>OrgInvitation</code> con un token <code>cuid()</code> único, expiración de 7 días, y se envía un email con la URL <code>/invite/accept?token={token}</code>. Cuando el invitado se registra y accede a esa URL, el token se valida y la membresía se crea en una <code>$transaction</code> atómica:</p>

<pre><code class="language-typescript">// Crear invitación con upsert (maneja re-invitaciones)
const invitation = await db.orgInvitation.upsert({
  where: { organizationId_email: { organizationId, email } },
  create: {
    organizationId,
    email,
    role: 'MEMBER',
    invitedById: session.user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  update: { status: 'PENDING', expiresAt, acceptedAt: null },
  select: { token: true },
})

// Aceptar invitación en transacción atómica
await db.$transaction([
  db.organizationMember.create({
    data: {
      userId: session.user.id,
      organizationId: invitation.organizationId,
      role: invitation.role,
    },
  }),
  db.orgInvitation.update({
    where: { id: invitation.id },
    data: { status: 'ACCEPTED', acceptedAt: new Date() },
  }),
])</code></pre>

<p>El <code>upsert</code> maneja el caso de re-invitación: si ya existía una invitación expirada o revocada, la reactiva en lugar de crear un duplicado o lanzar un error de constraint.</p>

<h3>Plan-gated membership</h3>

<p>La verificación de límites ocurre en dos momentos: al invitar y al aceptar. Entre ambos momentos el plan puede haber cambiado o el límite puede haberse alcanzado con otra invitación paralela:</p>

<pre><code class="language-typescript">const org = await db.organization.findUniqueOrThrow({
  where: { id: organizationId },
  select: { plan: true, name: true, _count: { select: { members: true } } },
})

const limit = PLAN_LIMITS[org.plan].maxMembers
if (org._count.members &gt;= limit) {
  return {
    success: false,
    error: {
      code: 'PLAN_LIMIT_REACHED',
      message: `Your ${org.plan} plan is limited to ${limit} members. Upgrade to add more.`,
    },
  }
}</code></pre>

<h3>El race condition y cómo mitigarlo</h3>

<p>Con el isolation level por defecto de PostgreSQL (<code>READ COMMITTED</code>), dos admins que inviten simultáneamente al último asiento disponible pueden ambos pasar la verificación del límite y crear la membresía. La solución técnicamente correcta es <code>SELECT ... FOR UPDATE</code>, que bloquea la fila del org y serializa los intentos concurrentes:</p>

<pre><code class="language-typescript">await prisma.$transaction(async (tx) => {
  // Bloquea la fila del org — serializa intentos concurrentes
  await tx.$queryRaw`SELECT id FROM "Organization" WHERE id = ${orgId} FOR UPDATE`

  const count = await tx.organizationMember.count({
    where: { organizationId: orgId },
  })

  if (count &gt;= planLimit) {
    throw new Error('Member limit reached for current plan')
  }

  await tx.organizationMember.create({
    data: { organizationId: orgId, userId, role: 'MEMBER' },
  })
})</code></pre>

<p>En la práctica, la mayoría de los SaaS aceptan este race condition y lo corrigen vía sync de billing. La probabilidad de que dos admins inviten al último asiento de forma simultánea es extremadamente baja. Si tu app tiene ese patrón de uso, implementa el <code>FOR UPDATE</code>. Si no, el doble check (al invitar y al aceptar) es suficiente.</p>

<h2>Audit logs inmutables — SET NULL, no CASCADE</h2>

<p>Los audit logs son el componente que más se diseña mal en sistemas multi-tenant. El error más común es definir los campos <code>userId</code> y <code>organizationId</code> con <code>onDelete: Cascade</code>, lo que significa que borrar un usuario borra silenciosamente todos sus registros de auditoría.</p>

<h3>Por qué CASCADE destruye el trail de auditoría</h3>

<p>Los audit logs deben ser inmutables por diseño: append-only, sin <code>UPDATE</code> ni <code>DELETE</code> permitidos. <code>CASCADE</code> viola este principio directamente — delega la eliminación al motor de base de datos y destruye evidencia de forma silenciosa. <code>RESTRICT</code> tampoco funciona: impediría eliminar usuarios, lo cual es inviable. <code>SET NULL</code> es la única opción que preserva el registro mientras rompe el enlace con la entidad eliminada:</p>

<pre><code class="language-prisma">model AuditLog {
  id             String   @id @default(cuid())
  organizationId String?  @map("organization_id")
  userId         String?  @map("user_id")
  action         String   // "org.member.invited", "subscription.created"
  resource       String   // "OrganizationMember", "Subscription"
  metadata       Json     @default("{}")
  createdAt      DateTime @default(now()) @db.Timestamptz

  // SET NULL — el log persiste aunque se borre el usuario o la org
  organization Organization? @relation(fields: [organizationId], references: [id], onDelete: SetNull)
  user         User?         @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([organizationId])
  @@index([userId])
  @@index([createdAt])
  @@index([action])
  @@map("audit_logs")
}</code></pre>

<h3>La tensión GDPR vs SOC 2 — cómo SET NULL la resuelve</h3>

<p>El Artículo 17 del GDPR (derecho de supresión) entra en conflicto directo con SOC 2 Type II, que exige retención mínima de 365 días de logs en almacenamiento tamper-proof. Cuando un usuario ejerce su derecho al olvido, ¿qué pasa con sus audit logs?</p>

<p>El GDPR permite excepciones: la retención para fines legítimos de auditoría es una base legal válida que puede prevalecer sobre el derecho de supresión. <code>SET NULL</code> actúa como <strong>pseudonymización</strong>: el evento de auditoría se preserva (acción, timestamp, recurso) pero el enlace al dato personal (<code>userId</code>) se anula.</p>

<p>Para ir más lejos, guarda un snapshot del actor como texto en el campo <code>metadata</code> al escribir el log. Cuando proceses una solicitud de eliminación GDPR, haz <code>SET NULL</code> en el FK y borra el PII del campo JSON. El audit log retiene la estructura del evento sin datos personales. Este es el patrón que usa Documenso en su <code>DocumentAuditLog</code>.</p>

<h2>Tests E2E del flujo multi-tenant con Playwright</h2>

<p>Cal.com es el único proyecto open-source multi-tenant con tests E2E comprensivos para flujos de organizaciones. El patrón que usa es más robusto que el típico <code>storageState</code>: crea fixtures con Prisma directamente, evitando dependencias de UI para la preparación del estado.</p>

<h3>Fixtures con Prisma: aislamiento total</h3>

<pre><code class="language-typescript">// playwright/fixtures.ts
import { test as base } from '@playwright/test'
import { prisma } from '@/lib/prisma'

type OrgFixture = {
  org: { id: string; slug: string }
  owner: { id: string; email: string }
}

export const test = base.extend&lt;{ orgContext: OrgFixture }&gt;({
  orgContext: async ({ page }, use) => {
    const owner = await prisma.user.create({
      data: {
        email: `owner-${Date.now()}@test.com`,
        name: 'Test Owner',
        role: 'USER',
      },
    })
    const org = await prisma.organization.create({
      data: {
        name: 'Test Org',
        slug: `test-org-${Date.now()}`,
        members: {
          create: { userId: owner.id, role: 'OWNER' },
        },
      },
    })

    await use({ owner, org })

    // Limpieza — CASCADE en OrganizationMember gestiona miembros e invitaciones
    await prisma.organization.delete({ where: { id: org.id } })
    await prisma.user.delete({ where: { id: owner.id } })
  },
})

export { expect } from '@playwright/test'</code></pre>

<h3>Testear invitaciones sin SMTP</h3>

<p>No hace falta un servidor de email para testear el flujo de invitaciones. El token está en la base de datos — se puede leer directamente y navegar a la URL de aceptación sin pasar por el correo:</p>

<pre><code class="language-typescript">test('flujo completo de invitación', async ({ page, orgContext }) => {
  // Invitar via UI
  await page.goto(`/org/${orgContext.org.slug}`)
  await page.fill('[name=email]', 'newuser@test.com')
  await page.click('button[type=submit]')
  await expect(page.getByText('Invitation sent')).toBeVisible()

  // Leer el token directamente de la DB — sin SMTP
  const invitation = await prisma.orgInvitation.findFirst({
    where: {
      email: 'newuser@test.com',
      organizationId: orgContext.org.id,
    },
  })
  expect(invitation?.status).toBe('PENDING')

  // Navegar directamente a la URL de aceptación
  await page.goto(`/invite/accept?token=${invitation!.token}`)
  await expect(page.getByText('Invitation accepted')).toBeVisible()

  // Verificar membresía creada
  const member = await prisma.organizationMember.findFirst({
    where: { organizationId: orgContext.org.id },
    include: { user: { select: { email: true } } },
  })
  expect(member?.user.email).toBe('newuser@test.com')
})</code></pre>

<p>Este patrón es más rápido y determinístico que Mailhog o Inbucket: no hay espera de SMTP, no hay parsing de emails, y el test no falla por timeouts de correo.</p>

<p>Para tests que requieren múltiples usuarios autenticados simultáneamente, usa browser contexts separados:</p>

<pre><code class="language-typescript">test('admin invita, member acepta', async ({ browser }) => {
  const adminContext = await browser.newContext({
    storageState: 'playwright/.auth/admin.json',
  })
  const memberContext = await browser.newContext({
    storageState: 'playwright/.auth/member.json',
  })

  const adminPage = await adminContext.newPage()
  const memberPage = await memberContext.newPage()
  // Ambos usuarios interactúan de forma independiente
})</code></pre>

<h2>El checklist del SaaS multi-tenant</h2>

<ul>
  <li><strong>Routing:</strong> Usa <code>/org/[slug]</code>. Resuelve el tenant en <code>layout.tsx</code>, no en el middleware.</li>
  <li><strong>Middleware:</strong> Solo rate limiting, verificación JWT y RBAC de plataforma. Sin Prisma.</li>
  <li><strong>Schema:</strong> Dos enums separados: <code>Role</code> (plataforma) y <code>OrgRole</code> (organización). Índices manuales en todas las FKs.</li>
  <li><strong>Invitaciones:</strong> Token + expiración + <code>upsert</code> para re-invitaciones. Verifica límite de plan al invitar Y al aceptar.</li>
  <li><strong>Race condition:</strong> Doble check es suficiente para la mayoría de los casos. Implementa <code>FOR UPDATE</code> si tienes invitaciones concurrentes a alta frecuencia.</li>
  <li><strong>Audit logs:</strong> <code>onDelete: SetNull</code>, no <code>Cascade</code>. Guarda snapshot del actor en <code>metadata</code>. Append-only.</li>
  <li><strong>Tests:</strong> Crea fixtures con Prisma. Lee tokens de invitación directamente de la DB. Browser contexts separados para múltiples usuarios.</li>
</ul>

<p>Si no quieres implementar todo esto desde cero, el <a href="/arkeonix">boilerplate de Arkeonix Labs</a> tiene el sistema multi-tenant completo ya implementado y testeado en producción: schema Prisma con todos los índices, Server Actions con Zod, flujo de invitaciones con Resend, RBAC dual, audit logs inmutables y suite E2E con Playwright.</p>`;

// ─── Post metadata ───────────────────────────────────────────────────

const post = {
  title: "Multi-tenancy en Next.js 15: organizaciones, roles y límites por plan",
  slug: "multi-tenancy-nextjs-15-organizaciones-roles-prisma",
  excerpt:
    "Cómo implementar multi-tenancy en Next.js 15 App Router con Auth.js v5, Prisma y Vercel. Dos capas de RBAC, invitaciones con token, plan-gated membership, audit logs inmutables y tests E2E con Playwright. Con código real de producción.",
  content,
  author: "David López",
  published_at: new Date().toISOString(),
  language: "ES",
  category: "Dev",
  product_category: "boilerplate",
  status: "published",
  cover_image: "",
};

// ─── Insert ─────────────────────────────────────────────────────────

async function run() {
  console.log(`\n📝 Insertando post: "${post.title}"`);
  console.log(`   Slug: ${post.slug}`);

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
