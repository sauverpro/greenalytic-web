"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { login } from "../../services/userService";
import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { FiEyeOff } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import Link from "next/link";
import AuthLayout from "../../components/authLayout";
import { TextInput } from "./TextInput";
import Button from "./Button";

const Login: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [passwordShown, setPasswordShown] = useState(false);

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
    } else if (formData.password.length < 3) {
      newErrors.password = "Password must contain at least 3 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const result = await login(formData);
        if (result.success) {
          if (result.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/client");
          }
          toast.success("Login successful!");
        } else {
          toast.error(result.message);
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-lg p-5 mx-auto bg-indigo-100 mt-10 mb-28 md:shadow-xl sm:shadow-none md:rounded-xl sm:rounded-none">
        <div className="">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-primary">
              Welcome to Greenalytic
            </h2>
            <div className="border-[1px] w-10 bg-primary border-primary inline-block mb-2" />
          </div>

          <div className="text-sm text-center">Login to continue</div>

          <div className="flex flex-col items-center">
            <form
              className="w-full"
              onSubmit={handleLogin}
              data-testid="loginForm"
            >
              {errors.password && (
                <div className="w-full p-4 my-4 text-center bg-red-400 rounded-md">
                  <small className="text-white">{errors.password}</small>
                </div>
              )}
              <TextInput
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                icon={<FaRegEnvelope className="mr-2 text-sms" />}
                error={errors.email}
              />
              <div className="pl-4 mb-1 text-left">
                {errors.email && (
                  <small className="text-red-600">{errors.email}</small>
                )}
              </div>

              <TextInput
                type={passwordShown ? "text" : "password"}
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                icon={<MdLockOutline className="mr-2 text-sms" />}
                error={errors.password}
                togglePassword={togglePassword}
              />
              <div className="pl-4 mb-1 text-left">
                {errors.password && (
                  <small className="text-red-600">{errors.password}</small>
                )}
              </div>
              <div className="flex flex-col items-center justify-between w-full mt-5 mb-5 rounded sm:flex-row">
                <div className="w-50%">
                  <label
                    htmlFor="checkbox"
                    className="flex items-center text-xs"
                  >
                    <input type="checkbox" name="remember" className="mr-1" />
                    Remember me
                  </label>
                </div>
                <div className="w-[50%] flex flex-row justify-end">
                  <Link href="/forgotPassword" className="text-xs">
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <div className="justify-center w-full">
                {isLoading ? (
                  <Button type="button" disabled>
                    Loading...
                  </Button>
                ) : (
                  <Button type="submit">Login</Button>
                )}
              </div>
            </form>
          </div>

          <div className="my-4 text-sm text-center">
            First time here?
            <Link href="/signup" className="mx-1 text-primary">
              Register
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
