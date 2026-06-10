"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";

/*
  Navbar is fixed + transparent — panels render behind it.
  Logo and auth use mix-blend-mode: difference so they're
  readable over any panel color (dark or light).
  Dropdown keeps solid bg so it's always legible.
*/

const BLEND: React.CSSProperties = { mixBlendMode: "difference", color: "white" };

export function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading       = status === "loading";
  const pathname        = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setDropdownOpen(false); }, [pathname]);

  const handleSignOut = async () => { await signOut({ callbackUrl: "/" }); };

  const getUserInitials = () => {
    if (!session?.user?.name) return "?";
    return session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="mx-auto relative flex h-[68px] max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="pointer-events-auto font-heading text-lg font-normal tracking-tight"
          style={BLEND}
        >
          Deusto <em style={{ fontStyle: "normal", color: "white" }}>Design</em> Association
        </Link>

        {/* Auth */}
        <div className="hidden items-center gap-4 lg:flex pointer-events-auto">
          {isLoading ? null : isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              {/* Trigger — blend mode */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium"
                style={BLEND}
              >
                <span className="flex h-5 w-5 items-center justify-center border border-current text-xs font-bold">
                  {getUserInitials()}
                </span>
                <span className="max-w-[90px] truncate">{session?.user?.name ?? "Usuario"}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown — solid bg so it's always legible */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 border border-border bg-bg shadow-none"
                  style={{ mixBlendMode: "normal" }}>
                  <div className="border-b border-border px-4 py-3">
                    <p className="truncate text-sm font-medium text-fg">{session?.user?.name}</p>
                    <p className="truncate text-xs text-muted">{session?.user?.email}</p>
                  </div>
                  <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted hover:text-fg hover:bg-surface transition-colors">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link href="/profile/edit" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted hover:text-fg hover:bg-surface transition-colors">
                    <User className="h-4 w-4" /> Mi Perfil
                  </Link>
                  <div className="border-t border-border" />
                  <button onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-accent hover:bg-accent-light transition-colors">
                    <LogOut className="h-4 w-4" /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login"
                className="text-sm font-medium transition-colors"
                style={BLEND}>
                Acceder
              </Link>
              <Link href="/auth/register"
                className="px-4 py-1.5 text-sm font-medium border"
                style={BLEND}>
                Unirse →
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
