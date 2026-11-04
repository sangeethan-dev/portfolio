/*
 * All site copy in one place. Components import from here so FAQs,
 * rates and contact details are never duplicated.
 *
 * Voice: plain, warm, specific. The homepage is a general portfolio with
 * no prices: direct prices go in cold emails, so agencies only ever see
 * their own rates on /agencies. Don't add prices or niche wording to it.
 */

/* ── Site URL — the ONE place to change when moving to a custom domain.
   Used for canonical tags, og:url, sitemap.xml and robots.txt.
   Can also be set per environment with NEXT_PUBLIC_SITE_URL. ───────── */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.sangeethan.com").replace(/\/$/, "");

export const contact = {
  email: "email2geethan@gmail.com",
  phoneDisplay: "+94 75 6144113",
  whatsapp: "https://wa.me/94756144113",
  inspirations: "https://lab.sangeethan.com/",
  city: "Colombo",
  timeZone: "Asia/Colombo",
  clientTimeZone: "Australia/Brisbane",
  clientTimeLabel: "AEST",
};

export const aud = (n) => `AUD ${n.toLocaleString("en-AU")}`;

/* Foot of the mobile menu on /agencies (menuLine elsewhere) */
export const agencyLine = "For agencies · Fixed quotes in AUD · Invoiced to you, never your client";

