"use server"

import { signIn } from "@/auth/auth"

export async function loginAction(prevState: unknown, formData: FormData) {
  try {
    await signIn("credentials", formData)
  } catch (error) {
    if ((error as any)?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error
    }
    return "CredentialsSignin"
  }

  return null
}
