"use client";
import React, { useState } from "react";
import TextInput from "./TextInput";
import Button from "./Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import vehicleLogin from "../../../public/images";

const Login: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      // Simulate login logic
      setTimeout(() => {
        setIsLoading(false);
        const userRole =
          formData.email === "admin@example.com" ? "admin" : "client";
        if (userRole === "admin") {
          router.push("/admin-dash");
        } else {
          router.push("/client-dash");
        }
      }, 1000);
    }
  };

  return (
    <div className="flex w-full container flex space-x-2 items-center justify-center tablet:min-h-[100vh] px-10">
      <div className="image-container w-[50%]">
        <Image
          src="/images/my-vehicle.png"
          alt="Baby Care Logo"
          width={300}
          height={300}
          className="text-bt-primary w-[80%]"
        />
      </div>

      <div className="content flex flex-col gap-5 space-y-4 w-[50%] phone:w-[80%] tablet:w-[40%] justify-start items-start h-full">
        <h3 className="text-lg font-semibold text-center self-center">
          LOGIN TO CONTINUE
        </h3>
        <p className="text-sm">Enter details below</p>

        <form
          className="w-full flex flex-col space-y-5 h-[45%] justify-end"
          onSubmit={handleLogin}
        >
          <TextInput
            error={errors.email}
            borderColor={errors.email ? "red" : "gray"}
            type="email"
            title="Email"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextInput
            error={errors.password}
            borderColor={errors.password ? "red" : "gray"}
            type="password"
            title="Password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            secured={true}
          />
          <div className="flex flex-col">
            <Button
              type="submit"
              disabled={isLoading}
              color={"rgb(38 38 38)"}
              value={isLoading ? "Loading..." : "Login"}
            />
          </div>
        </form>
        <p className="text-center align-middle self-center">- OR -</p>

        <Button
          //   icon={<FcGoogle />}
          value="Continue with Google"
          type="button"
          onClick={() => {
            alert("Google login is not implemented");
          }}
        />

        <p className="text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:text-blue-800">
            Create One
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
