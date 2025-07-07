'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const counters = [
  { label: 'Vehicles Tested', value: 1500 },
  { label: 'Riders Tested', value: 300 },
  { label: 'Jobs Created Locally', value: 10 }
]

function useCounter(target: number, duration: number) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const stepTime = Math.max(Math.floor(duration / target), 20)

    const interval = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= target) clearInterval(interval)
    }, stepTime)

    return () => clearInterval(interval)
  }, [target, duration])

  return count
}

// Create a separate component for each counter to use hooks properly
function CounterItem({ label, value, index }: { label: string; value: number; index: number }) {
  const count = useCounter(value, 1000)
  
  return (
    <motion.div
      className="col-md-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h3 className="display-5 fw-bold">{count}+</h3>
      <p>{label}</p>
    </motion.div>
  )
}

export default function Stats() {
  return (
    <section className="py-5 bg-dark text-white text-center">
      <div className="container">
        <h2 className="mb-4">Our Impact</h2>
        <div className="row">
          {counters.map(({ label, value }, index) => (
            <CounterItem 
              key={label} 
              label={label} 
              value={value} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}
