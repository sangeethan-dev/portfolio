/*
  Stillwater Psychology: site settings
  ------------------------------------
  Change the values below and every matching spot on the site updates.
  Keep the quote marks around each value.

*/
window.SITE_CONFIG = {
  // Session fees. Reviewed each July.
  fees: {
    standard: "$230", // 50 minute session
    extended: "$320", // 80 minute session
    couples: "$340",  // 80 minute couples session
  },

  // Opening hours, shown in the hero card, FAQ, final call to action and footer.
  hours: {
    weekdays: "Monday to Friday, 8am to 6pm",
    late: "Thursday evenings until 8pm",
    short: "Mon to Fri, 8am to 6pm · Thu until 8pm",
  },

  // Contact details. The suburb line stays as is; update the street address after the January move.
  contact: {
    street: "Suite 5, 18 Lakeside Drive",
    suburb: "Varsity Lakes QLD 4227",
    phone: "07 5550 1427",
    email: "hello@stillwaterpsychology.com.au",
  },

  // Halaxy booking links. Paste the full links between the quotes, for example
  // newClient: "https://www.halaxy.com/...". Until these are set, booking
  // buttons scroll to the contact details in the footer.
  booking: {
    newClient: "",      // the free 15 minute call
    existingClient: "", // existing clients booking their next session
  },
};
