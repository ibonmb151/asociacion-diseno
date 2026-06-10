import type { ReactNode } from "react";

type BadgeVariant = "accent" | "secondary" | "muted" | "success" | "warning" | "danger";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  accent: "border border-accent text-accent",
  secondary: "border border-fg text-fg",
  muted: "border border-border text-muted",
  success: "border border-success text-success",
  warning: "border border-warning text-warning",
  danger: "border border-danger text-danger",
};

export function Badge({ children, variant = "muted", className = "" }: BadgeProps) {
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
