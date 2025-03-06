"use client";
import React, { ReactNode } from "react";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-row font-serif grow bg-indigo-50">
      <div className="image-container w-[50%]">
        <Image
          src="/images/my-vehicle.png"
          alt="logo"
          width={300}
          height={300}
          className="text-bt-primary w-[80%]"
        />
      </div>

      <div className="w-full lg:w-[50%] flex flex-row items-end">
        {children}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AuthLayout;
