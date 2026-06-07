import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MessageCircle, Pin, Plus, Search, ChevronRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

interface ForumPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const CATEGORIES = ["Discussion", "Feedback", "Resources", "General"] as const;

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getCategoryStyles(category: string | null): string {
  switch (category) {
    case "Discussion":
      return "bg-primary-100 text-primary-700";
    case "Feedback":
      return "bg-secondary/10 text-secondary-dark";
    case "Resources":
      return "bg-success/10 text-success";
    case "General":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

/* ------------------------------------------------------------------ */
/*  Página principal del foro                                          */
/*  Server Component — el buscador y filtros usan formulario con GET   */
/* ------------------------------------------------------------------ */

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const { q, category } = await searchParams;

  // Build Prisma where clause
  const where: Record<string, unknown> = {};

  if (category && CATEGORIES.includes(category as any)) {
    where.category = category;
  }

  if (q && q.trim().length > 0) {
    where.title = { contains: q.trim(), mode: "insensitive" };
  }

  const posts = await prisma.forumPost.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: [
      { pinned: "desc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Cabecera ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Foro
          </h1>
          <p className="mt-1 text-muted-foreground">
            Participa en debates, comparte conocimientos y resuelve dudas con
            la comunidad.
          </p>
        </div>

        <Link
          href="/forum/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-light active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Nuevo Post
        </Link>
      </div>

      {/* ── Buscador y filtros ── */}
      <form
        method="GET"
        action="/forum"
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar por título…"
            className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-primary-50 px-5 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary-100"
        >
          Buscar
        </button>
      </form>

      {/* ── Lista de posts ── */}
      <div className="mt-6 space-y-3">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/50 px-6 py-16 text-center">
            <MessageCircle className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              {q || category
                ? "No hay posts que coincidan con tu búsqueda"
                : "Aún no hay posts en el foro"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              {q || category
                ? "Prueba con otros términos o quita los filtros."
                : "Sé el primero en iniciar una conversación."}
            </p>
            {!q && !category && (
              <Link
                href="/forum/new"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-light"
              >
                Crear primer post
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}

/* ─── PostCard ─── */

function PostCard({
  post,
}: {
  post: {
    id: string;
    title: string;
    pinned: boolean;
    category: string | null;
    createdAt: Date;
    user: { id: string; name: string | null; image: string | null };
    _count: { comments: number };
  };
}) {
  return (
    <Link
      href={`/forum/${post.id}`}
      className="group relative block rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
    >
      {post.pinned && (
        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-white shadow-sm">
          <Pin className="h-3 w-3" />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {post.pinned && (
              <span className="flex items-center gap-1 rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary-dark">
                <Pin className="h-3 w-3" />
                Pinned
              </span>
            )}
            {post.category && (
              <span
                className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-medium ${getCategoryStyles(post.category)}`}
              >
                {post.category}
              </span>
            )}
          </div>

          <h2 className="mt-2 text-lg font-semibold text-primary group-hover:text-primary-light">
            {post.title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              Por{" "}
              <span className="font-medium text-foreground">
                {post.user.name ?? "Usuario"}
              </span>
            </span>
            <span>{formatDate(post.createdAt)}</span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {post._count.comments}{" "}
              {post._count.comments === 1 ? "comentario" : "comentarios"}
            </span>
          </div>
        </div>

        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
