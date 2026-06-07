import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"
import { prisma } from "@/lib/prisma"

const secretKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard"

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email y contraseña requeridos" },
      { status: 400 },
    )
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !user.password) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=CredentialsSignin`, req.url),
    )
  }

  const isValid = await bcrypt.compare(password, user.password!)

  if (!isValid) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=CredentialsSignin`, req.url),
    )
  }

  const token = await new SignJWT({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey)

  const useSecureCookies =
    req.url?.startsWith("https://") ||
    req.headers.get("x-forwarded-proto") === "https"

  const prefix = useSecureCookies ? "__Secure-" : ""
  const cookieName = `${prefix}next-auth.session-token`

  const response = NextResponse.redirect(new URL(callbackUrl, req.url))
  response.cookies.set(cookieName, token, {
    httpOnly: true,
    secure: useSecureCookies,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  })
  response.cookies.set("next-auth.callback-url", callbackUrl, {
    httpOnly: true,
    secure: useSecureCookies,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  })

  return response
}
