import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/*  POST /api/join-request                                             */
/*  Body: { name, email, type: "professional"|"professor", message? }  */
/*  Alta de profesionales/profesores: NO crean cuenta — dejan sus datos*/
/*  y la asociación les contacta para darles correo institucional.     */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TYPES = ["professional", "professor"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const type = typeof body.type === "string" ? body.type : "";
    const message =
      typeof body.message === "string" && body.message.trim().length > 0
        ? body.message.trim()
        : null;

    if (!name) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Email no válido" }, { status: 400 });
    }
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Tipo no válido" }, { status: 400 });
    }

    await prisma.joinRequest.create({
      data: { name, email, type, message },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/join-request error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
