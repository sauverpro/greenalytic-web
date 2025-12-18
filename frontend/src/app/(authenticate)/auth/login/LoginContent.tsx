"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Users,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import authService, { LoginCredentials } from "@/services/authservice";
import { useAuth } from "@/lib/use-auth";


export default function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();
  const { login, handleGoogleCallback } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      handleGoogleCallback(token);
    }
  }, [searchParams, handleGoogleCallback]);


  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setFormError(null);

    try {
      console.log("the reponseloggin in *****************************************",)
      const response = await login(data);


      if (response?.message) {
        setFormSuccess(response.message);

      }
      router.push("/dashboard");
    } catch (error: Error | unknown) {
      const message =
        (error instanceof Error ? error.message : "Login failed") ||
        (typeof error === "object" && error !== null && "response" in error
          ? (error as any).response?.data?.message
          : "Login failed");
      setFormError(message);
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setFormError(null);

    try {
      await authService.initiateGoogleLogin();
    } catch (error: any) {
      setFormError(error.message);
      setIsGoogleLoading(false);
    }
  };

  // Show loading state during Google callback processing
  if (isGoogleLoading && searchParams.get("token")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Processing Google login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-6xl shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 min-h-[600px]">
                {/* Left Side - Branding */}
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-12 text-white relative">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10">
                    <Image
                      src="/images/logo.png"
                      alt="Greenalytic Logo"
                      width={180}
                      height={90}
                      className="object-contain mb-6 brightness-0 invert"
                    />
                    <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
                    <p className="text-xl text-green-100 mb-8">
                      Sign in to your Vehicle Data Monitoring Platform
                    </p>
                    <div className="space-y-6">
                      {[
                        {
                          icon: BarChart3,
                          title: "Real-time Analytics",
                          desc: "Monitor vehicle emissions and performance data",
                        },
                        {
                          icon: Shield,
                          title: "Secure Platform",
                          desc: "Enterprise-grade security for your fleet data",
                        },
                        {
                          icon: Users,
                          title: "Team Collaboration",
                          desc: "Role-based access for your entire team",
                        },
                      ].map(({ icon: Icon, title, desc }, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="bg-white/20 p-3 rounded-full">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{title}</h3>
                            <p className="text-green-100">{desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-12 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                      <p className="text-sm text-green-100 italic">
                        "Greenalytic has transformed how we monitor our fleet
                        emissions..."
                      </p>
                      <p className="text-sm font-semibold mt-2">
                        - Fleet Manager, EcoTransport Ltd
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="p-12 bg-white flex flex-col justify-center">
                  <div className="max-w-md mx-auto w-full">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Sign In
                      </h2>
                      <p className="text-gray-600">
                        Enter your credentials to access your dashboard
                      </p>
                    </div>

                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {formError && (
                        <Alert variant="destructive">
                          <AlertDescription>{formError}</AlertDescription>
                        </Alert>
                      )}
                      {formSuccess && (
                        <Alert variant="default" className="bg-green-100 text-green-900">
                          <AlertDescription>{formSuccess}</AlertDescription>
                        </Alert>
                      )}
                      {/* email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your Email"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                              },
                            })}
                            className="pl-12 h-12 text-base"
                          />
                        </div>
                        {errors.email && (
                          <p className="text-sm text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...register("password", {
                              required: "Password is required",
                              minLength: {
                                value: 6,
                                message: "Minimum 6 characters",
                              },
                            })}
                            className="pl-12 pr-12 h-12 text-base"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-500">
                            {errors.password.message}
                          </p>
                        )}
                      </div>

                      {/* Remember + Forgot */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-green-600"
                          />
                          <span>Remember me</span>
                        </label>
                        <Link
                          href="/auth/forgotPassword"
                          className="text-sm text-green-600 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full h-12 text-base text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            Signing in...
                          </div>
                        ) : (
                          "Sign In"
                        )}
                      </Button>

                      <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-300" />
                        <span className="mx-3 text-sm text-gray-400">
                          or continue with
                        </span>
                        <div className="flex-grow border-t border-gray-300" />
                      </div>

                      <div className="space-y-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 text-gray-700"
                          onClick={handleGoogleLogin}
                          disabled={isGoogleLoading}
                        >
                          {isGoogleLoading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2" />
                              <span className="text-sm font-medium">
                                Redirecting to Google...
                              </span>
                            </div>
                          ) : (
                            <>
                              <span className="text-sm font-medium">
                                Sign in with Google
                              </span>
                              <Image
                                src="/icons8-google-50.png"
                                alt="Google"
                                width={20}
                                height={20}
                                className="h-5 w-5"
                              />
                            </>
                          )}
                        </Button>
                      </div>

                      <p className="text-center text-gray-600">
                        Don't have an account?{" "}
                        <Link
                          href="/auth/signup"
                          className="text-green-600 hover:underline font-semibold"
                        >
                          Create one here
                        </Link>
                      </p>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
                      By signing in, you agree to our{" "}
                      <Link
                        href="/terms"
                        className="text-green-600 hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-green-600 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
