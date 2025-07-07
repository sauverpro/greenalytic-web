// app/about/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="bg-white text-gray-900">
      {/* Preloader */}
      <div id="preloader" className="hidden">
        <div className="loader flex items-center justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="loader__bar bg-green-500 w-1 h-4 animate-pulse" />
          ))}
          <div className="loader__ball w-3 h-3 bg-green-500 rounded-full animate-bounce" />
        </div>
      </div>

      {/* Top Bar */}
      <div className="bg-gray-100 py-2 text-sm">
        <div className="container mx-auto px-4 flex justify-between">
          <div className="flex space-x-4 text-gray-600">
            <a href="mailto:info@greenalytic.rw"><i className="fa fa-envelope-o mr-1" /> info@greenalytic.rw</a>
            <a href="tel:+250234567890"><i className="fa fa-phone mr-1" /> +250 234 567 890</a>
          </div>
          <div className="space-x-3 text-gray-600">
            <a href="#"><i className="fa fa-facebook-square" /></a>
            <a href="#"><i className="fa fa-instagram" /></a>
            <a href="#"><i className="fa fa-linkedin-square" /></a>
            <a href="#"><i className="fa fa-twitter-square" /></a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/">
            <Image
              src="/images/Greene-Tech-_black-no-bg_ (2).png"
              alt="GreenTech Logo"
              width={200}
              height={60}
            />
          </Link>
          <nav className="space-x-4">
            {['Home', 'About us', 'Our Services', 'Projects', 'Testimonials', 'Products', 'Contact'].map((name, idx) => (
              <Link
                key={idx}
                href={`/${name.toLowerCase().replace(/ /g, '-')}`}
                className="text-gray-700 hover:text-green-600"
              >
                {name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Banner */}
      <section className="text-center text-white bg-green-700 py-16">
        <h2 className="text-5xl font-bold">About Us</h2>
        <div className="text-sm mt-2">
          <Link href="/">Home</Link> / About Us
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h4 className="text-green-600 font-semibold">About Us</h4>
            <h2 className="text-3xl font-bold mb-4">Welcome to <span className="text-green-700">GreenTech</span></h2>
            <p className="text-gray-600 mb-4">
              We are your technology and innovation-oriented partner, revolutionizing knowledge transfer.
            </p>
            <p className="text-gray-600 mb-6">
              We promote sustainable use of resources to support Rwanda's development.
            </p>
            <Link href="/services">
              <button className="btn bg-green-600 text-white px-4 py-2 rounded">Discover Our Services</button>
            </Link>
          </div>
          <div>
            <Image
              src="/uploads/main-about.jpg"
              alt="About GreenTech"
              width={640}
              height={360}
              className="rounded shadow-lg w-full"
            />
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Image
              src="/uploads/abouts.jpg"
              alt="GreenTech Mission"
              width={640}
              height={360}
              className="rounded shadow-lg w-full"
            />
          </div>
          <div>
            <h4 className="text-green-600 font-semibold">Who We Are</h4>
            <h2 className="text-3xl font-bold mb-4">We Are <span className="text-green-700">GreenTech</span></h2>
            <p className="text-gray-600 mb-4">We transform knowledge sharing for sustainable innovation.</p>
            <p className="text-gray-600 mb-6">We champion environmental protection for future generations.</p>
            <Link href="/services">
              <button className="btn bg-green-600 text-white px-4 py-2 rounded">Explore More</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Meet The Team */}
      <section className="bg-cover bg-center py-20 text-white" style={{ backgroundImage: 'url(/uploads/parallax_03.jpg)' }}>
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-2">Meet The Team</h3>
          <p className="mb-12">Passionate professionals driving innovation and sustainability.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Example Member */}
            <div className="bg-white text-gray-900 rounded shadow-lg p-4 text-center">
              <Image
                src="/css/team/image1.png"
                alt="Emmanuel TUYIZERE"
                width={160}
                height={160}
                className="mx-auto mb-4"
              />
              <h4 className="font-semibold">Emmanuel TUYIZERE</h4>
              <p className="text-sm text-gray-500">CEO</p>
              <div className="flex justify-center space-x-3 mt-2 text-green-600">
                <a href="#"><i className="fa fa-facebook" /></a>
                <a href="#"><i className="fa fa-twitter" /></a>
                <a href="#"><i className="fa fa-linkedin" /></a>
              </div>
            </div>
            {/* Add more team members here */}
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 flex flex-wrap justify-center items-center gap-6">
          {['250STARTUP logo.jpg', 'IPR Karonig logo.jpg', 'NCST Logo.png', 'IOM Rwanda.jpg'].map((img, i) => (
            <Image
              key={i}
              src={`/images/${img}`}
              alt={`Partner ${i + 1}`}
              width={100}
              height={60}
              className="object-contain"
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12">
          <div>
            <Image
              src="/images/Greene-Tech-_White-no-bg_.png"
              alt="GreenTech Logo"
              width={160}
              height={80}
              className="mb-4"
            />
            <p>Empowering Rwanda with sustainable tech solutions for a brighter tomorrow.</p>
          </div>
          <div>
            <h3 className="text-white text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><a href="http://sdb-73.hosting.stackcp.net:3000/login">Login</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg mb-4">Subscribe</h3>
            <p className="mb-2">Join our newsletter for updates.</p>
            <form>
              <input type="email" placeholder="Your email" className="w-full p-2 rounded bg-gray-800 text-white" />
              <button className="mt-2 bg-green-600 px-4 py-2 rounded text-white text-sm flex items-center">
                <i className="fa fa-envelope-o mr-2" /> Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="text-center text-sm mt-12 border-t border-gray-700 pt-6">
          © 2022 GreenTech. Design by <a href="#" className="underline text-green-500">250STARTUPS</a>.
        </div>
      </footer>
    </main>
  )
}

