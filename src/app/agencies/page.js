import AgencyHero from "@/components/Agencies/AgencyHero";
import Manifesto from "@/components/Manifesto/Manifesto";
import Mantra from "@/components/Mantra/Mantra";
import AgencyServices from "@/components/Agencies/AgencyServices";
// import AgencyHandover from "@/components/Agencies/AgencyHandover"; // hidden for now (see below)
import AgencyRates from "@/components/Agencies/AgencyRates";
import AgencyTimelines from "@/components/Agencies/AgencyTimelines";
import AgencyProcess from "@/components/Agencies/AgencyProcess";
import Playground from "@/components/Playground/Playground";
import Stack from "@/components/Stack/Stack";
import FAQ from "@/components/FAQ/FAQ";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import ThemeFlip from "@/components/ThemeFlip/ThemeFlip";
import { agency } from "@/content/site";
import { pageMeta } from "@/lib/meta";

// shared directly with agencies, not meant to be found through search
export const metadata = pageMeta({ ...agency.meta, path: "/agencies", noindex: true });

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
        <Mantra content={agency.mantra} />
        <AgencyServices />
        {/* <AgencyHandover /> hidden for now; it's labelled Fig. 04, so renumber when it returns */}
        <Stack fig="Fig. 04 — Stack" />
        <AgencyRates />
        <AgencyTimelines />
        <AgencyProcess />
        <Playground fig="Fig. 08 — Lab" title={agency.lab.title} intro={agency.lab.intro} />
        <FAQ
          items={agency.faqs}
          fig="Fig. 09 — FAQ"
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
