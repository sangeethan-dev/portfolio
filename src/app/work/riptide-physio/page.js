import RiptideApp from "@/components/Riptide/RiptideApp";
import Hero from "@/components/Riptide/Hero/Hero";
import Acts from "@/components/Riptide/Acts/Acts";
import BodyMap from "@/components/Riptide/BodyMap/BodyMap";
import Services from "@/components/Riptide/Services/Services";
import Programs from "@/components/Riptide/Programs/Programs";
import Team from "@/components/Riptide/Team/Team";
import Space from "@/components/Riptide/Space/Space";
import Fees from "@/components/Riptide/Fees/Fees";
import Faq from "@/components/Riptide/Faq/Faq";
import Finale from "@/components/Riptide/Finale/Finale";

/* Riptide Physio & Performance — a homepage told like a film trailer */
export default function RiptidePage() {
  return (
    <RiptideApp>
      <Hero />
      <Acts />
      <BodyMap />
      <Services />
      <Programs />
      <Team />
      <Space />
      <Fees />
      <Faq />
      <Finale />
    </RiptideApp>
  );
}
