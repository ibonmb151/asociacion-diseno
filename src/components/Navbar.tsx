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
  Sparkles,
} from "lucide-react";

const publicLinks = [{ href: "/", label: "Inicio", icon: Sparkles }];

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

  // Close dropdown on click outside
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

  // Close mobile menu on route change
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
    <nav className="sticky top-0 z-50 w-full border-b border-primary-100/50 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary"
        >
          <Sparkles className="h-6 w-6 text-secondary" />
          <span className="font-heading">Asociación de Diseño</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-primary-50 text-primary"
                  : "text-muted-foreground hover:bg-primary-50/50 hover:text-primary"
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
            <div className="h-8 w-8 animate-pulse rounded-full bg-primary-100" />
          ) : isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 pr-2 text-sm font-medium text-primary transition-colors hover:bg-primary-100"
              >
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "Avatar"}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {getUserInitials()}
                  </span>
                )}
                <span className="max-w-[100px] truncate">
                  {session?.user?.name ?? "Usuario"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-xl border border-primary-100 bg-white p-1.5 shadow-lg ring-1 ring-black/5">
                  <div className="border-b border-primary-100/50 px-3 py-2">
                    <p className="truncate text-sm font-medium text-primary">
                      {session?.user?.name ?? "Usuario"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {session?.user?.email ?? ""}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary-50 hover:text-primary"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary-50 hover:text-primary"
                  >
                    <User className="h-4 w-4" />
                    Mi Perfil
                  </Link>

                  <div className="my-1 border-t border-primary-100/50" />

                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-red-50"
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
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary-50 hover:text-primary"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-light"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center justify-center rounded-lg p-2 text-primary transition-colors hover:bg-primary-50 lg:hidden"
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-primary-100/50 bg-white lg:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary-50 text-primary"
                    : "text-muted-foreground hover:bg-primary-50 hover:text-primary"
                }`}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-primary-100/50 px-4 py-3">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-primary-100" />
                <div className="h-4 w-24 animate-pulse rounded bg-primary-100" />
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
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {getUserInitials()}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-medium text-primary">
                      {session?.user?.name ?? "Usuario"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session?.user?.email ?? ""}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center rounded-lg border border-primary-200 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-light"
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
