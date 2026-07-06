"use client"

import { Nav } from "./libs/ui/nav";
import Company from "./libs/ui/company";
import Patners from "./libs/ui/patners";
import Services from "./libs/ui/services";
import CTA from "./libs/ui/cta";
import Footer from "./libs/ui/footer";

export default function LandingPage() {
  return (
     <main
      className="min-h-screen"
    >
      <section className="min-h-screen">
        <Nav />
        <Company />
        <Patners/>
        <Services />
        <CTA />
        <Footer />
      </section>
    </main>
  )
}

