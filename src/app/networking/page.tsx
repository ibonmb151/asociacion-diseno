import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";
import Link from "next/link";
import {
  Search,
  X,
  Briefcase,
  FileText,
  Users,
  Building2,
  GraduationCap,
  ArrowRight,
  Sparkles,
  MapPin,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface NeedItem {
  id: string;
  title: string;
  description: string;
  skills: string[];
  status: string;
  createdAt: Date;
  company: {
    id: string;
    name: string;
    logo: string | null;
    sector: string | null;
    location: string | null;
  };
}

interface ProposalItem {
  id: string;
  title: string;
  description: string;
  category: string | null;
  tags: string[];
  status: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    studentProfile: {
      skills: string[];
      course: string | null;
    } | null;
  };
}

interface NetworkingData {
  needs: NeedItem[];
  proposals: ProposalItem[];
}

/* ------------------------------------------------------------------ */
/*  Data fetching                                                     */
/* ------------------------------------------------------------------ */

async function getNetworkingData(search?: string): Promise<NetworkingData> {
  try {
    // Build filters for skills/keywords
    const needFilter: Record<string, unknown> = { status: "open" };
    const proposalFilter: Record<string, unknown> = { status: "open" };

    if (search && search.trim().length > 0) {
      const query = search.trim();

      // For needs: search in title, description, and skills
      needFilter.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { skills: { has: query } },
      ];

      // For proposals: search in title, description, and tags
      proposalFilter.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { has: query } },
      ];
    }

    const [needs, proposals] = await Promise.all([
      prisma.companyNeed.findMany({
        where: needFilter,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
              sector: true,
              location: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.proposal.findMany({
        where: proposalFilter,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              studentProfile: {
                select: {
                  skills: true,
                  course: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    return { needs, proposals };
  } catch {
    return { needs: [], proposals: [] };
  }
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

export default async function NetworkingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const session = await auth();
  const { needs, proposals } = await getNetworkingData(q);

  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const isStudent = userRole === "STUDENT";
  const isCompany = userRole === "COMPANY";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ─── Header ──────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-secondary" />
          <span className="text-sm font-semibold uppercase tracking-wider text-secondary">
            Networking
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Área de Networking
        </h1>
        <p className="mt-1 text-gray-500">
          Conecta empresas que buscan talento con estudiantes que quieren
          colaborar.
        </p>
      </div>

      {/* ─── Search ──────────────────────────────────────────────── */}
      <SearchBar initialQuery={q ?? ""} />

      {/* ─── Results count ────────────────────────────────────────── */}
      <p className="mb-6 text-sm text-gray-500">
        {(needs.length + proposals.length) === 0
          ? "No se encontraron resultados"
          : `Se encontraron ${needs.length} necesidad${needs.length !== 1 ? "es" : ""} y ${proposals.length} propuesta${proposals.length !== 1 ? "s" : ""}`}
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ════════════════════════════════════════════════════════════
            SECTION 1: Necesidades de Empresas
            ════════════════════════════════════════════════════════════ */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Briefcase className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Necesidades de Empresas
            </h2>
          </div>

          {needs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-12">
              <Building2 className="mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-500">
                No hay necesidades abiertas en este momento.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {needs.map((need) => (
                <div
                  key={need.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  {/* Header with company info */}
                  <div className="mb-2 flex items-center gap-2">
                    {need.company.logo ? (
                      <img
                        src={need.company.logo}
                        alt={need.company.name}
                        className="h-7 w-7 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary">
                        {need.company.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase() ?? "?"}
                      </div>
                    )}
                    <Link
                      href={`/companies/${need.company.id}`}
                      className="text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      {need.company.name}
                    </Link>
                    {need.company.sector && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                        {need.company.sector}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900">
                    {need.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {need.description}
                  </p>

                  {/* Skills */}
                  {need.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {need.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700"
                        >
                          {skill}
                        </span>
                      ))}
                      {need.skills.length > 5 && (
                        <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                          +{need.skills.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Company location & action */}
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      {need.company.location && (
                        <>
                          <MapPin className="h-3 w-3" />
                          <span>{need.company.location}</span>
                        </>
                      )}
                    </div>
                    {isStudent && (
                      <Link
                        href={`/companies/${need.company.id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                      >
                        Contactar
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                    {!isStudent && (
                      <Link
                        href={`/companies/${need.company.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        Ver detalles
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 2: Propuestas de Estudiantes
            ════════════════════════════════════════════════════════════ */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <FileText className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Propuestas de Estudiantes
            </h2>
          </div>

          {proposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-12">
              <GraduationCap className="mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-500">
                No hay propuestas de estudiantes activas en este momento.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  {/* Header with user info */}
                  <div className="mb-2 flex items-center gap-2">
                    {proposal.user.image ? (
                      <img
                        src={proposal.user.image}
                        alt={proposal.user.name ?? "Usuario"}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                        {proposal.user.name
                          ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase() ?? "?"}
                      </div>
                    )}
                    <Link
                      href={`/students/${proposal.user.id}`}
                      className="text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      {proposal.user.name}
                    </Link>
                    {proposal.user.studentProfile?.course && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                        {proposal.user.studentProfile.course}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900">
                    {proposal.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {proposal.description}
                  </p>

                  {/* Tags */}
                  {proposal.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {proposal.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-secondary/10 px-1.5 py-0.5 text-xs font-medium text-secondary-dark"
                        >
                          {tag}
                        </span>
                      ))}
                      {proposal.tags.length > 5 && (
                        <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                          +{proposal.tags.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action */}
                  <div className="mt-3 flex items-center justify-end border-t border-gray-100 pt-3">
                    {isCompany && (
                      <Link
                        href={`/students/${proposal.user.id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                      >
                        Conectar
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                    {!isCompany && (
                      <Link
                        href={`/students/${proposal.user.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        Ver perfil
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Search Component                                                  */
/* ------------------------------------------------------------------ */

function SearchBar({ initialQuery }: { initialQuery: string }) {
  return (
    <form action="/networking" method="GET" className="mb-6">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          name="q"
          defaultValue={initialQuery}
          placeholder="Buscar por skills, keywords..."
          className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {initialQuery && (
          <a
            href="/networking"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </a>
        )}
      </div>
    </form>
  );
}
