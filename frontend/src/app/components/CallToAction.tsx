'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CallToAction() {
  return (
    <motion.section
      className="py-5 bg-primary text-white text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="container">
        <h2 className="mb-3">Join us in shaping Africa’s green future.</h2>
        <p className="lead">Let’s reduce emissions, drive electric, and innovate together.</p>
        <Link href="/contact" className="btn btn-light btn-lg mt-3">Get Involved</Link>
      </div>
    </motion.section>
  )
}
