"use client"

import { Nav } from "./libs/ui/landing/nav";
import Company from "./libs/ui/landing/company";
import Patners from "./libs/ui/landing/patners";
import ProductTour from "./libs/ui/landing/product-tour";
import Services from "./libs/ui/landing/services";
import CTA from "./libs/ui/landing/cta";
import Footer from "./libs/ui/landing/footer";


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
        <ProductTour />
        <CTA />
        <Footer />
      </section>
    </main>
  )
}

