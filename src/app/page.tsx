"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  ChevronRight,
  Calendar,
  Users,
  Sparkles,
  Lightbulb,
  Palette,
  MessageCircle,
  Target,
  Award,
  Eye,
} from "lucide-react";

/* ─── Animation variants ─── */
const easeOut = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: easeOut },
});

const scaleFade = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay, ease: easeOut },
});

/* ─── HERO ─── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Text side */}
          <div className="lg:col-span-3">
            <motion.span
              {...fadeUp(0)}
              className="section-label"
            >
              Deusto Design Association
            </motion.span>

            <motion.h1
              {...fadeUp(0.1)}
              className="mt-6 hero-title text-fg"
            >
              El diseño
              <br />
              <span className="gradient-text">encuentra</span> su
              <br />
              comunidad
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            >
              Un punto de encuentro para los diseñadores de Deusto. 
              Identidad colectiva, formación complementaria, retos 
              semanales y conexión directa con la industria.
            </motion.p>

            <motion.div
              {...fadeUp(0.3)}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/auth/register?type=student"
                className="btn-primary"
              >
                Únete a la comunidad
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/portfolio"
                className="btn-ghost"
              >
                <Palette className="h-4 w-4" />
                Ver proyectos
              </Link>
            </motion.div>


          </div>

          {/* Image side — editorial photo grid */}
          <motion.div
            {...scaleFade(0.2)}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="editorial-image-card aspect-[3/4]">
                <div className="flex h-full w-full items-center justify-center bg-accent-light/40">
                  <Users className="h-12 w-12 text-accent/30" />
                </div>
              </div>
              <div className="mt-8">
                <div className="editorial-image-card aspect-square">
                  <div className="flex h-full w-full items-center justify-center bg-secondary-muted">
                    <Palette className="h-10 w-10 text-secondary/30" />
                  </div>
                </div>
                <div className="editorial-image-card mt-3 aspect-[4/3]">
                  <div className="flex h-full w-full items-center justify-center bg-accent-light/30">
                    <Target className="h-8 w-8 text-accent/30" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── IMAGE GALLERY STRIP ─── */

