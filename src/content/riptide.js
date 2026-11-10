/*
 * Riptide Physio & Performance — every word on /work/riptide-physio.
 * A concept build: the clinic, people, phone number and prices are fictional.
 * The phone number sits in the ACMA range reserved for fiction (07 5550 xxxx),
 * so it never rings a real person.
 */

const M = "/riptide";

export const clinic = {
  name: "Riptide Physio & Performance",
  short: "Riptide",
  suburb: "Mermaid Beach",
  region: "Gold Coast",
  founded: 2018,
  phone: "(07) 5550 2618",
  phoneHref: "tel:+61755502618",
  email: "hello@riptidephysio.com.au",
  address: ["Shop 3, 14 Seagull Avenue", "Mermaid Beach QLD 4218"],
  mapsHref: "https://www.google.com/maps/search/?api=1&query=Seagull+Avenue+Mermaid+Beach+QLD+4218",
  mapEmbed:
    "https://www.openstreetmap.org/export/embed.html?bbox=153.4268%2C-28.0498%2C153.4442%2C-28.0371&layer=mapnik",
  hours: [
    { days: "Mon – Fri", time: "6:00am – 7:30pm" },
    { days: "Saturday", time: "7:00am – 12:30pm" },
    { days: "Sunday", time: "Closed" },
  ],
  parking:
    "Free parking for patients behind the building (enter from Seagull Ave), plus 2-hour street parking out front. The 700 bus stops two minutes' walk away on the Gold Coast Highway.",
  rating: { score: "4.9", count: "412" },
};

export const nav = [
  { label: "Treatments", href: "#treatments" },
  { label: "Programs", href: "#programs" },
  { label: "Team", href: "#team" },
  { label: "Fees", href: "#fees" },
  { label: "Visit", href: "#visit" },
];

export const hero = {
  video: { landscape: `${M}/hero.mp4`, portrait: `${M}/hero-portrait.mp4` },
  poster: { landscape: `${M}/hero.webp`, portrait: `${M}/hero-portrait.webp` },
  eyebrow: "Mermaid Beach · Gold Coast · Since 2018",
  headline: "Move like nothing’s holding you back.",
  sub: "Sports and everyday physio in Mermaid Beach. No referral needed.",
  primary: "Book an appointment",
  secondary: "I’m an existing patient",
  strip: ["HICAPS on the spot", "Open 6am", "Saturdays"],
};

export const acts = {
  title: "Recovery, in three steps",
  items: [
    {
      numeral: "01",
      name: "Assess",
      line: "We find the real cause, not just where it hurts.",
      detail:
        "A full 45-minute first visit: your history, how you move, strength and load testing. You leave knowing what’s going on and what happens next.",
      video: `${M}/act-assess.mp4`,
      poster: `${M}/act-assess.webp`,
    },
    {
      numeral: "02",
      name: "Treat",
      line: "Hands-on care plus a plan you can follow.",
      detail:
        "Manual therapy, dry needling and exercise in our rehab gym, with a home program in the Physitrack app so you know exactly what to do between sessions.",
      video: `${M}/act-treat.mp4`,
      poster: `${M}/act-treat.webp`,
    },
    {
      numeral: "03",
      name: "Return",
      line: "Back to your sport, your work, your life.",
      detail:
        "We test you against the things you actually do, whether that’s paddling out, a 10k, or a full day at the desk, and build you past where you were before.",
      video: `${M}/act-return.mp4`,
      poster: `${M}/act-return.webp`,
    },
  ],
};

/*
 * 3D body hotspots. `pos` is a point on the figure in model units (the body
 * is about 3.55 units tall, feet at y = 0). `facing` is the yaw (radians) the
 * figure turns to so the area faces the camera.
 */
