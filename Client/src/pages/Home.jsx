import React from "react";
import Hero from "./LandingPage/Home/Hero";
import About from "./LandingPage/Home/About";
import Footer from "./LandingPage/Home/Footer";
import Services from "./LandingPage/Home/Services";
import ContactForm from "./LandingPage/Home/ContactForm";
import FAQ from "./LandingPage/Home/FAQ";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <Services />
      <FAQ />
      <ContactForm />
      <Footer />
    </div>
  );
}
