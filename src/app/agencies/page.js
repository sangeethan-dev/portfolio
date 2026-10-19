import AgencyHero from "@/components/Agencies/AgencyHero";
import AgencyWhy from "@/components/Agencies/AgencyWhy";
import Manifesto from "@/components/Manifesto/Manifesto";
import Mantra from "@/components/Mantra/Mantra";
import AgencyServices from "@/components/Agencies/AgencyServices";
import AgencyRates from "@/components/Agencies/AgencyRates";
import AgencyProcess from "@/components/Agencies/AgencyProcess";
import Playground from "@/components/Playground/Playground";
import FAQ from "@/components/FAQ/FAQ";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import ThemeFlip from "@/components/ThemeFlip/ThemeFlip";
import { agency } from "@/content/site";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({ ...agency.meta, path: "/agencies" });

export default function AgenciesPage() {
  return (
    <>
      <main>
        <AgencyHero />
        <Manifesto
          fig="Fig. 02 — Statement"
          content={agency.statement}
          more={{ href: "#services", label: "What I build" }}
        />
        <AgencyWhy />
        <Mantra content={agency.mantra} />
        <AgencyServices />
        <AgencyRates />
        <AgencyProcess />
        <Playground fig="Fig. 07 — Lab" title={agency.lab.title} intro={agency.lab.intro} />
        <FAQ
          items={agency.faqs}
          fig="Fig. 08 — FAQ"
          title="Agency questions."
          intro="What agency owners and project managers ask before sending the first brief."
        />
        <Contact variant="agency" />
      </main>
      <Footer />
      <ThemeFlip />
    </>
  );
}
