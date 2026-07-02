---
name: Academic Onboarding System
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#434655'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#525657'
  on-tertiary: '#ffffff'
  tertiary-container: '#6b6e70'
  on-tertiary-container: '#eff1f3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1024px
  gutter: 20px
---

## Brand & Style

The design system is built to facilitate a seamless transition for students and staff. The personality is **trustworthy, organized, and welcoming**, mirroring the clarity of a high-end productivity tool like Notion. It balances academic rigor with a friendly, approachable interface.

The visual style is **Minimalist / Modern**. It prioritizes extreme legibility, intentional whitespace, and a high signal-to-noise ratio. By utilizing a "paper-on-surface" logic, the system feels familiar and lightweight, reducing the cognitive load of onboarding checklists and administrative tasks.

## Colors

The palette is anchored by a high-contrast **Academic Blue** (#2563EB), used exclusively for primary actions and active states to signal progress. 

- **Backgrounds:** Use pure white (#FFFFFF) for page containers and a subtle off-white (#F8FAFC) for the canvas to create depth without shadows.
- **Typography:** Deep slate (#1E293B) provides maximum readability for body text, while a softer gray (#64748B) is used for secondary metadata.
- **Dividers:** Use a consistent light gray (#E2E8F0) for hairline borders (1px) to define structure without adding visual clutter.

## Typography

This design system utilizes **Plus Jakarta Sans** for headings to inject a soft, welcoming geometric character, and **Hanken Grotesk** for body text to ensure professional clarity and high legibility in data-dense checklist views.

For mobile displays, `display-lg` scales down to 28px and `headline-lg` scales to 22px to ensure content remains above the fold. Paragraph spacing should be generous, typically 1em between blocks, to maintain a "document-like" feel.

## Layout & Spacing

The system follows a **Fixed Grid** philosophy for desktop to maintain the "reading a guide" experience, centered with a maximum width of 1024px. On mobile, it transitions to a fluid 1-column layout with 20px side margins.

- **Checklist Spacing:** List items use `md` (16px) vertical padding to ensure touch targets are accessible and the interface feels breathable.
- **Grouping:** Use `xl` (40px) spacing between major sections or chapters in the guide to provide clear visual breaks.
- **Alignment:** All elements align to a 4px baseline grid to maintain a disciplined, academic structure.

## Elevation & Depth

This design system avoids heavy drop shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

1.  **Level 0 (Canvas):** The base background layer (#F8FAFC).
2.  **Level 1 (Cards/Surface):** Pure white (#FFFFFF) surfaces with a 1px border (#E2E8F0). This is the primary container for checklist items.
3.  **Level 2 (Popovers/Modals):** Pure white with a very soft, diffused shadow (0px 4px 20px rgba(0, 0, 0, 0.05)) to suggest temporary interaction.

Navigation bars should remain flat with a bottom border rather than a shadow to keep the interface looking "printed."

## Shapes

The shape language is **Rounded**, using a base radius of 8px (0.5rem). This softens the academic tone, making the application feel more like a modern companion tool rather than a rigid government form.

- **Checkboxes:** Use 4px radius (rounded-sm) rather than sharp corners to match the friendly aesthetic.
- **Progress Bars:** Fully rounded (pill-shaped) to represent a continuous, smooth journey.
- **Buttons:** 8px radius to maintain consistency with card containers.

## Components

### Buttons
- **Primary:** Solid blue (#2563EB) with white text. No gradients.
- **Secondary:** Ghost style with blue text and a light gray border.

### Checklist & Cards
Checklist items are contained within Level 1 cards. Upon completion, the card background may transition to a very faint green tint, or simply display a completed icon. Use a subtle strike-through for text only if the task is no longer relevant.

### Progress Bars
A thin (8px height) track in light gray (#E2E8F0) with a primary blue fill. Place progress indicators at the top of category pages to provide constant orientation.

### Input Fields
Inputs should look like the "Notion" style: 1px borders that darken slightly on focus. Avoid heavy "inner shadows." Use Hanken Grotesk (16px) for input text to prevent iOS zoom-on-focus.

### Tabs
Underline style navigation for top-level categories. The active tab is indicated by a 2px blue bottom border and bolded text, while inactive tabs remain secondary gray.

### Tables
Keep tables "borderless." Use a light gray background for the header row and 1px horizontal dividers between rows. No vertical lines.