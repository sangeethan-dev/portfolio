/*
 * All site copy in one place. Components import from here so prices,
 * FAQs and contact details are never duplicated.
 *
 * Voice: plain, warm, specific. Written for owners of small local
 * practices — people who care about being found, trusted and booked,
 * not about frameworks.
 */

/* ── Site URL — the ONE place to change when moving to a custom domain.
   Used for canonical tags, og:url, sitemap.xml and robots.txt.
   Can also be set per environment with NEXT_PUBLIC_SITE_URL. ───────── */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://sangeethan.vercel.app").replace(/\/$/, "");

export const contact = {
  email: "email2geethan@gmail.com",
  phoneDisplay: "+94 75 6144113",
  whatsapp: "https://wa.me/94756144113",
  inspirations: "https://sangee-inspirations.vercel.app/",
  city: "Colombo",
  timeZone: "Asia/Colombo",
  clientTimeZone: "Australia/Brisbane",
  clientTimeLabel: "AEST",
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

/* Header nav on /agencies */
export const agencyNav = [
  { label: "Services", href: "#services" },
  { label: "Rates", href: "#rates" },
  { label: "Lab", href: "#playground" },
  { label: "Contact", href: "#contact" },
];

/* Pages linked from the footer and the mobile menu (not the desktop nav) */
export const pageLinks = {
  agencies: { label: "For agencies", href: "/agencies" },
  privacy: { label: "Privacy", href: "/privacy" },
};

/* ── Story beats (Statement + Mantra) ────────────────────────────── */
export const manifesto = {
  statement:
    "I'm an independent web developer building websites that get local practices found, trusted and booked.",
  pillars: ["Clarity first.", "Craft always.", "Built to last."],
  mission:
    "Your website should do some of the work for you: answer the common questions, show who you are, and make booking easy. That's the whole job, and I do it by hand.",
};

export const mantra = {
  label: "Found, trusted, booked",
  kicker: "Three jobs. One website.",
  words: ["Found", "Trusted", "Booked"],
  caption: "From first search to first booking",
};

/* Footer sign-off */
export const signoff = {
  kicker: "Let's build a website that works as hard as you do.",
  title: "Ready to build something bold?",
};

/* Contact-form option for one-off fixes to an existing site */
export const FIX_SERVICE = "Fix something on my website";

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
  FIX_SERVICE,
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

/* "Who I build for" magnetic strip — photos from Unsplash (free licence) */
export const spotlight = {
  title: "Built for the people who keep you moving",
  sub: "Websites for local practices and studios",
  copy: [
    "You spend your day looking after people. Your website should do some of that work for you: answer the common questions, show who you are, and make booking easy.",
    "I build sites for small practices and studios that want to look as good online as they are in person, without spending their evenings fixing them.",
  ],
  frames: [
    { src: "/portfolio/practices/01-assess.webp", alt: "Practitioner assessing a patient's leg on a treatment table", caption: "Assess" },
    { src: "/portfolio/practices/02-reformer.webp", alt: "Woman stretching on a Pilates reformer in a bright arched studio", caption: "Reformer" },
    { src: "/portfolio/practices/03-coastline.webp", alt: "Aerial view of a coastline with a headland and long beach", caption: "Coastline" },
    { src: "/portfolio/practices/04-adjust.webp", alt: "Hands-on treatment to a patient's upper back", caption: "Adjust" },
    { src: "/portfolio/practices/05-studio.webp", alt: "Modern Pilates studio with rows of reformer machines", caption: "Studio" },
    { src: "/portfolio/practices/06-release.webp", alt: "Close-up of a massage therapist's hands at work", caption: "Release" },
    { src: "/portfolio/practices/07-golden-hour.webp", alt: "Surfers in the water at sunset beside a rocky shore", caption: "Golden hour" },
    { src: "/portfolio/practices/08-recover.webp", alt: "Practitioner supporting a patient's shoulder during an assessment", caption: "Recover" },
  ],
};

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
  { value: 50, suffix: "+", label: "Projects delivered" },
  { value: 1, suffix: "", label: "Person you deal with" },
];

/* ── Stack section ────────────────────────────────────────────────
   live: true = running on this site right now (gets the ● marker).
   note = what I use it for; shown when the tool is hovered/tapped. */
