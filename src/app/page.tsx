import Link from "next/link";
import {
  Sparkles,
  Briefcase,
  MessageCircle,
  Building2,
  FileText,
  ArrowRight,
  Users,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary-800">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-400/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-300/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200/30 bg-primary-300/10 px-4 py-1.5 text-sm text-primary-100">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span>La comunidad de diseño más grande del país</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Design{" "}
              <span className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
                Association
              </span>{" "}
              Hub
            </h1>

            <p className="mt-6 text-lg leading-8 text-primary-100 sm:text-xl">
              La plataforma que conecta a estudiantes de diseño con las mejores
              empresas. Crea tu portfolio, participa en debates, y encuentra las
              oportunidades que impulsarán tu carrera.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/register?type=student"
                className="inline-flex items-center gap-2 rounded-xl bg-secondary px-8 py-3.5 text-base font-semibold text-primary-dark shadow-lg shadow-secondary/25 transition-all hover:bg-secondary-light hover:shadow-xl hover:shadow-secondary/30 active:scale-[0.98]"
              >
                <GraduationCap className="h-5 w-5" />
                Empieza como Estudiante
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/auth/register?type=company"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98]"
              >
                <Building2 className="h-5 w-5" />
                Registra tu Empresa
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-primary-200">
              <span className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-success" />
                1000+ estudiantes
              </span>
              <span className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                200+ empresas
              </span>
              <span className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-200" />
                Gratuito
              </span>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold text-secondary">
              Funcionalidades
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Todo lo que necesitas en un solo lugar
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              Tanto si eres estudiante buscando oportunidades como empresa en
              busca de talento, nuestra plataforma tiene todo lo que necesitas.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1: Portfolio Showcase */}
            <div className="group relative rounded-2xl border border-primary-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:shadow-primary-100/50">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-primary">
                Portfolio Showcase
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Crea un portfolio profesional con tus mejores proyectos.
                Comparte tu trabajo con empresas y recibe feedback de la
                comunidad.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-secondary">
                <span>Explorar portfolios</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            {/* Feature 2: Forum & Community */}
            <div className="group relative rounded-2xl border border-primary-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:shadow-primary-100/50">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-primary">
                Foro y Comunidad
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Participa en debates, comparte conocimientos, resuelve dudas y
                conecta con otros diseñadores y profesionales del sector.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-secondary">
                <span>Ir al foro</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            {/* Feature 3: Company Networking */}
            <div className="group relative rounded-2xl border border-primary-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:shadow-primary-100/50">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-primary">
                Company Networking
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Conecta con empresas que buscan talento de diseño. Recibe
                ofertas, colabora en proyectos reales y construye tu red
                profesional.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-secondary">
                <span>Ver empresas</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            {/* Feature 4: Proposals */}
            <div className="group relative rounded-2xl border border-primary-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:shadow-primary-100/50">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-primary">
                Propuestas y Proyectos
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Las empresas publican necesidades y los estudiantes presentan
                sus propuestas. Colabora en proyectos reales y gana
                experiencia.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-secondary">
                <span>Ver propuestas</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-primary-800 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Nuestra comunidad crece cada día
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Miles de estudiantes y empresas ya confían en nosotros para
              impulsar sus carreras y encontrar el mejor talento.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<GraduationCap className="h-8 w-8" />}
              value="1,200+"
              label="Estudiantes"
              description="Diseñadores registrados"
            />
            <StatCard
              icon={<Building2 className="h-8 w-8" />}
              value="250+"
              label="Empresas"
              description="Empresas asociadas"
            />
            <StatCard
              icon={<Briefcase className="h-8 w-8" />}
              value="3,500+"
              label="Proyectos"
              description="Portfolios publicados"
            />
            <StatCard
              icon={<Users className="h-8 w-8" />}
              value="98%"
              label="Satisfacción"
              description="Usuarios satisfechos"
            />
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-primary-800 px-8 py-16 shadow-xl sm:px-16 sm:py-24">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-secondary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary-400/10 blur-3xl" />

            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                ¿Listo para formar parte de la comunidad?
              </h2>
              <p className="mt-4 text-lg text-primary-100">
                Únete a Design Association Hub y descubre un mundo de
                oportunidades para estudiantes y empresas de diseño.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/auth/register?type=student"
                  className="inline-flex items-center gap-2 rounded-xl bg-secondary px-8 py-3.5 text-base font-semibold text-primary-dark shadow-lg shadow-secondary/25 transition-all hover:bg-secondary-light hover:shadow-xl"
                >
                  <GraduationCap className="h-5 w-5" />
                  Únete como Estudiante
                </Link>
                <Link
                  href="/auth/register?type=company"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <Building2 className="h-5 w-5" />
                  Registra tu Empresa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-primary-100 bg-primary-50/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="col-span-1 lg:col-span-1">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-bold text-primary"
              >
                <Sparkles className="h-5 w-5 text-secondary" />
                <span>Design Hub</span>
              </Link>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Conectando el talento del diseño con las mejores oportunidades
                profesionales.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-primary">
                Plataforma
              </h3>
              <ul className="mt-4 space-y-3">
                <FooterLink href="/portfolio" label="Portfolio" />
                <FooterLink href="/forum" label="Foro" />
                <FooterLink href="/proposals" label="Propuestas" />
                <FooterLink href="/networking" label="Networking" />
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="text-sm font-semibold text-primary">Comunidad</h3>
              <ul className="mt-4 space-y-3">
                <FooterLink href="/students" label="Estudiantes" />
                <FooterLink href="/companies" label="Empresas" />
                <FooterLink href="/dashboard" label="Dashboard" />
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-primary">Legal</h3>
              <ul className="mt-4 space-y-3">
                <FooterLink href="/terms" label="Términos y Condiciones" />
                <FooterLink href="/privacy" label="Política de Privacidad" />
                <FooterLink href="/contact" label="Contacto" />
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-primary-100 pt-8">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Design Association Hub. Todos
              los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Sub-components ─── */

function StatCard({
  icon,
  value,
  label,
  description,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all hover:bg-white/10">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-secondary">
        {icon}
      </div>
      <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-sm font-semibold text-primary-100">{label}</p>
      <p className="mt-1 text-xs text-primary-200">{description}</p>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        {label}
      </Link>
    </li>
  );
}
