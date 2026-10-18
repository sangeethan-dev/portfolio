import Privacy from "@/components/Privacy/Privacy";
import Footer from "@/components/Footer/Footer";
import ThemeFlip from "@/components/ThemeFlip/ThemeFlip";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "Privacy — Sangeethan",
  description: "What the contact forms on this site collect, why, where it's stored, and how to ask for it to be deleted.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <main>
        <Privacy />
      </main>
      <Footer />
      <ThemeFlip />
    </>
  );
}
