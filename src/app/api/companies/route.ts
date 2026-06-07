import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/*  GET /api/companies                                                 */
/*  Query params:                                                      */
/*    - q    : búsqueda por nombre o sector                            */
/*    - id   : empresa específica con sus necesidades                  */
/* ------------------------------------------------------------------ */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const id = searchParams.get("id");

    // ── Single company by id ──────────────────────────────────────
    if (id && id.trim().length > 0) {
      const company = await prisma.company.findUnique({
        where: { id: id.trim() },
        include: {
          needs: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!company) {
        return NextResponse.json(
          { error: "Empresa no encontrada" },
          { status: 404 },
        );
      }

      return NextResponse.json({ company });
    }

    // ── List companies with optional search ──────────────────────
    const where: Record<string, unknown> = {};

    if (q && q.trim().length > 0) {
      const query = q.trim();
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
        isVerified: true,
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

    return NextResponse.json({ companies });
  } catch (error) {
    console.error("GET /api/companies error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
