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
    note: "Fixed price, agreed before we start",
    desc: "A website made for your practice, not a template with your logo on it. It looks the part and makes booking easy.",
    features: [
      "Up to 7 pages (services, team, fees and so on)",
      "Designed from scratch for you",
      "Works properly on phones",
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
    desc: "I look after your website every month, so you never have to think about updates, backups or something breaking.",
    features: [
      "Software and security updates",
      "Regular backups",
      "Uptime monitoring",
      "Small edits each month, like new staff, hours or fees",
    ],
    cta: "Add the Care Plan",
  },
  {
    id: "custom",
    num: "03",
    title: "Online Stores & Custom Projects",
    amount: null,
    priceLabel: "Custom quote",
    desc: "Need more than a standard site? An online shop, several locations, or something built around how you work. I'll quote it properly.",
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
    desc: "First we work out what people need to find quickly: your services, fees, where you are, and how to book.",
  },
  {
    num: "02",
    title: "Design",
    desc: "Then I design it to feel like your practice. You see it, tell me what you think, and we adjust it together.",
  },
  {
    num: "03",
    title: "Code",
    desc: "I build it by hand so it loads quickly on a phone, with basic SEO set up so local searches can find you.",
  },
  {
    num: "04",
    title: "Live",
    desc: "We test it, launch it, and it starts taking bookings. On the Care Plan, I keep it updated and backed up after that.",
  },
];

export const concepts = [
  {
    id: "clinic",
    name: "Tidewater Physio",
    sector: "Physiotherapy · Burleigh Heads",
    package: "Business Website + Care Plan",
    brief: "Two physios whose old site hid the Book button three clicks deep. Now services, fees and the next free times are right there, so a new client can book in under a minute.",
    built: ["6 pages", "Online booking flow", "Practitioner profiles", "Fees & rebates page"],
    hint: "Book an appointment",
  },
  {
    id: "cafe",
    name: "Grounds & Co.",
    sector: "Café · Melbourne",
    package: "Business Website",
    brief: "A local café that wanted its website to feel as warm as walking in, with the menu one tap away.",
    built: ["5 pages", "Interactive menu", "Opening hours & map", "Mobile-first"],
    hint: "Try the menu",
  },
  {
    id: "store",
    name: "Salt & Fern",
    sector: "Homewares · Byron Bay",
    package: "Online Store — custom quote",
    brief: "A small homewares brand moving from weekend markets to selling online. Product pages you almost want to touch, and a checkout that doesn't get in the way.",
    built: ["Shopify store", "Colour variants", "Animated cart", "Product storytelling"],
    hint: "Pick a colour, add to bag",
  },
];

export const stats = [
  { value: 8, suffix: "", label: "Years building websites" },
  { value: 30, suffix: "+", label: "Websites delivered" },
  { value: 1, suffix: "", label: "Person you deal with" },
];

export const skills = [
  "HTML", "CSS", "JavaScript", "React", "Next.js", "GSAP", "WordPress",
  "Shopify", "Liquid", "PHP", "Figma", "Lenis", "Canvas", "SEO",
  "Node.js", "Vercel", "Matter.js", "Framer Motion",
];

export const faqs = [
  {
    q: `What do I get for ${aud(offer.website)}?`,
    a: [
      "A website of up to 7 pages, designed for your practice. Usually that's home, services, team, fees, about, contact and booking.",
      "It works well on phones, it's set up so people nearby can find you on Google, and every Book Now button goes straight to your booking system.",
      `${aud(offer.website)} is an introductory price. It's normally ${aud(offer.websiteWas)}, and we agree the final price before I start.`,
    ],
  },
  {
    q: "Will it work with my booking system?",
    a: [
      "Yes. I'll connect it to whatever you already use, whether that's Cliniko, Nookal, Halaxy, HotDoc, Jane or something else.",
      "Clients can book from any page in a couple of taps.",
    ],
  },
  {
    q: "What does the Care Plan cover?",
    a: [
      "Updates, security, backups, and keeping an eye on whether your site is up.",
      "It also covers small changes each month, like a new team member, different hours or updated fees.",
      `It's ${aud(offer.care)}/month for the first ${offer.careMonths} months, then ${aud(offer.careWas)}. It's optional, but it means nothing gets left to slide.`,
    ],
  },
  {
    q: "I already have a website. Can you redesign it?",
    a: [
      "Yes. I'll rebuild it on the domain you already have and bring over anything worth keeping.",
      "I'll also redirect your old pages, so you don't lose the Google visibility you've built up.",
    ],
  },
  {
    q: "Do I need to write all the content?",
    a: [
      "No. Send me the basics: what you offer, your fees and who's on the team.",
      "I'll turn that into clear pages, and nothing goes live until you've approved every word.",
    ],
  },
  {
    q: "Does my website have to follow health advertising rules?",
    a: [
      "If your profession is registered with Ahpra, then yes, its advertising guidelines cover your website too.",
      "For example, no testimonials about clinical care and no promises about outcomes.",
      "I keep those rules in mind while writing, and you sign off everything before it goes live.",
    ],
  },
  {
    q: "How long does it take?",
    a: [
      "Usually 2 to 4 weeks from our first call to launch.",
      "The biggest factor is how quickly content and feedback come back to me.",
    ],
  },
  {
    q: "You're in Sri Lanka. How does that work?",
    a: [
      "Pretty smoothly. I'm 4.5 hours behind AEST, so your afternoon is my morning.",
      "Day to day we can talk by email, phone or WhatsApp, whatever suits you.",
    ],
  },
];
