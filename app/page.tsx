import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Services } from '@/components/Services'
import { Projects } from '@/components/Projects'
import { About } from '@/components/About'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

// Seção de projetos oculta até termos cases para mostrar.
const SHOW_PROJECTS = false

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      {SHOW_PROJECTS && <Projects />}
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