export const bodyMap = {
  model: `${M}/body.bin`,
  title: "Where does it hurt?",
  intro: "Tap the area that’s bothering you. We’ll show you what it might be and how we help.",
  regions: [
    {
      id: "neck",
      label: "Neck",
      pos: [0, 3.079, -0.11],
      facing: Math.PI,
      conditions: ["Desk-related neck pain", "Whiplash (CTP claims)", "Tension headaches", "Wry neck"],
      help: "Hands-on treatment to settle pain quickly, then posture and strength work you can fit around your workday. We can also check your desk setup.",
      service: "Back & neck pain",
    },
    {
      id: "shoulder",
      label: "Shoulder",
      pos: [0.436, 2.871, 0.085],
      facing: -0.5,
      conditions: ["Rotator cuff injuries", "Surfer’s shoulder", "Dislocations", "Post-surgery rehab"],
      help: "We work out whether it’s the joint, the tendon or how your shoulder blade moves, then load it back up in stages until you can paddle, throw or lift again.",
      service: "Sports injuries",
    },
    {
      id: "back",
      label: "Lower back",
      pos: [0, 2.229, -0.164],
      facing: Math.PI,
      conditions: ["Acute low back pain", "Disc injuries & sciatica", "Lifting injuries (WorkCover)", "Pregnancy-related back pain"],
      help: "Most back pain gets better with the right movement, not bed rest. We calm it down, explain what’s going on in plain words and get you moving with confidence.",
      service: "Back & neck pain",
    },
    {
      id: "hip",
      label: "Hip",
      pos: [0.331, 1.896, 0.067],
      facing: -0.35,
      conditions: ["Hip & groin pain", "Gluteal tendinopathy", "Hip arthritis", "Hip replacement rehab"],
      help: "From runners with groin pain to hip arthritis, we strengthen the hip properly. Ask us about the GLA:D® program for arthritis.",
      service: "GLA:D® program",
    },
    {
      id: "knee",
      label: "Knee",
      pos: [0.295, 1.042, 0.119],
      facing: -0.25,
      conditions: ["ACL tears & reconstruction", "Runner’s knee", "Meniscus injuries", "Knee arthritis"],
      help: "Whether it’s an ACL or a niggle that flares up every time you run, we test it, treat it and build it back. ACL patients follow our 12-week Return-to-Sport program.",
      service: "ACL Return-to-Sport",
    },
    {
      id: "ankle",
      label: "Ankle",
      pos: [0.354, 0.148, 0.111],
      facing: -0.3,
      conditions: ["Ankle sprains", "Achilles pain", "Plantar heel pain", "Shin splints"],
      help: "Sprains that never quite settle and Achilles pain that won’t go away are common. We rebuild strength, balance and spring so it stops coming back.",
      service: "Sports injuries",
    },
  ],
};

export const services = {
  title: "What we treat",
  items: [
    { title: "Sports injuries", line: "Sprains, strains and tears, from weekend footy to the national stage.", img: `${M}/svc-sports.webp` },
    { title: "Back & neck pain", line: "Desk-bound or lifting all day, we get you moving without pain.", img: `${M}/svc-back.webp` },
    { title: "Post-surgery rehab", line: "ACL, shoulder, hip and knee replacements, with your surgeon kept in the loop.", img: `${M}/svc-postop.webp` },
    { title: "Clinical Pilates", line: "Small classes on reformers, run by physios. Health fund rebates apply.", img: `${M}/svc-pilates.webp` },
    { title: "Dry needling", line: "Releases tight, overactive muscles as part of hands-on treatment.", img: `${M}/svc-needling.webp` },
    { title: "Running assessments", line: "Video gait analysis on the treadmill, with a plan for your next race.", img: `${M}/svc-running.webp` },
    { title: "Women’s health", line: "Pregnancy, postnatal recovery and pelvic health with a female physio.", img: `${M}/svc-womens.webp` },
  ],
};

