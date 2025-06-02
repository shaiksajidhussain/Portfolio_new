import Hero from '../components/Hero'
  
  import Projects from '../components/Projects'
 
import Navbar from '../components/Navbar'
import About from '../components/About'
import Contact from '../components/Contact'
import Experiences from '../components/Experiences'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Experiences />
      <Projects />
      <Contact />
    </main>
  )
}