export const stack = {
  title: "The stack.",
  intro:
    "The tools I build with, grouped by the job they do. Hover one to see what I use it for. The ones marked ● are running on this page right now.",
  groups: [
    {
      id: "build",
      label: "Build",
      blurb: "What every site is made of.",
      tools: [
        { name: "Next.js", live: true, note: "This site, and most of my custom builds." },
        { name: "React", live: true, note: "Every interactive part of this page is a React component." },
        { name: "JavaScript", live: true, note: "Hand-written, no page builder underneath." },
        { name: "TypeScript", note: "For bigger codebases and shared projects." },
        { name: "HTML & CSS", live: true, note: "Semantic, accessible and mobile first." },
        { name: "Tailwind", note: "When a project or team already uses it." },
      ],
    },
    {
      id: "motion",
      label: "Motion",
      blurb: "What makes it move.",
      tools: [
        { name: "GSAP", live: true, note: "Every animation on this site, including the one under your cursor." },
        { name: "Lenis", live: true, note: "The smooth scroll you're feeling right now." },
        { name: "Canvas", live: true, note: "The hero's blueprint grid and the glyphs in the footer." },
        { name: "Three.js", note: "3D scenes and shaders, like my ink fluid experiment." },
        { name: "WebGL", note: "GPU effects when CSS isn't enough." },
        { name: "Framer Motion", note: "Motion inside React projects that already use it." },
        { name: "Matter.js", note: "Real physics: things you can drag, throw and drop." },
      ],
    },
    {
      id: "cms",
      label: "CMS & commerce",
      blurb: "Sites your clients can run themselves.",
      tools: [
        { name: "WordPress", note: "Custom themes your team can edit without calling me." },
        { name: "Elementor", note: "Page-builder sites that agencies can hand over." },
        { name: "Shopify", note: "Online stores, from theme tweaks to full builds." },
        { name: "Liquid", note: "Custom Shopify sections and templates." },
        { name: "PHP", note: "Custom WordPress themes and plugins." },
      ],
    },
  ],
};

/* ── The Lab (Experiments section) ─────────────────────────────────
   The experiments live in a separate project (sangee-inspirations). Each
   one's thumbnail is its preview.webp, copied to public/portfolio/lab/<id>.webp,
   and its page is <inspirations>/showcase/<id>. Copy from its meta.json. */
const labItem = (item) => ({
  ...item,
  href: `${contact.inspirations}showcase/${item.id}`,
  img: `/portfolio/lab/${item.id}.webp`,
});

