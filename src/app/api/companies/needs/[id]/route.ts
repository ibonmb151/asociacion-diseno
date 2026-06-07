import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/* ------------------------------------------------------------------ */
/*  GET /api/companies/needs/[id]                                      */
/* ------------------------------------------------------------------ */

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const need = await prisma.companyNeed.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            sector: true,
            location: true,
            website: true,
            description: true,
          },
        },
      },
    });

    if (!need) {
      return NextResponse.json(
        { error: "Necesidad no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({ need });
  } catch (error) {
    console.error("GET /api/companies/needs/[id] error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/*  PATCH /api/companies/needs/[id]                                    */
/*  Body: { title?, description?, skills?, status? }                  */
/*  Auth: Solo la empresa propietaria                                 */
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

    if ((session.user as { role?: string }).role !== "COMPANY") {
      return NextResponse.json(
        { error: "Solo las empresas pueden modificar necesidades" },
        { status: 403 },
      );
    }

    const { id } = await params;

    // Fetch the need to check ownership
    const existing = await prisma.companyNeed.findUnique({
      where: { id },
      select: {
        companyId: true,
        company: { select: { email: true } },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Necesidad no encontrada" },
        { status: 404 },
      );
    }

    // Verify the company owns this need via email match
    if (existing.company.email !== session.user.email) {
      return NextResponse.json(
        { error: "No tienes permisos para modificar esta necesidad" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { title, description, skills, status } = body;

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

    if (skills !== undefined) {
      updateData.skills = Array.isArray(skills) ? skills : [];
    }

    if (status !== undefined) {
      const validStatuses = ["open", "interviewing", "filled", "closed"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: "Estado inválido. Valores válidos: " + validStatuses.join(", ") },
          { status: 400 },
        );
      }
      updateData.status = status;
    }

    const need = await prisma.companyNeed.update({
      where: { id },
      data: updateData,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            sector: true,
          },
        },
      },
    });

    return NextResponse.json({ need });
  } catch (error) {
    console.error("PATCH /api/companies/needs/[id] error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/companies/needs/[id]                                   */
/*  Auth: Solo la empresa propietaria                                 */
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

    if ((session.user as { role?: string }).role !== "COMPANY") {
      return NextResponse.json(
        { error: "Solo las empresas pueden eliminar necesidades" },
        { status: 403 },
      );
    }

    const { id } = await params;

    // Fetch the need to check ownership
    const existing = await prisma.companyNeed.findUnique({
      where: { id },
      select: {
        companyId: true,
        company: { select: { email: true } },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Necesidad no encontrada" },
        { status: 404 },
      );
    }

    // Verify the company owns this need via email match
    if (existing.company.email !== session.user.email) {
      return NextResponse.json(
        { error: "No tienes permisos para eliminar esta necesidad" },
        { status: 403 },
      );
    }

    await prisma.companyNeed.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Necesidad eliminada correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/companies/needs/[id] error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
