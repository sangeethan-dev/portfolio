import Preloader from "@/components/Preloader/Preloader";
import Hero from "@/components/Hero/Hero";
import BuildStory from "@/components/BuildStory/BuildStory";
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
        <BuildStory />
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
