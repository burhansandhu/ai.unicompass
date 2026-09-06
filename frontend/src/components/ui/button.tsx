import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed rounded-button";

    const variantStyles = {
      primary:
        "bg-[#3157E8] text-white hover:bg-[#2545BE] focus:ring-[#3157E8]/40 active:transform active:scale-[0.99] shadow-sm",
      secondary:
        "bg-[#EEF2FF] text-[#3157E8] hover:bg-[#E0E7FF] focus:ring-[#3157E8]/30",
      outline:
        "bg-white border border-[#E7EAF0] text-[#152033] hover:bg-[#F7F8FC] hover:border-[#D1D5DB] focus:ring-[#3157E8]/20",
      ghost:
        "bg-transparent text-[#667085] hover:text-[#152033] hover:bg-[#F7F8FC] focus:ring-gray-200",
      danger:
        "bg-[#E5484D] text-white hover:bg-[#D43D42] focus:ring-[#E5484D]/40 shadow-sm",
    };

    const sizeStyles = {
      sm: "h-9 px-3 text-xs",
      md: "h-11 px-5 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Please wait...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
