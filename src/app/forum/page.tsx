import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MessageCircle, Pin, Plus, Search, ChevronRight } from "lucide-react";
import { Pagination } from "@/components/pagination";

const ITEMS_PER_PAGE = 10;

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

interface ForumPageProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
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
      return "bg-accent-light/30 text-accent";
    case "Feedback":
      return "bg-secondary-muted text-secondary";
    case "Resources":
      return "bg-primary-50 text-muted";
    case "General":
      return "bg-primary-50 text-muted";
    default:
      return "bg-primary-50 text-muted";
  }
}

/* ------------------------------------------------------------------ */
/*  Página principal del foro                                          */
/*  Server Component — el buscador y filtros usan formulario con GET   */
/* ------------------------------------------------------------------ */

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const { q, category, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  // Build Prisma where clause
  const where: Record<string, unknown> = {};

  if (category && CATEGORIES.includes(category as any)) {
    where.category = category;
  }

  if (q && q.trim().length > 0) {
    where.title = { contains: q.trim(), mode: "insensitive" };
  }

  const [posts, total] = await Promise.all([
    prisma.forumPost.findMany({
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
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.forumPost.count({ where }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Cabecera ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-fg">
            Foro
          </h1>
          <p className="mt-1 text-muted">
            Participa en debates, comparte conocimientos y resuelve dudas con
            la comunidad.
          </p>
        </div>

        <Link
          href="/forum/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
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
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar por título…"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 pl-10 pr-4 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
        </div>

        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
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
          className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-fg hover:bg-primary-50"
        >
          Buscar
        </button>
      </form>

      {/* ── Lista de posts ── */}
      <div className="mt-6 space-y-3">
        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-primary-50 px-6 py-16 text-center">
            <MessageCircle className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 text-lg font-medium text-muted">
              {q || category
                ? "No hay posts que coincidan con tu búsqueda"
                : "Aún no hay posts en el foro"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {q || category
                ? "Prueba con otros términos o quita los filtros."
                : "Sé el primero en iniciar una conversación."}
            </p>
            {!q && !category && (
              <Link
                href="/forum/new"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/forum"
        searchParams={{ q, category }}
      />
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
      className="group relative block bento-card p-5"
    >
      {post.pinned && (
        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-white">
          <Pin className="h-3 w-3" />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {post.pinned && (
              <span className="flex items-center gap-1 rounded-md bg-secondary-muted px-2 py-0.5 text-xs font-medium text-secondary">
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

          <h2 className="mt-2 font-heading text-lg font-medium text-fg">
            {post.title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span>
              Por{" "}
              <span className="font-medium text-fg">
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

        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
