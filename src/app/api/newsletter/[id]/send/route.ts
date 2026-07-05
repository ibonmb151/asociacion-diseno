import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";
import { sendEditionToAudience, sendTestEmail } from "@/lib/newsletter";

/* ------------------------------------------------------------------ */
/*  POST /api/newsletter/[id]/send                                     */
/*  Query: ?test=1 → envío de prueba solo al email del redactor        */
/*  Requiere rol REDACTOR o ADMIN.                                     */
/*  Idempotente: si la edición ya tiene sentAt, no reenvía.            */
/* ------------------------------------------------------------------ */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string } | undefined)?.role;

    if (!session?.user?.id || (role !== "REDACTOR" && role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const isTest = new URL(request.url).searchParams.get("test") === "1";

    const edition = await prisma.newsletterEdition.findUnique({ where: { id } });
    if (!edition) {
      return NextResponse.json({ error: "Edición no encontrada" }, { status: 404 });
    }

    if (isTest) {
      if (!session.user.email) {
        return NextResponse.json(
          { error: "Tu cuenta no tiene email para la prueba" },
          { status: 400 },
        );
      }
      await sendTestEmail(edition, session.user.email);
      return NextResponse.json({ ok: true, test: true, to: session.user.email });
    }

    // Idempotencia: nunca dos envíos de la misma edición
    if (edition.sentAt) {
      return NextResponse.json(
        { error: `Ya enviada el ${edition.sentAt.toISOString()}`, alreadySent: true },
        { status: 409 },
      );
    }
    if (!edition.title.trim() || !edition.summary.trim()) {
      return NextResponse.json(
        { error: "Completa titular y resumen antes de enviar" },
        { status: 400 },
      );
    }

    // Marcar como enviada ANTES del envío evita doble click / carrera;
    // si Resend falla del todo, se revierte.
    await prisma.newsletterEdition.update({
      where: { id },
      data: { sentAt: new Date() },
    });

    try {
      const result = await sendEditionToAudience(edition);
      if (result.sent === 0 && result.failed > 0) {
        throw new Error("Ningún email salió de Resend");
      }
      return NextResponse.json({ ok: true, ...result });
    } catch (err) {
      await prisma.newsletterEdition.update({
        where: { id },
        data: { sentAt: null },
      });
      throw err;
    }
  } catch (error) {
    console.error("POST /api/newsletter/[id]/send error:", error);
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
