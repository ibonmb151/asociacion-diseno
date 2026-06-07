import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const role = (session.user as { role?: string }).role

    if (role === "STUDENT") {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          image: true,
          studentProfile: {
            select: {
              course: true,
              skills: true,
              linkedin: true,
              website: true,
            },
          },
        },
      })
      return NextResponse.json(user)
    }

    if (role === "COMPANY") {
      const company = await prisma.company.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          description: true,
          sector: true,
          location: true,
          website: true,
          logo: true,
        },
      })
      return NextResponse.json(company)
    }

    return NextResponse.json({ error: "Rol no soportado" }, { status: 400 })
  } catch (error) {
    console.error("GET /api/profile error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const role = (session.user as { role?: string }).role

    if (role === "STUDENT") {
      const { name, bio, course, skills, linkedin, website } = body

      const userData: Record<string, unknown> = {}
      if (name !== undefined) userData.name = name
      if (bio !== undefined) userData.bio = bio

      if (Object.keys(userData).length > 0) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: userData,
        })
      }

      const studentData: Record<string, unknown> = {}
      if (course !== undefined) studentData.course = course
      if (skills !== undefined) studentData.skills = skills
      if (linkedin !== undefined) studentData.linkedin = linkedin
      if (website !== undefined) studentData.website = website

      if (Object.keys(studentData).length > 0) {
        await prisma.studentProfile.upsert({
          where: { userId: session.user.id },
          create: { userId: session.user.id, ...studentData } as any,
          update: studentData,
        })
      }

      return NextResponse.json({ success: true })
    }

    if (role === "COMPANY") {
      const { name, description, sector, location, website, logo } = body

      const companyData: Record<string, unknown> = {}
      if (name !== undefined) companyData.name = name
      if (description !== undefined) companyData.description = description
      if (sector !== undefined) companyData.sector = sector
      if (location !== undefined) companyData.location = location
      if (website !== undefined) companyData.website = website
      if (logo !== undefined) companyData.logo = logo

      if (Object.keys(companyData).length > 0) {
        await prisma.company.update({
          where: { id: session.user.id },
          data: companyData,
        })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Rol no soportado" }, { status: 400 })
  } catch (error) {
    console.error("PATCH /api/profile error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
