import AgencyHero from "@/components/Agencies/AgencyHero";
import AgencyWhy from "@/components/Agencies/AgencyWhy";
import AgencyServices from "@/components/Agencies/AgencyServices";
import AgencyRates from "@/components/Agencies/AgencyRates";
import AgencyProcess from "@/components/Agencies/AgencyProcess";
import Work from "@/components/Work/Work";
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
        <AgencyWhy />
        <AgencyServices />
        <AgencyRates />
        <AgencyProcess />
        <Work
          fig="Fig. 06 — Work"
          title="The standard"
          note={agency.workNote}
          intro="In the meantime, these three concept projects show the quality you'd get. The businesses are made up, but the sites are real and they work, so try them."
          showFixes={false}
        />
        <FAQ
          items={agency.faqs}
          fig="Fig. 07 — FAQ"
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
