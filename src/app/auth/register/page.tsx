"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  GraduationCap,
  Building2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Home,
  FileText,
  Briefcase,
} from "lucide-react";

type UserType = "student" | "company";

const inputBase =
  "block w-full rounded-md border border-border bg-surface py-3 pl-10 pr-3 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [userType, setUserType] = useState<UserType>(
    typeParam === "company" ? "company" : "student",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");

  useEffect(() => {
    if (typeParam === "company") setUserType("company");
    else if (typeParam === "student") setUserType("student");
  }, [typeParam]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const isStudent = userType === "student";
    const name = isStudent ? studentName : companyName;
    const email = isStudent ? studentEmail : companyEmail;
    const password = isStudent ? studentPassword : companyPassword;
    const description = isStudent ? undefined : companyDescription;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: isStudent ? "STUDENT" : "COMPANY",
          ...(description ? { description } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al registrarse. Intenta de nuevo.");
        setIsLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        router.push("/auth/login");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setIsLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-heading text-xl font-semibold text-fg"
          >
            <Home className="h-5 w-5 text-accent" />
            <span>Asociación de Diseño</span>
          </Link>
          <h2 className="mt-6 font-heading text-3xl font-medium tracking-tight text-fg">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-muted">
            Únete a la comunidad de diseño más grande
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 rounded-lg border border-border bg-surface p-8">
          {error && (
            <div className="mb-6 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          {/* User Type Tabs */}
          <div className="mb-8 grid grid-cols-2 gap-2 rounded-md bg-primary-50 p-1">
            <button
              type="button"
              onClick={() => setUserType("student")}
              className={`flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                userType === "student"
                  ? "bg-surface text-fg shadow-sm"
                  : "text-muted hover:text-fg"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Soy Estudiante
            </button>
            <button
              type="button"
              onClick={() => setUserType("company")}
              className={`flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                userType === "company"
                  ? "bg-surface text-fg shadow-sm"
                  : "text-muted hover:text-fg"
              }`}
            >
              <Building2 className="h-4 w-4" />
              Soy Empresa
            </button>
          </div>

          {/* Google Register */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-border bg-surface px-4 py-3 text-sm font-medium text-fg transition-all hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Registrarse con Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface px-4 text-muted">
                O regístrate con email
              </span>
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {userType === "student" && (
              <>
                <div>
                  <label htmlFor="studentName" className="block text-sm font-medium text-fg">
                    Nombre Completo
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-muted" />
                    </div>
                    <input
                      id="studentName" type="text" required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="María García López"
                      className={inputBase}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="studentEmail" className="block text-sm font-medium text-fg">
                    Email
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-muted" />
                    </div>
                    <input
                      id="studentEmail" type="email" autoComplete="email" required
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="maria@email.com"
                      className={inputBase}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="studentPassword" className="block text-sm font-medium text-fg">
                    Contraseña
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-muted" />
                    </div>
                    <input
                      id="studentPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password" required minLength={6}
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
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

                <div className="rounded-md bg-primary-50 p-4">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="mt-0.5 h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-sm font-medium text-fg">
                        Beneficios para estudiantes
                      </p>
                      <ul className="mt-1 space-y-1 text-xs text-muted">
                        <li>Crea tu portfolio profesional</li>
                        <li>Participa en el foro y networking</li>
                        <li>Recibe ofertas de empresas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            {userType === "company" && (
              <>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-fg">
                    Nombre de la Empresa
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Building2 className="h-5 w-5 text-muted" />
                    </div>
                    <input
                      id="companyName" type="text" required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Nombre de tu empresa"
                      className={inputBase}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="companyEmail" className="block text-sm font-medium text-fg">
                    Email Corporativo
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-muted" />
                    </div>
                    <input
                      id="companyEmail" type="email" autoComplete="email" required
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      placeholder="empresa@correo.com"
                      className={inputBase}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="companyPassword" className="block text-sm font-medium text-fg">
                    Contraseña
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-muted" />
                    </div>
                    <input
                      id="companyPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password" required minLength={6}
                      value={companyPassword}
                      onChange={(e) => setCompanyPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
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

                <div>
                  <label htmlFor="companyDescription" className="block text-sm font-medium text-fg">
                    Descripción <span className="text-muted">(opcional)</span>
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute top-3 left-0 flex items-start pl-3">
                      <FileText className="h-5 w-5 text-muted" />
                    </div>
                    <textarea
                      id="companyDescription" rows={3}
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      placeholder="Cuéntanos a qué se dedica tu empresa..."
                      className="block w-full rounded-md border border-border bg-surface py-3 pl-10 pr-3 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                    />
                  </div>
                </div>

                <div className="rounded-md bg-primary-50 p-4">
                  <div className="flex items-start gap-3">
                    <Briefcase className="mt-0.5 h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-sm font-medium text-fg">
                        Beneficios para empresas
                      </p>
                      <ul className="mt-1 space-y-1 text-xs text-muted">
                        <li>Publica necesidades y proyectos</li>
                        <li>Encuentra talento de diseño</li>
                        <li>Conecta con estudiantes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-medium text-surface transition-all hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="font-medium text-accent hover:text-accent-hover">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
