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
import FrameAnimation from '../app/components/FrameAnimation'

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
    <main className="min-h-screen relative">
      <div className="fixed inset-0 z-0">
        <FrameAnimation />
      </div>
      <div className="relative z-10">
        <Navbar />
        <div className='relative top-3'>
          <Hero />
        </div>
        <About />
        <Experiences />
        <Education />
        <Testimonials />
        <Projects />
        <Contact />
      </div>
    </main>
  )
}
