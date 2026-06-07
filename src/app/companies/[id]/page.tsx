import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";
import { ContactCompanyButton } from "./contact-company-button";
import {
  Globe,
  MapPin,
  Building2,
  ExternalLink,
  Calendar,
  Pencil,
  Plus,
  Users,
  Briefcase,
  ArrowLeft,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const NEED_STATUS_LABELS: Record<string, string> = {
  open: "Abierta",
  interviewing: "En proceso",
  filled: "Cubierta",
  closed: "Cerrada",
};

const NEED_STATUS_STYLES: Record<string, string> = {
  open: "bg-green-50 text-green-700",
  interviewing: "bg-yellow-50 text-yellow-700",
  filled: "bg-blue-50 text-blue-700",
  closed: "bg-gray-100 text-gray-500",
};

async function getCompany(id: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        needs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return company;
  } catch {
    return null;
  }
}

export default async function CompanyProfilePage({ params }: PageProps) {
  const { id } = await params;

  const [company, session] = await Promise.all([
    getCompany(id),
    auth(),
  ]);

  if (!company) {
    notFound();
  }

  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const isStudent = userRole === "STUDENT";
  const isCompanyOwner =
    userRole === "COMPANY" && session?.user?.email === company.email;

  const createdDate = new Date(company.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/companies"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a empresas
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ─── Sidebar — Company Info ─────────────────────────────── */}
        <aside className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Logo */}
            <div className="mb-4 flex justify-center">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-28 w-28 rounded-xl object-cover ring-4 ring-gray-50"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-primary-50 text-3xl font-bold text-primary">
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
              <h1 className="text-2xl font-bold text-gray-900">
                {company.name}
              </h1>
              {company.sector && (
                <span className="mt-1 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {company.sector}
                </span>
              )}
            </div>

            {/* Description */}
            {company.description && (
              <p className="mt-4 text-center text-sm text-gray-600 leading-relaxed">
                {company.description}
              </p>
            )}

            {/* Details */}
            <div className="mt-5 space-y-2">
              {company.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                  <span>{company.location}</span>
                </div>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                >
                  <Globe className="h-4 w-4 shrink-0 text-gray-400" />
                  <span className="truncate">
                    {new URL(company.website).hostname}
                  </span>
                  <ExternalLink className="h-3 w-3 ml-auto shrink-0" />
                </a>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                <span>Miembro desde {createdDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Briefcase className="h-4 w-4 shrink-0 text-gray-400" />
                <span>
                  {company.needs.length} necesidad
                  {company.needs.length !== 1 ? "es" : ""} publicada
                  {company.needs.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            {isStudent && (
              <ContactCompanyButton
                companyId={company.id}
                companyName={company.name}
              />
            )}

            {isCompanyOwner && (
              <div className="mt-5 space-y-3">
                <Link
                  href={`/companies/${company.id}/needs/new`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Publicar Nueva Necesidad
                </Link>
                <button
                  disabled
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-500"
                  title="Próximamente"
                >
                  <Pencil className="h-4 w-4" />
                  Editar Perfil
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ─── Main — Needs List ──────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="h-5 w-5 text-gray-500" />
            <h2 className="text-xl font-bold text-gray-900">
              Necesidades Activas
            </h2>
          </div>

          {company.needs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-16">
              <Building2 className="mb-3 h-10 w-10 text-gray-300" />
              <p className="text-gray-500">
                Esta empresa no ha publicado necesidades todavía.
              </p>
              {isCompanyOwner && (
                <Link
                  href={`/companies/${company.id}/needs/new`}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Publicar Primera Necesidad
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {company.needs.map((need) => {
                const shortDesc =
                  need.description.length > 200
                    ? need.description.slice(0, 200) + "..."
                    : need.description;

                return (
                  <div
                    key={need.id}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {need.title}
                        </h3>
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            NEED_STATUS_STYLES[need.status] ??
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {NEED_STATUS_LABELS[need.status] ?? need.status}
                        </span>
                      </div>
                      <span className="whitespace-nowrap text-xs text-gray-400">
                        {new Date(need.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-600">{shortDesc}</p>

                    {/* Skills */}
                    {need.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {need.skills.map((skill: string) => (
                          <span
                            key={skill}
                            className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Company owner actions */}
                    {isCompanyOwner && (
                      <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                        <Link
                          href={`/companies/${company.id}/needs/${need.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Editar
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
