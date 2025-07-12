'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function TestimonialsPage() {
  const testimonials = Array(6).fill({
    title: 'Wonderful Support!',
    message: 'They have got our Car on reducing gases emission and car defects diagnosis.',
    name: 'Names',
    company: 'Company Name',
    image: '/uploads/testi_01.png',
  })

  const partners = [
    '250STARTUP logo.jpg',
    'IPR Karonig logo.jpg',
    'NCST Logo.png',
    'IOM Rwanda.jpg',
  ]

  return (
    <main className="bg-white text-gray-900">
      {/* Banner */}
      <section className="bg-green-700 text-white py-16 text-center">
        <h2 className="text-4xl font-bold mb-2">Testimonials</h2>
        <div className="text-sm">
          <Link href="/" className="underline">Home</Link> / Testimonials
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold">Testimonials</h3>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              We thank all our amazing clients for their trust and support. Here’s what they have to say about GreenTech.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">
                  <i className="fa fa-quote-left text-green-600 mr-2" />
                  {item.title}
                </h3>
                <p className="text-gray-700 mb-4">{item.message}</p>
                <div className="flex items-center space-x-4">
                  <Image src={item.image} alt="client" width={48} height={48} className="rounded-full" />
                  <div>
                    <h4 className="font-bold">{item.name}</h4>
                    <small className="text-gray-500">{item.company}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Clients */}
      <section className="py-20 bg-cover bg-center text-white" style={{ backgroundImage: 'url(/uploads/parallax_03.jpg)' }}>
        <div className="bg-black/60 py-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold">Our Clients</h3>
            <p className="text-gray-300 mt-2 mb-8">
              We’re proud to work with innovators and leaders in sustainability and technology.
            </p>

            <div className="flex flex-wrap justify-center gap-8">
              {partners.map((img, idx) => (
                <Image
                  key={idx}
                  src={`/images/${img}`}
                  alt={`Partner ${idx + 1}`}
                  width={120}
                  height={60}
                  className="object-contain bg-white p-2 rounded shadow"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12">
          <div>
            <Image
              src="/images/Greene-Tech-_White-no-bg_.png"
              alt="GreenTech Logo"
              width={200}
              height={80}
              className="mb-4"
            />
            <p>
              Promoting environmental protection and sustainable resource management through decentralized governance in Rwanda.
            </p>
          </div>

          <div>
            <h3 className="text-white text-lg mb-4">Pages</h3>
            <ul className="space-y-2">
              {['Home', 'Pricing', 'About', 'Contact', 'Login'].map((page, idx) => (
                <li key={idx}>
                  <Link href="/" className="hover:underline">{page}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg mb-4">Subscribe</h3>
            <p className="mb-4">
              Your innovation partner transforming knowledge into sustainable technology.
            </p>
            <form>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white mb-2"
              />
              <button className="bg-green-600 px-4 py-2 text-white rounded">
                <i className="fa fa-envelope-o mr-2" /> Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-12 text-sm border-t border-gray-700 pt-6">
          All Rights Reserved. &copy; 2022 GreenTech. Design by <a href="#" className="underline text-green-400">250STARTUPS</a>.
        </div>
      </footer>
    </main>
  )
}
