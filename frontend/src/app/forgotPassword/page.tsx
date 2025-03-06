"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaRegEnvelope } from "react-icons/fa";
import AuthLayout from "../../components/authLayout";
import { TextInput } from "../login/TextInput";
import Button from "../login/Button";
import Link from "next/link";
import useAxiosClient from "@/hooks/axiosClient";

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({ email: "" });
  const client = useAxiosClient();

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await client.post("/users/forget", formData);
        if (response.status === 200) {
          toast.success("Password reset link sent to your email!");
          router.push("/resetPassword");
        } else {
          toast.error("Failed to send reset link. Please try again.");
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-lg p-5 mx-auto bg-indigo-100 mt-10 mb-28 md:shadow-xl sm:shadow-none md:rounded-xl sm:rounded-none">
        <div className="">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-primary">Forgot Password</h2>
            <div className="border-[1px] w-10 bg-primary border-primary inline-block mb-2" />
          </div>

          <div className="text-sm text-center">
            Enter your email to reset your password
          </div>

          <div className="flex flex-col items-center">
            <form
              className="w-full"
              onSubmit={handleForgotPassword}
              data-testid="forgotPasswordForm"
            >
              <TextInput
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                icon={<FaRegEnvelope className="mr-2 text-gray-400" />}
                error={errors.email}
              />
              <div className="pl-4 mb-1 text-left">
                {errors.email && (
                  <small className="text-red-600">{errors.email}</small>
                )}
              </div>
              <div className="justify-center w-full mt-5">
                <Button
                  type="submit"
                  className="w-full bg-primary m-0 inline-block rounded-md lg:px-12 lg:py-2 sm:px-4 sm:py-1 md:font-semibold sm:mt-2 sm:font-medium text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          </div>

          <div className="my-4 text-sm text-center">
            <Link href="/login" className="mx-1 text-primary">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
