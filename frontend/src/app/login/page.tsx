"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail, Shield, Users, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Login successful", formData)
    } catch (error) {
      setErrors({ general: "Invalid username or password" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-6xl shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 min-h-[600px]">
                {/* Left Side - Branding & Features */}
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-12 flex flex-col justify-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="mb-8">
                      <Image
                        src="/images/logo.png"
                        alt="Greenalytic Logo"
                        width={180}
                        height={90}
                        className="object-contain mb-6 brightness-0 invert"
                      />
                      <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
                      <p className="text-xl text-green-100 mb-8">Sign in to your Vehicle Data Monitoring Platform</p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-full">
                          <BarChart3 className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Real-time Analytics</h3>
                          <p className="text-green-100">Monitor vehicle emissions and performance data</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-full">
                          <Shield className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Secure Platform</h3>
                          <p className="text-green-100">Enterprise-grade security for your fleet data</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-full">
                          <Users className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Team Collaboration</h3>
                          <p className="text-green-100">Role-based access for your entire team</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                      <p className="text-sm text-green-100 italic">
                        "Greenalytic has transformed how we monitor our fleet emissions. The real-time insights help us
                        maintain compliance and reduce our environmental impact."
                      </p>
                      <p className="text-sm font-semibold mt-2">- Fleet Manager, EcoTransport Ltd</p>
                    </div>
                  </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="p-12 flex flex-col justify-center bg-white">
                  <div className="max-w-md mx-auto w-full">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                      <p className="text-gray-600">Enter your credentials to access your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {errors.general && (
                        <Alert variant="destructive">
                          <AlertDescription>{errors.general}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                          Username
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={`pl-12 h-12 text-base ${errors.username ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                          />
                        </div>
                        {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`pl-12 pr-12 h-12 text-base ${errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                            Remember me
                          </label>
                        </div>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Signing in...
                          </div>
                        ) : (
                          "Sign In"
                        )}
                      </Button>

                      <div className="text-center">
                        <p className="text-gray-600">
                          {"Don't have an account? "}
                          <Link
                            href="/signup"
                            className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
                          >
                            Create one here
                          </Link>
                        </p>
                      </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <p className="text-xs text-gray-500 text-center">
                        By signing in, you agree to our{" "}
                        <Link href="/terms" className="text-green-600 hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-green-600 hover:underline">
                          Privacy Policy
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
