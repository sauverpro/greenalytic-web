'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroBanner() {
  return (
    <section className="hero-banner text-center text-white d-flex align-items-center" style={{ backgroundImage: 'url("/images/banner.jpg")', backgroundSize: 'cover', height: '100vh' }}>
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="display-4 fw-bold">
          Empowering Clean Mobility and Sustainable Innovation Across Africa
        </h1>
        <p className="lead mt-3">
          From real-time vehicle emissions monitoring to electric transport solutions for agriculture...
        </p>
        <div className="mt-4">
          <Link href="/services" className="btn btn-primary btn-lg me-2">Explore Services</Link>
          <Link href="/impact" className="btn btn-outline-light btn-lg">See Our Impact</Link>
        </div>
      </motion.div>
    </section>
  )
}
