import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

interface InputProps {
  title?: string;
  placeholder?: string;
  value?: string;
  error?: string;
  type?: string;
  secured?: boolean;
  borderColor?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<InputProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-container flex relative my-2 w-full flex-col">
      {props.title && (
        <p className="bg-white absolute top-[-10px] px-4 text-black ml-2 text-xs">
          {props.title}
        </p>
      )}
      <div
        className={
          !props.error
            ? "input border border-gray-400 rounded-sm w-full"
            : "input border border-red-400 rounded-sm w-full"
        }
      >
        <input
          type={showPassword ? "text" : props.type}
          placeholder={props.placeholder}
          title={props.title}
          value={props.value}
          onChange={props.onChange}
          className="rounded phone:p-2 p-4 outline-none w-full text-black text-sm"
        />
        <div className="eye absolute top-[30%] right-[5%]">
          {props.secured ? (
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              {!showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
      <p className="error text-red-600 text-xs self-start">{props.error}</p>
    </div>
  );
};

export default TextInput;
