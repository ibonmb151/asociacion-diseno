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
      {/* Editorial header */}
      <div className="page-header mb-2">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="page-header-eyebrow">Colaboración</span>
            <h1 className="font-heading text-4xl font-medium tracking-tight text-fg sm:text-5xl">
              Propuestas
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
              Propón ideas, colaboraciones o eventos. La comunidad vota, 
              comenta y se suma a las mejores iniciativas.
            </p>
          </div>
          <Link
            href="/proposals/new"
            className="btn-primary shrink-0"
          >
            <Plus className="h-4 w-4" />
            Nueva propuesta
          </Link>
        </div>
      </div>

      {/* ── Filtros ── */}
      <form
        method="GET"
        action="/proposals"
        className="mb-8 flex flex-wrap items-end gap-3"
      >
        <div className="relative min-w-0 flex-1 basis-48">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar propuestas…"
            className="search-input"
          />
        </div>

        <select name="category" defaultValue={category ?? ""} className="select-input">
          <option value="">Todas las categorías</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select name="status" defaultValue={status ?? ""} className="select-input">
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button type="submit" className="btn-ghost">
          Filtrar
        </button>
      </form>

      {/* ── Lista de propuestas ── */}
      <div className="mt-6 space-y-3">
        {proposals.length === 0 ? (
          <div className="empty-state">
            <Lightbulb className="h-10 w-10 text-border" />
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
                className="btn-primary mt-6"
              >
                <Plus className="h-4 w-4" />
                Crear primera propuesta
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
      className="listing-card group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
              {statusConfig.label}
            </span>
            {proposal.category && (
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${getCategoryStyles(proposal.category)}`}>
                {proposal.category}
              </span>
            )}
          </div>

          <h2 className="mt-2 font-heading text-base font-medium text-fg transition-colors group-hover:text-accent">
            {proposal.title}
          </h2>

          <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-2">
            {shortDescription}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span>
              Por{" "}
              <span className="font-medium text-fg">
                {proposal.user.name ?? "Usuario"}
              </span>
            </span>
            <span>{formatDate(proposal.createdAt)}</span>
          </div>

          {proposal.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {proposal.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-full bg-accent-light/30 px-2.5 py-0.5 text-[11px] text-accent">
                  {tag}
                </span>
              ))}
              {proposal.tags.length > 4 && (
                <span className="text-[11px] text-muted">+{proposal.tags.length - 4}</span>
              )}
            </div>
          )}
        </div>

        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
