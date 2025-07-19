"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaRegEnvelope, FaLock } from "react-icons/fa";
import AuthLayout from "../../../components/authLayout";
import { TextInput } from "../../(auth)/login/TextInput";
import Button from "../../(auth)/login/Button";
import useAxiosClient from "@/hooks/axiosClient";
import Link from "next/link";

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newpassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    newpassword: "",
    confirmPassword: "",
  });
  const client = useAxiosClient();

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: "",
      otp: "",
      newpassword: "",
      confirmPassword: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if (!formData.otp) {
      newErrors.otp = "OTP is required";
      valid = false;
    }

    if (!formData.newpassword) {
      newErrors.newpassword = "New password is required";
      valid = false;
    } else if (formData.newpassword.length < 6) {
      newErrors.newpassword = "New password must be at least 6 characters";
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
      valid = false;
    } else if (formData.confirmPassword !== formData.newpassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await client.post("/users/reset", formData);
        if (response.status === 200) {
          toast.success("Password reset successfully!");
          router.push("/login");
        } else {
          toast.error("Failed to reset password. Please try again.");
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
            <h2 className="text-2xl font-bold text-primary">Reset Password</h2>
            <div className="border-[1px] w-10 bg-primary border-primary inline-block mb-2" />
          </div>

          <div className="text-sm text-center">
            Enter your email, OTP, and new password to reset your password
          </div>

          <div className="flex flex-col items-center">
            <form
              className="w-full"
              onSubmit={handleResetPassword}
              data-testid="resetPasswordForm"
            >
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
                type="text"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={(e) =>
                  setFormData({ ...formData, otp: e.target.value })
                }
                icon={<FaLock className="mr-2 text-sms" />}
                error={errors.otp}
              />
              <div className="pl-4 mb-1 text-left">
                {errors.otp && (
                  <small className="text-red-600">{errors.otp}</small>
                )}
              </div>

              <TextInput
                type="password"
                placeholder="Enter new password"
                value={formData.newpassword}
                onChange={(e) =>
                  setFormData({ ...formData, newpassword: e.target.value })
                }
                icon={<FaLock className="mr-2 text-sms" />}
                error={errors.newpassword}
              />
              <div className="pl-4 mb-1 text-left">
                {errors.newpassword && (
                  <small className="text-red-600">{errors.newpassword}</small>
                )}
              </div>

              <TextInput
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                icon={<FaLock className="mr-2 text-sms" />}
                error={errors.confirmPassword}
              />
              <div className="pl-4 mb-1 text-left">
                {errors.confirmPassword && (
                  <small className="text-red-600">
                    {errors.confirmPassword}
                  </small>
                )}
              </div>

              <div className="justify-center w-full mt-5">
                <Button
                  type="submit"
                  className="w-full bg-primary m-0 inline-block rounded-md lg:px-12 lg:py-2 sm:px-4 sm:py-1 md:font-semibold sm:mt-2 sm:font-medium text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Reset Password"}
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

export default ResetPassword;
