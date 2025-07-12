'use client';
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, User, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
export default function Navbar() {

  const [isScrolled, setIsScrolled] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const pathname = usePathname()




  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Team', href: '/team' },
    { name: 'Partners', href: '/partners' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  return (
    <>
      {/* Green Accent Stripe */}
      <div className="h-1 bg-gradient-to-r from-greenalytic-light via-greenalytic to-greenalytic-dark"></div>
      
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}>
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-greenalytic to-transparent opacity-60"></div>
        
        <div className="px-4">
          <div className="flex items-center justify-between py-4">
            
            {/* Simple Logo Section */}
            <Link href="/" className="flex items-center group">
              <img 
                src="/Greenalytic.png" 
                alt="Greenalytic Motors" 
                className="h-24 w-auto group-hover:scale-105 transition-transform duration-300" 
              />
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 xl:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive ? "text-green-600 bg-green-50" : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Sheet open={isSignInOpen} onOpenChange={setIsSignInOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-green-600">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Sign In to Greenalytic</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <SignInForm onClose={() => setIsSignInOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
                <SheetTrigger asChild>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    <User className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Join Greenalytic</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <SignUpForm onClose={() => setIsSignUpOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <img src="/Greenalytic.png" alt="Greenalytic Motors" className="h-16 w-auto" />
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={`block px-3 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                          isActive
                            ? "text-green-600 bg-green-50"
                            : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.name}
                      </Link>
                    )
                  })}
                </div>

                <Separator className="my-6" />

                {/* Mobile Auth Buttons */}
                <div className="space-y-3">
                  <Sheet open={isSignInOpen} onOpenChange={setIsSignInOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={closeMobileMenu}
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[400px] sm:w-[540px]">
                      <SheetHeader>
                        <SheetTitle>Sign In to Greenalytic</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <SignInForm onClose={() => setIsSignInOpen(false)} />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Sheet open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
                    <SheetTrigger asChild>
                      <Button
                        className="w-full justify-start bg-green-600 hover:bg-green-700"
                        onClick={closeMobileMenu}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Sign Up
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[400px] sm:w-[540px]">
                      <SheetHeader>
                        <SheetTitle>Join Greenalytic</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <SignUpForm onClose={() => setIsSignUpOpen(false)} />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </SheetContent>
            </Sheet>

          </div>
        </div>


      </nav>

    </>
  );
  function SignInForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your password"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
          Forgot password?
        </Link>
      </div>

      <div className="space-y-3">
        <Button className="w-full bg-green-600 hover:bg-green-700">Sign In</Button>
        <Button variant="outline" className="w-full bg-transparent">
          Continue with Google
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600">
        {"Don't have an account? "}
        <button onClick={onClose} className="text-green-600 hover:text-green-700 font-medium">
          Sign up
        </button>
      </p>
    </div>
  )
}
  
  function SignUpForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="First name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Last name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="signupEmail"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="signupPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Create a password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Confirm your password"
          />
        </div>
      </div>

      <div className="flex items-start">
        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500 mt-1" />
        <span className="ml-2 text-sm text-gray-600">
          I agree to the{" "}
          <Link href="/terms" className="text-green-600 hover:text-green-700">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-green-600 hover:text-green-700">
            Privacy Policy
          </Link>
        </span>
      </div>

      <div className="space-y-3">
        <Button className="w-full bg-green-600 hover:bg-green-700">Create Account</Button>
        <Button variant="outline" className="w-full bg-transparent">
          Continue with Google
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button onClick={onClose} className="text-green-600 hover:text-green-700 font-medium">
          Sign in
        </button>
      </p>
    </div>
  )
}
}