export const nav = [
  { label: "Build", href: "#build" },
  { label: "Lab", href: "#playground" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/* Header nav on /agencies */
export const agencyNav = [
  { label: "Services", href: "#services" },
  { label: "Rates", href: "#rates" },
  { label: "Lab", href: "#playground" },
  { label: "Contact", href: "#contact" },
];

/* Pages linked from the footer. /agencies is deliberately not here: it's
   shared directly in agency outreach and never linked from the main site. */
export const pageLinks = {
  privacy: { label: "Privacy", href: "/privacy" },
};

/* ── Story beats (Statement + Mantra) ────────────────────────────── */
export const manifesto = {
  statement:
    "I'm an independent web developer building fast websites with motion people remember.",
  pillars: ["One person.", "Fixed quote.", "No hand-offs."],
  mission:
    "Eight years in, I still do it by hand: clean code, sharp type, and animation that earns its place. You get one person from the first call to launch day, and a site that's easy to run after it.",
};

export const mantra = {
  label: "Designed, built, shipped",
  kicker: "Three jobs. One developer.",
  words: ["Designed", "Built", "Shipped"],
  caption: "From first sketch to launch day",
};

/* "One person. No chain." section. Don't attack agencies here: they're
   the main audience and can reach this page. The target is the chain of
   people, not the agency. Keep the project cap in step with the FAQ. */
export const onePerson = {
  title: "One person. No chain.",
  from: "Your brief",
  chain: ["Salesperson", "Project manager", "Designer", "Developer"],
  me: "Sangeethan",
  to: "Your website",
  copy: [
    "On a bigger team, your brief passes through a salesperson, a project manager, a designer and a developer. Something gets lost at every step. With me there are no steps. The person who hears what you want is the person who builds it.",
    "My next project depends on how this one goes. That's all the motivation I need.",
  ],
  wontTitle: "What I won't do",
  wont: [
    "Hand your project to anyone else.",
    "Take on more than 3 projects at a time.",
    "Promise you first place on Google. Nobody controls that.",
  ],
};

/* Footer sign-off */
export const signoff = {
  kicker: "Let's build a website that works as hard as you do.",
  title: "Have a project in mind?",
};

/* Options for the contact form's service select */
export const serviceOptions = [
  "New website",
  "Redesign of my current website",
  "Online store",
  "Landing page",
  "Fix something on my website",
  "Looking after my website",
  "Not sure yet",
];

export const buildSteps = [
  {
    num: "01",
    title: "Wireframe",
    desc: "First we work out what people need to find quickly, and what you want them to do next.",
  },
  {
    num: "02",
    title: "Design",
    desc: "Then it gets a look that's yours. You see it, tell me what you think, and we adjust it together.",
  },
  {
    num: "03",
    title: "Code",
    desc: "I build it by hand so it loads quickly on a phone, moves well, and shows up properly on Google.",
  },
  {
    num: "04",
    title: "Live",
    desc: "We test it, launch it, and hand it over. I can stay on to keep it updated, or leave you with everything you need.",
  },
];

export const stats = [
  { value: 8, suffix: "", label: "Years building websites" },
  { value: 50, suffix: "+", label: "Projects delivered" },
  { value: 1, suffix: "", label: "Person you deal with" },
];

/* Foot of the mobile menu */
export const menuLine = `Independent web developer · ${stats[0].value} years · ${stats[1].value}${stats[1].suffix} projects`;

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
        { name: "Webflow", note: "Designs built with clean classes and a CMS your team can edit." },
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
   (960x600 webp). Only list experiments that are plain pages (they have an
   index.html): the scanner runs <inspirations>/showcases/<id>/index.html live,
   and React showcases (component.tsx) have no such page.
   and its page is <inspirations>/showcase/<id>. Copy from its meta.json. */
const labItem = (item) => ({
  ...item,
  href: `${contact.inspirations}showcase/${item.id}`,
  // the bare experiment (no gallery chrome), embedded live in the scanner
  run: `${contact.inspirations}showcases/${item.id}/index.html`,
  img: `/portfolio/lab/${item.id}.webp`,
});

export const lab = {
  title: "Things I build for fun.",
  intro:
    "Most of my client work went out under other brands, so it isn't mine to show. These are the experiments I build between projects: cursors, loaders, heroes and other interactions. Drag one into the scanner to run it.",
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
      id: "acronym-intro-hero",
      title: "Acronym Intro Hero",
      category: "Hero",
      desc: "A landscape practice's homepage: an acronym intro opens into the hero through a chamfered frame, then sector cards slide over it as you scroll.",
      tech: ["Preloader", "Sticky", "Lenis"],
    },
    {
      id: "morph-loader",
      title: "Morph Loader",
      category: "Loader",
      desc: "A photographer's intro: a morphing shape flip-books portraits while loading, then blooms into the full-screen hero.",
      tech: ["SVG", "Path Morph", "Clip Path"],
    },
    {
      id: "liquid-reveal-hero",
      title: "Liquid Reveal Hero",
      category: "Hero",
      desc: "A fashion lookbook hero where photography pours in through a liquid displacement field, with a word-by-word headline reveal.",
      tech: ["SVG Filter", "Displacement", "Reveal"],
    },
    {
      id: "guiding-light",
      title: "Guiding Light",
      category: "Cursor",
      desc: "A procedural flame follows your cursor through a dark forest, revealing only what its light touches.",
      tech: ["Canvas", "Particles", "CSS Mask"],
    },
    {
      id: "infinite-marquee",
      title: "Infinite Marquee",
      category: "Marquee",
      desc: "A film studio's reel in three seamless rows — hover eases a row to rest, scroll speeds it up, drag scrubs with inertia.",
      tech: ["Vanilla JS", "Loop", "Drag"],
    },
    {
      id: "magnetic-cards",
      title: "Magnetic Cards",
      category: "Cards",
      desc: "A photo zine's four prints held in a stack — push them with your cursor and they spring back, dragging their neighbours along.",
      tech: ["GSAP", "Physics", "Cursor"],
    },
  ].map(labItem),
};

