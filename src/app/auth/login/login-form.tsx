"use client"

import { useActionState } from "react"
import { Mail, Lock, Loader2 } from "lucide-react"
import { loginAction } from "./actions"

interface Props {
  callbackUrl: string
  urlError: string | null
}

export function LoginForm({ callbackUrl, urlError }: Props) {
  const [actionError, formAction, isPending] = useActionState(loginAction, null)

  const error = actionError ?? urlError

  const displayError =
    error === "CredentialsSignin"
      ? "Credenciales inválidas. Verifica tu email y contraseña."
      : error === "OAuthAccountNotLinked"
        ? "Este email ya está registrado con otro método de inicio de sesión."
      : error
        ? "Ocurrió un error al iniciar sesión. Intenta de nuevo."
        : null

  return (
    <>
      {displayError && (
        <div className="mb-6 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger">
          {displayError}
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-fg">
            Email
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-muted" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="tu@email.com"
              className="block w-full rounded-md border border-border bg-surface py-3 pl-10 pr-3 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-fg">
            Contraseña
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-muted" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="block w-full rounded-md border border-border bg-surface py-3 pl-10 pr-3 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-medium text-surface hover:bg-accent-hover disabled:opacity-70"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>
    </>
  )
}
