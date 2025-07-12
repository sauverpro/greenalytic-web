'use client'

import { motion } from 'framer-motion'

export default function Mission() {
  return (
    <section className="py-5 bg-light text-center">
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="mb-3">Our Mission</h2>
        <p className="lead">
          At Greenalytic Motors Ltd, we create smart, sustainable technologies that tackle air pollution, support clean transport, and improve livelihoods in Africa.
        </p>
      </motion.div>
    </section>
  )
}
