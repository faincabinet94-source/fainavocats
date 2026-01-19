"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  icon?: boolean;
}

export function Button({
  children,
  variant = "primary",
  icon = false,
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary: cn(
      "bg-primary-light text-white hover:bg-primary transition-colors duration-200 rounded-lg font-medium"
    ),
    secondary: cn(
      "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 transition-colors duration-200 rounded-lg font-medium"
    ),
    ghost: cn(
      "text-gray-600 hover:text-primary-light hover:bg-blue-50 transition-colors duration-200 rounded-lg font-medium"
    ),
    outline: cn(
      "bg-transparent text-primary-light border border-primary-light hover:bg-blue-50 transition-colors duration-200 rounded-lg font-medium"
    )
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
      {icon && (
        <ArrowRight className="ml-2 h-4 w-4" />
      )}
    </button>
  );
}

// On garde le nom ShimmerButton pour la compatibilité mais on le rend simple
export function ShimmerButton({ children, className, ...props }: ButtonProps) {
    return <Button variant="primary" className={className} {...props}>{children}</Button>;
}
