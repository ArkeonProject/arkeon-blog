import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevate?: boolean;
}

export default function Card({ className = "", elevate = true, ...rest }: CardProps) {
  const baseStyles =
    "rounded-2xl border border-gray-300 dark:border-[#1b2944] bg-gradient-to-br from-white to-gray-50 dark:from-[#0a1628] dark:to-[#0f1f38] backdrop-blur-sm transition-colors duration-300";
  const shadow = elevate ? "shadow-lg shadow-gray-200 dark:shadow-[#007EAD]/15" : "";
  return <div className={`${baseStyles} ${shadow} ${className}`.trim()} {...rest} />;
}
