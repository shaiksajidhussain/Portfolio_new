'use client'
import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import Hero from '../components/Hero'
import Projects from '../components/Projects'
import Navbar from '../components/Navbar'
import About from '../components/About'
import Contact from '../components/Contact'
import Experiences from '../components/Experiences'
import Testimonials from '../components/Testimonials'
import Education from '../components/Education'

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.1,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <main
      className="min-h-screen"
      style={{
        background: `linear-gradient(38.73deg, rgba(204, 0, 187, 0.15) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%)`
      }}
    >
      <Navbar />
      <Hero />
      <About />
      <Experiences />
      <Education />
      <Testimonials />
      <Projects />
      <Contact />
    </main>
  )
}
