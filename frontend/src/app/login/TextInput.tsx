import React from "react";
import { MdPersonOutline } from "react-icons/md";
import { FiEyeOff } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  error: string;
  togglePassword?: () => void;
}

export const TextInput: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  icon,
  error,
  togglePassword,
}) => (
  <div className="flex items-center w-full p-2 my-2 mb-2 bg-gray-100 border rounded-md border-gray dark:bg-dark-bg">
    {icon}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="flex-1 px-2 text-sm bg-gray-100 outline-none dark:border-white dark:bg-dark-bg dark:text-white"
    />
    {togglePassword && (
      <div className="text-gray-400 cursor-pointer" onClick={togglePassword}>
        {type === "text" ? <FaRegEye /> : <FiEyeOff />}
      </div>
    )}
  </div>
);

export const SelectInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error: string;
}> = ({ value, onChange, options, error }) => (
  <div className="flex items-center w-full p-2 my-2 mb-2 bg-gray-100 border rounded-md border-gray dark:bg-dark-bg">
    <MdPersonOutline className="mr-2 text-gray-400" />
    <select
      value={value}
      onChange={onChange}
      className="flex-1 px-2 text-sm bg-gray-100 outline-none dark:border-white dark:bg-dark-bg dark:text-white"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
