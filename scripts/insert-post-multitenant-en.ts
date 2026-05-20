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

const content = `<p>Most multi-tenancy tutorials for Next.js stop at the routing layer: they show you how to configure subdomains or dynamic routes and move on. In production, routing is the easy part. What actually matters is the business logic: two role layers that don't bleed into each other, invitations with expiration and plan limits, and audit logs that survive user deletion without violating GDPR.</p>

<p>This article covers all of it with real production code from the Arkeonix Labs boilerplate — Next.js 15 App Router, Auth.js v5, Prisma 5, Vercel.</p>

<h2>Why routes instead of subdomains</h2>

<p>Before writing a single line of code, the most important decision is how the tenant appears in the URL: <code>company.app.com</code> (subdomains) or <code>app.com/company</code> (routes). This decision affects infrastructure, authentication, and local development.</p>

<h3>Linear, Dub.co, and Plane chose routes</h3>

<p>Linear uses <code>linear.app/{workspace-slug}/team/{key}</code>. Dub.co uses <code>app.dub.co/(dashboard)/[slug]</code> — built by a former Vercel engineer with Next.js. Plane uses <code>app.plane.so/{workspace-slug}/projects/</code>. GitHub uses <code>github.com/{org}/{repo}</code>. Notion uses routes for its internal app; subdomains only appear on externally published Notion Sites.</p>

<p>The pattern is consistent: <strong>routes for B2B SaaS</strong> where authenticated users navigate between organizations inside a single app.</p>

<h3>The hidden complexity of wildcard domains on Vercel</h3>

<p>Subdomains on Vercel require transferring DNS control to their nameservers so they can generate wildcard TLS certificates. DNS propagation takes 24-48 hours. Multi-tenant preview URLs are exclusive to the Enterprise plan. Custom SSL certificates are also Enterprise-only.</p>

<p>Authentication gets complicated too. Cookies are host-only by default — a cookie on <code>app.example.com</code> is not sent to <code>tenant1.example.com</code>. To share sessions you need to set the cookie domain to <code>.example.com</code>, exposing the session to all subdomains. Auth.js v5 has documented <code>state_mismatch</code> issues in cross-subdomain OAuth flows. Safari ITP adds another layer of complexity. With routes, <strong>one cookie on one domain</strong> handles everything, with no special configuration.</p>

<h3>When subdomains are the right choice</h3>

<p>Subdomains are correct when the tenant <em>is</em> the public product: Shopify (<code>mystore.myshopify.com</code>), Hashnode (<code>username.hashnode.dev</code>), Cal.com for external booking pages. If your tenant's customers will visit a branded URL, use subdomains. If authenticated users navigate within your app, use routes.</p>

<h2>The middleware doesn't resolve the tenant — and that's correct</h2>

<p>Next.js <code>middleware.ts</code> runs in the Edge Runtime — V8 isolates, not full Node.js. This architecture has direct implications for multi-tenancy.</p>

<h3>The three Edge Runtime limitations with Prisma</h3>

<p><strong>No TCP network APIs.</strong> V8 isolates cannot open TCP connections, which is the protocol PostgreSQL uses. Prisma uses a Rust query engine that requires TCP connections to the database server. Exact error: <code>PrismaClient is unable to run in Vercel Edge Functions or Edge Middleware</code>.</p>

<p><strong>~1MB bundle limit.</strong> Prisma's query engine binary exceeds this limit on its own.</p>

<p><strong>No native modules.</strong> Rust-compiled binaries cannot run inside the V8 sandbox.</p>

<p>The solution isn't to force Prisma into middleware. The solution is to let middleware do only what it can do efficiently: rate limiting with Redis, JWT verification, and route protection. The tenant gets resolved in <code>layout.tsx</code>.</p>

<pre><code class="language-typescript">// middleware.ts — correct responsibilities
// ✅ Rate limiting by IP with Upstash Redis
// ✅ JWT session verification (Auth.js v5)
// ✅ Route protection: /dashboard/*, /org, /settings, /billing
// ✅ Platform RBAC for /admin/* (requires ADMIN or SUPER_ADMIN)
// ❌ Does NOT resolve the current tenant — that's layout.tsx's job

export default auth(async function middleware(request: NextRequest) {
  // Handles auth and rate limiting only
  // Has no access to Prisma or which org is currently active
})</code></pre>

<h3>The pattern: layout.tsx as tenant boundary</h3>

<p>In Next.js 15, <code>params</code> is a <code>Promise</code> that must be awaited. The dynamic segment layout is the right place to resolve the tenant and verify the user has access:</p>

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

  // If the org doesn't exist or the user isn't a member → 404
  if (!org || org.members.length === 0) notFound()

  return &lt;&gt;{children}&lt;/&gt;
}</code></pre>

<p>There is no React Context equivalent for Server Components — the official Next.js documentation confirms this. Child pages re-read <code>params</code> from their own props or receive data from the layout via props.</p>

<h2>Two role layers that no tutorial explains</h2>

<p>The most common confusion in multi-tenant systems is mixing platform roles with organization roles. They are two distinct concepts that live in two distinct places in the schema.</p>

<h3>Platform roles vs organization roles</h3>

<p><strong>Platform roles</strong> (<code>role</code> field on the <code>User</code> model): control access to global platform administration. A <code>SUPER_ADMIN</code> can access <code>/admin</code> and impersonate any organization. A regular <code>USER</code> cannot. The middleware checks this role directly from the JWT, without a database query.</p>

<p><strong>Organization roles</strong> (<code>role</code> field on <code>OrganizationMember</code>): control permissions within a specific tenant. An <code>OWNER</code> can change roles and remove members. A <code>MEMBER</code> can only view their organization's content. Server Actions verify this role with an explicit query.</p>

<pre><code class="language-typescript">// Helper to verify permissions within an org
async function requireOrgAdmin(userId: string, organizationId: string) {
  const membership = await db.organizationMember.findFirst({
    where: { userId, organizationId, role: { in: ['OWNER', 'ADMIN'] } },
  })
  if (!membership) throw new Error('You do not have permission to manage this organization.')
  return membership
}</code></pre>

<h3>The Prisma schema that supports both layers</h3>

<pre><code class="language-prisma">model User {
  id    String @id @default(cuid())
  email String @unique
  role  Role   @default(USER)           // ← PLATFORM role

  memberships OrganizationMember[]
  @@map("users")
}

model Organization {
  id   String @id @default(cuid())
  name String
  slug String @unique                   // ← /org/[slug]
  plan Plan   @default(FREE)

  members     OrganizationMember[]
  invitations OrgInvitation[]
  @@map("organizations")
}

model OrganizationMember {
  id             String  @id @default(cuid())
  userId         String  @map("user_id")
  organizationId String  @map("organization_id")
  role           OrgRole @default(MEMBER)  // ← ORGANIZATION role

  @@unique([userId, organizationId])
  @@index([organizationId])   // Manual index — PostgreSQL doesn't auto-create these
  @@index([userId])
  @@map("organization_members")
}

enum Role    { USER  ADMIN  SUPER_ADMIN }  // Platform
enum OrgRole { OWNER ADMIN  MEMBER      }  // Organization</code></pre>

<p>Two separate enums, two separate models. Mixing them is the mistake that costs the most to undo in a production system.</p>

<h2>Invitations with token, expiration, and plan limits</h2>

<h3>The complete flow</h3>

<p>The invitation flow has two branches depending on whether the invitee already has an account:</p>

<p><strong>If the user exists</strong> → they are added directly as a <code>MEMBER</code> and the audit log is updated. No pending email, because they already have immediate access.</p>

<p><strong>If the user doesn't exist</strong> → an <code>OrgInvitation</code> is created with a unique <code>cuid()</code> token, 7-day expiration, and an email is sent with the URL <code>/invite/accept?token={token}</code>. When the invitee registers and visits that URL, the token is validated and the membership is created in an atomic <code>$transaction</code>:</p>

<pre><code class="language-typescript">// Create invitation with upsert (handles re-invitations)
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

// Accept invitation in an atomic transaction
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

<p>The <code>upsert</code> handles re-invitation: if an expired or revoked invitation already existed, it reactivates it instead of creating a duplicate or throwing a constraint error.</p>

<h3>Plan-gated membership</h3>

<p>Limit verification happens at two points: when inviting and when accepting. Between those two moments the plan may have changed or the limit may have been reached by another invitation:</p>

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
      message: \`Your \${org.plan} plan is limited to \${limit} members. Upgrade to add more.\`,
    },
  }
}</code></pre>

<h3>The race condition and how to mitigate it</h3>

<p>With PostgreSQL's default isolation level (<code>READ COMMITTED</code>), two admins simultaneously inviting the last available seat can both pass the limit check and both create the membership. The technically correct solution is <code>SELECT ... FOR UPDATE</code>, which locks the org row and serializes concurrent attempts:</p>

<pre><code class="language-typescript">await prisma.$transaction(async (tx) => {
  // Lock the org row — serializes concurrent attempts
  await tx.$queryRaw\`SELECT id FROM "Organization" WHERE id = \${orgId} FOR UPDATE\`

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

<p>In practice, most SaaS products accept this race condition and correct it via billing sync. The probability of two admins simultaneously inviting the last seat is extremely low. If your app has that usage pattern, implement <code>FOR UPDATE</code>. Otherwise, the double check (at invite and at accept) is sufficient.</p>

<h2>Immutable audit logs — SET NULL, not CASCADE</h2>

<p>Audit logs are the component most often designed wrong in multi-tenant systems. The most common mistake is defining <code>userId</code> and <code>organizationId</code> fields with <code>onDelete: Cascade</code>, which silently deletes all audit records when a user is deleted.</p>

<h3>Why CASCADE destroys your audit trail</h3>

<p>Audit logs must be immutable by design: append-only, with no <code>UPDATE</code> or <code>DELETE</code> allowed. <code>CASCADE</code> directly violates this principle — it delegates deletion to the database engine and silently destroys evidence. <code>RESTRICT</code> doesn't work either: it would prevent deleting users, which is impractical. <code>SET NULL</code> is the only option that preserves the record while severing the link to the deleted entity:</p>

<pre><code class="language-prisma">model AuditLog {
  id             String   @id @default(cuid())
  organizationId String?  @map("organization_id")
  userId         String?  @map("user_id")
  action         String   // "org.member.invited", "subscription.created"
  resource       String   // "OrganizationMember", "Subscription"
  metadata       Json     @default("{}")
  createdAt      DateTime @default(now()) @db.Timestamptz

  // SET NULL — log persists even when user or org is deleted
  organization Organization? @relation(fields: [organizationId], references: [id], onDelete: SetNull)
  user         User?         @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([organizationId])
  @@index([userId])
  @@index([createdAt])
  @@index([action])
  @@map("audit_logs")
}</code></pre>

<h3>The GDPR vs SOC 2 tension — how SET NULL resolves it</h3>

<p>GDPR Article 17 (right to erasure) directly conflicts with SOC 2 Type II, which requires a minimum 365-day retention of tamper-proof logs. When a user exercises their right to be forgotten, what happens to their audit logs?</p>

<p>GDPR allows exceptions: retention for legitimate audit purposes is a valid legal basis that can override the right to erasure. <code>SET NULL</code> effectively acts as <strong>pseudonymization</strong>: the audit event is preserved (action, timestamp, resource) but the link to the personal data (<code>userId</code>) is severed.</p>

<p>To go further, store a snapshot of the actor as plain text in the <code>metadata</code> field when writing the log. When processing a GDPR deletion request, do <code>SET NULL</code> on the FK and scrub PII from the JSON field. The audit log retains the event structure without personal data. This is the pattern Documenso uses in its <code>DocumentAuditLog</code>.</p>

<h2>E2E tests for the multi-tenant flow with Playwright</h2>

<p>Cal.com is the only open-source multi-tenant project with comprehensive E2E tests for organization flows. The pattern it uses is more robust than the typical <code>storageState</code> approach: it creates fixtures with Prisma directly, avoiding UI dependencies for state setup.</p>

<h3>Prisma fixtures: total isolation</h3>

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
        email: \`owner-\${Date.now()}@test.com\`,
        name: 'Test Owner',
        role: 'USER',
      },
    })
    const org = await prisma.organization.create({
      data: {
        name: 'Test Org',
        slug: \`test-org-\${Date.now()}\`,
        members: {
          create: { userId: owner.id, role: 'OWNER' },
        },
      },
    })

    await use({ owner, org })

    // Cleanup — CASCADE on OrganizationMember handles members and invitations
    await prisma.organization.delete({ where: { id: org.id } })
    await prisma.user.delete({ where: { id: owner.id } })
  },
})

export { expect } from '@playwright/test'</code></pre>

<h3>Testing invitations without SMTP</h3>

<p>You don't need an email server to test the invitation flow. The token is in the database — read it directly and navigate to the acceptance URL without going through email:</p>

<pre><code class="language-typescript">test('complete invitation flow', async ({ page, orgContext }) => {
  // Invite via UI
  await page.goto(\`/org/\${orgContext.org.slug}\`)
  await page.fill('[name=email]', 'newuser@test.com')
  await page.click('button[type=submit]')
  await expect(page.getByText('Invitation sent')).toBeVisible()

  // Read the token directly from the DB — no SMTP needed
  const invitation = await prisma.orgInvitation.findFirst({
    where: {
      email: 'newuser@test.com',
      organizationId: orgContext.org.id,
    },
  })
  expect(invitation?.status).toBe('PENDING')

  // Navigate directly to the acceptance URL
  await page.goto(\`/invite/accept?token=\${invitation!.token}\`)
  await expect(page.getByText('Invitation accepted')).toBeVisible()

  // Verify membership was created
  const member = await prisma.organizationMember.findFirst({
    where: { organizationId: orgContext.org.id },
    include: { user: { select: { email: true } } },
  })
  expect(member?.user.email).toBe('newuser@test.com')
})</code></pre>

<p>This pattern is faster and more deterministic than Mailhog or Inbucket: no SMTP wait, no email parsing, and the test doesn't fail due to mail delivery timeouts.</p>

<p>For tests requiring multiple simultaneously authenticated users, use separate browser contexts:</p>

<pre><code class="language-typescript">test('admin invites, member accepts', async ({ browser }) => {
  const adminContext = await browser.newContext({
    storageState: 'playwright/.auth/admin.json',
  })
  const memberContext = await browser.newContext({
    storageState: 'playwright/.auth/member.json',
  })

  const adminPage = await adminContext.newPage()
  const memberPage = await memberContext.newPage()
  // Both users interact independently
})</code></pre>

<h2>The multi-tenant SaaS checklist</h2>

<ul>
  <li><strong>Routing:</strong> Use <code>/org/[slug]</code>. Resolve the tenant in <code>layout.tsx</code>, not in middleware.</li>
  <li><strong>Middleware:</strong> Rate limiting, JWT verification, and platform RBAC only. No Prisma.</li>
  <li><strong>Schema:</strong> Two separate enums: <code>Role</code> (platform) and <code>OrgRole</code> (organization). Manual indexes on all foreign keys.</li>
  <li><strong>Invitations:</strong> Token + expiration + <code>upsert</code> for re-invitations. Verify plan limit at invite time AND at accept time.</li>
  <li><strong>Race condition:</strong> Double check is sufficient for most cases. Implement <code>FOR UPDATE</code> if you have high-frequency concurrent invitations.</li>
  <li><strong>Audit logs:</strong> <code>onDelete: SetNull</code>, not <code>Cascade</code>. Store actor snapshot in <code>metadata</code>. Append-only.</li>
  <li><strong>Tests:</strong> Create fixtures with Prisma. Read invitation tokens directly from the DB. Separate browser contexts for multiple users.</li>
</ul>

<p>If you don't want to implement all of this from scratch, the <a href="/recursos/saas-boilerplate">Arkeonix Labs boilerplate</a> has the complete multi-tenant system already implemented and tested in production: full Prisma schema with all indexes, Server Actions with Zod, invitation flow with Resend, dual RBAC, immutable audit logs, and a Playwright E2E suite.</p>`;

