"use server"

import { signIn } from "@/auth/auth"

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const callbackUrl = (formData.get("callbackUrl") as string) ?? "/dashboard"

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    })
  } catch (error) {
    if ((error as any)?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error
    }
    return "CredentialsSignin"
  }

  return null
}
