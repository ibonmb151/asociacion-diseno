"use client"

import { useState, useEffect } from "react"
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"

interface Props {
  callbackUrl: string
}

export function LoginForm({ callbackUrl }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [csrfToken, setCsrfToken] = useState("")

  useEffect(() => {
    fetch("/api/auth/csrf")
      .then(r => r.json())
      .then(data => setCsrfToken(data.csrfToken ?? ""))
      .catch(() => {})
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Native form POST — always works, follows redirects, sets cookies
    const form = document.createElement("form")
    form.method = "POST"
    form.action = `/api/auth/callback/credentials`
    form.style.display = "none"

    const fields = { csrfToken, email, password, callbackUrl }
    for (const [name, value] of Object.entries(fields)) {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = name
      input.value = value
      form.appendChild(input)
    }

    document.body.appendChild(form)
    form.submit()
    // Page will navigate away — no need to reset loading state
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="mb-4 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

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
            value={email}
            onChange={e => setEmail(e.target.value)}
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
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="block w-full rounded-md border border-border bg-surface py-3 pl-10 pr-10 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-fg"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-medium text-surface hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          "Iniciar Sesión"
        )}
      </button>
    </form>
  )
}
