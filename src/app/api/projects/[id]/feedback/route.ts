import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth/auth"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const feedback = await prisma.feedback.findMany({
    where: { projectId: id },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(feedback)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { rating, comment } = await req.json()
  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
  }

  // Check project exists
  const project = await prisma.project.findUnique({ where: { id } })
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  // Don't allow self-feedback
  if (project.userId === session.user.id) {
    return NextResponse.json({ error: "Cannot rate your own project" }, { status: 400 })
  }

  // Check existing feedback
  const existing = await prisma.feedback.findUnique({
    where: { projectId_userId: { projectId: id, userId: session.user.id } },
  })
  if (existing) {
    return NextResponse.json({ error: "You already rated this project" }, { status: 409 })
  }

  const feedback = await prisma.feedback.create({
    data: {
      projectId: id,
      userId: session.user.id,
      rating,
      comment,
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  })

  return NextResponse.json(feedback, { status: 201 })
}