function GalleryStrip() {
  const images = [
    { color: "bg-accent-light/50", icon: <Users className="h-6 w-6 text-accent/40" /> },
    { color: "bg-secondary-muted", icon: <Palette className="h-6 w-6 text-secondary/40" /> },
    { color: "bg-accent-light/30", icon: <Target className="h-6 w-6 text-accent/40" /> },
    { color: "bg-accent/10", icon: <Award className="h-6 w-6 text-accent/40" /> },
    { color: "bg-secondary-muted", icon: <Eye className="h-6 w-6 text-secondary/40" /> },
  ];

  return (
    <section className="overflow-hidden border-y border-border bg-surface">
      <div className="flex gap-0">
        {[...Array(2)].map((_, setIdx) => (
          <div key={setIdx} className="marquee-track flex">
            {images.map((img, i) => (
              <div
                key={`${setIdx}-${i}`}
                className={`flex h-48 w-72 shrink-0 items-center justify-center ${img.color}`}
              >
                <div className="text-center">
                  {img.icon}
                  <p className="mt-2 text-xs text-muted/60">
                    Espacio para fotografía
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── FEATURES ─── */

function FeaturesSection() {
  const features = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Charlas semanales",
      description:
        "Cada semana traemos a profesionales en activo para compartir novedades del sector, herramientas emergentes y casos reales.",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Retos de diseño",
      description:
        "Challenges semanales para poner a prueba tus habilidades. Diseña productos, conceptos o servicios y recibe feedback de la comunidad.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Equipos multidisciplinares",
      description:
        "Trabaja en equipos más grandes combinando perfiles de branding, UX, producto e ilustración. Como en un estudio real.",
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Formación continua",
      description:
        "Talleres sobre IA aplicada al diseño, nuevas herramientas, modelado 3D y todo lo que la industria demanda.",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Feedback colectivo",
      description:
        "Comparte tus proyectos y recibe críticas constructivas de compañeros, profesores y profesionales del sector.",
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Conexión con empresas",
      description:
        "Las empresas publican necesidades reales. Presenta tus propuestas, colabora y construye tu red profesional.",
    },
  ];

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <motion.div {...fadeUp(0)} className="mx-auto mb-16 max-w-2xl text-center">
          <span className="section-label">Qué ofrecemos</span>
          <h2 className="mt-6 font-heading text-4xl font-medium leading-tight text-fg sm:text-5xl">
            Una comunidad diseñada
            <br />
            <span className="text-accent">para crecer juntos</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp(i * 0.08)}
              className="card group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light text-accent">
                {f.icon}
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold text-fg">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── UPCOMING EVENTS / TALKS ─── */

function EventsSection() {
  const events = [
    {
      day: "17",
      month: "Jun",
      title: "IA generativa aplicada al diseño de producto",
      speaker: "Ane Urrutia — Design Lead, IDEO",
      type: "Charla",
    },
    {
      day: "24",
      month: "Jun",
      title: "Design Systems: de la teoría a la práctica",
      speaker: "Unai Martínez — UX Engineer, Cabify",
      type: "Taller",
    },
    {
      day: "01",
      month: "Jul",
      title: "Challenge: Rediseña una app en 48h",
      speaker: "Organizado por la comunidad",
      type: "Reto",
    },
  ];

  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <motion.div {...fadeUp(0)} className="max-w-xl">
            <span className="section-label">Próximos eventos</span>
            <h2 className="mt-6 font-heading text-4xl font-medium leading-tight text-fg sm:text-5xl">
              Charlas, talleres y retos
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Cada semana activamos la comunidad con contenido diseñado para 
              complementar tu formación universitaria.
            </p>
          </motion.div>
          <Link
            href="/forum"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover"
          >
            Ver todos los eventos
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e, i) => (
            <motion.div key={e.title} {...fadeUp(i * 0.1)}>
              <div className="event-card">
                <div className="event-date">
                  <span className="event-date-day">{e.day}</span>
                  <span className="event-date-month">{e.month}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="tag">{e.type}</span>
                  <h3 className="mt-2 font-heading text-base font-semibold leading-snug text-fg">
                    {e.title}
                  </h3>
                  <p className="mt-1 truncate text-xs text-muted">
                    {e.speaker}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURED PROJECTS ─── */

function ProjectsSection() {
  const projects = [
    {
      title: "Identidad Visual — Café de Altura",
      author: "Lucía García",
      tags: ["Branding", "Packaging"],
      gradient: "from-accent/20 to-secondary/20",
    },
    {
      title: "App — EcoTracker",
      author: "Marc López",
      tags: ["UX/UI", "Sostenibilidad"],
      gradient: "from-secondary/20 to-accent/20",
    },
    {
      title: "Packaging Sostenible — Oliva Eco",
      author: "Ana Martínez",
      tags: ["Packaging", "Branding"],
      gradient: "from-accent/20 to-accent-light",
    },
  ];

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <motion.div {...fadeUp(0)} className="max-w-xl">
            <span className="section-label">Portfolio destacado</span>
            <h2 className="mt-6 font-heading text-4xl font-medium leading-tight text-fg sm:text-5xl">
              Proyectos de la comunidad
            </h2>
          </motion.div>
          <Link
            href="/portfolio"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover"
          >
            Ver todos los proyectos
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.div key={p.title} {...scaleFade(i * 0.1)}>
              <div className="project-card group cursor-pointer">
                <div
                  className={`flex aspect-[4/3] items-center justify-center rounded-t-xl bg-gradient-to-br ${p.gradient}`}
                >
                  <Palette className="h-16 w-16 text-accent/30" />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                  <h3 className="mt-3 font-heading text-base font-semibold leading-snug text-fg">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">por {p.author}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIAL ─── */

function TestimonialSection() {
  return (
    <section className="section-dark">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl">
          <motion.div {...scaleFade(0)} className="text-center">
            <span className="inline-block font-body text-xs font-semibold tracking-[0.12em] uppercase text-secondary">
              Lo que dicen
            </span>
            <blockquote className="mt-8">
              <p className="font-heading text-2xl font-light leading-relaxed text-dark-fg sm:text-3xl lg:text-4xl">
                &ldquo;Esta comunidad me ha dado acceso a profesionales 
                y herramientas que en clase simplemente no existen. 
                Las charlas semanales me abrieron los ojos a lo que 
                realmente demanda la industria.&rdquo;
              </p>
              <footer className="mt-8">
                <div className="mx-auto flex items-center justify-center gap-3">
                  <div className="avatar bg-accent/30" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-dark-fg">
                      María García
                    </p>
                    <p className="text-xs text-dark-muted">
                      Diseñadora UX/UI · Miembro desde 2025
                    </p>
                  </div>
                </div>
              </footer>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */

function CTASection() {
  return (
    <section className="bg-accent">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <motion.div
          {...fadeUp(0)}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="font-heading text-4xl font-medium leading-tight text-white sm:text-5xl">
            ¿Eres diseñador de Deusto?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-accent-light/90">
            Únete a la asociación y forma parte de una comunidad que está 
            redefiniendo el diseño en la universidad. Charlas, retos, 
            proyectos reales y una red de contactos que impulsará tu carrera.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/register?type=student"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-sm font-medium text-accent transition-all hover:bg-accent-light active:scale-[0.98]"
            >
              <GraduationCap className="h-4 w-4" />
              Quiero unirme
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/register?type=company"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/40 bg-transparent px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10 active:scale-[0.98]"
            >
              <Building2 className="h-4 w-4" />
              Soy una empresa
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
    <footer className="section-dark border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="font-heading text-lg font-semibold text-dark-fg"
            >
              Deusto Design
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-dark-muted">
              Asociación de diseño de la Universidad de Deusto. 
              Conectando estudiantes, profesores y empresas para 
              construir el futuro del diseño.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-dark-fg">
              Plataforma
            </h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="/portfolio" label="Portfolio" />
              <FooterLink href="/forum" label="Foro" />
              <FooterLink href="/proposals" label="Propuestas" />
              <FooterLink href="/newsletter" label="El Semanal" />
              <FooterLink href="/networking" label="Networking" />
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-dark-fg">
              Comunidad
            </h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="/students" label="Estudiantes" />
              <FooterLink href="/companies" label="Empresas" />
              <FooterLink href="/dashboard" label="Dashboard" />
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-dark-fg">
              Deusto
            </h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="https://deusto.es" label="Universidad de Deusto" />
              <li className="text-sm text-dark-muted">
                diseño@deusto.es
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-dark-muted">
            &copy; {new Date().getFullYear()} Deusto Design Association
          </p>
          <p className="text-sm text-dark-muted">
            Hecho por y para la comunidad de diseño de Deusto
          </p>
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
        className="text-sm text-dark-muted transition-colors hover:text-dark-fg"
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
      <GalleryStrip />
      <FeaturesSection />
      <EventsSection />
      <ProjectsSection />
      <TestimonialSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
