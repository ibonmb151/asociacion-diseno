import { NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const callbackUrl = (formData.get("callbackUrl") as string) ?? "/dashboard"

  if (!email || !password) {
    return NextResponse.redirect(
      new URL("/auth/login?error=CredentialsSignin", req.url),
    )
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user?.password) {
    return NextResponse.redirect(
      new URL("/auth/login?error=CredentialsSignin", req.url),
    )
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return NextResponse.redirect(
      new URL("/auth/login?error=CredentialsSignin", req.url),
    )
  }

  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    return NextResponse.redirect(
      new URL("/auth/login?error=CredentialsSignin", req.url),
    )
  }

  const now = Math.floor(Date.now() / 1000)
  const encodedSecret = new TextEncoder().encode(secret)

  const token = await new SignJWT({
    name: user.name,
    email: user.email,
    picture: user.image,
    sub: user.id,
    id: user.id,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime("30d")
    .setJti(crypto.randomUUID())
    .sign(encodedSecret)

  const response = NextResponse.redirect(new URL(callbackUrl, req.url))
  const isSecure = req.url.startsWith("https")

  response.cookies.set("next-auth.session-token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isSecure,
    maxAge: 30 * 24 * 60 * 60,
  })

  return response
}
