"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  MessageCircle,
  Building2,
  FileText,
  GraduationCap,
  Home,
  ChevronRight,
  Globe,
} from "lucide-react";

/* ─── Animation variants ─── */
const easeOut = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay, ease: easeOut },
});

const scaleFade = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.4, delay, ease: easeOut },
});

/* ─── HERO ─── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-bg">
      {/* Subtle editorial rule at the top */}
      <div className="mx-auto h-px max-w-7xl bg-border" />

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl">
          {/* Eyebrow */}
          <motion.span
            {...fadeUp(0)}
            className="editorial-eyebrow inline-block"
          >
            Comunidad de diseño
          </motion.span>

          {/* Main headline — editorial serif, light weight, dramatic */}
          <motion.h1
            {...fadeUp(0.1)}
            className="mt-4 font-heading text-5xl font-light leading-[1.05] tracking-[-0.03em] text-fg sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Donde el talento
            <br />
            <span className="gradient-text-warm">encuentra</span> su
            oportunidad
          </motion.h1>

          {/* Standfirst — intentionally much smaller (dramatic scale jump) */}
          <motion.p
            {...fadeUp(0.2)}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            La plataforma que conecta a estudiantes de diseño con empresas.
            Publica tu portfolio, participa en el foro, y construye tu futuro
            profesional.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.3)}
            className="mt-10 flex flex-col items-start gap-4 sm:flex-row"
          >
            <Link
              href="/auth/register?type=student"
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-all hover:bg-accent-hover active:scale-[0.98]"
            >
              <GraduationCap className="h-4 w-4" />
              Empieza como Estudiante
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/auth/register?type=company"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-medium text-fg transition-all hover:border-muted hover:bg-surface active:scale-[0.98]"
            >
              <Building2 className="h-4 w-4" />
              Registra tu Empresa
            </Link>
          </motion.div>

          {/* Trust indicators — minimal, one accent use (the stat numbers) */}
          <motion.div
            {...fadeUp(0.4)}
            className="mt-16 flex flex-wrap gap-x-10 gap-y-3"
          >
            <div>
              <span className="font-heading text-xl font-medium text-accent">
                1.200+
              </span>
              <span className="ml-2 text-sm text-muted">estudiantes</span>
            </div>
            <div>
              <span className="font-heading text-xl font-medium text-accent">
                250+
              </span>
              <span className="ml-2 text-sm text-muted">empresas</span>
            </div>
            <div>
              <span className="font-heading text-xl font-medium text-accent">
                Gratuito
              </span>
              <span className="ml-2 text-sm text-muted">sin compromiso</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom editorial rule */}
      <div className="mx-auto h-px max-w-7xl bg-border" />
    </section>
  );
}

/* ─── BENTO SHOWCASE ─── */

