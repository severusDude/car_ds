---
name: Vibrant Functionalist
colors:
  surface: '#fbf8ff'
  surface-dim: '#dad9e3'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2fd'
  surface-container: '#eeedf7'
  surface-container-high: '#e8e7f1'
  surface-container-highest: '#e3e1ec'
  on-surface: '#1a1b22'
  on-surface-variant: '#5a4136'
  inverse-surface: '#2f3038'
  inverse-on-surface: '#f1effa'
  outline: '#8e7164'
  outline-variant: '#e2bfb0'
  surface-tint: '#a04100'
  primary: '#a04100'
  on-primary: '#ffffff'
  primary-container: '#ff6b00'
  on-primary-container: '#572000'
  inverse-primary: '#ffb693'
  secondary: '#5f5e61'
  on-secondary: '#ffffff'
  secondary-container: '#e4e1e6'
  on-secondary-container: '#656467'
  tertiary: '#0062a1'
  on-tertiary: '#ffffff'
  tertiary-container: '#059eff'
  on-tertiary-container: '#003357'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb693'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#e4e1e6'
  secondary-fixed-dim: '#c8c5ca'
  on-secondary-fixed: '#1b1b1e'
  on-secondary-fixed-variant: '#47464a'
  tertiary-fixed: '#d0e4ff'
  tertiary-fixed-dim: '#9ccaff'
  on-tertiary-fixed: '#001d35'
  on-tertiary-fixed-variant: '#00497b'
  background: '#fbf8ff'
  on-background: '#1a1b22'
  surface-variant: '#e3e1ec'
typography:
  h1:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  h1-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 16px
  margin: 24px
---

## Brand & Style
This design system is built on the principles of **Minimalism** and **Modern functionalism**. It prioritizes clarity and utility, stripping away unnecessary ornamentation to focus on content and action. The personality is professional and energetic, achieved through the juxtaposition of a rigorous neutral foundation with a singular, high-vibrancy accent. 

The system utilizes high contrast and generous whitespace to create a sense of order. It is designed for users who value efficiency and precision, making it ideal for SaaS, productivity tools, and data-driven dashboards. The aesthetic remains "unopinionated" enough to scale across different domains while maintaining a distinctive edge through its bold use of color and crisp geometric alignment.

## Colors
The palette is centered around a vibrant "International Orange" (#FF6B00) used sparingly for primary actions, progress indicators, and critical focus states. 

### Light Mode
The background is pure white (#FFFFFF), utilizing a range of Zinc grays for depth. Text is predominantly Zinc-950 (#09090B) for maximum legibility. Borders use Zinc-200 (#E4E4E7) to maintain a crisp, light feel.

### Dark Mode
The background shifts to a deep Zinc-950 (#09090B). Surfaces use Zinc-900 (#18181B) to create subtle elevation. Borders are defined by Zinc-800 (#27272A). The primary orange retains its hex value but gains increased prominence against the dark backdrop, requiring careful management of optical weight.

### Contrast
Status colors (Success, Warning, Destructive) follow standard utility patterns but are desaturated slightly to ensure the primary orange remains the undisputed focal point of the interface.

## Typography
The system uses **Inter** exclusively to lean into its systematic, utilitarian nature. The typeface is chosen for its exceptional legibility on digital screens and its neutral "workhorse" quality.

- **Scale:** A tight typographic scale ensures hierarchy without excessive size shifts.
- **Tracking:** Headlines use slight negative letter-spacing (-0.01em to -0.02em) to appear tighter and more professional. Small labels use slight positive tracking to maintain readability at reduced scales.
- **Weights:** Use SemiBold (600) for subheadings and Medium (500) for interactive labels. Regular (400) is reserved for all body copy to maintain a clean, airy feel.

## Layout & Spacing
The design system employs a **12-column fluid grid** for desktop environments, transitioning to a **4-column grid** for mobile. 

- **Rhythm:** An 8pt spatial system (with 4pt increments for fine-tuning) governs all padding and margins. 
- **Consistency:** Horizontal padding within components (like buttons and inputs) is generally double the vertical padding (e.g., 8px top/bottom, 16px left/right).
- **Reflow:** On mobile, page margins compress to 16px to maximize screen real estate, while gutters remain at 16px to prevent content crowding.

## Elevation & Depth
Depth is communicated primarily through **Tonal Layering** and **Crisp Outlines** rather than heavy shadows.

- **Surface Levels:** In Light Mode, cards and modals use a white background with a 1px border (#E4E4E7). In Dark Mode, elevated surfaces use Zinc-900 (#18181B).
- **Shadows:** When necessary (e.g., dropdown menus, modals), use a single, highly diffused shadow: `0 10px 15px -3px rgb(0 0 0 / 0.1)`. Shadows should be neutral and never tinted with the primary color.
- **Focus States:** Use a 2px offset ring in the primary orange color to clearly indicate keyboard navigation and active input states.

## Shapes
The shape language is strictly **Soft (0.25rem)**. This subtle rounding maintains the professional, architectural feel of the design while removing the "harshness" of sharp 0px corners.

- **Components:** Standard buttons, input fields, and checkboxes use a 6px (`rounded-md`) radius.
- **Containers:** Larger elements like cards and modals scale up to an 8px (`rounded-lg`) radius.
- **Icons:** Should follow a similar geometric logic, utilizing a 2px stroke width and slightly rounded caps to match the UI's softening.

## Components
- **Buttons:** Primary buttons are solid Orange (#FF6B00) with white text. Secondary buttons use a transparent background with a Zinc-200 border in light mode. Ghost buttons are reserved for low-priority actions.
- **Input Fields:** Use a 1px border (Zinc-200). On focus, the border transitions to Zinc-950 or the Primary Orange, accompanied by a subtle outer ring.
- **Chips/Badges:** Small, 12px font size, Medium weight. Use a light Zinc-100 fill in light mode or Zinc-800 in dark mode to keep them secondary to main actions.
- **Cards:** Minimalist. No heavy shadows; use 1px borders to define boundaries. Use Zinc-50 for card headers to create internal hierarchy.
- **Tabs:** Underline style for top-level navigation, or "segmented control" style (pill background) for sub-filtering within a page.
- **Data Tables:** High density. Use Zinc-50 for header rows and 1px horizontal dividers. Avoid vertical lines to keep the interface clean and breathable.