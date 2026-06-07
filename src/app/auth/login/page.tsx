"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Loader2 } from "lucide-react"

function LoginForm() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get("error")
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"

  const [csrfToken, setCsrfToken] = useState("")
  const [csrfLoaded, setCsrfLoaded] = useState(false)

  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((res) => res.json())
      .then((data) => {
        setCsrfToken(data.csrfToken ?? "")
        setCsrfLoaded(true)
      })
      .catch(() => setCsrfLoaded(true))
  }, [])

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (errorParam === "CredentialsSignin") {
      setError("Credenciales inválidas. Verifica tu email y contraseña.")
    } else if (errorParam === "OAuthAccountNotLinked") {
      setError(
        "Este email ya está registrado con otro método de inicio de sesión.",
      )
    } else if (errorParam) {
      setError("Ocurrió un error al iniciar sesión. Intenta de nuevo.")
    }
  }, [errorParam])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-heading text-xl font-semibold text-fg"
          >
            <span>Asociación de Diseño</span>
          </Link>
          <h2 className="mt-6 font-heading text-3xl font-medium tracking-tight text-fg">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-muted">
            Accede a tu cuenta para continuar
          </p>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-surface p-8">
          {error && (
            <div className="mb-6 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          {!csrfLoaded && (
            <div className="mb-6 flex items-center justify-center gap-2 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando...
            </div>
          )}

          <form
            action="/api/auth/login"
            method="POST"
            className="space-y-5"
          >
            <input type="hidden" name="csrfToken" value={csrfToken} />
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
              disabled={!csrfLoaded}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-medium text-surface hover:bg-accent-hover disabled:opacity-70"
            >
              {!csrfLoaded ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface px-4 text-muted">
                O continúa con email
              </span>
            </div>
          </div>

          <form action="/api/auth/signin/google" method="POST">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-md border border-border bg-surface px-4 py-3 text-sm font-medium text-fg hover:bg-primary-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Iniciar sesión con Google
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          ¿No tienes cuenta?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-accent hover:text-accent-hover"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-bg">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
