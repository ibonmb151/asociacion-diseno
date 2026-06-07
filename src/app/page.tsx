"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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
  Palette,
  Zap,
  Globe,
  Star,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}

/* ─── HERO ─── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary-900">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-400/10 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-accent/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200/30 bg-primary-300/10 px-4 py-1.5 text-sm text-primary-100"
          >
            <Sparkles className="h-4 w-4 text-secondary" />
            <span>La comunidad de diseño más grande del país</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Donde el{" "}
            <span className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
              Talento
            </span>{" "}
            y las{" "}
            <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
              Oportunidades
            </span>{" "}
            se encuentran
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 text-lg leading-8 text-primary-100 sm:text-xl max-w-2xl mx-auto"
          >
            La plataforma que conecta a estudiantes de diseño con las mejores
            empresas. Crea tu portfolio, participa en debates, y encuentra las
            oportunidades que impulsarán tu carrera.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/auth/register?type=student"
              className="group inline-flex items-center gap-2 rounded-xl bg-secondary px-8 py-3.5 text-base font-semibold text-primary-dark shadow-lg shadow-secondary/25 transition-all hover:bg-secondary-light hover:shadow-xl hover:shadow-secondary/30 active:scale-[0.98]"
            >
              <GraduationCap className="h-5 w-5" />
              Empieza como Estudiante
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/auth/register?type=company"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98]"
            >
              <Building2 className="h-5 w-5" />
              Registra tu Empresa
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-primary-200"
          >
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              1,200+ estudiantes
            </span>
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-secondary" />
              250+ empresas
            </span>
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent-light" />
              3,500+ proyectos
            </span>
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary-200" />
              Gratuito
            </span>
          </motion.div>
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
  );
}

/* ─── FEATURES ─── */

function FeaturesSection() {
  const features = [
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Portfolio Showcase",
      description:
        "Crea un portfolio profesional con tus mejores proyectos. Comparte tu trabajo con empresas y recibe feedback de la comunidad.",
      color: "bg-secondary/10 text-secondary",
      href: "/portfolio",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Foro y Comunidad",
      description:
        "Participa en debates, comparte conocimientos, resuelve dudas y conecta con otros diseñadores y profesionales del sector.",
      color: "bg-primary-50 text-primary",
      href: "/forum",
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Company Networking",
      description:
        "Conecta con empresas que buscan talento de diseño. Recibe ofertas, colabora en proyectos reales y construye tu red profesional.",
      color: "bg-success/10 text-success",
      href: "/networking",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Propuestas y Proyectos",
      description:
        "Las empresas publican necesidades y los estudiantes presentan sus propuestas. Colabora en proyectos reales y gana experiencia.",
      color: "bg-accent/10 text-accent",
      href: "/proposals",
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="font-heading text-base font-semibold tracking-wider text-secondary uppercase">
            Funcionalidades
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tanto si eres estudiante buscando oportunidades como empresa en
            busca de talento, nuestra plataforma tiene todo lo que necesitas.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative rounded-2xl border border-primary-100 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-primary-100/50"
            >
              {/* Icon */}
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="font-heading text-lg font-semibold text-primary">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>

              {/* Link */}
              <Link
                href={feature.href}
                className="mt-4 flex items-center gap-1 text-sm font-medium text-secondary transition-colors hover:text-secondary-dark"
              >
                <span>Explorar</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── STATS ─── */

function StatsSection() {
  const stats = [
    {
      icon: <GraduationCap className="h-8 w-8" />,
      value: "1,200+",
      label: "Estudiantes",
      description: "Diseñadores registrados",
      delay: 0,
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      value: "250+",
      label: "Empresas",
      description: "Empresas asociadas",
      delay: 0.15,
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      value: "3,500+",
      label: "Proyectos",
      description: "Portfolios publicados",
      delay: 0.3,
    },
    {
      icon: <Star className="h-8 w-8" />,
      value: "98%",
      label: "Satisfacción",
      description: "Usuarios satisfechos",
      delay: 0.45,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary-900 py-20 sm:py-24">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Nuestra comunidad crece cada día
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            Miles de estudiantes y empresas ya confían en nosotros para
            impulsar sus carreras y encontrar el mejor talento.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: stat.delay }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-secondary">
                {stat.icon}
              </div>
              <p className="font-heading text-3xl font-bold tracking-tight text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-primary-100">
                {stat.label}
              </p>
              <p className="mt-1 text-xs text-primary-200">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ─── */

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Esta plataforma me conectó con mi primera oportunidad profesional. El portfolio me ayudó a destacar y una empresa contactó conmigo a las dos semanas.",
      author: "María García",
      role: "Diseñadora UX/UI",
      icon: <Palette className="h-5 w-5" />,
    },
    {
      quote:
        "Como empresa, encontrar talento joven de diseño nunca había sido tan fácil. Las propuestas de los estudiantes son increíblemente creativas y bien elaboradas.",
      author: "Carlos Méndez",
      role: "Director Creativo, Estudio DM",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      quote:
        "El foro es mi parte favorita. Aprendo muchísimo de otros diseñadores y he creado una red de contactos increíble para mi futuro profesional.",
      author: "Ana López",
      role: "Estudiante de Diseño Gráfico",
      icon: <MessageCircle className="h-5 w-5" />,
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="font-heading text-base font-semibold tracking-wider text-secondary uppercase">
            Testimonios
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Lo que dicen de nosotros
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative rounded-2xl border border-primary-100 bg-white p-8 shadow-sm"
            >
              {/* Quote mark */}
              <div className="absolute -top-3 -left-2 text-5xl text-secondary/20 font-heading leading-none">
                &ldquo;
              </div>

              <p className="relative text-sm leading-6 text-muted-foreground">
                {item.quote}
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-primary-50 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    {item.author}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */

function CTASection() {
  return (
    <section className="bg-gradient-to-b from-white to-primary-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-primary-900 px-6 py-16 shadow-xl sm:px-16 sm:py-24"
        >
          {/* Blobs */}
          <motion.div
            className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-secondary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              ¿Listo para formar parte de la comunidad?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
            Únete a la Asociación de Diseño y descubre un mundo de
              oportunidades para estudiantes y empresas del sector.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/register?type=student"
                className="group inline-flex items-center gap-2 rounded-xl bg-secondary px-8 py-3.5 text-base font-semibold text-primary-dark shadow-lg shadow-secondary/25 transition-all hover:bg-secondary-light hover:shadow-xl"
              >
                <GraduationCap className="h-5 w-5" />
                Únete como Estudiante
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
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
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */

function FooterSection() {
  return (
    <footer className="border-t border-primary-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-heading font-bold text-primary"
            >
              <Sparkles className="h-5 w-5 text-secondary" />
              <span>Asociación de Diseño</span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Conectando el talento del diseño con las mejores oportunidades
              profesionales.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-primary">
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
            <h3 className="font-heading text-sm font-semibold text-primary">
              Comunidad
            </h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="/students" label="Estudiantes" />
              <FooterLink href="/companies" label="Empresas" />
              <FooterLink href="/dashboard" label="Dashboard" />
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-primary">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="/terms" label="Términos y Condiciones" />
              <FooterLink href="/privacy" label="Política de Privacidad" />
              <li className="text-sm text-muted-foreground">
                hola@asociacion-diseno.es
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-100 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Asociación de Diseño. Todos
              los derechos reservados.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>Hecho con 💜 para la comunidad de diseño</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
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
