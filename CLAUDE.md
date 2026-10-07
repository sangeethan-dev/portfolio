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
- Fonts (next/font/google in layout.js): Unbounded (display) + Inter Tight (body) + JetBrains Mono (code/labels)
- All animations via GSAP — no CSS animation for interactive elements
  (CSS transitions are OK only for simple hover colour changes)
- Import gsap + plugins from `@/lib/gsap`, never straight from "gsap"
- Every GSAP setup needs a reduced-motion path (`gsap.matchMedia()` + `MQ` from `@/lib/gsap`)

## Structure

- /app → Next.js app router (`/` is the portfolio; other routes are standalone demos)
- /components → one folder per section
- /content/site.js → all copy: prices, packages, FAQs, concepts, contact details
- /lib/gsap → plugin registry, theme controller, reusable animation hooks
- /lib/lenis → smooth scroll, `scrollToSection`, `setScrollLocked`

## Design tokens

- globals.css has all CSS variables (colors, spacing, fonts, motion)
- Identity "Blueprint → Colour": components use the SEMANTIC tokens
  (--bg, --fg, --fg-mute, --line, --surface, --accent, --accent-ink).
  The theme controller tweens them between --bp-* and --live-* as sections
  marked `data-theme-section="blueprint|live"` scroll into view.

## CSS Rules

- NEVER use hardcoded colour values in CSS files
- ALWAYS use CSS custom properties from globals.css
- If a colour doesn't have a variable, add it to
  globals.css :root first, then use the variable
- This applies to every component, every CSS module,
  every section — no exceptions
