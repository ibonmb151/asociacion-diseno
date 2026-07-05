import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";

/* ------------------------------------------------------------------ */
/*  GET /api/newsletter                                                */
/*  Público: solo ediciones enviadas.                                  */
/*  REDACTOR/ADMIN: todas (incluye borradores).                        */
/* ------------------------------------------------------------------ */

export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string } | undefined)?.role;
    const isRedactor = role === "REDACTOR" || role === "ADMIN";

    const editions = await prisma.newsletterEdition.findMany({
      where: isRedactor ? {} : { sentAt: { not: null } },
      orderBy: { number: "desc" },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ editions });
  } catch (error) {
    console.error("GET /api/newsletter error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
