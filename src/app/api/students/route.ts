import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/*  GET /api/students                                                  */
/*  Query params:                                                      */
/*    - q       : búsqueda por nombre o skill                          */
/*    - course  : filtrar por curso                                    */
/*    - skill   : filtrar por skill específico                         */
/* ------------------------------------------------------------------ */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const course = searchParams.get("course");
    const skill = searchParams.get("skill");

    // Build the Prisma where clause dynamically
    const where: Record<string, unknown> = {
      role: "STUDENT",
    };

    // General search (name, bio)
    if (q && q.trim().length > 0) {
      const query = q.trim();
      const skillTerms = query.split(/\s+/).filter(Boolean);

      const orConditions: Record<string, unknown>[] = [
        { name: { contains: query, mode: "insensitive" } },
        { bio: { contains: query, mode: "insensitive" } },
      ];

      // Search in studentProfile skills
      if (skillTerms.length === 1) {
        orConditions.push({
          studentProfile: { skills: { has: skillTerms[0] } },
        });
      } else if (skillTerms.length > 1) {
        orConditions.push({
          studentProfile: { skills: { hasSome: skillTerms } },
        });
      }

      where.OR = orConditions;
    }

    // Specific course filter (in studentProfile)
    if (course && course.trim().length > 0) {
      where.studentProfile = {
        ...(where.studentProfile as Record<string, unknown> || {}),
        course: { contains: course.trim(), mode: "insensitive" },
      };
    }

    const students = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        studentProfile: {
          select: {
            skills: true,
            course: true,
            linkedin: true,
            website: true,
          },
        },
        _count: {
          select: {
            projects: {
              where: { visible: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("GET /api/students error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
