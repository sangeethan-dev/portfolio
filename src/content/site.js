/*
 * All site copy in one place. Components import from here so prices,
 * FAQs and contact details are never duplicated.
 *
 * Voice: plain, warm, specific. Written for owners of small local
 * practices — people who care about being found, trusted and booked,
 * not about frameworks.
 */

export const contact = {
  email: "email2geethan@gmail.com",
  phoneDisplay: "+94 75 6144113",
  whatsapp: "https://wa.me/94756144113",
  inspirations: "https://sangee-inspirations.vercel.app/",
};

/* ── Pricing / introductory offer — change prices here only ──────── */
export const offer = {
  label: "Introductory offer",
  website: 2000,
  websiteWas: 2900,
  care: 100,
  careWas: 150,
  careMonths: 12,
};

export const aud = (n) => `AUD ${n.toLocaleString("en-AU")}`;

/* Short lines reused in the hero, menu, footer and metadata */
export const offerLine = `Websites ${aud(offer.website)} · Care Plan ${aud(offer.care)}/mo for ${offer.careMonths} months`;

export const nav = [
  { label: "Build", href: "#build" },
  { label: "Work", href: "#work" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export const packages = [
  {
    id: "website",
    num: "01",
    title: "Business Website",
    currency: "AUD",
    amount: offer.website,
    was: offer.websiteWas,
    note: "One fixed price, agreed before work starts",
    desc: "A custom website that makes a great first impression and turns a quick search into a booked appointment.",
    features: [
      "Up to 7 pages — services, team, fees and more",
      "Custom design — no templates",
      "Fast and easy to use on a phone",
      "Basic SEO so people nearby can find you",
      "Book Now buttons linked to your booking system",
    ],
    cta: "Claim the offer",
    featured: true,
  },
  {
    id: "care",
    num: "02",
    title: "Website Care Plan",
    currency: "AUD",
    amount: offer.care,
    was: offer.careWas,
    suffix: "/ month",
    note: `First ${offer.careMonths} months, then ${aud(offer.careWas)}/month`,
    desc: "Your website looked after every month, so you can focus on your clients — not plugins, passwords and backups.",
    features: [
      "Software and security updates",
      "Regular backups",
      "Uptime monitoring",
      "Monthly content edits — new staff, hours, fees",
    ],
    cta: "Add the Care Plan",
  },
  {
    id: "custom",
    num: "03",
    title: "Online Stores & Custom Projects",
    amount: null,
    priceLabel: "Custom quote",
    desc: "For bigger ideas: an online shop for your products, a site for several locations, or features built around how you work.",
    features: [
      "Shopify online stores",
      "Sites beyond 7 pages",
      "Multi-location websites",
      "Custom features & integrations",
    ],
    cta: "Get a quote",
  },
];

/* Options for the contact form's service select */
export const WEBSITE_WITH_CARE = "Business Website + Care Plan";

export const serviceOptions = [
  "Business Website",
  WEBSITE_WITH_CARE,
  "Redesign of my current website",
  "Website Care Plan",
  "Online Stores & Custom Projects",
  "Not sure yet",
];

export const buildSteps = [
  {
    num: "01",
    title: "Wireframe",
    desc: "We plan what visitors need to find fast — services, fees, location — and where the Book button goes.",
  },
  {
    num: "02",
    title: "Design",
    desc: "A look that feels like your practice: calm, credible and unmistakably yours. You review it and we refine it together.",
  },
  {
    num: "03",
    title: "Code",
    desc: "Hand-built to load fast on a phone, with basic SEO so people searching nearby can find you.",
  },
  {
    num: "04",
    title: "Live",
    desc: "Tested, launched and taking bookings. On the Care Plan, I keep it updated, backed up and secure.",
  },
];

export const concepts = [
  {
    id: "clinic",
    name: "Tidewater Physio",
    sector: "Physiotherapy · Burleigh Heads",
    package: "Business Website + Care Plan",
    brief: "A two-physio practice whose old site hid the Book button three clicks deep. The new one puts services, fees and next available times up front — so new clients can book in under a minute.",
    built: ["6 pages", "Online booking flow", "Practitioner profiles", "Fees & rebates page"],
    hint: "Book an appointment",
  },
  {
    id: "cafe",
    name: "Grounds & Co.",
    sector: "Café · Melbourne",
    package: "Business Website",
    brief: "A neighbourhood café that wanted its website to feel as warm as walking in, with the menu one tap away.",
    built: ["5 pages", "Interactive menu", "Opening hours & map", "Mobile-first"],
    hint: "Try the menu",
  },
  {
    id: "store",
    name: "Salt & Fern",
    sector: "Homewares · Byron Bay",
    package: "Online Store — custom quote",
    brief: "A small homewares brand moving from weekend markets to online. Product pages that feel tactile, and a checkout that stays out of the way.",
    built: ["Shopify store", "Colour variants", "Animated cart", "Product storytelling"],
    hint: "Pick a colour, add to bag",
  },
];

export const stats = [
  { value: 8, suffix: "", label: "Years building websites" },
  { value: 30, suffix: "+", label: "Websites delivered" },
  { value: 1, suffix: "", label: "Point of contact" },
];

export const skills = [
  "HTML", "CSS", "JavaScript", "React", "Next.js", "GSAP", "WordPress",
  "Shopify", "Liquid", "PHP", "Figma", "Lenis", "Canvas", "SEO",
  "Node.js", "Vercel", "Matter.js", "Framer Motion",
];

export const faqs = [
  {
    q: `What do I get for ${aud(offer.website)}?`,
    a: `A custom-designed website of up to 7 pages — typically home, services, team, fees, about, contact and a booking page. It's built to be fast on phones, set up with basic SEO so people nearby can find you, and your Book Now buttons are linked to your booking system. One fixed price, agreed before any work starts.`,
  },
  {
    q: `Is ${aud(offer.website)} the normal price?`,
    a: `No — it's an introductory offer. The standard price is ${aud(offer.websiteWas)}, and the Care Plan is normally ${aud(offer.careWas)}/month. With the offer, care is ${aud(offer.care)}/month for your first ${offer.careMonths} months.`,
  },
  {
    q: "Will it work with my online booking system?",
    a: "Yes. I link your website to the booking system you already use — Cliniko, Nookal, Halaxy, HotDoc, Jane and similar — so clients can book in a couple of taps, from any page.",
  },
  {
    q: "What does the Care Plan cover?",
    a: `Software and security updates, regular backups, uptime monitoring, and your monthly content edits — a new team member, changed hours, updated fees. It's ${aud(offer.care)}/month for the first ${offer.careMonths} months, then ${aud(offer.careWas)}/month. It's optional, but it means your site never falls behind.`,
  },
  {
    q: "I already have a website. Can you redesign it?",
    a: "Yes. I can rebuild it on your existing domain, bring across the content worth keeping, and set up redirects from your old pages so you don't lose the Google visibility you've already built.",
  },
  {
    q: "Do I need to write all the content myself?",
    a: "You know your services best, so you'll give me the essentials — what you offer, your fees, your team. I'll shape it into clear, scannable pages and you approve every word before launch.",
  },
  {
    q: "Does the website need to follow health advertising rules?",
    a: "If your profession is registered with Ahpra, its advertising guidelines apply to your website — for example, no testimonials about clinical care and no promised outcomes. I keep those rules in mind when shaping your content, and you sign off everything before it goes live.",
  },
  {
    q: "How long does it take?",
    a: "Usually 2–4 weeks from our first call to launch. Most of that time depends on how quickly content and feedback come through. Online stores and custom projects get a timeline with their quote.",
  },
  {
    q: "You're in Sri Lanka — how does that work?",
    a: "Easily. I'm 4.5 hours behind AEST, so your afternoon is my morning and there's plenty of overlap for calls. Day to day we talk by email, phone or WhatsApp — whatever suits you.",
  },
  {
    q: "Are the projects on this site real businesses?",
    a: "They're concept projects. My past client work is under NDA, so I built these to show the kind of website you'd get. The businesses are fictional — the code and every animation are real.",
  },
];
