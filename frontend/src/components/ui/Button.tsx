import type { ReactElement } from "react";

type Variants = "primary" | "secondary";
type Size = "sm" | "md" | "lg";
interface ButtonProps {
  variant: Variants;
  size: Size;
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick: () => void;
}

const variantStyles: Record<Variants, string> = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-primary",
};

const sizeStyles: Record<Size, string> = {
  sm: "py-1 px-2",
  md: "py-2 px-4",
  lg: "py-4 px-6",
};

const defaultStyles = "rounded-md flex items-center";

const Button = (props: ButtonProps) => {
  return (
    <button
      className={`${variantStyles[props.variant]} ${defaultStyles} ${
        sizeStyles[props.size]
      }`}
    >
      {props.startIcon ? <div className="pr-2">{props.startIcon}</div> : null} {props.text} {props.endIcon ? <div>{props.endIcon}</div> : null}
    </button>
  );
};

export default Button;
