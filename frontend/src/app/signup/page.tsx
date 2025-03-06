"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaRegEnvelope, FaUser, FaPhoneAlt } from "react-icons/fa";
import { MdLockOutline, MdPersonOutline } from "react-icons/md";
import { FiEyeOff } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import { LuNotebookPen } from "react-icons/lu";
import Link from "next/link";
import AuthLayout from "../../components/authLayout";
import Button from "../login/Button";
import { signup } from "../../api/services/userService";

const Signup: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
  });
  const [passwordShown, setPasswordShown] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      username: "",
      email: "",
      password: "",
      phoneNumber: "",
      gender: "",
    };

    if (!formData.username) {
      newErrors.username = "Username is required";
      valid = false;
    }

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

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
      valid = false;
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const result = await signup(formData);
        if (result.success) {
          toast.success("Signup successful!");
          router.push("/login");
        } else {
          toast.error("Failed to register. Please try again.");
        }
      } catch (error: any) {
        toast.error("Something went wrong. Please try again.");
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
              Create an Account
            </h2>
            <div className="border-[1px] w-10 bg-primary border-primary inline-block mb-2" />
          </div>

          <div className="flex items-center justify-center ">
            <LuNotebookPen className="text-2xl" />
          </div>

          <div className="flex flex-col items-center">
            <form
              className="w-full"
              onSubmit={handleSignup}
              data-testid="signupForm"
            >
              <div className="flex items-center w-full p-2 my-2 mb-2 bg-gray-100 border rounded-md border-gray dark:bg-dark-bg">
                <FaUser className="mr-2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="flex-1 px-2 text-sm bg-gray-100 outline-none dark:border-white dark:bg-dark-bg dark:text-white"
                />
              </div>
              <div className="pl-4 mb-1 text-left">
                {errors.username && (
                  <small className="text-red-600">{errors.username}</small>
                )}
              </div>

              <div className="flex items-center w-full p-2 my-2 mb-2 bg-gray-100 border rounded-md border-gray dark:bg-dark-bg">
                <FaRegEnvelope className="mr-2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="flex-1 px-2 text-sm bg-gray-100 outline-none dark:border-white dark:bg-dark-bg dark:text-white"
                />
              </div>
              <div className="pl-4 mb-1 text-left">
                {errors.email && (
                  <small className="text-red-600">{errors.email}</small>
                )}
              </div>

              <div className="flex items-center w-full p-2 my-4 mb-2 bg-gray-100 border rounded-md md:w-full border-gray dark:border-white dark:bg-dark-bg">
                <MdLockOutline className="mr-2 text-gray-400" />
                <input
                  type={passwordShown ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="flex-1 text-sm bg-gray-100 outline-none dark:border-white dark:bg-dark-bg dark:text-white"
                />
                <div className="text-gray-400 cursor-pointer">
                  {passwordShown ? (
                    <FaRegEye onClick={togglePassword} />
                  ) : (
                    <FiEyeOff onClick={togglePassword} />
                  )}
                </div>
              </div>
              <div className="pl-4 mb-1 text-left">
                {errors.password && (
                  <small className="text-red-600">{errors.password}</small>
                )}
              </div>

              <div className="flex items-center w-full">
                <div className="flex items-center w-full p-2 my-2 mb-2 bg-gray-100 border rounded-md border-gray dark:bg-dark-bg">
                  <FaPhoneAlt className="mr-2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="flex-1 px-2 text-sm bg-gray-100 outline-none dark:border-white dark:bg-dark-bg dark:text-white"
                  />
                </div>
                <div className="pl-4 mb-1 text-left">
                  {errors.phoneNumber && (
                    <small className="text-red-600">{errors.phoneNumber}</small>
                  )}
                </div>

                <div className="flex items-center w-full p-2 my-2 mb-2 bg-gray-100 border rounded-md border-gray dark:bg-dark-bg">
                  <MdPersonOutline className="mr-2 text-gray-400" />
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="flex-1 px-2 text-sm bg-gray-100 outline-none dark:border-white dark:bg-dark-bg dark:text-white"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="pl-4 mb-1 text-left">
                {errors.gender && (
                  <small className="text-red-600">{errors.gender}</small>
                )}
              </div>

              <div className="flex flex-col items-center justify-between w-full mt-5 mb-5 rounded sm:flex-row">
                <div className="w-50%">
                  <label
                    htmlFor="checkbox"
                    className="flex items-center text-xs"
                  >
                    <input type="checkbox" name="terms" className="mr-1" />I
                    agree to the terms and conditions
                  </label>
                </div>
              </div>
              <div className="justify-center w-full">
                {isLoading ? (
                  <Button
                    type="button"
                    disabled
                  >
                    Loading...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                  >
                    Sign Up
                  </Button>
                )}
              </div>
            </form>
          </div>

          <div className="my-4 text-sm text-center">
            Already have an account?
            <Link href="/login" className="mx-1 text-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;
