"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, User, Mail, Phone, Building, Users, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"


const USER_ROLES = [
  { value: "fleet_manager", label: "Fleet Manager", description: "Manage fleet operations and view analytics" },
  { value: "technician", label: "Technician", description: "Handle device installation and diagnostics" },
  { value: "analyst", label: "Analyst", description: "Access reports and data analysis tools" },
  { value: "support_agent", label: "Support Agent", description: "Provide customer support and assistance" },
]

const BUSINESS_SECTORS = [
  "Transport",
  "Logistics",
  "Delivery",
  "Agriculture",
  "Construction",
  "Mining",
  "Tourism",
  "Other",
]

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "rw", label: "Kinyarwanda" },
]

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    nationalId: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
    companyName: "",
    companyRegNo: "",
    businessSector: "",
    fleetSize: "",
    notificationPreference: "email",
    language: "en",
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required"
      } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
        newErrors.fullName = "Full name should contain only letters"
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      }

      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required"
      } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
        newErrors.phoneNumber = "Please enter a valid phone number"
      }
    }

    if (step === 2) {
      if (!formData.username.trim()) {
        newErrors.username = "Username is required"
      } else if (formData.username.length < 6 || formData.username.length > 10) {
        newErrors.username = "Username must be 6-10 characters"
      }

      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters"
      } else if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)) {
        newErrors.password = "Password must include uppercase letter and symbol"
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }

      if (!formData.role) {
        newErrors.role = "Please select a role"
      }
    }

    if (step === 3) {
      if (formData.role === "fleet_manager") {
        if (!formData.fleetSize) {
          newErrors.fleetSize = "Fleet size is required for fleet managers"
        }
      }
    }

    if (step === 4) {
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms of use"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(4)) return

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Registration successful", formData)
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const stepTitles = ["Personal Information", "Account Setup", "Company Details", "Preferences & Terms"]

  const progress = (currentStep / 4) * 100

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`pl-12 h-12 ${errors.fullName ? "border-red-500" : "border-gray-300 focus:border-green-500"}`}
                  />
                </div>
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-12 h-12 ${errors.email ? "border-red-500" : "border-gray-300 focus:border-green-500"}`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                  Phone Number *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="+250 xxx xxx xxx"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`pl-12 h-12 ${errors.phoneNumber ? "border-red-500" : "border-gray-300 focus:border-green-500"}`}
                  />
                </div>
                {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalId" className="text-sm font-medium text-gray-700">
                  National ID / Passport (Optional)
                </Label>
                <Input
                  id="nationalId"
                  name="nationalId"
                  placeholder="Enter ID number"
                  value={formData.nationalId}
                  onChange={handleInputChange}
                  className="h-12 border-gray-300 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username *
                </Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="6-10 characters"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`h-12 ${errors.username ? "border-red-500" : "border-gray-300 focus:border-green-500"}`}
                />
                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                  <SelectTrigger
                    className={`h-12 ${errors.role ? "border-red-500" : "border-gray-300 focus:border-green-500"}`}
                  >
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-sm text-gray-500">{role.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 chars, uppercase & symbol"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pr-12 h-12 ${errors.password ? "border-red-500" : "border-gray-300 focus:border-green-500"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pr-12 h-12 ${errors.confirmPassword ? "border-red-500" : "border-gray-300 focus:border-green-500"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Optional:</strong> Company information is required for fleet managers and helpful for
                organizational accounts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                  Company Name
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="pl-12 h-12 border-gray-300 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyRegNo" className="text-sm font-medium text-gray-700">
                  Company Registration Number
                </Label>
                <Input
                  id="companyRegNo"
                  name="companyRegNo"
                  placeholder="Enter registration number"
                  value={formData.companyRegNo}
                  onChange={handleInputChange}
                  className="h-12 border-gray-300 focus:border-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Business Sector</Label>
                <Select
                  value={formData.businessSector}
                  onValueChange={(value) => handleSelectChange("businessSector", value)}
                >
                  <SelectTrigger className="h-12 border-gray-300 focus:border-green-500">
                    <SelectValue placeholder="Select business sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_SECTORS.map((sector) => (
                      <SelectItem key={sector} value={sector.toLowerCase()}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fleetSize" className="text-sm font-medium text-gray-700">
                  Fleet Size (Number of Vehicles) {formData.role === "fleet_manager" && "*"}
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="fleetSize"
                    name="fleetSize"
                    type="number"
                    placeholder="Enter number of vehicles"
                    value={formData.fleetSize}
                    onChange={handleInputChange}
                    className={`pl-12 h-12 ${errors.fleetSize ? "border-red-500" : "border-gray-300 focus:border-green-500"}`}
                  />
                </div>
                {errors.fleetSize && <p className="text-sm text-red-500">{errors.fleetSize}</p>}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-base font-medium text-gray-900">Notification Preference</Label>
                <RadioGroup
                  value={formData.notificationPreference}
                  onValueChange={(value) => handleSelectChange("notificationPreference", value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="email" id="email-notif" />
                    <Label htmlFor="email-notif" className="flex-1 cursor-pointer">
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-gray-500">Receive notifications via email</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="sms" id="sms-notif" />
                    <Label htmlFor="sms-notif" className="flex-1 cursor-pointer">
                      <div className="font-medium">SMS</div>
                      <div className="text-sm text-gray-500">Receive notifications via SMS</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="whatsapp" id="whatsapp-notif" />
                    <Label htmlFor="whatsapp-notif" className="flex-1 cursor-pointer">
                      <div className="font-medium">WhatsApp</div>
                      <div className="text-sm text-gray-500">Receive notifications via WhatsApp</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium text-gray-900">Language</Label>
                  <Select value={formData.language} onValueChange={(value) => handleSelectChange("language", value)}>
                    <SelectTrigger className="h-12 border-gray-300 focus:border-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))}
                  className={`mt-1 ${errors.agreeToTerms ? "border-red-500" : ""}`}
                />
                <div className="flex-1">
                  <Label htmlFor="agreeToTerms" className="text-sm cursor-pointer">
                    I agree to the{" "}
                    <Link href="/terms" className="text-green-600 hover:underline font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-green-600 hover:underline font-medium">
                      Privacy Policy
                    </Link>
                    . I understand that my account will be reviewed and approved within 24 hours.
                  </Label>
                </div>
              </div>
              {errors.agreeToTerms && <p className="text-sm text-red-500 mt-2">{errors.agreeToTerms}</p>}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-7xl shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-5">
                {/* Left Sidebar - Progress & Branding */}
                <div className="lg:col-span-2 bg-gradient-to-br from-green-600 to-emerald-700 p-8 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="mb-8">
                      <Image
                        src="/images/logo.png"
                        alt="Greenalytic Logo"
                        width={160}
                        height={80}
                        className="object-contain mb-6 brightness-0 invert"
                      />
                      <h1 className="text-3xl font-bold mb-2">Join Greenalytic</h1>
                      <p className="text-green-100">Create your account to start monitoring vehicle emissions</p>
                    </div>

                    {/* Progress Section */}
                    <div className="mb-8">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Step {currentStep} of 4</span>
                        <span>{Math.round(progress)}% Complete</span>
                      </div>
                      <Progress value={progress} className="h-2 bg-white/20" />
                      <p className="text-sm text-green-100 mt-2">{stepTitles[currentStep - 1]}</p>
                    </div>

                    {/* Steps List */}
                    <div className="space-y-4 flex-1">
                      {stepTitles.map((title, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                              index + 1 < currentStep
                                ? "bg-white text-green-600"
                                : index + 1 === currentStep
                                  ? "bg-green-400 text-white"
                                  : "bg-white/20 text-white"
                            }`}
                          >
                            {index + 1 < currentStep ? <CheckCircle className="h-5 w-5" /> : index + 1}
                          </div>
                          <span
                            className={`text-sm ${index + 1 <= currentStep ? "text-white font-medium" : "text-green-200"}`}
                          >
                            {title}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                      <p className="text-sm text-green-100">
                        <strong>Need help?</strong> Contact our support team at support@greenalytic.com
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Content - Form */}
                <div className="lg:col-span-3 p-8 bg-white">
                  <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{stepTitles[currentStep - 1]}</h2>
                      <p className="text-gray-600">
                        {currentStep === 1 && "Let's start with your basic information"}
                        {currentStep === 2 && "Set up your login credentials and role"}
                        {currentStep === 3 && "Tell us about your organization (optional)"}
                        {currentStep === 4 && "Almost done! Set your preferences"}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                      {errors.general && (
                        <Alert variant="destructive" className="mb-6">
                          <AlertDescription>{errors.general}</AlertDescription>
                        </Alert>
                      )}

                      {renderStepContent()}

                      <div className="flex justify-between items-center mt-8 pt-6 border-t">
                        <div className="flex space-x-4">
                          {currentStep > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handlePrevious}
                              className="flex items-center space-x-2 px-6 py-3 bg-transparent"
                            >
                              <ArrowLeft className="h-4 w-4" />
                              <span>Previous</span>
                            </Button>
                          )}
                        </div>

                        <div className="flex space-x-4">
                          {currentStep < 4 ? (
                            <Button
                              type="button"
                              onClick={handleNext}
                              className="bg-green-600 hover:bg-green-700 flex items-center space-x-2 px-6 py-3"
                            >
                              <span>Next</span>
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              type="submit"
                              disabled={isLoading}
                              className="bg-green-600 hover:bg-green-700 px-8 py-3"
                            >
                              {isLoading ? (
                                <div className="flex items-center space-x-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  <span>Creating Account...</span>
                                </div>
                              ) : (
                                "Create Account"
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="text-center mt-6">
                        <p className="text-gray-600">
                          Already have an account?{" "}
                          <Link
                            href="/login"
                            className="text-green-600 hover:text-green-700 font-semibold hover:underline"
                          >
                            Sign in here
                          </Link>
                        </p>
                      </div>
                    </form>
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
