import Preloader from "@/components/Preloader/Preloader";
import Hero from "@/components/Hero/Hero";
import Manifesto from "@/components/Manifesto/Manifesto";
import Mantra from "@/components/Mantra/Mantra";
import BuildStory from "@/components/BuildStory/BuildStory";
import Spotlight from "@/components/Spotlight/Spotlight";
import Work from "@/components/Work/Work";
import Playground from "@/components/Playground/Playground";
import Pricing from "@/components/Pricing/Pricing";
import About from "@/components/About/About";
import FAQ from "@/components/FAQ/FAQ";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import ThemeFlip from "@/components/ThemeFlip/ThemeFlip";

export default function Home() {
  return (
    <>
      <Preloader />
      <main>
        <Hero />
        <Manifesto />
        <Mantra />
        <BuildStory />
        <Spotlight />
        <Work />
        <Playground />
        <Pricing />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <ThemeFlip />
    </>
  );
}
