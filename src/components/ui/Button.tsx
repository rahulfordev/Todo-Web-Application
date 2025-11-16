import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer relative";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-blue-700 active:bg-primary-600 disabled:bg-blue-300 disabled:cursor-not-allowed",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed",
    outline:
      "border-2 border-primary text-primary hover:bg-blue-50 active:bg-blue-100 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed",
    ghost:
      "text-primary hover:bg-blue-50 active:bg-blue-100 disabled:text-gray-300 disabled:cursor-not-allowed",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Content wrapper with opacity control */}
      <span
        className={`flex items-center justify-center gap-2 transition-opacity duration-200 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {icon}
        {children}
      </span>

      {/* Loading spinner */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-current"
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
        </span>
      )}
    </button>
  );
};
