import Preloader from "@/components/Preloader/Preloader";
import Hero from "@/components/Hero/Hero";
import Manifesto from "@/components/Manifesto/Manifesto";
import Mantra from "@/components/Mantra/Mantra";
import AgencyServices from "@/components/Agencies/AgencyServices";
import BuildStory from "@/components/BuildStory/BuildStory";
import Playground from "@/components/Playground/Playground";
import OnePerson from "@/components/OnePerson/OnePerson";
import About from "@/components/About/About";
import FAQ from "@/components/FAQ/FAQ";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import ThemeFlip from "@/components/ThemeFlip/ThemeFlip";
import { services } from "@/content/site";

export default function Home() {
  return (
    <>
      <Preloader />
      <main>
        <Hero />
        <Manifesto />
        <Mantra />
        <AgencyServices fig="Fig. 03 — Services" title={services.title} intro={services.intro} items={services.items} />
        <BuildStory />
        <Playground />
        <OnePerson />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <ThemeFlip />
    </>
  );
}
