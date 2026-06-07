import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/* ------------------------------------------------------------------ */
/*  PATCH /api/contact/[id]                                            */
/*  Body: { status: "accepted" | "rejected" }                         */
/*  Auth: Solo la empresa destinataria puede cambiar el estado         */
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
        { error: "Solo las empresas pueden gestionar solicitudes de contacto" },
        { status: 403 },
      );
    }

    const { id } = await params;

    // Find the company associated with this user
    const company = await prisma.company.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    });

    if (!company) {
      return NextResponse.json(
        { error: "No se encontró un perfil de empresa asociado" },
        { status: 404 },
      );
    }

    // Fetch the contact request
    const contactRequest = await prisma.contactRequest.findUnique({
      where: { id },
      select: { companyId: true, status: true },
    });

    if (!contactRequest) {
      return NextResponse.json(
        { error: "Solicitud de contacto no encontrada" },
        { status: 404 },
      );
    }

    // Verify this request belongs to the company
    if (contactRequest.companyId !== company.id) {
      return NextResponse.json(
        { error: "No tienes permisos para gestionar esta solicitud" },
        { status: 403 },
      );
    }

    // Cannot modify already resolved requests
    if (contactRequest.status !== "pending") {
      return NextResponse.json(
        { error: "Esta solicitud ya ha sido procesada" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { status: newStatus } = body;

    if (!newStatus || !["accepted", "rejected"].includes(newStatus)) {
      return NextResponse.json(
        { error: "El estado debe ser 'accepted' o 'rejected'" },
        { status: 400 },
      );
    }

    const updated = await prisma.contactRequest.update({
      where: { id },
      data: { status: newStatus },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    return NextResponse.json({ contactRequest: updated });
  } catch (error) {
    console.error("PATCH /api/contact/[id] error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
