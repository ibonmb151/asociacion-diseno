"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  MessageCircle,
  FileText,
  Building2,
  Users,
  ChevronDown,
  Home,
} from "lucide-react";

const publicLinks = [{ href: "/", label: "Inicio", icon: Home }];

const protectedLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Estudiantes", icon: GraduationCap },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/forum", label: "Foro", icon: MessageCircle },
  { href: "/proposals", label: "Propuestas", icon: FileText },
  { href: "/companies", label: "Empresas", icon: Building2 },
  { href: "/networking", label: "Networking", icon: Users },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const navLinks = isAuthenticated
    ? [...publicLinks, ...protectedLinks]
    : publicLinks;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getUserInitials = () => {
    if (!session?.user?.name) return "?";
    return session.user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight text-fg"
        >
          <Home className="h-5 w-5 text-accent" />
          <span>Asociación de Diseño</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-accent-light/30 text-accent"
                  : "text-muted hover:bg-accent-light/15 hover:text-fg"
              }`}
            >
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Desktop Auth Area */}
        <div className="hidden items-center gap-3 lg:flex">
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-border" />
          ) : isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-accent-light/10"
              >
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "Avatar"}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                    {getUserInitials()}
                  </span>
                )}
                <span className="max-w-[100px] truncate">
                  {session?.user?.name ?? "Usuario"}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-lg border border-border bg-surface p-1.5 shadow-lg">
                  <div className="border-b border-border px-3 py-2">
                    <p className="truncate text-sm font-medium text-fg">
                      {session?.user?.name ?? "Usuario"}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {session?.user?.email ?? ""}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-accent-light/15 hover:text-fg"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <Link
                    href="/profile/edit"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-accent-light/15 hover:text-fg"
                  >
                    <User className="h-4 w-4" />
                    Mi Perfil
                  </Link>

                  <div className="my-1 border-t border-border" />

                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-danger transition-colors hover:bg-danger-bg"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-md px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-fg"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/register"
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center justify-center rounded-md p-2 text-fg transition-colors hover:bg-accent-light/15 lg:hidden"
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-surface lg:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-accent-light/30 text-accent"
                    : "text-muted hover:bg-accent-light/15 hover:text-fg"
                }`}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-border px-4 py-3">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-border" />
                <div className="h-4 w-24 rounded bg-border" />
              </div>
            ) : isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? "Avatar"}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                      {getUserInitials()}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-medium text-fg">
                      {session?.user?.name ?? "Usuario"}
                    </p>
                    <p className="text-xs text-muted">
                      {session?.user?.email ?? ""}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger-bg"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-accent-light/10"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
