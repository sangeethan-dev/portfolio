/*
  Stillwater Psychology: site settings
  ------------------------------------
  Change the values below and every matching spot on the site updates.
  Keep the quote marks around text values. Fees are plain numbers (no $).

*/
window.SITE_CONFIG = {
  // Session fees in dollars. Reviewed each July.
  fees: {
    standard: 230, // 50 minute session with a psychologist
    clinical: 260, // 50 minute session with a clinical psychologist
    extended: 320, // 80 minute session
    couples: 340,  // 80 minute couples session
  },

  // Indicative Medicare rebates (Better Access, sessions of 50 minutes or more).
  // Check these each July against the MBS schedule.
  medicare: {
    general: 98.95,   // registered psychologist
    clinical: 145.25, // clinical psychologist
  },

  // Opening hours, shown in the hero card, FAQ, contact section and footer.
  hours: {
    weekdays: "Monday to Friday, 8am to 6pm",
    late: "Thursday evenings until 8pm",
    short: "Mon to Fri, 8am to 6pm · Thu until 8pm",
  },

  // Contact details. The phone and fax use a range reserved for fictional use.
  contact: {
    street: "Suite 5, 18 Lakeside Drive",
    suburb: "Varsity Lakes QLD 4227",
    phone: "07 5550 1427",
    fax: "07 5550 1428",
    email: "hello@stillwaterpsychology.com.au",
  },

  // Halaxy booking links. Leave them empty to use the booking flow built into
  // the site. Paste a full link (for example "https://www.halaxy.com/...") to
  // send that button to Halaxy instead.
  booking: {
    newClient: "",      // the free 15 minute call
    existingClient: "", // existing clients booking their next session
  },
};
