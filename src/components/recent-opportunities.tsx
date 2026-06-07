import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Briefcase, Building2 } from "lucide-react"

export async function RecentOpportunities() {
  const needs = await prisma.companyNeed.findMany({
    where: { status: "open" },
    include: {
      company: { select: { name: true, id: true, logo: true, sector: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  if (needs.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light/30 text-accent">
            <Briefcase className="h-4 w-4" />
          </div>
          <h2 className="font-heading text-xl font-medium text-fg">Oportunidades Recientes</h2>
        </div>
        <Link
          href="/companies"
          className="text-sm text-accent hover:text-accent-hover"
        >
          Ver todas
        </Link>
      </div>

      <div className="space-y-3">
        {needs.map((need) => (
          <Link
            key={need.id}
            href={`/companies/${need.company.id}`}
            className="block rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-fg truncate">{need.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{need.company.name}</span>
                  {need.company.sector && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{need.company.sector}</span>
                    </>
                  )}
                </div>
                {need.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {need.skills.slice(0, 3).map((skill: string) => (
                      <span
                        key={skill}
                        className="rounded-md bg-primary-50 px-1.5 py-0.5 text-xs text-muted"
                      >
                        {skill}
                      </span>
                    ))}
                    {need.skills.length > 3 && (
                      <span className="text-xs text-muted">+{need.skills.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
              <span className="shrink-0 text-xs text-muted">
                {new Date(need.createdAt).toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
