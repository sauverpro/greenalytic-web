import React from "react";
import { FcGoogle } from "react-icons/fc";

interface ButtonProps {
  name?: string;
  value?: string;
  color?: string;
  icon?: any;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
}

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button
      type={props.type}
      style={{
        backgroundColor: props.color || "rgb(38 38 38)",
        display: "flex",
        flexDirection: "row",
      }}
      className={`bg-[#059669] rounded-sm mt-2 px-4 w-full py-3 border-none flex space-x-2 items-center justify-center gap-2`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.icon}
      <p className={`text-sm`} style={{ color: "white" }}>
        {props.value}
      </p>
    </button>
  );
};

export default Button;
