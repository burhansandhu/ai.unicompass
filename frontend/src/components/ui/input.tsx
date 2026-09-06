import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#152033]">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "w-full h-11 px-3.5 bg-white border border-[#E7EAF0] text-[#152033] placeholder-[#9CA3AF] text-sm rounded-input transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#3157E8]/20 focus:border-[#3157E8] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
              error && "border-[#E5484D] focus:ring-[#E5484D]/20 focus:border-[#E5484D]",
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-[#E5484D] mt-0.5">{error}</span>}
        {helperText && !error && <span className="text-xs text-[#667085] mt-0.5">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
