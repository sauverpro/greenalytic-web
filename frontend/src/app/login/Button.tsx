import React from "react";

interface ButtonProps {
  type: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string; // Keep this to allow additional custom classes
}

const Button: React.FC<ButtonProps> = ({
  type,
  disabled,
  onClick,
  children,
  className = "", 
}) => {
  const baseStyles =
    "w-full bg-primary hover:bg-second m-0 inline-block rounded-md lg:px-12 lg:py-2 sm:px-4 sm:py-1 md:font-semibold sm:mt-2 sm:font-medium text-white";

  const disabledStyles = disabled ? "opacity-50" : "";

  const combinedStyles = `${baseStyles} ${disabledStyles} ${className}`;

  return (
    <button
      type={type}
      className={combinedStyles}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