// ─── Post metadata ───────────────────────────────────────────────────

const post = {
  title: "Multi-tenancy in Next.js 15: organizations, roles, and plan limits",
  slug: "multi-tenancy-nextjs-15-organizations-roles-prisma",
  excerpt:
    "How to implement multi-tenancy in Next.js 15 App Router with Auth.js v5, Prisma, and Vercel. Dual RBAC layers, token-based invitations, plan-gated membership, immutable audit logs, and E2E tests with Playwright. Real production code.",
  content,
  author: "David López",
  published_at: new Date().toISOString(),
  language: "EN",
  category: "Dev",
  product_category: "boilerplate",
  status: "published",
  cover_image: "",
};

// ─── Insert ─────────────────────────────────────────────────────────

async function run() {
  console.log(`\n📝 Inserting post: "${post.title}"`);
  console.log(`   Slug: ${post.slug}`);

  const { data: existing } = await supabase
    .from("posts")
    .select("id, slug")
    .eq("slug", post.slug)
    .single();

  if (existing) {
    console.error(`\n❌ Post with slug "${post.slug}" already exists (id: ${existing.id})`);
    console.log("   Use UPDATE instead of INSERT to modify it.");
    process.exit(1);
  }

  const { data, error } = await supabase.from("posts").insert(post).select().single();

  if (error) {
    console.error("\n❌ Insert error:", error.message);
    process.exit(1);
  }

  console.log(`\n✅ Post published successfully`);
  console.log(`   ID: ${(data as { id: number }).id}`);
  console.log(`   URL: /blog/${post.slug}`);
}

void run();
