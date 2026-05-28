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
- Fonts: Fraunces (headings) + Inter (body) from Google Fonts
- All animations via GSAP — no CSS animation for interactive elements

## Structure

- /app → Next.js app router
- /components → one folder per section
- /lib/gsap → reusable animation hooks

## Design tokens

- globals.css has all CSS variables (colors, spacing, fonts, motion)

## CSS Rules

- NEVER use hardcoded colour values in CSS files
- ALWAYS use CSS custom properties from globals.css
- If a colour doesn't have a variable, add it to
  globals.css :root first, then use the variable
- This applies to every component, every CSS module,
  every section — no exceptions
