'use client'

import { motion } from 'framer-motion'

const features = [
  { title: 'Africa-First Innovation', text: 'Technologies designed and tested for Rwandan and African conditions.' },
  { title: 'Real Environmental Impact', text: 'Real-time emission monitoring and electric tricycles promote clean air.' },
  { title: 'Smart & Affordable Tech', text: 'GPS, emissions, speed, and fuel monitoring in one device.' },
  { title: 'Proven Partnerships', text: 'Collaborations with NCST, CMU-Africa, REM, and others.' },
  { title: 'Data-Driven Solutions', text: 'Dashboards with real-time emissions, GPS, and fuel analytics.' },
  { title: 'Local Jobs & Production', text: 'Locally built/assembled products that create employment.' }
]

export default function WhyGreenalytic() {
  return (
    <section className="py-5">
      <div className="container text-center">
        <h2 className="mb-4">Why Choose Greenalytic?</h2>
        <div className="row">
          {features.map((item, index) => (
            <motion.div
              key={item.title}
              className="col-md-4 mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="p-3 border rounded h-100">
                <h5 className="fw-bold">{item.title}</h5>
                <p>{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
