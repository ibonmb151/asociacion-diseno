import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";

/* ------------------------------------------------------------------ */
/*  GET /api/proposals                                                 */
/*  Query params:                                                      */
/*    - category : filtrar por categoría                               */
/*    - status   : filtrar por estado (open, in_progress, completed,   */
/*                 closed)                                             */
/*    - q        : búsqueda por título o descripción                   */
/* ------------------------------------------------------------------ */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    // Build Prisma where clause dynamically
    const where: Record<string, unknown> = {};

    if (category && category.trim().length > 0) {
      where.category = category.trim();
    }

    if (status && status.trim().length > 0) {
      where.status = status.trim();
    }

    if (q && q.trim().length > 0) {
      const query = q.trim();
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    const proposals = await prisma.proposal.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ proposals });
  } catch (error) {
    console.error("GET /api/proposals error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/*  POST /api/proposals                                                */
/*  Body: { title, description, category, tags }                       */
/*  Requiere autenticación                                             */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { title, description, category, tags } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "El título es obligatorio" },
        { status: 400 },
      );
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "La descripción es obligatoria" },
        { status: 400 },
      );
    }

    const validCategories = [
      "Collaboration",
      "Project Idea",
      "Event",
      "General",
    ];
    const finalCategory =
      category && validCategories.includes(category) ? category : "General";

    const proposal = await prisma.proposal.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category: finalCategory,
        tags: Array.isArray(tags) ? tags : [],
        userId: session.user.id,
        status: "open",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ proposal }, { status: 201 });
  } catch (error) {
    console.error("POST /api/proposals error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
