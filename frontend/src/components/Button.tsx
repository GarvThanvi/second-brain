import type { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  text: string;
  startIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantClasses = {
  primary: "bg-custom-blue text-white",
  secondary: "bg-custom-gray text-custom-blue",
};

const defaultClasses =
  "px-4 py-2 rounded-md font-normal flex items-center justify-center";

const Button = ({
  variant,
  text,
  startIcon,
  onClick,
  fullWidth,
  loading,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${variantClasses[variant]} ${defaultClasses} ${
        fullWidth ? "w-full" : ""
      } ${loading ? "opacity-45" : ""}`}
      disabled={loading}
    >
      {startIcon && <div className="pr-2">{startIcon}</div>}
      {text}
    </button>
  );
};

export default Button;