export const faqs = [
  {
    q: "What kind of projects do you take on?",
    a: [
      "Websites, online stores and landing pages, mostly in Next.js, WordPress, Webflow and Shopify.",
      "I can design it too, or build from designs you already have. If you want motion and interaction, that's the part I enjoy most.",
    ],
  },
  {
    q: "Why not use a bigger team?",
    a: [
      "For a very large project, a bigger team can be the right call. For most websites, it just puts more people between you and the work.",
      "With me, the person you talk to is the person who builds it, and I take on 3 projects at a time.",
    ],
  },
  {
    q: "How much does a website cost?",
    a: [
      "It depends on the size of the site and what it needs to do, so I don't publish one price.",
      "Tell me what you have in mind and you'll get a fixed quote before I start. No hourly surprises.",
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
      "No. Send me the basics: what you do and who it's for.",
      "I'll turn that into clear pages, and nothing goes live until you've approved every word.",
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
    q: "What happens after launch?",
    a: [
      "You own the site and everything in it, and I make sure you can update it yourself.",
      "If you'd rather not think about it, I can look after updates, backups and small changes for you.",
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
   firstProject hides the offer line, so the page is safe to ship as is.
   No care plans for agencies: ongoing work is hourly, no retainer. */
const AGENCY_HOURLY = 35;
const AGENCY_SITE = 1800; // 5–7 pages, built from your design
const AGENCY_SITE_DESIGNED = 2200; // …and I design it too

export const agency = {
  meta: {
    title: "White-Label Web Developer Australia — Sangeethan",
    description:
      "White-label web developer for Australian digital marketing agencies. WordPress, Webflow, Shopify and Next.js builds, landing pages and fixes, delivered under your brand with fixed quotes.",
  },
  hero: {
    title: "Your white-label web developer.",
    sub: "I build websites for Australian digital marketing agencies, under your brand. You keep the client relationship; I deliver on time and stay invisible.",
  },
  statement: {
    statement:
      "I'm the developer behind the websites your agency sells. You keep the client and the credit. I keep the deadline.",
    pillars: ["Your brand.", "Fixed quotes.", "On time."],
    mission:
      "Eight years and 50+ projects in, starting at a digital marketing agency, I know how briefs, deadlines and client sign-offs really work. I fit into the way your team already works, and nobody outside it needs to know I'm there.",
  },
  mantra: {
    label: "Your brand, my code, on time",
    kicker: "Three promises. Every project.",
    words: ["Your brand", "My code", "On time"],
    caption: "Invisible on purpose",
  },
  services: [
    { title: "WordPress", desc: "Elementor or custom themes, built so your team can edit them." },
    { title: "Webflow", desc: "Your designs built in Webflow, with clean classes and a CMS your team can edit." },
    { title: "Shopify", desc: "Theme builds and customisation, with product pages that sell." },
    { title: "Next.js builds", desc: "Fast, custom sites for when a page builder won't cut it." },
    { title: "Landing pages", desc: "Campaign pages built to your designs, ready for tracking." },
    { title: "Redesigns & migrations", desc: "Move a client site without losing content or Google rankings." },
    { title: "Speed, SEO & technical fixes", desc: "Core Web Vitals, broken pages, redirects, schema and security warnings." },
    {
      title: "Edits & fixes on call",
      desc: `Small changes, plugin updates and broken pages, billed hourly at ${aud(AGENCY_HOURLY)}. No retainer.`,
    },
  ],
  /* "Send me the design" — the build-to-design promise for design-led
     studios. A sticky browser frame acts out each point as it scrolls past;
     `shots` are the same page (a Lab experiment) at each screen size and
     `caption` is the frame's readout for that point. */
  handover: {
    title: "Send me the design. I'll match it.",
    intro: "Figma, Adobe XD or a PDF mock-up all work.",
    files: ["Figma", "Adobe XD", "PDF mock-up"],
    shots: {
      desktop: "/portfolio/handover/desktop.webp",
      tablet: "/portfolio/handover/tablet.webp",
      phone: "/portfolio/handover/phone.webp",
    },
    url: "staging.your-agency.com.au",
    points: [
      {
        title: "Every screen size",
        caption: "Desktop · tablet · phone",
        desc: "Built to your design at desktop, tablet and phone sizes. Where the design doesn't show a breakpoint, I ask before I guess.",
      },
      {
        title: "Your system, not a theme's",
        caption: "Your fonts, colours and spacing",
        desc: "Your fonts, colours and spacing, not a theme's defaults.",
      },
      {
        title: "Motion as designed",
        caption: "Design → build",
        desc: "Animations and hover states built the way your designer meant them. The Lab below shows what's possible.",
      },
      {
        title: "No design yet?",
        caption: "Wireframe → design",
        desc: `I can design it in your client's brand for ${aud(AGENCY_SITE_DESIGNED)} instead of ${aud(AGENCY_SITE)}.`,
      },
    ],
  },
  // prefix "From" = starting price; a null amount shows "On request"
  rates: [
    {
      label: "5–7 page website",
      prefix: "From",
      amount: AGENCY_SITE,
      note: `Built from your design. ${aud(AGENCY_SITE_DESIGNED)} if I design it too.`,
    },
    {
      label: "Landing page",
      prefix: "From",
      amount: 400,
      note: "Built from your design, ready for tracking. AUD 550 if I design it.",
    },
    {
      label: "Hourly / overflow",
      amount: AGENCY_HOURLY,
      suffix: "/ hr",
      note: "Invoiced when done.",
    },
  ],
  // shown under the rate cards; matches the offer in every outreach email (null hides it)
  firstProject: {
    tag: "First project together?",
    text: "Take 20% off the first site, or start with a small paid test task, like one landing page, and see how I work before you commit.",
  },
  /* Typical turnarounds, drawn as bars on a `scale`-working-day axis
     (20 = 4 weeks). min/max are working days; max - min is the lighter
     "range" part of the bar. */
  timelines: {
    title: "How long things take.",
    intro: "Every quote comes with a date. These are typical, counted from when I have the designs and content.",
    scale: 20,
    items: [
      { label: "Fixes and small edits", time: "Usually by your next morning", min: 0.5, max: 0.5 },
      { label: "Landing page", time: "3–5 working days", min: 3, max: 5 },
      { label: "5–7 page website", time: "3–4 weeks", min: 15, max: 20 },
    ],
    note: "Running against a launch date? Tell me in the brief and I'll say up front whether I can hit it.",
  },
  process: [
    { title: "Brief", desc: "You send the brief, the designs or a call recording." },
    { title: "Fixed quote", desc: "A fixed price and timeline, usually within a day." },
    { title: "Build on staging", desc: "I build on a private staging link, never on the live site." },
    { title: "Your review", desc: "You and your client review it. Revisions are part of the quote." },
    { title: "Launch under your brand", desc: "It goes live with your agency's name on it, not mine." },
    { title: "After launch", desc: "Need changes later? Send them over and I bill the time at the hourly rate. No retainer, no lock-in." },
  ],
  lab: {
    title: "What I can build for you.",
    intro:
      "Agency work goes out under your brand, so I don't show it publicly. These experiments show the motion and interaction I can bring to your clients' sites. Drag one into the scanner to run it, and ask me for relevant examples on a call.",
  },
  faqs: [
    {
      q: "Whose name goes on the site?",
      a: [
        "Yours. No credits in the footer, no mention of me in the code or the handover.",
        "And I never contact your clients, unless you ask me to join a call as part of your agency.",
      ],
    },
    {
      q: "Who will I actually talk to?",
      a: [
        "Me. I write the code and answer every message, on Slack, email or WhatsApp. There's no account manager in between.",
      ],
    },
    {
      q: "How many agencies do you work with?",
      a: ["Three at a time, so your job doesn't wait behind a bigger client."],
    },
    {
      q: "Is the quote fixed before you start?",
      a: [
        "Yes. You get a fixed price and a date first, so your margin is known up front.",
        "Two rounds of revisions are included. Anything outside the brief gets a quick quote before I start on it.",
      ],
    },
    {
      q: "You're overseas. Why would I trust that?",
      a: [
        "You're not hiring an offshore team. You're hiring one named person, with a face, a phone number and WhatsApp.",
        "Working from Colombo also keeps my rates low enough to leave real room for your margin.",
      ],
    },
    {
      q: "How do the time zones work?",
      a: [
        "I'm 4.5 hours behind AEST, so we overlap in your afternoon.",
        "Changes you send then are usually ready by your next morning.",
      ],
    },
    {
      q: "What are your payment terms?",
      a: ["For builds, 50% upfront and 50% at launch. Fixes and hourly work are invoiced when done, in AUD, to your agency."],
    },
    {
      q: "Who owns the code and logins?",
      a: ["Your agency or your client, from launch day. I hand over all logins and files."],
    },
  ],
  needs: ["Overflow builds", "Ongoing partnership", "One project", "Edits & fixes"],
};

/* ── /privacy ──────────────────────────────────────────────────────── */
export const privacy = {
  updated: "31 October 2026",
  sections: [
    {
      title: "What the contact forms collect",
      body: [
        "When you send an enquiry, I collect what you type in: your name, email address, the service you choose, and your message.",
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
