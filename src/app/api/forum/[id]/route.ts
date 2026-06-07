import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/* ------------------------------------------------------------------ */
/*  GET /api/forum/[id]                                                */
/* ------------------------------------------------------------------ */

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const post = await prisma.forumPost.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("GET /api/forum/[id] error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/forum/[id]                                             */
/*  Solo el autor del post puede eliminarlo                            */
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

    // Fetch post to check ownership
    const existing = await prisma.forumPost.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Post no encontrado" },
        { status: 404 },
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "No tienes permisos para eliminar este post" },
        { status: 403 },
      );
    }

    await prisma.forumPost.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Post eliminado correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/forum/[id] error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
