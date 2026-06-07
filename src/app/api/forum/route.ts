import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";

/* ------------------------------------------------------------------ */
/*  GET /api/forum                                                     */
/*  Query params:                                                      */
/*    - category : filtrar por categoría                               */
/*    - q        : búsqueda por título                                 */
/*  Returns: posts ordenados: pinned primero, luego por fecha descend. */
/* ------------------------------------------------------------------ */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    // Build Prisma where clause
    const where: Record<string, unknown> = {};

    if (category && category.trim().length > 0) {
      where.category = category.trim();
    }

    if (q && q.trim().length > 0) {
      where.title = { contains: q.trim(), mode: "insensitive" };
    }

    const posts = await prisma.forumPost.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: [
        { pinned: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("GET /api/forum error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/*  POST /api/forum                                                    */
/*  Body: { title, content, category }                                 */
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
    const { title, content, category } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "El título es obligatorio" },
        { status: 400 },
      );
    }

    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "El contenido es obligatorio" },
        { status: 400 },
      );
    }

    const validCategories = ["Discussion", "Feedback", "Resources", "General"];
    const finalCategory =
      category && validCategories.includes(category) ? category : "General";

    const post = await prisma.forumPost.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: finalCategory,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("POST /api/forum error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
