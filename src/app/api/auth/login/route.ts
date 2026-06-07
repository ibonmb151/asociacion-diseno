import { NextRequest } from "next/server"
import { redirect } from "next/navigation"
import { signIn } from "@/auth/auth"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const callbackUrl = (formData.get("callbackUrl") as string) ?? "/dashboard"

  if (!email || !password) {
    redirect("/auth/login?error=CredentialsSignin")
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      redirect("/auth/login?error=CredentialsSignin")
    }

    redirect(callbackUrl)
  } catch (error) {
    if ((error as any)?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error
    }
    redirect("/auth/login?error=CredentialsSignin")
  }
}