export const lab = {
  title: "Things I build for fun.",
  intro:
    "When I'm not on client work, I build experiments: cursors, loaders, marquees and other small interactions. The good ones end up in real projects. Drag one into the scanner to see it.",
  items: [
    {
      id: "ascii-glyph-field",
      title: "ASCII Glyph Field",
      category: "Cursor",
      desc: "A word built from thousands of scrambling glyphs that scatter from your cursor, heat up as they move, and morph on every click.",
      tech: ["Canvas", "Physics", "ASCII"],
    },
    {
      id: "ink-fluid-cursor",
      title: "Ink Fluid Cursor",
      category: "Cursor",
      desc: "A GPU fluid simulation that pours ink from the cursor and inverts the editorial page beneath it.",
      tech: ["WebGL", "Three.js", "Fluid Sim"],
    },
    {
      id: "guiding-light",
      title: "Guiding Light",
      category: "Cursor",
      desc: "A procedural flame follows your cursor through a dark forest, revealing only what its light touches.",
      tech: ["Canvas", "Particles", "CSS Mask"],
    },
    {
      id: "magnetic-marquee",
      title: "Magnetic Marquee",
      category: "Cursor",
      desc: "An image strip that follows the cursor, steers with your sideways motion and shoulders the copy out of its way.",
      tech: ["Marquee", "Physics", "Blend Mode"],
    },
    {
      id: "untouchable-contact",
      title: "Untouchable Contact",
      category: "Scroll",
      desc: "An endless contact list that parts around a chrome object as you scroll — and an object that dodges every attempt to touch it.",
      tech: ["Infinite Scroll", "Physics", "Cursor"],
    },
    {
      id: "magnetic-cards",
      title: "Magnetic Cards",
      category: "Cards",
      desc: "A photo zine's four prints held in a stack — push them with your cursor and they spring back, dragging their neighbours along.",
      tech: ["GSAP", "Physics", "Cursor"],
    },
    {
      id: "testimonials-marquee",
      title: "Testimonials Marquee",
      category: "Testimonials",
      desc: "Guest notes for a coastal hotel in three columns drifting at different speeds — hover eases a column to rest.",
      tech: ["Framer Motion", "Marquee", "Cards"],
    },
    {
      id: "scroll-reveal-grid",
      title: "Scroll Reveal Grid",
      category: "Reveal",
      desc: "An architecture portfolio whose projects wipe into view with settling zoom and parallax as you scroll.",
      tech: ["IntersectionObserver", "Clip Path", "Parallax"],
    },
    {
      id: "morph-loader",
      title: "Morph Loader",
      category: "Loader",
      desc: "A photographer's intro: a morphing shape flip-books portraits while loading, then blooms into the full-screen hero.",
      tech: ["SVG", "Path Morph", "Clip Path"],
    },
    {
      id: "infinite-marquee",
      title: "Infinite Marquee",
      category: "Marquee",
      desc: "A film studio's reel in three seamless rows — hover eases a row to rest, scroll speeds it up, drag scrubs with inertia.",
      tech: ["Vanilla JS", "Loop", "Drag"],
    },
    {
      id: "liquid-reveal-hero",
      title: "Liquid Reveal Hero",
      category: "Hero",
      desc: "A fashion lookbook hero where photography pours in through a liquid displacement field, with a word-by-word headline reveal.",
      tech: ["SVG Filter", "Displacement", "Reveal"],
    },
  ].map(labItem),
};

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

/* ── /agencies — white-label offer ─────────────────────────────────
   Rates are null until set: a null rate shows "On request" and a null
   firstProject hides the offer line, so the page is safe to ship as is. */
