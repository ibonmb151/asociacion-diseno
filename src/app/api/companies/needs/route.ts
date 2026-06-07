import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";

/* ------------------------------------------------------------------ */
/*  GET /api/companies/needs                                           */
/*  Query params:                                                      */
/*    - skill  : filtrar por skill específico                          */
/*    - status : filtrar por estado (default: "open")                  */
/* ------------------------------------------------------------------ */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get("skill");
    const status = searchParams.get("status") ?? "open";

    const where: Record<string, unknown> = {
      status,
    };

    if (skill && skill.trim().length > 0) {
      where.skills = { has: skill.trim() };
    }

    const needs = await prisma.companyNeed.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            sector: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ needs });
  } catch (error) {
    console.error("GET /api/companies/needs error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/*  POST /api/companies/needs                                          */
/*  Body: { title, description, skills, status }                      */
/*  Auth: Requiere rol COMPANY                                         */
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

    if ((session.user as { role?: string }).role !== "COMPANY") {
      return NextResponse.json(
        { error: "Solo las empresas pueden publicar necesidades" },
        { status: 403 },
      );
    }

    // Find the Company record associated with this user
    const company = await prisma.company.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    });

    if (!company) {
      return NextResponse.json(
        { error: "No se encontró un perfil de empresa asociado a esta cuenta" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { title, description, skills, status } = body;

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

    const need = await prisma.companyNeed.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        skills: Array.isArray(skills) ? skills : [],
        status: typeof status === "string" ? status : "open",
        companyId: company.id,
      },
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

    return NextResponse.json({ need }, { status: 201 });
  } catch (error) {
    console.error("POST /api/companies/needs error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
