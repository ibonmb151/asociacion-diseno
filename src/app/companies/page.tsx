import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Building2, MapPin, Globe, Search, X } from "lucide-react";

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

async function getCompanies(search?: string): Promise<CompanyCard[]> {
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
    });

    return companies;
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const companies = await getCompanies(q);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Directorio de Empresas
        </h1>
        <p className="mt-1 text-gray-500">
          Explora empresas asociadas y descubre oportunidades de colaboración.
        </p>
      </div>

      {/* Search bar */}
      <CompanySearch initialQuery={q ?? ""} />

      {/* Results count */}
      <p className="mb-6 text-sm text-gray-500">
        {companies.length === 0
          ? "No se encontraron empresas"
          : `${companies.length} empresa${companies.length !== 1 ? "s" : ""} encontrada${companies.length !== 1 ? "s" : ""}`}
      </p>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/companies/${company.id}`}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            {/* Logo placeholder */}
            <div className="mb-4 flex justify-center">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-20 w-20 rounded-xl object-cover ring-2 ring-gray-100"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary-50 text-2xl font-bold text-primary">
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
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                {company.name}
              </h3>
              {company.sector && (
                <span className="mt-1 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {company.sector}
                </span>
              )}
            </div>

            {/* Description */}
            {company.description && (
              <p className="mt-2 line-clamp-2 text-center text-sm text-gray-600">
                {company.description}
              </p>
            )}

            {/* Location & Website */}
            <div className="mt-3 flex flex-col items-center gap-1 text-xs text-gray-400">
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
            <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-gray-100 pt-3 text-sm text-gray-500">
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
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          name="q"
          defaultValue={initialQuery}
          placeholder="Buscar por nombre, sector o descripción..."
          className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {initialQuery && (
          <a
            href="/companies"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </a>
        )}
      </div>
    </form>
  );
}
