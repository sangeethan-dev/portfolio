/*
 * "Recent fixes" strip in the Work section. Edit this list as you finish
 * jobs. The strip hides itself when the list is empty.
 *
 * Each fix: { business, suburb, problem, result, turnaround, example? }
 * `example: true` shows an "Example" tag. Remove the flag (or the whole
 * entry) once you have a real job to show.
 */
export const fixes = [
  {
    business: "Physio clinic",
    suburb: "Southport",
    problem: "The Book Now button opened a blank page on iPhones.",
    result: "Booking link fixed on every page and tested on iOS and Android.",
    turnaround: "Same day",
    example: true,
  },
  {
    business: "Café",
    suburb: "Burleigh Heads",
    problem: "Google showed a 'Not secure' warning on the menu page.",
    result: "SSL fixed and old http links redirected.",
    turnaround: "4 hours",
    example: true,
  },
  {
    business: "Plumber",
    suburb: "Robina",
    problem: "Tapping the phone number on a mobile did nothing.",
    result: "Click-to-call working, plus 6 broken links found and fixed.",
    turnaround: "Next morning",
    example: true,
  },
];
