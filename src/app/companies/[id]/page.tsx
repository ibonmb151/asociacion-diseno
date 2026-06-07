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
  open: "bg-success-bg text-success",
  interviewing: "bg-warning-bg text-warning",
  filled: "bg-accent-light/30 text-accent",
  closed: "bg-primary-50 text-muted",
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
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a empresas
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ─── Sidebar — Company Info ─────────────────────────────── */}
        <aside className="lg:col-span-1">
          <div className="rounded-lg border border-border bg-surface p-6">
            {/* Logo */}
            <div className="mb-4 flex justify-center">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-28 w-28 rounded-xl object-cover ring-2 ring-border"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-primary-50 text-3xl font-bold text-fg">
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
              <h1 className="font-heading text-3xl font-medium tracking-tight text-fg">
                {company.name}
              </h1>
              {company.sector && (
                <span className="mt-1 inline-block rounded-md bg-accent-light/30 px-2.5 py-0.5 text-xs font-medium text-accent">
                  {company.sector}
                </span>
              )}
            </div>

            {/* Description */}
            {company.description && (
              <p className="mt-4 text-center text-sm text-fg leading-relaxed">
                {company.description}
              </p>
            )}

            {/* Details */}
            <div className="mt-5 space-y-2">
              {company.location && (
                <div className="flex items-center gap-2 text-sm text-fg">
                  <MapPin className="h-4 w-4 shrink-0 text-muted" />
                  <span>{company.location}</span>
                </div>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover"
                >
                  <Globe className="h-4 w-4 shrink-0 text-muted" />
                  <span className="truncate">
                    {new URL(company.website).hostname}
                  </span>
                  <ExternalLink className="h-3 w-3 ml-auto shrink-0" />
                </a>
              )}
              <div className="flex items-center gap-2 text-sm text-muted">
                <Calendar className="h-4 w-4 shrink-0 text-muted" />
                <span>Miembro desde {createdDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Briefcase className="h-4 w-4 shrink-0 text-muted" />
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-surface hover:bg-accent-hover"
                >
                  <Plus className="h-4 w-4" />
                  Publicar Nueva Necesidad
                </Link>
                <Link
                  href={`/profile/edit`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-fg hover:bg-primary-50"
                >
                  <Pencil className="h-4 w-4" />
                  Editar Perfil
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* ─── Main — Needs List ──────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="h-5 w-5 text-muted" />
            <h2 className="font-heading text-xl font-medium text-fg">
              Necesidades Activas
            </h2>
          </div>

          {company.needs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-primary-50 py-16 text-center">
              <Building2 className="mb-3 mx-auto h-10 w-10 text-muted" />
              <p className="text-muted">
                Esta empresa no ha publicado necesidades todavía.
              </p>
              {isCompanyOwner && (
                <Link
                  href={`/companies/${company.id}/needs/new`}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-surface hover:bg-accent-hover"
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
                    className="rounded-lg border border-border bg-surface p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-heading text-xl font-medium text-fg">
                          {need.title}
                        </h3>
                        <span
                          className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-medium ${
                            NEED_STATUS_STYLES[need.status] ??
                            "bg-primary-50 text-muted"
                          }`}
                        >
                          {NEED_STATUS_LABELS[need.status] ?? need.status}
                        </span>
                      </div>
                      <span className="whitespace-nowrap text-xs text-muted">
                        {new Date(need.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-fg">{shortDesc}</p>

                    {/* Skills */}
                    {need.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {need.skills.map((skill: string) => (
                          <span
                            key={skill}
                            className="rounded-md bg-primary-50 px-2 py-0.5 text-xs text-muted"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Company owner actions */}
                    {isCompanyOwner && (
                      <div className="mt-4 flex gap-2 border-t border-border pt-3">
                        <Link
                          href={`/companies/${company.id}/needs/${need.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-fg hover:bg-primary-50"
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
