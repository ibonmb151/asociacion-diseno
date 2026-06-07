import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";

/* ------------------------------------------------------------------ */
/*  GET /api/projects                                                  */
/*  Query params:                                                      */
/*    - userId   : filtrar por usuario (para el portfolio propio)      */
/*    - all      : si "true", devuelve todos los proyectos visibles    */
/* ------------------------------------------------------------------ */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const all = searchParams.get("all") === "true";

    const session = await auth();

    // If a specific userId is requested, validate it's the user's own or public
    if (userId) {
      // If not authenticated or not the same user, only return visible projects
      if (!session?.user || session.user.id !== userId) {
        const projects = await prisma.project.findMany({
          where: {
            userId: userId,
            visible: true,
          },
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ projects });
      }

      // Authenticated as the same user — return all their projects
      const projects = await prisma.project.findMany({
        where: { userId: userId },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ projects });
    }

    // `?all=true` — public projects feed
    if (all) {
      const projects = await prisma.project.findMany({
        where: { visible: true },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ projects });
    }

    // Default: if authenticated, return own projects
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 },
      );
    }

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/*  POST /api/projects                                                 */
/*  Body: { title, description, tags, category, visible }              */
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
    const { title, description, tags, category, visible } = body;

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

    if (!category || typeof category !== "string") {
      return NextResponse.json(
        { error: "La categoría es obligatoria" },
        { status: 400 },
      );
    }

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        tags: Array.isArray(tags) ? tags : [],
        category,
        visible: typeof visible === "boolean" ? visible : true,
        userId: session.user.id,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
