import { NextRequest, NextResponse } from "next/server"
import { signIn } from "@/auth/auth"

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

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=${result.error}`, req.url),
      )
    }

    return NextResponse.redirect(new URL(callbackUrl, req.url))
  } catch {
    return NextResponse.redirect(
      new URL("/auth/login?error=CredentialsSignin", req.url),
    )
  }
}
