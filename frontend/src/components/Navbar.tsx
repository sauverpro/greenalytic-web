"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Home,
  Users,
  Handshake,
  Newspaper,
  Phone,
  Mail,
  Info,
  Package,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  CheckSquare
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Info },
  { name: "Products", href: "/products", icon: Package },
  { name: "Team", href: "/team", icon: Users },
  { name: "Partners", href: "/partners", icon: Handshake },
  { name: "Blog", href: "/blog", icon: Newspaper },
  { name: "Contact", href: "/contact", icon: Phone },
  { name: "Login", href: "/auth/login", icon: Phone }
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const NavButton = ({
    item,
    mobile = false
  }: {
    item: (typeof navigationItems)[0];
    mobile?: boolean;
  }) => {
    const active = isActive(item.href);
    const baseClasses = mobile
      ? "flex items-center gap-3 px-4 py-3 text-left w-full transition-all duration-200"
      : "px-6 py-2 text-sm font-medium transition-all duration-200 relative";

    const activeClasses = active
      ? mobile
        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-tl-2xl rounded-br-2xl shadow-lg"
        : "bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-tl-2xl rounded-br-2xl shadow-lg transform scale-105"
      : mobile
        ? "text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 rounded-tl-xl rounded-br-xl"
        : "text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 hover:rounded-tl-xl hover:rounded-br-xl hover:shadow-md";

    return (
      <Link href={item.href} className={`${baseClasses} ${activeClasses}`}>
        {mobile && <item.icon className="h-5 w-5" />}
        {item.name}
        {active &&
          !mobile &&
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm" />}
      </Link>
    );
  };

  return <div className="w-full">
    {/* Top Contact Bar */}
    <div className="bg-gray-800 text-white py-2 px-4 hidden md:block h-12">
      <div className="container mx-auto flex justify-between items-center text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>info@greenalytic.rw</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>+250 788 567 890</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {socialLinks.map((social, index) =>
            <Link
              key={index}
              href={social.href}
              className="hover:text-green-400 transition-colors duration-200"
              aria-label={social.label}>
              <social.icon className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>

    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group">
            <img src="/Greenalytic.png" alt="Greenalytic Motors" className="h-24 w-auto group-hover:scale-105 transition-transform duration-300" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 ">
            {navigationItems.map(item =>
              <NavButton key={item.name} item={item} />
            )}
          </div>

          {/* Mobile Menu Button & Sheet */}
          <div className="lg:hidden  bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-tl-2xl rounded-br-2xl shadow-lg px-2 txl-xl retive top-36">
            < Sheet open={isOpen} onOpenChange={setIsOpen} >
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-green-50 hover:text-green-600 rounded-tl-lg rounded-br-lg transition-all duration-200">
                  <Menu className="h-10 w-10" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 bg-white border-l-2 border-green-100" style={{ animation: "slideInFromRight 0.3s ease-out" }}>
                {/* Mobile Navigation Content */}
                <div className="h-full flex flex-col p-2">
                  {/* Header with Logo */}
                  <DialogTitle>
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-gray-700 p-6 rounded-tl-2xl rounded-br-2xl ">
                      <div className="flex items-center gap-3">
                        <Image src="/Greenalytic.png" alt="Greenalytic Motors" width={160} height={48} className="h-10 sm:h-12 md:h-16 w-auto brightness-0 invert" priority />
                      </div>
                    </div>
                  </DialogTitle>

                  {/* Navigation Items */}
                  <div className="flex-1 overflow-y-auto p-4 rounded-tl-xl rounded-br-xl border border-green-500 w-full bg-gradient-to-r from-green-50 to-emerald-600">
                    <div className="space-y-2 ">
                      {navigationItems.map(item => {
                        const active = isActive(item.href);
                        return <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-4 py-3 text-left w-full transition-all duration-200 ${active ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-tl-2xl rounded-br-2xl shadow-lg" : "text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 rounded-tl-xl rounded-br-xl"}`}>
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">
                            {item.name}
                          </span>
                        </Link>;
                      })}
                    </div>

                    {/* Contact Info in Mobile */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Contact Info
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">
                            info@greenalytic.rw
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">+250 788 567 890</span>
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Follow Us
                        </h4>
                        <div className="flex items-center gap-3">
                          {socialLinks.map((social, index) =>
                            <Link
                              key={index}
                              href={social.href}
                              className="p-2 bg-gray-100 hover:bg-green-100 hover:text-green-600 rounded-tl-lg rounded-br-lg transition-all duration-200"
                              aria-label={social.label}>
                              <social.icon className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>

    <style jsx>{`@keyframes slideInFromRight {from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }}`}</style>
  </div>;
}
