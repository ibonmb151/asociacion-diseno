import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/* ------------------------------------------------------------------ */
/*  GET /api/projects/[id]                                             */
/* ------------------------------------------------------------------ */

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
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

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/*  PATCH /api/projects/[id]                                           */
/*  Body: { title?, description?, tags?, category?, visible? }         */
/* ------------------------------------------------------------------ */

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 },
      );
    }

    const { id } = await params;

    // Fetch project to check ownership
    const existing = await prisma.project.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 },
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "No tienes permisos para modificar este proyecto" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { title, description, tags, category, visible } = body;

    // Build update payload (only include provided fields)
    const updateData: Record<string, unknown> = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return NextResponse.json(
          { error: "El título no puede estar vacío" },
          { status: 400 },
        );
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || description.trim().length === 0) {
        return NextResponse.json(
          { error: "La descripción no puede estar vacía" },
          { status: 400 },
        );
      }
      updateData.description = description.trim();
    }

    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags) ? tags : [];
    }

    if (category !== undefined) {
      if (typeof category !== "string") {
        return NextResponse.json(
          { error: "Categoría inválida" },
          { status: 400 },
        );
      }
      updateData.category = category;
    }

    if (visible !== undefined) {
      updateData.visible = Boolean(visible);
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error("PATCH /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/projects/[id]                                          */
/* ------------------------------------------------------------------ */

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams,
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 },
      );
    }

    const { id } = await params;

    // Fetch project to check ownership
    const existing = await prisma.project.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 },
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "No tienes permisos para eliminar este proyecto" },
        { status: 403 },
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Proyecto eliminado correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
