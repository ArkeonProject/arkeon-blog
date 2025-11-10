import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-linear-to-r from-[#007EAD] to-[#00aaff] text-white shadow-lg shadow-[#007EAD]/40 hover:from-[#00aaff] hover:to-[#007EAD] hover:shadow-[#00aaff]/60 border border-transparent",
  secondary:
    "bg-transparent border border-[#007EAD]/40 text-white hover:border-[#00aaff] hover:text-[#00aaff]",
  ghost:
    "bg-transparent text-white hover:text-[#00aaff]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-3 text-base",
  lg: "px-7 py-3 text-lg",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  loadingText = "…",
  disabled,
  ...rest
}: ButtonProps) {
  const content = loading ? loadingText : children;
  const stateClasses = disabled || loading ? "opacity-60 cursor-not-allowed" : "transition-all duration-300";

  return (
    <button
      className={`${variantStyles[variant]} ${sizeStyles[size]} rounded-xl font-semibold tracking-wide focus:outline-none focus:ring-4 focus:ring-[#00aaff]/30 ${stateClasses} ${className}`.trim()}
      disabled={Boolean(disabled || loading)}
      {...rest}
    >
      {content}
    </button>
  );
}
