"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, GraduationCap, Building2, Globe } from "lucide-react";

/* ─── Animation variants ─── */
const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, delay, ease },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5, delay, ease },
});

/* ─── Auth CTA banner (only when logged out) ─── */

function AuthBanner() {
  const { data: session, status } = useSession();
  if (status === "loading" || session) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-[68px] z-40 flex items-center justify-between gap-4 bg-fg px-6 py-3 lg:px-8"
      >
        <p className="text-sm font-medium text-white/70">
          ¿Primera vez aquí? Únete a la comunidad de diseño de Deusto.
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/auth/register"
            className="flex items-center gap-1.5 border border-white px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-fg"
          >
            Crear cuenta →
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── HERO ─── */

function HeroSection() {
  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Top line */}
        <div className="flex items-center justify-between border-b border-border py-5">
          <motion.span {...fadeIn(0)} className="editorial-eyebrow">
            Universidad de Deusto — Bilbao, España
          </motion.span>
          <motion.span {...fadeIn(0.1)} className="editorial-eyebrow">
            Est. 2026
          </motion.span>
        </div>

        {/* Main headline */}
        <div className="py-16 lg:py-24">
          <motion.h1
            {...fadeUp(0.1)}
            className="font-heading text-[clamp(3.5rem,9vw,8.5rem)] font-normal leading-[0.95] tracking-[-0.04em] text-fg"
          >
            La comunidad
            <br />
            para los diseñadores
            <br />
            <span className="italic text-accent">del mañana.</span>
          </motion.h1>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-6 border-t border-border py-10 sm:flex-row sm:items-end sm:justify-between">
          <motion.p
            {...fadeUp(0.2)}
            className="max-w-sm text-base leading-relaxed text-muted"
          >
            Proyectos, charlas con profesionales, retos de diseño y conexión con la industria.
            Todo lo que el grado no cubre, aquí lo encontrás.
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="flex items-center gap-4">
            <Link
              href="/auth/register?type=student"
              className="group flex items-center gap-2 border border-fg bg-fg px-6 py-3 text-sm font-medium text-bg transition-all hover:bg-transparent hover:text-fg"
            >
              <GraduationCap className="h-4 w-4" />
              Soy estudiante
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/auth/register?type=company"
              className="flex items-center gap-2 border border-border px-6 py-3 text-sm font-medium text-fg transition-all hover:border-fg"
            >
              <Building2 className="h-4 w-4" />
              Soy empresa
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── PILLARS ─── */

function PillarsSection() {
  const items = [
    { num: "01", title: "Portfolio",   desc: "Sube tus proyectos y recibe feedback real de la comunidad. Muestra tu trabajo a empresas que buscan talento.",             href: "/portfolio" },
    { num: "02", title: "Charlas",     desc: "Profesionales en activo comparten lo que está pasando ahora en el sector. IA, tools, tendencias.",                        href: "/forum" },
    { num: "03", title: "Challenges",  desc: "Retos de diseño reales para aprender haciendo. Solos o en equipo, con feedback de profesionales.",                        href: "/proposals" },
    { num: "04", title: "Foro",        desc: "La conversación que debería existir en el grado. Recursos, dudas, proyectos en común.",                                   href: "/forum" },
    { num: "05", title: "Empresas",    desc: "Conecta con estudios y empresas que buscan talento de diseño. Prácticas, colaboraciones, primeras oportunidades.",        href: "/companies" },
  ];

  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-border py-5">
          <span className="editorial-eyebrow">Qué hacemos</span>
          <span className="editorial-eyebrow">05 pilares</span>
        </div>
        <div>
          {items.map((item, i) => (
            <motion.div key={item.num} {...fadeUp(i * 0.07)} className="group">
              <Link href={item.href}>
                <div className="flex items-start gap-6 border-b border-border py-8 transition-colors hover:bg-surface lg:py-10">
                  <span className="editorial-eyebrow w-8 flex-shrink-0 pt-1">{item.num}</span>
                  <div className="flex flex-1 items-start justify-between gap-8">
                    <div>
                      <h3 className="font-heading text-[clamp(2rem,4vw,3.5rem)] font-normal leading-none tracking-tight text-fg">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">{item.desc}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── MANIFESTO ─── */

function ManifestoSection() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-border py-5">
          <span className="editorial-eyebrow">Manifiesto</span>
        </div>
        <div className="py-20 lg:py-28">
          <motion.blockquote
            {...fadeUp(0)}
            className="font-heading text-[clamp(2rem,5vw,4.5rem)] font-normal leading-[1.1] tracking-[-0.03em] text-fg"
          >
            "El grado nos da la base.{" "}
            <span className="italic text-muted">
              La realidad profesional avanza exponencialmente.
            </span>{" "}
            Esta asociación es el puente."
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
}

/* ─── WHY ─── */

function WhySection() {
  const reasons = [
    { title: "IA aplicada al diseño",       desc: "Los estudios ya entrenan modelos con su histórico de proyectos. Los diseñadores del mañana necesitan entender cómo funciona esto — y cómo usarlo a su favor.", highlight: true },
    { title: "Herramientas emergentes",      desc: "KeyShot ya no es la única opción. Nuevas alternativas con IA redefinen el render y el modelado 3D. ¿Cuáles merece aprender? ¿Cuáles son hype?",             highlight: false },
    { title: "Conexión real con la industria", desc: "Charlas con profesionales en activo. No ponentes genéricos — gente que está resolviendo estos problemas hoy.",                                            highlight: false },
  ];

  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-border py-5">
          <span className="editorial-eyebrow">Por qué existe</span>
        </div>
        <div className="grid gap-0 py-16 lg:grid-cols-2 lg:gap-20 lg:py-20">
          <motion.div {...fadeUp(0)} className="mb-12 lg:mb-0">
            <h2 className="font-heading text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.03em] text-fg">
              El diseño avanza.
              <br />
              <span className="italic">La formación también.</span>
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">
              No es una crítica al grado — es honestidad sobre lo que cambia
              más rápido de lo que cualquier plan de estudios puede absorber.
            </p>
          </motion.div>
          <div>
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                {...fadeUp(i * 0.1)}
                className={`border-t border-border py-7 ${r.highlight ? "border-l-2 border-l-accent pl-6" : "border-l-2 border-l-transparent pl-6"}`}
              >
                <p className="mb-2 font-heading text-xl font-normal tracking-tight text-fg">{r.title}</p>
                <p className="text-sm leading-relaxed text-muted">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */

function CTASection() {
  return (
    <section className="bg-fg">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-white/10 py-5">
          <span className="font-body text-[0.7rem] font-medium uppercase tracking-[0.12em] text-white/40">Únete</span>
        </div>
        <div className="py-20 lg:py-28">
          <motion.div {...fadeUp(0)}>
            <h2 className="font-heading text-[clamp(4rem,12vw,11rem)] font-normal leading-[0.95] tracking-[-0.04em] text-bg">
              ¿Diseñas
              <br />
              en Deusto?
            </h2>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/auth/register?type=student" className="group flex items-center gap-2 border border-bg px-8 py-4 text-sm font-medium text-bg transition-all hover:bg-bg hover:text-fg">
                Crear cuenta
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/auth/login" className="px-8 py-4 text-sm font-medium text-white/50 transition-colors hover:text-bg">
                Ya tengo cuenta
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */

function FooterSection() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-bg border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-heading text-lg font-normal tracking-tight text-fg">
              Deusto <span className="italic text-accent">Design</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">La comunidad de diseño de la Universidad de Deusto, Bilbao.</p>
          </div>
          <div>
            <p className="mb-4 font-body text-xs font-medium uppercase tracking-widest text-muted">Plataforma</p>
            <ul className="space-y-2.5">
              {[["Portfolio", "/portfolio"], ["Foro", "/forum"], ["Challenges", "/proposals"], ["Empresas", "/companies"], ["El Semanal", "/newsletter"]].map(([label, href]) => (
                <li key={label}><Link href={href} className="text-sm text-muted transition-colors hover:text-fg">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 font-body text-xs font-medium uppercase tracking-widest text-muted">Comunidad</p>
            <ul className="space-y-2.5">
              {[["Estudiantes", "/students"], ["Networking", "/networking"], ["Dashboard", "/dashboard"]].map(([label, href]) => (
                <li key={label}><Link href={href} className="text-sm text-muted transition-colors hover:text-fg">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 font-body text-xs font-medium uppercase tracking-widest text-muted">Deusto</p>
            <ul className="space-y-2.5">
              <li className="text-sm text-muted">Bilbao, España</li>
              <li className="text-sm text-muted">Grado en Diseño</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-3 border-t border-border py-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted">© {year} Deusto Design</p>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Globe className="h-3.5 w-3.5" />
            Hecho por y para diseñadores de Deusto
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ─── */

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <AuthBanner />
      <HeroSection />
      <PillarsSection />
      <ManifestoSection />
      <WhySection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
