'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp } from 'lucide-react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.3, y: 40, rotate: -180 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            rotate: 0,
            transition: {
              type: 'spring',
              stiffness: 260,
              damping: 16,
            },
          }}
          exit={{
            opacity: 0,
            scale: 0.3,
            y: 40,
            transition: { duration: 0.2, ease: 'easeIn' },
          }}
          whileHover={{ scale: 1.12, y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-white text-slate-600 border border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center justify-center"
          aria-label="맨 위로"
        >
          <ChevronUp size={20} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