export const programs = {
  title: "Programs",
  intro: "Structured programs with a clear start, finish and goal. Each one starts with a full assessment.",
  items: [
    {
      name: "ACL Return-to-Sport",
      length: "12 weeks",
      line: "From your first post-op steps to passing the tests that say you’re ready for the field.",
      includes: ["Staged gym program with a physio", "Strength & hop testing at weeks 6 and 12", "Updates to your surgeon", "Return-to-sport sign-off"],
      video: `${M}/knee.mp4`,
      poster: `${M}/knee.webp`,
    },
    {
      name: "GLA:D® for knee & hip arthritis",
      length: "8 weeks",
      line: "The evidence-based program from Denmark: two small-group classes a week, proven to reduce pain and the need for surgery.",
      includes: ["2 education sessions", "12 supervised group classes", "Licensed GLA:D® physio", "Health fund rebates per class"],
      img: `${M}/prog-glad.webp`,
    },
    {
      name: "Run Clinic",
      length: "Single session + follow-up",
      line: "A 75-minute video gait analysis with Dr Ana Ribeiro’s team, for runners who want fewer injuries and a faster PB.",
      includes: ["Slow-motion treadmill video", "Strength & mobility screening", "Shoe and training-load advice", "Written report and drills"],
      img: `${M}/prog-run.webp`,
    },
  ],
};

export const team = {
  title: "Meet the team",
  cast: [
    {
      id: "liam",
      name: "Liam Carter",
      role: "Co-founder · Sports Physiotherapist",
      specialty: "Contact sport, shoulders & ACL rehab",
      img: `${M}/team-liam.webp`,
      focus: "50% 22%",
      bio: [
        "Liam spent six seasons as physio for a state rugby league side before opening Riptide with Ana in 2018. He’s seen just about every shoulder, knee and ankle injury the game can throw at a body.",
        "He treats everyday people the same way he treated athletes: a clear diagnosis, a plan with milestones, and honest conversations about when you’re ready.",
      ],
      quals: ["B. Physiotherapy (Hons)", "Titled Sports & Exercise Physiotherapist", "Dry needling certified"],
    },
    {
      id: "ana",
      name: "Dr Ana Ribeiro",
      role: "Co-founder · Physiotherapist, PhD",
      specialty: "Running biomechanics & bone stress injuries",
      img: `${M}/team-ana.webp`,
      focus: "50% 18%",
      bio: [
        "Ana completed her PhD in running biomechanics, studying how load and technique affect injury in distance runners. She leads our Run Clinic and the video gait analysis lab.",
        "From first-time parkrunners to marathoners chasing a PB, she helps runners stay on the road for longer.",
      ],
      quals: ["PhD (Running Biomechanics)", "B. Physiotherapy", "Clinical Pilates instructor"],
    },
    {
      id: "josh",
      name: "Josh Tane",
      role: "Physiotherapist",
      specialty: "Surf & paddle injuries, dry needling",
      img: `${M}/team-josh.webp`,
      focus: "50% 25%",
      bio: [
        "A lifelong Gold Coast surfer, Josh knows what paddling does to shoulders and backs. He treats surfers, swimmers and anyone whose sport lives in the water.",
        "Expect hands-on treatment and a gym plan you can actually stick to.",
      ],
      quals: ["B. Physiotherapy", "Dry needling certified", "Surf Lifesaving QLD physio"],
    },
    {
      id: "mia",
      name: "Mia Lawson",
      role: "Physiotherapist · Pilates Lead",
      specialty: "Women’s health & Clinical Pilates",
      img: `${M}/team-mia.webp`,
      focus: "50% 20%",
      bio: [
        "Mia runs our Clinical Pilates studio and women’s health service, from pregnancy-related pain to getting back to exercise after a baby.",
        "Her classes are small (four people at most), so the physio always has eyes on your form.",
      ],
      quals: ["B. Physiotherapy", "Women’s health post-grad", "APPI Pilates certified"],
    },
  ],
  alsoStarring: [
    { name: "Priya Nair", role: "Post-surgical rehab & GLA:D®" },
    { name: "Tom Becker", role: "Back & neck pain, WorkCover" },
  ],
};

