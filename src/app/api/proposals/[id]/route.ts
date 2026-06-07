import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/* ------------------------------------------------------------------ */
/*  GET /api/proposals/[id]                                            */
/* ------------------------------------------------------------------ */

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const proposal = await prisma.proposal.findUnique({
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

    if (!proposal) {
      return NextResponse.json(
        { error: "Propuesta no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({ proposal });
  } catch (error) {
    console.error("GET /api/proposals/[id] error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/*  PATCH /api/proposals/[id]                                          */
/*  Body: { title?, description?, category?, status?, tags? }          */
/*  Solo el autor puede modificar                                      */
/* ------------------------------------------------------------------ */

export async function PATCH(
  request: NextRequest,
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

    // Fetch proposal to check ownership
    const existing = await prisma.proposal.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Propuesta no encontrada" },
        { status: 404 },
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "No tienes permisos para modificar esta propuesta" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { title, description, category, status, tags } = body;

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
      if (
        typeof description !== "string" ||
        description.trim().length === 0
      ) {
        return NextResponse.json(
          { error: "La descripción no puede estar vacía" },
          { status: 400 },
        );
      }
      updateData.description = description.trim();
    }

    if (category !== undefined) {
      const validCategories = [
        "Collaboration",
        "Project Idea",
        "Event",
        "General",
      ];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: "Categoría inválida" },
          { status: 400 },
        );
      }
      updateData.category = category;
    }

    if (status !== undefined) {
      const validStatuses = ["open", "in_progress", "completed", "closed"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: "Estado inválido" },
          { status: 400 },
        );
      }
      updateData.status = status;
    }

    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags) ? tags : [];
    }

    const proposal = await prisma.proposal.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ proposal });
  } catch (error) {
    console.error("PATCH /api/proposals/[id] error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/proposals/[id]                                         */
/*  Solo el autor puede eliminar                                       */
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

    // Fetch proposal to check ownership
    const existing = await prisma.proposal.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Propuesta no encontrada" },
        { status: 404 },
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "No tienes permisos para eliminar esta propuesta" },
        { status: 403 },
      );
    }

    await prisma.proposal.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Propuesta eliminada correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/proposals/[id] error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
