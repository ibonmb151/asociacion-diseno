import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MessageCircle, Pin, Plus, Search, ChevronRight } from "lucide-react";
import { Pagination } from "@/components/pagination";

const ITEMS_PER_PAGE = 10;

interface ForumPageProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}

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

function CategoryBadge({ category }: { category: string | null }) {
  if (!category) return null;
  const styles: Record<string, string> = {
    Discussion: "bg-accent-light/30 text-accent",
    Feedback: "bg-secondary-muted text-secondary",
    Resources: "bg-accent/10 text-accent",
    General: "bg-border text-muted",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${styles[category] ?? styles.General}`}>
      {category === "Discussion" ? "Debate" :
       category === "Feedback" ? "Feedback" :
       category === "Resources" ? "Recursos" : category}
    </span>
  );
}

function PostCard({ post }: {
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
      className="listing-card group relative"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {post.pinned && (
              <span className="flex items-center gap-1 rounded-full bg-secondary-muted px-2.5 py-0.5 text-[11px] font-medium text-secondary">
                <Pin className="h-3 w-3" />
                Fijado
              </span>
            )}
            <CategoryBadge category={post.category} />
          </div>

          <h2 className="mt-2 font-heading text-base font-medium text-fg transition-colors group-hover:text-accent">
            {post.title}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
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

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const { q, category, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const where: Record<string, unknown> = {};

  if (category && CATEGORIES.includes(category as any)) {
    where.category = category;
  }

  if (q && q.trim().length > 0) {
    where.OR = [
      { title: { contains: q.trim(), mode: "insensitive" } },
      { content: { contains: q.trim(), mode: "insensitive" } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.forumPost.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { comments: true } },
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
      {/* Editorial header */}
      <div className="page-header mb-2">
        <span className="page-header-eyebrow">Comunidad</span>
        <h1 className="font-heading text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          Foro
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
          Participa en debates, comparte conocimientos, resuelve dudas 
          y construye comunidad con otros diseñadores de Deusto.
        </p>
      </div>

      {/* Action bar */}
      <div className="mb-8 flex items-center justify-between border-b border-border pb-5">
        <p className="text-sm text-muted">
          {total} {total === 1 ? "conversación" : "conversaciones"}
        </p>
        <Link
          href="/forum/new"
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          Nueva conversación
        </Link>
      </div>

      {/* Search + Filters */}
      <form
        method="GET"
        action="/forum"
        className="mb-8 flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar conversaciones…"
            className="search-input"
          />
        </div>

        <select
          name="category"
          defaultValue={category ?? ""}
          className="select-input"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "Discussion" ? "Debate" :
               cat === "Feedback" ? "Feedback" :
               cat === "Resources" ? "Recursos" : cat}
            </option>
          ))}
        </select>

        <button type="submit" className="btn-ghost">
          <Search className="h-4 w-4" />
          Buscar
        </button>
      </form>

      {/* Post list */}
      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="empty-state">
            <MessageCircle className="h-10 w-10 text-border" />
            <p className="mt-4 text-lg font-medium text-muted">
              {q || category
                ? "No hay conversaciones que coincidan con tu búsqueda"
                : "Aún no hay conversaciones en el foro"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {q || category
                ? "Prueba con otros términos o quita los filtros."
                : "Sé el primero en iniciar una conversación."}
            </p>
            {!q && !category && (
              <Link
                href="/forum/new"
                className="btn-primary mt-6"
              >
                <Plus className="h-4 w-4" />
                Crear primera conversación
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