export const space = {
  title: "A clinic built for movement.",
  shots: [
    { label: "The rehab gym", note: "Racks, sleds and a 20-metre track for proper return-to-sport testing.", img: `${M}/space-gym.webp` },
    { label: "The Pilates studio", note: "Six reformers and a trapeze table. Classes of four, run by physios.", img: `${M}/space-pilates.webp` },
    { label: "Treatment rooms", note: "Five private rooms with height-adjustable tables. Quiet, cool and unhurried.", img: `${M}/space-rooms.webp` },
  ],
};

export const fees = {
  title: "Fees & rebates, in plain words",
  intro: "No surprises. Prices include GST where it applies. Claim your health fund rebate on the spot with HICAPS, so you only pay the gap.",
  rows: [
    { item: "Initial consultation", time: "45 min", price: "$110" },
    { item: "Follow-up consultation", time: "30 min", price: "$95" },
    { item: "Extended follow-up", time: "45 min", price: "$125" },
    { item: "Run Clinic gait analysis", time: "75 min", price: "$210" },
    { item: "Clinical Pilates class", time: "55 min", price: "$42" },
  ],
  cover: [
    { title: "No referral needed", line: "Book directly. You don’t need to see a GP first." },
    { title: "HICAPS on the spot", line: "Swipe your health fund card and pay only the gap." },
    { title: "Medicare care plans", line: "Bring your GP’s Chronic Disease Management plan for a Medicare rebate." },
    { title: "DVA", line: "Gold and White card holders are welcome, with nothing to pay on approved treatment." },
    { title: "WorkCover", line: "Hurt at work? Bring your claim number and we bill WorkCover directly." },
    { title: "CTP", line: "Injured in a car accident? We work with your CTP insurer." },
  ],
};

export const faq = {
  title: "Quick questions",
  items: [
    {
      q: "Do I need a referral?",
      a: "No. You can book straight in with any of our physios. The only time you need a GP referral is for a Medicare care plan, DVA, or if your WorkCover or CTP insurer asks for one.",
    },
    {
      q: "What should I wear?",
      a: "Something comfortable you can move in. Shorts are best for hip, knee or ankle problems, and a singlet or loose top for the neck and shoulder. Bring your running shoes if it’s a running injury.",
    },
    {
      q: "How long is the first appointment?",
      a: "45 minutes. That gives us time to listen, assess properly, start treatment and send you home with a plan. Please arrive 5 minutes early to fill in a short form.",
    },
    {
      q: "Can I claim on my health fund?",
      a: "Yes. If you have extras cover that includes physiotherapy, we claim it on the spot through HICAPS and you only pay the gap. Clinical Pilates and GLA:D® classes are claimable with most funds too.",
    },
    {
      q: "Do you treat people who aren’t athletes?",
      a: "Absolutely, they’re most of the people we see. Office workers, tradies, new parents and retirees all get the same thorough care. ‘Athlete’ just means someone with something they want to get back to.",
    },
  ],
};

export const finale = {
  title: "Your comeback starts here.",
  video: `${M}/stride.mp4`,
  poster: `${M}/stride.webp`,
  acknowledgement:
    "Riptide Physio & Performance acknowledges the Kombumerri people of the Yugambeh language region, the Traditional Custodians of the land and waters where we work. We pay our respects to Elders past and present.",
};

/* Booking drawer: reads like the Cliniko flow the clinic uses */
export const booking = {
  types: [
    { id: "new", name: "Initial consultation", time: "45 min", price: "$110", note: "First visit, or a new injury" },
    { id: "follow", name: "Follow-up consultation", time: "30 min", price: "$95", note: "Continuing treatment" },
    { id: "run", name: "Run Clinic gait analysis", time: "75 min", price: "$210", note: "Video gait analysis" },
    { id: "pilates", name: "Clinical Pilates assessment", time: "45 min", price: "$110", note: "Required before classes" },
  ],
  anyone: "First available",
};
