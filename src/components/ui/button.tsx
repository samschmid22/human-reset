import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "quiet";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClassMap: Record<ButtonVariant, string> = {
  primary: "hr-button--primary",
  secondary: "hr-button--secondary",
  quiet: "hr-button--quiet",
};

const sizeClassMap: Record<ButtonSize, string> = {
  sm: "hr-button--sm",
  md: "hr-button--md",
};

export function Button({
  children,
  className,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn("hr-button", sizeClassMap[size], variantClassMap[variant], className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
