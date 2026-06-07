"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  icon?: React.ReactNode;
}

const baseInput =
  "block w-full rounded-md border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 transition-all";

const stateStyles = {
  normal:
    "border-border focus:border-accent focus:ring-accent/30",
  error:
    "border-danger focus:border-danger focus:ring-danger/30",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-fg">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`${baseInput} ${icon ? "pl-10" : ""} ${error ? stateStyles.error : stateStyles.normal} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-danger">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
