import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SubscribeForm } from "./SubscribeForm";

export const metadata = {
  title: "El Semanal — Deusto Design Association",
  description:
    "La newsletter de la comunidad de diseño de Deusto. Cada domingo: vida de la asociación, noticias de diseño, portfolio destacado y herramienta de la semana.",
};

export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const editions = await prisma.newsletterEdition.findMany({
    where: { sentAt: { not: null } },
    orderBy: { number: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      {/* Cabecera editorial */}
      <div className="border-b-2 border-fg pb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted">
          Deusto Design Association
        </div>
        <h1 className="mt-2 font-heading text-5xl text-fg sm:text-6xl">
          El Semanal<span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Cada domingo: vida de la asociación, noticias de diseño, portfolio
          destacado y la herramienta de la semana. Directo a tu bandeja.
        </p>
      </div>

      {/* Alta */}
      <SubscribeForm />

      {/* Hemeroteca */}
      <div className="mt-14">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted">
          Ediciones anteriores
        </h2>
        {editions.length === 0 ? (
          <p className="mt-4 font-heading text-xl text-muted">
            La primera edición llega pronto. Suscríbete para no perdértela.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-border border-t border-border">
            {editions.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/newsletter/${e.number}`}
                  className="group flex items-baseline gap-5 py-5 transition-colors hover:bg-surface"
                >
                  <span className="font-heading text-2xl text-accent">
                    {String(e.number).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className="font-heading text-xl text-fg group-hover:underline">
                      {e.title}
                    </span>
                    <span className="mt-1 block text-sm text-muted">
                      {e.summary.length > 140 ? `${e.summary.slice(0, 140)}…` : e.summary}
                    </span>
                  </span>
                  <span className="hidden text-xs text-muted sm:block">
                    {e.sentAt!.toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
