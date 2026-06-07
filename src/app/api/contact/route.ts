import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";

/* ------------------------------------------------------------------ */
/*  POST /api/contact                                                  */
/*  Body: { companyId, message }                                       */
/*  Auth: Requiere rol STUDENT                                         */
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

    if ((session.user as { role?: string }).role !== "STUDENT") {
      return NextResponse.json(
        { error: "Solo los estudiantes pueden enviar solicitudes de contacto" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { companyId, message } = body;

    // Validation
    if (!companyId || typeof companyId !== "string") {
      return NextResponse.json(
        { error: "El ID de la empresa es obligatorio" },
        { status: 400 },
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "El mensaje es obligatorio" },
        { status: 400 },
      );
    }

    // Verify the company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, name: true },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Empresa no encontrada" },
        { status: 404 },
      );
    }

    // Check if there's already a pending request from this student to this company
    const existing = await prisma.contactRequest.findFirst({
      where: {
        companyId,
        studentId: session.user.id,
        status: "pending",
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya tienes una solicitud pendiente con esta empresa" },
        { status: 409 },
      );
    }

    const contactRequest = await prisma.contactRequest.create({
      data: {
        companyId,
        studentId: session.user.id,
        message: message.trim(),
        status: "pending",
      },
      include: {
        company: {
          select: { id: true, name: true, logo: true },
        },
        student: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json({ contactRequest }, { status: 201 });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/*  GET /api/contact                                                   */
/*  Devuelve las solicitudes de contacto del usuario logueado:         */
/*    - Si es STUDENT:  solicitudes que ha enviado                     */
/*    - Si es COMPANY:  solicitudes recibidas (por su empresa)         */
/* ------------------------------------------------------------------ */

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 },
      );
    }

    const role = (session.user as { role?: string }).role;

    if (role === "STUDENT") {
      // Student: requests they sent
      const requests = await prisma.contactRequest.findMany({
        where: { studentId: session.user.id },
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
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ contactRequests: requests });
    }

    if (role === "COMPANY") {
      // Company: requests received, find company by email
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

      const requests = await prisma.contactRequest.findMany({
        where: { companyId: company.id },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              image: true,
              bio: true,
              studentProfile: {
                select: {
                  skills: true,
                  course: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ contactRequests: requests });
    }

    return NextResponse.json(
      { error: "Rol de usuario no válido" },
      { status: 403 },
    );
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
