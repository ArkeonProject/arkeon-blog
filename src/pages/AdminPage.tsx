import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabase";
import RichTextEditor from "../components/admin/RichTextEditor";
import {
  FiUsers, FiFileText, FiMail, FiLock, FiBarChart2,
  FiPlus, FiEdit2, FiTrash2,
  FiCheck, FiX, FiLayout,
} from "react-icons/fi";
import type { PostListItem } from "../types/post";

// ─── Types ───────────────────────────────────────────────────────────────────

type TableName = "posts" | "lab_posts";

interface AdminPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image?: string;
  published_at: string;
  language?: string;
  category?: string;
  product_category?: string | null;
  content: string;
  author: string;
  status: 'published' | 'draft';
  tags?: string[];
  difficulty?: string | null;
}

type Tab = "dashboard" | "posts" | "lab";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[áàäâã]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöôõ]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/ñ/g, "n")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

// ─── Auth gate ───────────────────────────────────────────────────────────────

function AuthGate({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password: pwd });
    if (authError) {
      setError("Credenciales incorrectas.");
    } else {
      onAuth();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-24 glass-card rounded-2xl p-8 text-center">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <FiLock className="text-primary text-xl" />
      </div>
      <h1 className="text-2xl font-display font-bold mb-2">Admin Access</h1>
      <p className="text-muted-foreground text-sm mb-6">Autenticación segura vía Supabase.</p>
      <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-4 py-3 rounded-xl bg-muted border border-border outline-none transition-all text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
          autoFocus
        />
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="Contraseña"
          required
          className={`w-full px-4 py-3 rounded-xl bg-muted border outline-none transition-all text-sm ${
            error ? "border-red-500 ring-2 ring-red-500/30" : "border-border focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
          }`}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {loading ? "Accediendo…" : "Acceder"}
        </button>
      </form>
    </div>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: React.ElementType }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="text-primary text-xl" />
      </div>
      <p className="text-3xl font-display font-bold mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

// ─── Overview Dashboard ───────────────────────────────────────────────────────

type OverviewData = {
  totalPosts: number;
  totalLab: number;
  totalSubs: number;
  byCategory: Record<string, number>;
  recentSubs: { email: string; created_at: string }[];
  recentPosts: PostListItem[];
};

