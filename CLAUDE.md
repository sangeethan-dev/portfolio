# Sangeethan Portfolio — Claude Code Context

## Stack

- Next.js App Router
- JavaScript (no TypeScript)
- Plain CSS / CSS Modules
- GSAP + ScrollTrigger
- Vercel hosting

## Rules

- No TypeScript
- No Tailwind
- Use CSS Modules per component
- Use CSS variables from globals.css
- Fonts (next/font/google in layout.js): Familjen Grotesk (display, sentence case) + Inter Tight (body) + JetBrains Mono (code/labels)
- All animations via GSAP — no CSS animation for interactive elements
  (CSS transitions are OK only for simple hover colour changes)
- Import gsap + plugins from `@/lib/gsap`, never straight from "gsap"
- Every GSAP setup needs a reduced-motion path (`gsap.matchMedia()` + `MQ` from `@/lib/gsap`)

## Structure

- /app → Next.js app router (`/` is the portfolio; other routes are standalone demos)
- /components → one folder per section
- /content/site.js → all copy: prices, packages, FAQs, concepts, contact details,
  agency page copy/rates, privacy copy, and `siteUrl` (the one place to change the domain)
- /content/fixes.js → "Recent fixes" strip data (strip hides when empty)
- /lib/gsap → plugin registry, theme controller, reusable animation hooks
- /lib/lenis → smooth scroll, `scrollToSection`, `setScrollLocked`,
  `useSectionNav` (section links that work from any route)

## Design tokens

- globals.css has all CSS variables (colors, spacing, fonts, motion)
- Identity "Blueprint → Colour": components use the SEMANTIC tokens
  (--bg, --fg, --fg-mute, --line, --surface, --accent, --accent-ink).
  The theme controller tweens them between --bp-* and --live-* as sections
  marked `data-theme-section="blueprint|live"` scroll into view.
  `useThemeFlip` resolves the theme from positions on every scroll update
  (the last section whose top crossed its start line wins); smaller areas
  can override it with `data-tone="blueprint|live"` while they cover the
  middle of the screen (Work rooms, BuildStory). Call `syncTheme()` from
  `@/lib/gsap/theme` if something moves sections without a scroll.
- Skin "Void → Bone" (inspired by trionn.com): near-black canvas, bone type,
  graphite hairlines, ONE ember accent (--signal) used sparingly. Headlines
  are big sentence-case grotesk (--display-weight, --display-track);
  CTAs are underlined mono links with a trailing arrow — always use
  `components/ArrowLink` (a port of trionn's letter-slide hover); don't
  hand-roll new link/button styles.
- Prefer real images (public/portfolio/…) over drawn vector illustrations.

## CSS Rules

- NEVER use hardcoded colour values in CSS files
- ALWAYS use CSS custom properties from globals.css
- If a colour doesn't have a variable, add it to
  globals.css :root first, then use the variable
- This applies to every component, every CSS module,
  every section — no exceptions
