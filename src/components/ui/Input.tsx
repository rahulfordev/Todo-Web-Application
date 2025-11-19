import React, {
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { Eye, EyeOff } from "lucide-react";

interface BaseProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseProps {
  as?: "input";
}

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    BaseProps {
  as: "textarea";
}

type Props = InputProps | TextareaProps;

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  ({ label, error, icon, className = "", as = "input", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isTextarea = as === "textarea";
    const isPassword = !isTextarea && (props as InputProps).type === "password";
    const inputType =
      isPassword && showPassword ? "text" : (props as InputProps).type;

    const baseClassName = `
      w-full px-4 py-3 rounded-lg text-sm font-normal text-blue-light border 
      ${error ? "border-accent-red" : "border-border"}
      ${icon ? "pl-10" : ""}
      ${isPassword ? "pr-10" : ""}
      focus:outline-none focus:ring-1 focus:ring-blue-light focus:border-transparent
      transition-all duration-200
      ${isTextarea ? "resize-none" : ""}
      ${className}
    `;

    // For textarea, use props as is
    if (isTextarea) {
      return (
        <div className="w-full">
          {label && (
            <label className="block text-sm font-medium text-black mb-1.5">
              {label}
            </label>
          )}
          <div className="relative">
            {icon && (
              <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
            )}
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={baseClassName}
              {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          </div>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      );
    }

    // For input, remove type from props to avoid override
    const { type, ...inputProps } =
      props as InputHTMLAttributes<HTMLInputElement>;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-black mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type={inputType}
            className={baseClassName}
            {...inputProps}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
