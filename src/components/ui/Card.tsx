import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevate?: boolean;
}

export default function Card({ className = "", elevate = true, ...rest }: CardProps) {
  const baseStyles =
    "rounded-2xl border border-[#1b2944] bg-linear-to-br from-[#0a1628] to-[#0f1f38] backdrop-blur-sm";
  const shadow = elevate ? "shadow-lg shadow-[#007EAD]/15" : "";
  return <div className={`${baseStyles} ${shadow} ${className}`.trim()} {...rest} />;
}
