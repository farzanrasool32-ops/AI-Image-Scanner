import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "lime" | "text";
  size?: "normal" | "small";
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  size = "normal",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = [
    "button",
    `button-${variant}`,
    size === "small" ? "button-small" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
