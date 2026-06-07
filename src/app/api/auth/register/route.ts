import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, type, companyName, description } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    if (type === "company") {
      // Create company account
      if (!companyName) {
        return NextResponse.json(
          { error: "Company name is required" },
          { status: 400 }
        );
      }

      const company = await prisma.company.create({
        data: {
          name: companyName,
          email,
          password: hashedPassword,
          description: description || "",
        },
      });

      // Also create a user entry for the company (for auth session)
      const user = await prisma.user.create({
        data: {
          name: companyName,
          email,
          password: hashedPassword,
          role: "COMPANY",
        },
      });

      return NextResponse.json(
        {
          message: "Company registered successfully",
          user: { id: user.id, email: user.email, name: user.name },
        },
        { status: 201 }
      );
    }

    // Create student account
    const user = await prisma.user.create({
      data: {
        name: name || "",
        email,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    // Create student profile
    await prisma.studentProfile.create({
      data: {
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
