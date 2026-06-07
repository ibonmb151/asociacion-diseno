import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Pagination } from "@/components/pagination";
import {
  Plus,
  Search,
  Lightbulb,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

interface ProposalsPageProps {
  searchParams: Promise<{
    category?: string;
    status?: string;
    q?: string;
    page?: string;
  }>;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  "Collaboration",
  "Project Idea",
  "Event",
  "General",
] as const;

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Closed" },
] as const;

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatusConfig(
  status: string,
): { label: string; bg: string; text: string; dot: string } {
  switch (status) {
    case "open":
      return {
        label: "Open",
        bg: "bg-success-bg",
        text: "text-success",
        dot: "bg-success",
      };
    case "in_progress":
      return {
        label: "In Progress",
        bg: "bg-secondary-muted",
        text: "text-secondary",
        dot: "bg-secondary",
      };
    case "completed":
      return {
        label: "Completed",
        bg: "bg-primary-50",
        text: "text-muted",
        dot: "bg-muted",
      };
    case "closed":
      return {
        label: "Closed",
        bg: "bg-primary-50",
        text: "text-muted",
        dot: "bg-muted",
      };
    default:
      return {
        label: status,
        bg: "bg-primary-50",
        text: "text-muted",
        dot: "bg-muted",
      };
  }
}

function getCategoryStyles(category: string | null): string {
  switch (category) {
    case "Collaboration":
      return "bg-accent-light/30 text-accent";
    case "Project Idea":
      return "bg-secondary-muted text-secondary";
    case "Event":
      return "bg-primary-50 text-muted";
    case "General":
      return "bg-primary-50 text-muted";
    default:
      return "bg-primary-50 text-muted";
  }
}

/* ------------------------------------------------------------------ */
/*  Página de propuestas                                               */
/*  Server Component                                                   */
/* ------------------------------------------------------------------ */

export default async function ProposalsPage({
  searchParams,
}: ProposalsPageProps) {
  const { category, status, q, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  // Build Prisma where clause
  const where: Record<string, unknown> = {};

  if (category && CATEGORIES.includes(category as any)) {
    where.category = category;
  }

  if (
    status &&
    STATUS_OPTIONS.some((s) => s.value === status)
  ) {
    where.status = status;
  }

  if (q && q.trim().length > 0) {
    const query = q.trim();
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  const [proposals, total] = await Promise.all([
    prisma.proposal.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.proposal.count({ where }),
  ]);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Cabecera ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-fg">
            Propuestas
          </h1>
          <p className="mt-1 text-muted">
            Propón ideas, colaboraciones o eventos para la comunidad de diseño.
          </p>
        </div>

        <Link
          href="/proposals/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-surface hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          Nueva Propuesta
        </Link>
      </div>

      {/* ── Filtros ── */}
      <form
        method="GET"
        action="/proposals"
        className="mt-8 flex flex-wrap items-end gap-3"
      >
        {/* Búsqueda */}
        <div className="relative min-w-0 flex-1 basis-48">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar propuestas…"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 pl-10 pr-4 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
        </div>

        {/* Categoría */}
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

        {/* Estado */}
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-fg hover:bg-primary-50"
        >
          Filtrar
        </button>
      </form>

      {/* ── Lista de propuestas ── */}
      <div className="mt-6 space-y-3">
        {proposals.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-primary-50 px-6 py-16 text-center">
            <Lightbulb className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 text-lg font-medium text-muted">
              {q || category || status
                ? "No hay propuestas que coincidan con los filtros"
                : "Aún no hay propuestas"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {q || category || status
                ? "Prueba con otros filtros."
                : "Sé el primero en proponer una idea."}
            </p>
            {!q && !category && !status && (
              <Link
                href="/proposals/new"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
              >
                Crear primera propuesta
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        ) : (
          proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/proposals"
        searchParams={{ q, category, status }}
      />
    </div>
  );
}

/* ─── ProposalCard ─── */

function ProposalCard({
  proposal,
}: {
  proposal: {
    id: string;
    title: string;
    description: string;
    category: string | null;
    status: string;
    tags: string[];
    createdAt: Date;
    user: { id: string; name: string | null; image: string | null };
  };
}) {
  const statusConfig = getStatusConfig(proposal.status);
  const shortDescription =
    proposal.description.length > 200
      ? proposal.description.slice(0, 200) + "…"
      : proposal.description;

  return (
    <Link
      href={`/proposals/${proposal.id}`}
      className="group relative block bento-card p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Estado */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`}
              />
              {statusConfig.label}
            </span>

            {/* Categoría */}
            {proposal.category && (
              <span
                className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-medium ${getCategoryStyles(proposal.category)}`}
              >
                {proposal.category}
              </span>
            )}
          </div>

          {/* Título */}
          <h2 className="mt-2 font-heading text-lg font-medium text-fg">
            {proposal.title}
          </h2>

          {/* Descripción corta */}
          <p className="mt-1.5 text-sm leading-6 text-muted line-clamp-2">
            {shortDescription}
          </p>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span>
              Por{" "}
              <span className="font-medium text-fg">
                {proposal.user.name ?? "Usuario"}
              </span>
            </span>
            <span>{formatDate(proposal.createdAt)}</span>
          </div>

          {/* Tags */}
          {proposal.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {proposal.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-primary-50 px-2 py-0.5 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
