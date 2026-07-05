import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";

/* ------------------------------------------------------------------ */
/*  PATCH /api/newsletter/[id]  — retocar titular/resumen (borrador)   */
/*  DELETE /api/newsletter/[id] — borrar borrador no enviado           */
/*  Requiere rol REDACTOR o ADMIN.                                     */
/* ------------------------------------------------------------------ */

async function requireRedactor() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user?.id || (role !== "REDACTOR" && role !== "ADMIN")) {
    return null;
  }
  return session;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireRedactor();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, summary } = body as { title?: string; summary?: string };

    const edition = await prisma.newsletterEdition.findUnique({ where: { id } });
    if (!edition) {
      return NextResponse.json({ error: "Edición no encontrada" }, { status: 404 });
    }
    if (edition.sentAt) {
      return NextResponse.json(
        { error: "La edición ya fue enviada; no se puede editar" },
        { status: 400 },
      );
    }

    const data: { title?: string; summary?: string } = {};
    if (typeof title === "string" && title.trim().length > 0) data.title = title.trim();
    if (typeof summary === "string") data.summary = summary.trim();

    const updated = await prisma.newsletterEdition.update({ where: { id }, data });
    return NextResponse.json({ edition: updated });
  } catch (error) {
    console.error("PATCH /api/newsletter/[id] error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireRedactor();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const edition = await prisma.newsletterEdition.findUnique({ where: { id } });
    if (!edition) {
      return NextResponse.json({ error: "Edición no encontrada" }, { status: 404 });
    }
    if (edition.sentAt) {
      return NextResponse.json(
        { error: "No se puede borrar una edición ya enviada" },
        { status: 400 },
      );
    }

    await prisma.newsletterEdition.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/newsletter/[id] error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