export const agency = {
  meta: {
    title: "White-Label Web Developer Australia — Sangeethan",
    description:
      "White-label web developer for Australian digital marketing agencies. WordPress, Shopify and Next.js builds, landing pages, fixes and care plans, delivered under your brand with fixed quotes.",
  },
  hero: {
    title: "Your white-label web developer.",
    sub: "I build and maintain websites for Australian digital marketing agencies, under your brand. You keep the client relationship; I deliver on time and stay invisible.",
  },
  statement: {
    statement:
      "I'm the developer behind the websites your agency sells. You keep the client and the credit. I keep the deadline.",
    pillars: ["Your brand.", "Fixed quotes.", "On time."],
    mission:
      "Overflow work, a one-off build or care for every client site. I fit into the way your team already works, and nobody outside it needs to know I'm there.",
  },
  mantra: {
    label: "Your brand, my code, on time",
    kicker: "Three promises. Every project.",
    words: ["Your brand", "My code", "On time"],
    caption: "Invisible on purpose",
  },
  why: [
    { title: "8 years, 50+ projects", desc: "I started at a digital marketing agency, so I know how briefs, deadlines and client sign-offs really work." },
    { title: "White-label by default", desc: "Your brand on everything: the site, the staging link, the handover. I never appear in front of your client." },
    { title: "Fixed quotes before starting", desc: "You get a fixed price up front, so your margin is known before a line of code is written." },
    { title: "Ready by your next morning", desc: "I'm 4.5 hours behind AEST. Send changes at the end of your day and they're done when you're back in." },
    { title: "One developer, no hand-offs", desc: "The person who quotes your project is the person who builds it. Nothing gets lost between teams." },
  ],
  services: [
    { title: "WordPress", desc: "Elementor or custom themes, built so your team can edit them." },
    { title: "Shopify", desc: "Theme builds and customisation, with product pages that sell." },
    { title: "Next.js builds", desc: "Fast, custom sites for when a page builder won't cut it." },
    { title: "Landing pages", desc: "Campaign pages built to your designs, ready for tracking." },
    { title: "Redesigns & migrations", desc: "Move a client site without losing content or Google rankings." },
    { title: "Speed, SEO & technical fixes", desc: "Core Web Vitals, broken pages, redirects, schema and security warnings." },
    { title: "Ongoing maintenance", desc: "Updates, backups and small edits for your clients' sites, every month." },
  ],
  // prefix "From" = starting price; a null amount shows "On request"
  rates: [
    {
      label: "5–7 page website",
      prefix: "From",
      amount: 1800,
      note: "Built from your design. AUD 2,200 if I design it too.",
    },
    {
      label: "Landing page",
      prefix: "From",
      amount: 400,
      note: "Built from your design, ready for tracking. AUD 550 if I design it.",
    },
    {
      label: "Hourly / overflow",
      amount: 35,
      suffix: "/ hr",
      note: "Invoiced when done.",
    },
  ],
  firstProject: null, // e.g. "20% off your first project"
  process: [
    { title: "Brief", desc: "You send the brief, the designs or a call recording." },
    { title: "Fixed quote", desc: "A fixed price and timeline, usually within a day." },
    { title: "Build on staging", desc: "I build on a private staging link, never on the live site." },
    { title: "Your review", desc: "You and your client review it. Revisions are part of the quote." },
    { title: "Launch under your brand", desc: "It goes live with your agency's name on it, not mine." },
    { title: "Optional care", desc: "I keep the site updated and backed up, billed to you." },
  ],
  lab: {
    title: "What I can build for you.",
    intro:
      "Agency work goes out under your brand, so I don't show it publicly. These experiments show the motion and interaction I can bring to your clients' sites. Drag one into the scanner to see it, and ask me for relevant examples on a call.",
  },
  faqs: [
    {
      q: "Whose name goes on the site?",
      a: [
        "Yours. White-label is the default, not an extra: no credits in the footer, no mention of me in the code or the handover.",
      ],
    },
    {
      q: "How do we communicate?",
      a: [
        "Whatever your team already uses: Slack, email or WhatsApp. I can join your Slack as a guest.",
        "You get one point of contact, me, for every project.",
      ],
    },
    {
      q: "How do the time zones work?",
      a: [
        "I'm 4.5 hours behind AEST. My working day overlaps your afternoon, so we can talk live, and I keep working after you've logged off.",
        "Changes you send in the afternoon are usually ready by your next morning.",
      ],
    },
    {
      q: "How many revisions are included?",
      a: ["Two rounds of revisions are included in every fixed quote. Anything outside the brief gets a quick quote before I start on it."],
    },
    {
      q: "What are your payment terms?",
      a: [
        "For builds, 50% upfront and 50% at launch. Fixes and hourly work are invoiced when done. Care plans are billed monthly.",
        "All prices are in AUD and invoiced to your agency, never to your client.",
      ],
    },
    {
      q: "Will you ever contact our clients?",
      a: ["Never. I only talk to your team, unless you ask me to join a call as part of your agency."],
    },
  ],
  needs: ["Overflow builds", "Ongoing partnership", "One project", "Maintenance"],
};

/* ── /privacy ──────────────────────────────────────────────────────── */
export const privacy = {
  updated: "18 October 2026",
  sections: [
    {
      title: "What the contact forms collect",
      body: [
        "When you send an enquiry, I collect what you type in: your name, email address, the package or service you choose, and your message.",
        "The agency form also collects your agency's name, its website and the kind of help you need.",
        "A hidden spam-trap field is checked and thrown away. The forms don't set cookies.",
      ],
    },
    {
      title: "Why I collect it",
      body: [
        "Only to reply to your enquiry, prepare a quote, and do the work if we go ahead. I don't add you to a mailing list, and I never sell or share your details.",
      ],
    },
    {
      title: "Where it's stored",
      body: [
        "The form sends your message to my Gmail inbox (Google) through this website, which is hosted on Vercel. It stays in that inbox and isn't saved in any other database.",
        "This site uses Vercel Analytics to count page views. It doesn't use cookies or identify you personally.",
      ],
    },
    {
      title: "Asking for deletion",
      body: [
        "You can ask to see, correct or delete what I hold about you at any time. Email me and I'll do it within 30 days, unless I need to keep an invoice record for tax.",
      ],
    },
  ],
};
