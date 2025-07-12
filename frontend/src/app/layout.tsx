import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';

export const metadata: Metadata = {
  title: 'Greenalytic Motors',
  description: 'Clean Mobility and Emissions Innovation in Africa',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Include Fauna-style Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Figtree:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body text-midnight_text bg-white dark:bg-darkmode transition-all duration-300 antialiased">
        {/* ✅ Client-side Navbar */}
        <Navbar />

        {/* ✅ Page Content with Transitions */}
        <main className="px-4 md:px-8">
          <PageTransition>{children}</PageTransition>
        </main>

        {/* Enhanced Footer */}
        <footer className="bg-gray-900 text-white">
          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid md:grid-cols-4 gap-8">
              
              {/* Company Info with Logo */}
              <div>
                <img 
                  src="/Greenalytic.png" 
                  alt="Greenalytic Motors" 
                  className="h-16 w-auto mb-4 brightness-0 invert opacity-90" 
                />
                <h4 className="font-semibold mb-2">Greenalytic Motors Ltd</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Kicukiro, Kigali, Rwanda
                </p>
                <p className="text-gray-300 text-sm mb-1">info@greenalytic.rw</p>
                <p className="text-gray-300 text-sm">+250 796 895 138</p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-1 text-sm">
                  <li><Link href="/products" className="text-gray-300 hover:text-greenalytic-light transition-colors">Products</Link></li>
                  <li><Link href="/contact" className="text-gray-300 hover:text-greenalytic-light transition-colors">Contact</Link></li>
                  <li><Link href="/about" className="text-gray-300 hover:text-greenalytic-light transition-colors">About Us</Link></li>
                  <li><Link href="/team" className="text-gray-300 hover:text-greenalytic-light transition-colors">Our Team</Link></li>
                  <li><Link href="/blog" className="text-gray-300 hover:text-greenalytic-light transition-colors">Blog</Link></li>
                  <li><Link href="/partners" className="text-gray-300 hover:text-greenalytic-light transition-colors">Partners</Link></li>
                </ul>
              </div>

              {/* Social Media Icons */}
              <div>
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-3 mb-6">
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-gray-800 hover:bg-greenalytic rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:shadow-lg transform hover:scale-110"
                  >
                    <span className="text-sm font-bold">f</span>
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-gray-800 hover:bg-greenalytic rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:shadow-lg transform hover:scale-110"
                  >
                    <span className="text-sm font-bold">in</span>
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-gray-800 hover:bg-greenalytic rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:shadow-lg transform hover:scale-110"
                  >
                    <span className="text-sm font-bold">tw</span>
                  </a>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div>
                <h4 className="font-semibold mb-4">Stay Updated</h4>
                <p className="text-sm text-gray-300 mb-4">
                  Get the latest updates on clean mobility innovation.
                </p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-greenalytic-light transition-colors"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-greenalytic to-greenalytic-dark hover:from-greenalytic-dark hover:to-greenalytic text-white rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                    <span className="font-bold">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="text-center text-xs text-gray-400">
                © {new Date().getFullYear()} Greenalytic Motors Ltd. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