function Overview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const [postsRes, labRes, subsRes, recentRes] = await Promise.all([
        supabase.from("posts").select("id, category"),
        supabase.from("lab_posts").select("id"),
        supabase.from("newsletter_subscribers").select("email, created_at").order("created_at", { ascending: false }).limit(8),
        supabase.from("posts").select("id, title, slug, excerpt, cover_image, published_at, language, category").order("published_at", { ascending: false }).limit(5),
      ]);
      if (postsRes.error) { setErr(postsRes.error.message); setLoading(false); return; }
      if (labRes.error) { setErr(labRes.error.message); setLoading(false); return; }
      const posts = postsRes.data ?? [];
      const byCategory: Record<string, number> = {};
      for (const p of posts) {
        const cat = (p as { category?: string }).category ?? "Uncategorized";
        byCategory[cat] = (byCategory[cat] ?? 0) + 1;
      }
      setData({
        totalPosts: posts.length,
        totalLab: (labRes.data ?? []).length,
        totalSubs: (subsRes.data ?? []).length,
        byCategory,
        recentSubs: (subsRes.data ?? []) as { email: string; created_at: string }[],
        recentPosts: (recentRes.data ?? []) as PostListItem[],
      });
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass-card rounded-2xl p-6 animate-pulse h-32" />)}</div>;
  if (err || !data) return <p className="text-red-400 text-center mt-10">Error: {err ?? "No data"}</p>;

  const maskEmail = (e: string) => { const [u, d] = e.split("@"); return `${u.slice(0, 2)}${"*".repeat(Math.max(2, u.length - 2))}@${d}`; };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Blog Posts" value={data.totalPosts} icon={FiFileText} />
        <StatCard label="Lab Posts" value={data.totalLab} icon={FiBarChart2} />
        <StatCard label="Subscribers" value={data.totalSubs} icon={FiMail} />
        <StatCard label="Categories" value={Object.keys(data.byCategory).length} icon={FiUsers} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display font-semibold mb-5">Posts by Category</h2>
          <div className="space-y-3">
            {Object.entries(data.byCategory).sort(([, a], [, b]) => b - a).map(([cat, count]) => (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{cat}</span>
                  <span className="font-semibold">{count}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round((count / data.totalPosts) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display font-semibold mb-5">Recent Subscribers</h2>
          {data.recentSubs.length === 0
            ? <p className="text-sm text-muted-foreground">No subscriber data available.</p>
            : <div className="space-y-2">
                {data.recentSubs.map((s) => (
                  <div key={s.email} className="flex justify-between py-2 border-b border-border/40 last:border-0">
                    <span className="text-sm font-mono text-muted-foreground">{maskEmail(s.email)}</span>
                    <span className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  );
}

// ─── Post Editor ──────────────────────────────────────────────────────────────

const EMPTY_POST: Omit<AdminPost, "id"> = {
  title: "", slug: "", excerpt: "", content: "", author: "David López",
  cover_image: "", published_at: new Date().toISOString().slice(0, 16),
  language: "ES", category: "", product_category: null,
  status: "published", tags: [], difficulty: null,
};

function PostEditor({
  table, post, onSave, onCancel,
}: {
  table: TableName;
  post: AdminPost | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const isLab = table === "lab_posts";
  const [form, setForm] = useState<Omit<AdminPost, "id">>(post ? { ...post } : { ...EMPTY_POST });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [slugManual, setSlugManual] = useState(!!post);

  const set = (k: keyof typeof form, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (v: string) => {
    set("title", v);
    if (!slugManual) set("slug", generateSlug(v));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setErr("Title, slug and content are required.");
      return;
    }
    setSaving(true);
    setErr(null);

    const payload: Record<string, unknown> = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      author: form.author,
      cover_image: form.cover_image || null,
      published_at: new Date(form.published_at).toISOString(),
      language: form.language,
      status: form.status,
    };

    if (isLab) {
      const tagsRaw = typeof form.tags === "string"
        ? (form.tags as string).split(",").map((t) => t.trim()).filter(Boolean)
        : form.tags ?? [];
      payload.tags = tagsRaw;
      payload.difficulty = form.difficulty || null;
    } else {
      payload.category = form.category || null;
      payload.product_category = form.product_category || null;
    }

    const { error } = post
      ? await supabase.from(table).update(payload).eq("id", post.id)
      : await supabase.from(table).insert(payload);

    if (error) {
      setErr(error.message);
    } else {
      onSave();
    }
    setSaving(false);
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary/60 outline-none transition-all text-sm";
  const labelClass = "block text-xs font-medium text-muted-foreground mb-1.5";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold">
          {post ? "Edit post" : "New post"}
        </h2>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted transition-all">
            <FiX className="text-xs" /> Cancel
          </button>
          <button
            onClick={() => { void handleSave(); }}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <FiCheck className="text-xs" />
            {saving ? "Saving…" : post ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {err && <p className="text-red-400 text-sm px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20">{err}</p>}

      {/* Metadata panel */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label className={labelClass}>Title *</label>
            <input className={inputClass} value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Post title…" />
          </div>

          <div>
            <label className={labelClass}>Slug *</label>
            <input
              className={inputClass}
              value={form.slug}
              onChange={(e) => { setSlugManual(true); set("slug", e.target.value); }}
              placeholder="my-post-slug"
            />
          </div>

          <div>
            <label className={labelClass}>Language</label>
            <select className={inputClass} value={form.language} onChange={(e) => set("language", e.target.value)}>
              <option value="ES">ES</option>
              <option value="EN">EN</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select className={inputClass} value={form.status} onChange={(e) => set("status", e.target.value as 'published' | 'draft')}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Author</label>
            <input className={inputClass} value={form.author} onChange={(e) => set("author", e.target.value)} />
          </div>

          {isLab ? (
            <>
              <div>
                <label className={labelClass}>Tags (comma-separated)</label>
                <input
                  className={inputClass}
                  value={Array.isArray(form.tags) ? form.tags.join(", ") : (form.tags as unknown as string) ?? ""}
                  onChange={(e) => set("tags", e.target.value)}
                  placeholder="docker, linux, nginx"
                />
              </div>
              <div>
                <label className={labelClass}>Difficulty</label>
                <select className={inputClass} value={form.difficulty ?? ""} onChange={(e) => set("difficulty", e.target.value || null)}>
                  <option value="">— None —</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </>
          ) : (
            <div>
              <label className={labelClass}>Category</label>
              <input className={inputClass} value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} placeholder="Products, News, Lab…" />
            </div>
          )}

          <div>
            <label className={labelClass}>Published at</label>
            <input type="datetime-local" className={inputClass} value={form.published_at?.slice(0, 16)} onChange={(e) => set("published_at", e.target.value)} />
          </div>

          <div className="lg:col-span-2">
            <label className={labelClass}>Cover image URL</label>
            <input className={inputClass} value={form.cover_image ?? ""} onChange={(e) => set("cover_image", e.target.value)} placeholder="https://…" />
          </div>

        </div>

        <div className="mt-4">
          <label className={labelClass}>Excerpt</label>
          <textarea
            rows={2}
            className={`${inputClass} resize-none`}
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            placeholder="Brief description shown in post cards…"
          />
        </div>
      </div>

      {/* WYSIWYG editor */}
      <div className="space-y-2">
        <label className={labelClass}>Content *</label>
        <RichTextEditor
          value={form.content}
          onChange={(html) => set("content", html)}
          placeholder="Start writing your post…"
          minHeight="500px"
        />
      </div>
    </div>
  );
}

// ─── Posts Manager ────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

function PostsManager({ table }: { table: TableName }) {
  const isLab = table === "lab_posts";
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminPost | "new" | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState<"all" | "ES" | "EN">("all");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    const columns = isLab
      ? "id, title, slug, excerpt, cover_image, published_at, language, content, author, tags, difficulty, status"
      : "id, title, slug, excerpt, cover_image, published_at, language, category, product_category, content, author, status";
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .order("published_at", { ascending: false });
    if (error) { setErr(error.message); } else { setPosts((data as AdminPost[]) ?? []); }
    setLoading(false);
  };

  useEffect(() => { void load(); }, [table]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeletingId(id);
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) { alert(`Error: ${error.message}`); }
    else { setPosts((prev) => prev.filter((p) => p.id !== id)); }
    setDeletingId(null);
  };

  const handleToggleStatus = async (post: AdminPost) => {
    const next = post.status === "published" ? "draft" : "published";
    setTogglingId(post.id);
    const { error } = await supabase.from(table).update({ status: next }).eq("id", post.id);
    if (error) { alert(`Error: ${error.message}`); }
    else { setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, status: next } : p)); }
    setTogglingId(null);
  };

  // Categorías únicas para el filtro
  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))] as string[];

  const filtered = posts.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.slug ?? "").toLowerCase().includes(q);
    const matchLang = langFilter === "all" || p.language === langFilter;
    const matchCat = catFilter === "all" || p.category === catFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchLang && matchCat && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset página al cambiar filtros
  useEffect(() => { setPage(1); }, [search, langFilter, catFilter, statusFilter]);

  if (editing !== null) {
    return (
      <PostEditor
        table={table}
        post={editing === "new" ? null : editing}
        onSave={() => { setEditing(null); void load(); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  const selectClass = "px-3 py-2 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary/40 outline-none text-sm transition-all";

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          className="flex-1 min-w-[160px] max-w-xs px-3 py-2 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary/40 outline-none text-sm transition-all"
          placeholder="Search posts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className={selectClass} value={langFilter} onChange={(e) => setLangFilter(e.target.value as "all"|"ES"|"EN")}>
          <option value="all">All languages</option>
          <option value="ES">ES</option>
          <option value="EN">EN</option>
        </select>
        <select className={selectClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all"|"published"|"draft")}>
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        {!isLab && (
          <select className={selectClass} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} posts</span>
        <button
          onClick={() => setEditing("new")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all"
        >
          <FiPlus /> New post
        </button>
      </div>

      {loading && <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 glass-card rounded-xl animate-pulse" />)}</div>}
      {err && <p className="text-red-400 text-sm">{err}</p>}

      {!loading && paginated.length === 0 && (
        <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
          {search || langFilter !== "all" || catFilter !== "all" ? "No posts match your filters." : `No ${isLab ? "lab " : ""}posts yet.`}
        </div>
      )}

      {!loading && paginated.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Lang</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  {isLab ? "Difficulty" : "Category"}
                </th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((post, i) => (
                <tr key={post.id} className={`border-b border-border/30 last:border-0 hover:bg-muted/40 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                  <td className="px-5 py-3">
                    <p className="font-medium truncate max-w-[220px]">{post.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">{post.slug}</p>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-muted border border-border/60 font-mono">{post.language ?? "—"}</span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground hidden lg:table-cell text-xs">
                    {isLab ? (post.difficulty ?? "—") : (post.category ?? "—")}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground hidden md:table-cell text-xs">
                    {new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => { void handleToggleStatus(post); }}
                      disabled={togglingId === post.id}
                      title={`Click to set ${post.status === "published" ? "draft" : "published"}`}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all disabled:opacity-50 ${
                        post.status === "published"
                          ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                          : "bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25"
                      }`}
                    >
                      {togglingId === post.id ? "…" : post.status === "published" ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setEditing(post)} className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" title="Edit">
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button onClick={() => { void handleDelete(post.id); }} disabled={deletingId === post.id} className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-40" title="Delete">
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg bg-muted border border-border text-sm disabled:opacity-40 hover:bg-muted/80 transition-all">←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${p === page ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border hover:bg-muted/80"}`}>{p}</button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg bg-muted border border-border text-sm disabled:opacity-40 hover:bg-muted/80 transition-all">→</button>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Overview", icon: FiLayout },
  { id: "posts", label: "Blog Posts", icon: FiFileText },
  { id: "lab", label: "Lab Posts", icon: FiBarChart2 },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setAuthed(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <Helmet>
        <title>Admin — Arkeonix Labs</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {!authed ? (
        <AuthGate onAuth={() => setAuthed(true)} />
      ) : (
        <div>
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Arkeonix Labs internal panel</p>
            </div>
            <button
              onClick={() => { void supabase.auth.signOut(); }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign out
            </button>
          </header>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-muted rounded-xl mb-8 w-fit">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  tab === id
                    ? "bg-surface text-foreground shadow-sm border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="text-xs" />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          {tab === "dashboard" && <Overview />}
          {tab === "posts" && <PostsManager table="posts" />}
          {tab === "lab" && <PostsManager table="lab_posts" />}
        </div>
      )}
    </div>
  );
}
