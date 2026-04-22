# Playful Editorial Homepage Redesign Design

Date: 2026-04-22
Status: Draft approved for implementation planning

## Goal

Refactor the current site's visual style toward the playful, editorial, motion-rich feeling of Maxima Therapy while keeping the existing top navigation bar unchanged. The redesign should make the homepage feel warmer, more colorful, and more interactive without replacing the site's content model or routing structure.

## Scope

In scope:

- Update global theme tokens in `src/styles/scss/_tokens.scss` to introduce a colorful palette beyond black and white.
- Restyle homepage sections in `src/app/page.module.scss`.
- Make targeted homepage markup changes in `src/components/home-page/HomePage.tsx` only where needed to support new decorative or animated elements.
- Add a cursor-following eyes component for the homepage hero or nearby feature area.
- Reuse existing animation dependencies and components where practical: GSAP, Lenis, Framer Motion/Motion, TextPressure, Marquee, StickerPeel, and FlowingMenu.
- Preserve accessibility basics: semantic headings, readable contrast, keyboard-safe links, and reduced-motion fallback.

Out of scope:

- Do not modify `src/components/top-navigation-bar/*` or its behavior.
- Do not redesign non-homepage routes unless global tokens naturally affect them.
- Do not add network calls, telemetry, or secret-dependent behavior.
- Do not rewrite the site's localization or content configuration.

## Visual Direction

Chosen direction: **Playful Editorial Tech**.

The design uses Maxima Therapy as a mood reference, not a clone. It adapts the same broad qualities to a personal technology portfolio:

- Cream or warm paper-like backgrounds instead of sterile white.
- Deep ink/green text for editorial readability.
- Coral orange, warm yellow, sky blue, mint/green, and purple accents.
- Large compressed display typography and oversized section moments.
- Rounded cards, sticker-like labels, capsule buttons, organic blobs, and poster-like composition.
- Motion that feels playful and responsive rather than purely decorative.

Because the user briefly compared A and B before choosing A, the final direction should keep A's playful energy while borrowing a small amount of B's mature technical tone. The result should feel lively but still credible as a developer/designer portfolio.

## Global Theme Tokens

`_tokens.scss` should become the source of the new palette. Suggested token intent:

- Backgrounds: cream, parchment, pale yellow, and soft mint surfaces.
- Text: deep forest/ink for strong text; softened ink for secondary copy.
- Accents: coral, sunny yellow, sky blue, lilac/purple, and mint.
- Borders: visible but warm, more like printed editorial dividers than neutral gray UI lines.
- Shadows: soft colored shadows with low opacity, not heavy black drop shadows.

Dark mode should remain usable, but it does not need to be a pure inversion. It can use deep green/ink backgrounds with warm accent colors retained.

## Homepage Architecture

Keep the existing high-level homepage flow:

1. Hero
2. Tech logo loop
3. Philosophy
4. Marquee
5. Capabilities
6. Works
7. Gears
8. Archive / FlowingMenu
9. Experience

The redesign should be implemented as targeted styling and small supporting markup changes rather than a total component rewrite.

### Hero

The hero becomes the strongest Maxima-inspired moment:

- Keep the existing title and TextPressure accent.
- Place the hero on a warm editorial canvas with subtle radial color fields.
- Add one prominent interactive eyes element that follows the cursor on pointer devices.
- Keep existing StickerPeel usage, but tune placement and visual hierarchy so stickers feel intentional rather than scattered.
- Use rounded labels or playful metadata rows for focus/mode/status.
- Keep copy readable; avoid burying the summary under decorative layers.

### Cursor-following Eyes

Create a small client component, likely under `src/components/home-page/`, for the eyes interaction.

Behavior:

- On pointer movement, pupils rotate or translate toward the cursor.
- On touch devices or reduced-motion preference, render a static state.
- Component should not attach excessive global listeners or cause layout thrashing.
- CSS variables can drive pupil offsets so styles remain simple.

### Section Treatments

Philosophy:

- Convert from restrained centered minimalism to a bold editorial statement block.
- Use large type, colored highlight shapes, and possibly a circular side label.

Capabilities:

- Replace thin grid-card feel with colorful rounded cards.
- Cards can hover with a slight lift, tilt, or spring-like scale.
- Keep icons and indexes, but make them feel like badges.

Works:

- Turn each project visual into a poster-like tile with colored background, layered abstract shapes, and stronger hover motion.
- Retain existing links and alternating layout.

Gears:

- Treat as a playful inventory board: sticker labels, colored category tags, and tactile card hover states.

Archive:

- Preserve FlowingMenu, but feed it new colors via props to match the playful palette.

Experience:

- Keep the list structure, but make hover states more expressive with warm background fills, pill-like metadata, and animated arrow motion.

## Motion Design

Use motion deliberately:

- Cursor-following eyes in hero.
- Existing smooth scrolling via Lenis remains.
- Section entry animations can use GSAP or CSS transitions where simple.
- Hover states should feel springy: lift, tilt, scale, arrow motion, or color fill.
- Marquee/FlowingMenu should contribute to motion but not overwhelm reading.
- Respect `prefers-reduced-motion`: disable or simplify non-essential motion.

Avoid adding complex 3D/WebGL unless there is a clear visual benefit. Existing libraries are available, but this redesign can succeed with CSS, GSAP, and light React interactions.

## Accessibility and Performance

- Preserve semantic headings and link destinations.
- Ensure color contrast for body text and key controls.
- Decorative eyes and shapes should be `aria-hidden`.
- Avoid scroll-jacking beyond existing Lenis behavior.
- Use CSS transforms for animation where possible.
- Avoid large new images or external assets.
- Keep client-side logic small and isolated.

## Testing and Verification

Minimum verification after implementation:

- `pnpm lint`
- `pnpm typecheck`
- Targeted homepage tests, likely `pnpm test -- src/app/test/page.test.tsx src/components/home-page/test`

If markup changes affect snapshots or accessible roles, update tests accordingly. Run broader checks if changes affect shared tokens or global CSS in a way likely to impact other pages.

## Success Criteria

The redesign is successful when:

- The top navigation bar is unchanged.
- The homepage clearly reads as playful, colorful, editorial, and motion-rich.
- The palette is no longer limited to black and white.
- A cursor-following eyes interaction is present and degrades gracefully.
- Existing content, links, i18n behavior, and routing remain intact.
- Lint, typecheck, and relevant tests pass.
