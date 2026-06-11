import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Services } from '@/components/Services'
import { Projects } from '@/components/Projects'
import { Pricing } from '@/components/Pricing'
import { About } from '@/components/About'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <Projects />
      <Pricing />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
