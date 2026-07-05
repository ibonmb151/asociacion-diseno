import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditionPage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const number = parseInt(numero, 10);
  if (Number.isNaN(number)) notFound();

  const edition = await prisma.newsletterEdition.findUnique({
    where: { number },
  });

  // Los borradores no son públicos
  if (!edition || !edition.sentAt) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/newsletter"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Todas las ediciones
      </Link>

      <div className="border-b-2 border-fg pb-5">
        <div className="text-xs uppercase tracking-[0.2em] text-muted">
          El Semanal — Nº {edition.number} ·{" "}
          {edition.sentAt.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
        <h1 className="mt-2 font-heading text-4xl text-fg">{edition.title}</h1>
        <p className="mt-3 max-w-2xl text-muted">{edition.summary}</p>
        <a
          href={edition.pdfUrl}
          download
          className="mt-4 inline-flex items-center gap-2 text-sm text-accent hover:underline"
        >
          <Download className="h-4 w-4" />
          Descargar PDF
        </a>
      </div>

      {/* Visor del PDF con su maquetación original */}
      <div className="mt-8 border border-border">
        <iframe
          src={edition.pdfUrl}
          title={`El Semanal Nº ${edition.number}`}
          className="h-[80vh] w-full"
        />
      </div>
    </div>
  );
}
