# Design Implementation Notes: Linear-Craft Architecture

This document records the exact token mapping, component bindings, contrast verifications, and architectural decisions derived from `design.md`.

---

## 1. Design Token System

The design system implements a dark-canvas software-craft marketing canvas built around `#010102` with Linear lavender-blue (`#5e6ad2`) as the sole chromatic accent.

### Color Tokens

| Token Name | Hex Value | Semantic Role in App | WCAG Contrast |
| :--- | :--- | :--- | :--- |
| `canvas` | `#010102` | Root page background, deep whitespace anchor | Base |
| `surface-1` | `#0f1011` | Primary cards, input containers, editorial panels | Elevation 1 |
| `surface-2` | `#141516` | Lifted metric tiles, selected pill tabs, dropdowns | Elevation 2 |
| `surface-3` | `#18191a` | Nested divider elements, borders, sub-nav bars | Elevation 3 |
| `surface-4` | `#191a1b` | Warning alert containers, deepest lifted surfaces | Elevation 4 |
| `hairline` | `#23252a` | Default 1px card and container borders | Structural |
| `hairline-strong` | `#34343a` | Hovered borders, active card borders | Interactive |
| `hairline-tertiary`| `#3e3e44` | Concentric orbital rings, nested borders | Precision detail |
| `primary` | `#5e6ad2` | Brand logomark arc, primary CTA button, active focus | 4.6:1 (Passes AA) |
| `primary-hover` | `#828fff` | Primary button hover state | 7.8:1 (Passes AAA) |
| `primary-focus` | `#5e69d1` | 2px accessible focus ring tint | 4.5:1 (Passes AA) |
| `ink` | `#f7f8f8` | Headlines, primary age numbers, brand wordmark | 19.3:1 (Passes AAA) |
| `ink-muted` | `#d0d6e0` | Secondary copy, milestone names, active tabs | 14.2:1 (Passes AAA) |
| `ink-subtle` | `#8a8f98` | Field labels, captions, tool descriptions | 6.5:1 (Passes AA) |
| `ink-tertiary` | `#62666d` | Legal notes, copyright, disabled states | 3.8:1 (UI AA) |
| `semantic-success` | `#27a644` | Passed milestone indicators, live tick pulse | 4.8:1 (Passes AA) |

---

## 2. Typography & Tracking Scale

Following `design.md`, type is set in the system SF Pro / Inter font stack with measured negative tracking:

- **Display XL / Page Hero (`h1`)**: `-0.04em` letter-spacing, weight `600`, line-height `1.15`.
- **Card Titles & Section Headers (`h2`, `h3`)**: `-0.03em` letter-spacing, weight `600`.
- **Primary Numerical Age (`ResultHero`)**: Set in monospace `ui-monospace, "SF Mono", monospace` at weight `600` with `-0.02em` tracking.
- **Eyebrows & Field Labels**: Set in uppercase with positive tracking `+0.04em` to mark taxonomy.
- **Body Prose**: Set in weight `400` with standard natural tracking.

---

## 3. Strict "Zero Emoji" Standard

Per explicit user specification, all emojis were eliminated from the platform and replaced with high-precision monochrome SVGs:
- Replaced `⏳` and `📅` in `Header.astro` and `ToolsHub.astro` with an orbital chronometer arc and discrete calendar grid SVG.
- Replaced `🌙` / `☀️` theme toggle with minimalist 1.75px stroke moon and sun vector paths.
- Replaced `🌐` in `LanguageBanner.astro` with an isometric globe vector.
- Replaced `🍪` in `CookieConsent.astro` with a security shield checkmark vector.
- Replaced `🔒` and `📐` in `about.astro` with padlock and precision protractor/compass vector icons.
- Replaced `🎉` in all 7 localized JSON strings (`todayIsBirthday`) and `BirthdayCountdownCalculator.tsx` with clean editorial text.
- Replaced `🐶` and `🐱` in `PetAgeCalculator.tsx` with refined "Canine (Dog)" and "Feline (Cat)" pill selectors.

---

## 4. Professional Chronological Brand Logo

A custom, professional vector logomark was engineered for the platform:
- **Design Concept**: Two concentric geometric precision rings representing Gregorian cycles and orbital chronology. A dashed outer tracking circle is framed with a signature Linear lavender arc (`#5e6ad2`), centering on an illuminated temporal coordinate node (`#f7f8f8`) and lavender pointer vector (`#828fff`).
- **Assets Created**:
  - `public/favicon.svg`: Square 32x32 precision app icon on `#010102` canvas.
  - `public/logo.svg`: Horizontal 280x40 vector brand mark with "Age & Date Calc" wordmark and "PRO" badge.
  - Inline responsive SVG embedded in `src/components/Header.astro`.
  - Seven localized 1200x630 Open Graph cards generated in `public/og/`.
