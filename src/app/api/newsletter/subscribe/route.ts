import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/*  POST /api/newsletter/subscribe                                     */
/*  Body: { email }                                                    */
/*  Público — alta en El Semanal sin necesidad de cuenta.              */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Email no válido" }, { status: 400 });
    }

    // Upsert: si existía dado de baja, lo reactiva
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email, source: "public" },
      update: { active: true },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/newsletter/subscribe error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