function BentoShowcaseSection() {
  const items = [
    {
      icon: <Briefcase className="h-5 w-5" />,
      title: "Portfolio",
      description:
        "Crea un portfolio profesional con tus mejores proyectos. Comparte tu trabajo con empresas interesadas en tu talento.",
      href: "/portfolio",
      span: "col-span-1 row-span-1",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Foro",
      description:
        "Debate con otros diseñadores, comparte conocimientos, resuelve dudas y construye tu red profesional.",
      href: "/forum",
      span: "col-span-1 row-span-1",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Propuestas",
      description:
        "Las empresas publican necesidades reales. Presenta tus propuestas y trabaja en proyectos que impulsarán tu carrera.",
      href: "/proposals",
      span: "col-span-1 row-span-1 lg:col-span-2",
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      title: "Networking",
      description:
        "Conecta con empresas que buscan talento de diseño. Recibe ofertas y construye tu red profesional.",
      href: "/networking",
      span: "col-span-1 row-span-1",
    },
  ];

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        {/* Section header */}
        <motion.div {...fadeUp(0)} className="mb-14 max-w-xl">
          <span className="editorial-eyebrow">Plataforma</span>
          <h2 className="mt-3 font-heading text-3xl font-medium leading-tight text-fg sm:text-4xl">
            Todo lo que necesitas
            <br />
            en un solo lugar
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Tanto si eres estudiante como empresa, nuestra plataforma está
            diseñada para conectar el talento con las oportunidades.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              {...scaleFade(i * 0.1)}
              className={`bento-card group relative flex flex-col ${item.span}`}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-light/50 text-accent">
                {item.icon}
              </div>

              <h3 className="font-heading text-lg font-semibold text-fg">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {item.description}
              </p>

              <Link
                href={item.href}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
              >
                Explorar
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── MERGED STATS + TESTIMONIAL ─── */

function StatsTestimonialSection() {
  const stats = [
    { value: "1.200+", label: "Estudiantes" },
    { value: "250+", label: "Empresas" },
    { value: "3.500+", label: "Proyectos" },
    { value: "98%", label: "Satisfacción" },
  ];

  return (
    <section className="bg-secondary-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Stats */}
          <div>
            <motion.span {...fadeUp(0)} className="editorial-eyebrow">
              Comunidad
            </motion.span>
            <motion.h2
              {...fadeUp(0.1)}
              className="mt-3 font-heading text-3xl font-medium leading-tight text-fg sm:text-4xl"
            >
              Una comunidad que crece
            </motion.h2>
            <motion.p
              {...fadeUp(0.15)}
              className="mt-3 text-base leading-relaxed text-muted"
            >
              Miles de estudiantes y empresas ya confían en nosotros.
            </motion.p>

            <div className="mt-10 grid grid-cols-2 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  {...scaleFade(i * 0.1)}
                >
                  <p className="font-heading text-3xl font-medium text-accent sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Testimonial as editorial pull quote */}
          <motion.div
            {...scaleFade(0.2)}
            className="relative flex items-center"
          >
            <blockquote className="border-l-2 border-accent pl-6 sm:pl-10">
              <p className="font-heading text-xl font-light leading-relaxed text-fg sm:text-2xl">
                &ldquo;Esta plataforma me conectó con mi primera oportunidad
                profesional. El portfolio me ayudó a destacar y una empresa
                contactó conmigo a las dos semanas.&rdquo;
              </p>
              <footer className="mt-6">
                <p className="text-sm font-medium text-fg">María García</p>
                <p className="text-sm text-muted">
                  Diseñadora UX/UI · Miembro desde 2025
                </p>
              </footer>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─── */

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Crea tu perfil",
      description:
        "Regístrate como estudiante o empresa. Completa tu perfil con tu experiencia y áreas de interés.",
    },
    {
      number: "02",
      title: "Comparte y conecta",
      description:
        "Publica proyectos en tu portfolio, participa en el foro, o publica necesidades como empresa.",
    },
    {
      number: "03",
      title: "Crece profesionalmente",
      description:
        "Recibe propuestas, conecta con empresas, colabora en proyectos reales y construye tu carrera.",
    },
  ];

  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <motion.div {...fadeUp(0)} className="mb-16 max-w-xl">
          <span className="editorial-eyebrow">Cómo funciona</span>
          <h2 className="mt-3 font-heading text-3xl font-medium leading-tight text-fg sm:text-4xl">
            Tres pasos para impulsar
            <br />
            tu carrera de diseño
          </h2>
        </motion.div>

        <div className="grid gap-10 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              {...fadeUp(i * 0.15)}
              className="relative"
            >
              <span className="font-heading text-6xl font-light text-border sm:text-7xl">
                {step.number}
              </span>
              <h3 className="mt-2 font-heading text-xl font-semibold text-fg">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
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
    <section className="bg-accent">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <motion.div
          {...fadeUp(0)}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-medium leading-tight text-white sm:text-4xl">
            ¿Listo para formar parte?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-accent-light">
            Únete a la Asociación de Diseño y descubre un mundo de
            oportunidades.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/register?type=student"
              className="inline-flex items-center gap-2 rounded-lg bg-surface px-6 py-3 text-sm font-medium text-accent transition-all hover:bg-accent-light active:scale-[0.98]"
            >
              <GraduationCap className="h-4 w-4" />
              Únete como Estudiante
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/register?type=company"
              className="inline-flex items-center gap-2 rounded-lg border border-surface/30 bg-transparent px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 active:scale-[0.98]"
            >
              <Building2 className="h-4 w-4" />
              Registra tu Empresa
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */

function FooterSection() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-heading text-lg font-semibold text-fg"
            >
              <Home className="h-5 w-5 text-accent" />
              <span>Asociación de Diseño</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Conectando el talento del diseño con las mejores oportunidades
              profesionales.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-fg">
              Plataforma
            </h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="/portfolio" label="Portfolio" />
              <FooterLink href="/forum" label="Foro" />
              <FooterLink href="/proposals" label="Propuestas" />
              <FooterLink href="/networking" label="Networking" />
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-fg">
              Comunidad
            </h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="/students" label="Estudiantes" />
              <FooterLink href="/companies" label="Empresas" />
              <FooterLink href="/dashboard" label="Dashboard" />
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-fg">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="/terms" label="Términos" />
              <FooterLink href="/privacy" label="Privacidad" />
              <li className="text-sm text-muted">
                hola@asociacion-diseno.es
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Asociación de Diseño
          </p>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Globe className="h-4 w-4" />
            <span>Hecho para la comunidad de diseño</span>
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
        className="text-sm text-muted transition-colors hover:text-fg"
      >
        {label}
      </Link>
    </li>
  );
}

/* ─── PAGE ─── */

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <BentoShowcaseSection />
      <StatsTestimonialSection />
      <HowItWorksSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
