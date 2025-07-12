'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const pathname = usePathname();

  const languages = [
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'RW', name: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'SW', name: 'Kiswahili', flag: '🇰🇪' }
  ];

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    setShowLanguageMenu(false);
    // Here you would implement actual language switching logic
    console.log(`Language changed to: ${langCode}`);
  };

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
        
        <div className="max-w-7xl mx-auto px-4">
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
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-greenalytic bg-greenalytic-light/10'
                        : 'text-gray-700 hover:text-greenalytic hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Section: Language + CTA + Mobile Menu */}
            <div className="flex items-center space-x-4">
              
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-greenalytic bg-gray-50 hover:bg-greenalytic-light/10 rounded-lg transition-all duration-200"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showLanguageMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Language Dropdown */}
                {showLanguageMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                      Select Language
                    </div>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-greenalytic-light/10 transition-colors ${
                          language === lang.code ? 'text-greenalytic bg-greenalytic-light/5' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{lang.name}</div>
                          <div className="text-xs text-gray-500">{lang.code}</div>
                        </div>
                        {language === lang.code && (
                          <div className="w-2 h-2 bg-greenalytic rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Link
                href="/contact"
                className="hidden md:inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-greenalytic to-greenalytic-dark hover:from-greenalytic-dark hover:to-greenalytic text-white font-semibold text-sm rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                Get Started
                <div className="ml-2 w-1.5 h-1.5 bg-greenalytic-light rounded-full animate-pulse"></div>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-greenalytic hover:bg-gray-50 rounded-lg transition-colors"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'text-greenalytic bg-greenalytic-light/10 border-l-4 border-greenalytic'
                          : 'text-gray-700 hover:text-greenalytic hover:bg-gray-50'
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                {/* Mobile Language Selector */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-sm font-semibold text-gray-500 mb-2 px-4">Language</div>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                          language === lang.code ? 'text-greenalytic bg-greenalytic-light/10' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Mobile CTA */}
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full mt-4 px-6 py-3 bg-gradient-to-r from-greenalytic to-greenalytic-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close language menu */}
      {showLanguageMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowLanguageMenu(false)}
        />
      )}
    </>
  );
}