import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Building2, MapPin, Globe, Search, X } from "lucide-react";
import { Pagination } from "@/components/pagination";

const ITEMS_PER_PAGE = 12;

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface CompanyCard {
  id: string;
  name: string;
  sector: string | null;
  description: string;
  logo: string | null;
  location: string | null;
  website: string | null;
  _count: {
    needs: number;
  };
}

/* ------------------------------------------------------------------ */
/*  Data fetching                                                     */
/* ------------------------------------------------------------------ */

async function getCompanies(
  search?: string,
  page = 1,
): Promise<[CompanyCard[], number]> {
  try {
    const where: Record<string, unknown> = {};

    if (search && search.trim().length > 0) {
      const query = search.trim();
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { sector: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    const companies = await prisma.company.findMany({
      where,
      select: {
        id: true,
        name: true,
        sector: true,
        description: true,
        logo: true,
        location: true,
        website: true,
        _count: {
          select: {
            needs: {
              where: { status: "open" },
            },
          },
        },
      },
      orderBy: { name: "asc" },
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
    });

    const total = await prisma.company.count({ where });

    return [companies, total];
  } catch {
    return [[], 0];
  }
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const [companies, total] = await getCompanies(q, currentPage);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Editorial header */}
      <div className="page-header mb-2">
        <span className="page-header-eyebrow">Colaboración</span>
        <h1 className="font-heading text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          Empresas
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
          Explora las empresas que colaboran con la comunidad. Descubre 
          oportunidades, necesidades reales y construye tu red profesional.
        </p>
      </div>

      {/* Search bar */}
      <CompanySearch initialQuery={q ?? ""} />

      {/* Results count */}
      <p className="mb-6 text-sm text-muted">
        {total} {total === 1 ? "empresa" : "empresas"}
      </p>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/companies/${company.id}`}
            className="listing-card group"
          >
            {/* Logo */}
            <div className="flex justify-center">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-20 w-20 rounded-xl object-cover ring-2 ring-border"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-accent-light/50 text-xl font-bold text-accent">
                  {company.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() ?? "?"}
                </div>
              )}
            </div>

            {/* Name & Sector */}
            <div className="mt-4 text-center">
              <h3 className="font-heading text-lg font-medium text-fg">
                {company.name}
              </h3>
              {company.sector && (
                <span className="tag mt-1">{company.sector}</span>
              )}
            </div>

            {/* Description */}
            {company.description && (
              <p className="mt-2 line-clamp-2 text-center text-sm text-muted">
                {company.description}
              </p>
            )}

            {/* Location & Website */}
            <div className="mt-3 flex flex-col items-center gap-1 text-xs text-muted">
              {company.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {company.location}
                </span>
              )}
              {company.website && (
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  {new URL(company.website).hostname}
                </span>
              )}
            </div>

            {/* Needs count */}
            <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-border pt-3 text-sm text-muted">
              <Building2 className="h-4 w-4" />
              <span>
                {company._count.needs === 0
                  ? "Sin necesidades activas"
                  : `${company._count.needs} necesidad${company._count.needs !== 1 ? "es" : ""} activa${company._count.needs !== 1 ? "s" : ""}`}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/companies"
        searchParams={{ q }}
      />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Search Component (Client)                                         */
/* ------------------------------------------------------------------ */

function CompanySearch({ initialQuery }: { initialQuery: string }) {
  return (
    <form
      action="/companies"
      method="GET"
      className="mb-6"
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          name="q"
          defaultValue={initialQuery}
          placeholder="Buscar por nombre, sector o descripción..."
          className="search-input"
        />
        {initialQuery && (
          <a
            href="/companies"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-muted"
          >
            <X className="h-4 w-4" />
          </a>
        )}
      </div>
    </form>
  );
}
