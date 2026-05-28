import Hero from "@/components/Hero/Hero";
import Stack from "@/components/Stack/Stack";
import Services from "@/components/Services/Services";
import Lab from "@/components/Lab/Lab";
import About from "@/components/About/About";
import Process from "@/components/Process/Process";
import FAQ from "@/components/FAQ/FAQ";
import Contact from "@/components/Contact/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stack />
      <Services />
      {/* <Work /> */}
      <Lab />
      <About />
      <Process />
      <FAQ />
      <Contact />
    </main>
  );
}
