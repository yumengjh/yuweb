<!-- cspell:words agentic minmax -->`r`n`r`n# Playful Editorial Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the homepage into a colorful, playful editorial experience inspired by Maxima Therapy while leaving the top navigation untouched.

**Architecture:** Keep the current homepage component structure and content flow, then add one focused client component for cursor-following eyes. Centralize the new color system in SCSS tokens, wire the eyes into the hero with minimal JSX, and restyle existing homepage sections through `src/app/page.module.scss` instead of rewriting page data or routes.

**Tech Stack:** Next.js App Router, React 19, TypeScript, SCSS Modules, Vitest + Testing Library, existing Motion/GSAP/Lenis dependencies.

---

## File Structure

- Create `src/components/home-page/CursorEyes.tsx`: small client component that tracks pointer movement and exposes CSS custom properties for pupil offsets.
- Create `src/components/home-page/CursorEyes.module.scss`: presentation and reduced-motion styles for the eye widget.
- Create `src/components/home-page/test/CursorEyes.test.tsx`: unit tests for static rendering, pointer tracking, and reduced-motion behavior.
- Modify `src/components/home-page/HomePage.tsx`: import and render `CursorEyes`; add small decorative spans/classes around the hero and project visuals; update FlowingMenu color props.
- Modify `src/app/page.module.scss`: replace the current minimal homepage styling with the playful editorial surface, colorful card treatments, hover motion, and responsive rules.
- Modify `src/styles/scss/_tokens.scss`: update global CSS variables to the warm colorful palette for light and dark themes.
- Modify `src/app/test/page.test.tsx`: update source-based assertions that intentionally lock old homepage layout details, and add an assertion that the eyes widget is rendered.

## Task 1: Add failing tests for the cursor-following eyes component

**Files:**

- Create: `src/components/home-page/test/CursorEyes.test.tsx`

- [ ] **Step 1: Write the failing component tests**

Create `src/components/home-page/test/CursorEyes.test.tsx` with this content:

```tsx
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, fireEvent, render, screen } from "@/test/render";

import { CursorEyes } from "../CursorEyes";

describe("CursorEyes", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders as decorative artwork with two eyes", () => {
    render(<CursorEyes />);

    const artwork = screen.getByTestId("cursor-eyes");
    expect(artwork).toHaveAttribute("aria-hidden", "true");
    expect(artwork.querySelectorAll("[data-testid='cursor-eye']")).toHaveLength(
      2,
    );
    expect(artwork).toHaveStyle({ "--eye-x": "0px", "--eye-y": "0px" });
  });

  it("updates pupil offsets toward the pointer", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      x: 100,
      y: 100,
      width: 120,
      height: 80,
      top: 100,
      right: 220,
      bottom: 180,
      left: 100,
      toJSON: () => null,
    } as DOMRect);

    render(<CursorEyes />);

    const artwork = screen.getByTestId("cursor-eyes");
    fireEvent.pointerMove(artwork, { clientX: 220, clientY: 180 });

    expect(artwork).toHaveStyle({ "--eye-x": "7.5px", "--eye-y": "5px" });
  });

  it("stays static when reduced motion is requested", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList,
    );

    render(<CursorEyes />);

    const artwork = screen.getByTestId("cursor-eyes");
    fireEvent.pointerMove(artwork, { clientX: 220, clientY: 180 });

    expect(artwork).toHaveStyle({ "--eye-x": "0px", "--eye-y": "0px" });
  });
});
```

- [ ] **Step 2: Run the new test and verify it fails**

Run:

```bash
pnpm test -- src/components/home-page/test/CursorEyes.test.tsx
```

Expected: FAIL because `../CursorEyes` does not exist yet.

## Task 2: Implement the cursor-following eyes component

**Files:**

- Create: `src/components/home-page/CursorEyes.tsx`
- Create: `src/components/home-page/CursorEyes.module.scss`
- Test: `src/components/home-page/test/CursorEyes.test.tsx`

- [ ] **Step 1: Create the component implementation**

Create `src/components/home-page/CursorEyes.tsx`:

```tsx
"use client";

import {
  useMemo,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";

import styles from "./CursorEyes.module.scss";

type EyeOffset = {
  x: number;
  y: number;
};

const MAX_X = 7.5;
const MAX_Y = 5;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function shouldReduceMotion() {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CursorEyes() {
  const [offset, setOffset] = useState<EyeOffset>({ x: 0, y: 0 });
  const reduceMotion = useMemo(shouldReduceMotion, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const nextX = clamp(
      ((event.clientX - centerX) / Math.max(rect.width / 2, 1)) * MAX_X,
      -MAX_X,
      MAX_X,
    );
    const nextY = clamp(
      ((event.clientY - centerY) / Math.max(rect.height / 2, 1)) * MAX_Y,
      -MAX_Y,
      MAX_Y,
    );

    setOffset({ x: Number(nextX.toFixed(2)), y: Number(nextY.toFixed(2)) });
  };

  const handlePointerLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const style = {
    "--eye-x": `${offset.x}px`,
    "--eye-y": `${offset.y}px`,
  } as CSSProperties;

  return (
    <div
      className={styles.eyes}
      data-testid="cursor-eyes"
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={style}
    >
      <span className={styles.eye} data-testid="cursor-eye">
        <span className={styles.pupil} />
      </span>
      <span className={styles.eye} data-testid="cursor-eye">
        <span className={styles.pupil} />
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Create the component styles**

Create `src/components/home-page/CursorEyes.module.scss`:

```scss
.eyes {
  --eye-x: 0px;
  --eye-y: 0px;

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.55rem, 1.3vw, 1rem);
  width: clamp(7rem, 14vw, 12rem);
  aspect-ratio: 1.85;
  padding: clamp(0.7rem, 1.4vw, 1.1rem);
  border: 3px solid var(--c-ink-strong);
  border-radius: 999px;
  background:
    radial-gradient(
      circle at 20% 18%,
      rgb(255 255 255 / 0.62),
      transparent 28%
    ),
    var(--c-accent-yellow);
  box-shadow: 0 0.85rem 0 var(--c-ink-strong);
  transform: rotate(5deg);
  touch-action: none;
}

.eye {
  position: relative;
  width: clamp(2.2rem, 4.4vw, 3.7rem);
  aspect-ratio: 1;
  border: 3px solid var(--c-ink-strong);
  border-radius: 999px;
  background: var(--c-surface-paper);
  overflow: hidden;
}

.pupil {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 42%;
  aspect-ratio: 1;
  border-radius: 999px;
  background: var(--c-ink-strong);
  transform: translate(calc(-50% + var(--eye-x)), calc(-50% + var(--eye-y)));
  transition: transform 120ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .pupil {
    transition: none;
  }
}
```

- [ ] **Step 3: Run the cursor eyes test and verify it passes**

Run:

```bash
pnpm test -- src/components/home-page/test/CursorEyes.test.tsx
```

Expected: PASS.

- [ ] **Step 4: Commit the component**

Run:

```bash
git add src/components/home-page/CursorEyes.tsx src/components/home-page/CursorEyes.module.scss src/components/home-page/test/CursorEyes.test.tsx
git commit -m "feat(home): add cursor-following eyes"
```

Expected: commit succeeds.

## Task 3: Add homepage integration tests for the new visual hook

**Files:**

- Modify: `src/app/test/page.test.tsx`

- [ ] **Step 1: Update homepage tests before wiring the component**

In `src/app/test/page.test.tsx`, update the first test by adding this assertion after the TextPressure title assertion:

```tsx
expect(screen.getByTestId("cursor-eyes")).toHaveAttribute(
  "aria-hidden",
  "true",
);
```

Replace the final test named `keeps the philosophy copy in the original responsive two-column layout` with this test:

```tsx
it("uses playful editorial homepage styling hooks", () => {
  const stylesSource = readFileSync(
    path.resolve(process.cwd(), "src/app/page.module.scss"),
    "utf8",
  );

  expect(stylesSource).toContain(".heroDecor");
  expect(stylesSource).toContain(".heroEyes");
  expect(stylesSource).toContain(".projectPosterBadge");
});
```

- [ ] **Step 2: Run the homepage test and verify it fails**

Run:

```bash
pnpm test -- src/app/test/page.test.tsx
```

Expected: FAIL because `cursor-eyes`, `.heroDecor`, `.heroEyes`, and `.projectPosterBadge` are not wired yet.

## Task 4: Wire decorative hero and project markup into the homepage

**Files:**

- Modify: `src/components/home-page/HomePage.tsx`
- Test: `src/app/test/page.test.tsx`

- [ ] **Step 1: Import the eyes component**

In `src/components/home-page/HomePage.tsx`, add this import near the other home-page imports:

```tsx
import { CursorEyes } from "@/components/home-page/CursorEyes";
```

- [ ] **Step 2: Add hero decorative markup**

Inside `<section className={styles.hero}>`, immediately after the opening tag, add:

```tsx
<div className={styles.heroDecor} aria-hidden="true">
  <span className={styles.heroBlobPrimary} />
  <span className={styles.heroBlobSecondary} />
  <span className={styles.heroOrbit}>play · build · ship</span>
</div>
<div className={styles.heroEyes}>
  <CursorEyes />
</div>
```

- [ ] **Step 3: Add project poster badges**

Inside each `.projectVisual`, before the conditional visual artwork, add:

```tsx
<span className={styles.projectPosterBadge}>
  SYS.{work.visual.toUpperCase()}
</span>
```

The resulting opening of the visual block should look like this:

```tsx
<div
  className={`${styles.projectVisual} ${work.visual === "light" ? styles.visualLight : styles.visualDark}`}
>
  <span className={styles.projectPosterBadge}>SYS.{work.visual.toUpperCase()}</span>
  {work.visual === "light" ? (
```

- [ ] **Step 4: Update FlowingMenu palette props**

In the `FlowingMenu` props inside the archive section, replace the color props with:

```tsx
textColor = "var(--c-ink-strong)";
bgColor = "var(--c-bg-2)";
marqueeBgColor = "var(--c-accent-coral)";
marqueeTextColor = "var(--c-ink-strong)";
borderColor = "var(--c-ink-strong)";
```

- [ ] **Step 5: Run the homepage test and verify only styling hooks remain failing if styles are not added yet**

Run:

```bash
pnpm test -- src/app/test/page.test.tsx
```

Expected: the `cursor-eyes` assertion should pass; source assertions for style class names may still fail until Task 6.

## Task 5: Update global theme tokens

**Files:**

- Modify: `src/styles/scss/_tokens.scss`

- [ ] **Step 1: Replace the light theme token values**

In `src/styles/scss/_tokens.scss`, replace the contents of the first `:root, :root[data-theme="light"], :root[data-theme="auto"]` block with:

```scss
:root,
:root[data-theme="light"],
:root[data-theme="auto"] {
  --hue-base: 14deg;
  --c-ink-strong: #14211b;
  --c-ink-soft: rgb(20 33 27 / 68%);
  --c-ink-softer: rgb(20 33 27 / 46%);
  --c-surface-paper: #fffaf0;
  --c-surface-paper-a70: rgb(255 250 240 / 88%);
  --c-text: #14211b;
  --c-text-1: rgb(20 33 27 / 90%);
  --c-text-2: rgb(20 33 27 / 68%);
  --c-text-3: rgb(20 33 27 / 46%);
  --c-bg: #fff7df;
  --c-bg-1: #fffaf0;
  --c-bg-2: #f8e8c8;
  --c-bg-3: #e7f4dd;
  --c-bg-soft: rgb(224 90 48 / 14%);
  --c-border: rgb(20 33 27 / 24%);
  --c-border-soft: rgb(20 33 27 / 14%);
  --c-border-strong: rgb(20 33 27 / 42%);
  --c-bg-a50: rgb(255 247 223 / 52%);
  --c-bg-a80: rgb(255 247 223 / 82%);
  --c-primary: #e05a30;
  --c-primary-soft: rgb(224 90 48 / 18%);
  --c-accent: #38bdf8;
  --c-accent-coral: #f0643c;
  --c-accent-yellow: #f7c948;
  --c-accent-sky: #73d2de;
  --c-accent-mint: #9be282;
  --c-accent-lilac: #a98bff;
  --c-button-bg: #14211b;
  --c-button-ink: #fffaf0;
  --c-button-hover-bg: #e05a30;
  --c-marker-strong: rgb(20 33 27 / 76%);
  --c-marker-soft: rgb(20 33 27 / 30%);
  --c-shadow-soft: 0 18px 48px rgb(224 90 48 / 0.16);
  --ld-bg-blur: var(--c-bg-a80);
  --ld-bg-card: var(--c-surface-paper);
  --ld-bg-active: var(--c-bg-3);
  --ld-shadow: var(--c-bg-soft);

  color-scheme: light;
}
```

- [ ] **Step 2: Replace the dark theme mixin values**

In the same file, replace the contents of `@mixin dark-theme` with:

```scss
@mixin dark-theme {
  --c-ink-strong: #fff7df;
  --c-ink-soft: rgb(255 247 223 / 72%);
  --c-ink-softer: rgb(255 247 223 / 48%);
  --c-surface-paper: #18251f;
  --c-surface-paper-a70: rgb(24 37 31 / 88%);
  --c-text: #fff7df;
  --c-text-1: rgb(255 247 223 / 90%);
  --c-text-2: rgb(255 247 223 / 70%);
  --c-text-3: rgb(255 247 223 / 48%);
  --c-bg: #0f1d18;
  --c-bg-1: #14211b;
  --c-bg-2: #1d3028;
  --c-bg-3: #263d31;
  --c-bg-soft: rgb(247 201 72 / 12%);
  --c-border: rgb(255 247 223 / 22%);
  --c-border-soft: rgb(255 247 223 / 14%);
  --c-border-strong: rgb(255 247 223 / 40%);
  --c-bg-a50: rgb(15 29 24 / 52%);
  --c-bg-a80: rgb(15 29 24 / 82%);
  --c-primary: #ff7a52;
  --c-primary-soft: rgb(255 122 82 / 18%);
  --c-accent: #73d2de;
  --c-accent-coral: #ff7a52;
  --c-accent-yellow: #f7c948;
  --c-accent-sky: #73d2de;
  --c-accent-mint: #9be282;
  --c-accent-lilac: #b9a4ff;
  --c-button-bg: #fff7df;
  --c-button-ink: #14211b;
  --c-button-hover-bg: #f7c948;
  --c-marker-strong: rgb(255 247 223 / 76%);
  --c-marker-soft: rgb(255 247 223 / 28%);
  --c-shadow-soft: 0 24px 80px rgb(0 0 0 / 0.32);
  --ld-bg-blur: var(--c-bg-a80);
  --ld-bg-card: var(--c-bg-2);
  --ld-bg-active: var(--c-primary-soft);
  --ld-shadow: var(--c-bg-a50);

  color-scheme: dark;
}
```

- [ ] **Step 3: Run a syntax-oriented check**

Run:

```bash
pnpm typecheck
```

Expected: PASS. SCSS tokens do not affect TypeScript, but this catches accidental TS regressions before styling work continues.

## Task 6: Restyle the homepage in the playful editorial direction

**Files:**

- Modify: `src/app/page.module.scss`
- Test: `src/app/test/page.test.tsx`

- [ ] **Step 1: Add new page-level and hero styles**

In `src/app/page.module.scss`, update these existing selectors to the following values, preserving unrelated nested selectors unless explicitly replaced:

```scss
.page {
  --home-eyebrow-size: clamp(0.68rem, 0.64rem + 0.2vw, 0.72rem);

  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 12% 8%,
      rgb(247 201 72 / 0.42),
      transparent 26rem
    ),
    radial-gradient(
      circle at 88% 14%,
      rgb(115 210 222 / 0.34),
      transparent 24rem
    ),
    linear-gradient(
      180deg,
      var(--c-bg-1) 0%,
      var(--c-bg) 42%,
      var(--c-bg-3) 100%
    );
  color: var(--c-ink-strong);
  font-family: var(--font-geist-sans), sans-serif;
  overflow-x: hidden;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.frame {
  position: relative;
  width: 100%;
  max-width: 1480px;
  margin: 0 auto;
  padding: 4vh 4vw 6vh;
}

.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 85vh;
  justify-content: space-between;
  padding: clamp(1.2rem, 3vw, 3rem);
  margin-bottom: 8vh;
  border: 2px solid var(--c-ink-strong);
  border-radius: clamp(2rem, 5vw, 4.5rem);
  background:
    linear-gradient(135deg, rgb(255 250 240 / 0.92), rgb(248 232 200 / 0.78)),
    radial-gradient(circle at 86% 26%, var(--c-accent-sky), transparent 16rem);
  box-shadow: 0 1.1rem 0 var(--c-ink-strong);
  overflow: hidden;
  isolation: isolate;
}

.heroDecor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: -1;
}

.heroBlobPrimary,
.heroBlobSecondary {
  position: absolute;
  display: block;
  border: 2px solid var(--c-ink-strong);
  border-radius: 999px;
}

.heroBlobPrimary {
  right: -5rem;
  top: 12%;
  width: clamp(10rem, 24vw, 22rem);
  aspect-ratio: 1;
  background: var(--c-accent-mint);
}

.heroBlobSecondary {
  left: 9%;
  bottom: 9%;
  width: clamp(5rem, 10vw, 8rem);
  aspect-ratio: 1;
  background: var(--c-accent-lilac);
  transform: rotate(-12deg);
}

.heroOrbit {
  position: absolute;
  right: clamp(1rem, 4vw, 4rem);
  bottom: clamp(1rem, 4vw, 3rem);
  padding: 0.75rem 1.1rem;
  border: 2px solid var(--c-ink-strong);
  border-radius: 999px;
  background: var(--c-accent-yellow);
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transform: rotate(-7deg);
}

.heroEyes {
  position: absolute;
  top: clamp(5rem, 12vw, 8rem);
  right: clamp(1rem, 7vw, 7rem);
  z-index: 1;
}
```

- [ ] **Step 2: Restyle hero text and metadata selectors**

Update these selectors:

```scss
.heroTop {
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: relative;
  z-index: 2;
}

.heroTop span {
  display: inline-flex;
  align-items: center;
  min-height: 2.1rem;
  padding: 0.45rem 0.8rem;
  border: 1px solid var(--c-ink-strong);
  border-radius: 999px;
  background: var(--c-surface-paper);
  box-shadow: 0 0.25rem 0 var(--c-ink-strong);
}

.heroTitle {
  position: relative;
  z-index: 2;
  margin: 8vh 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: clamp(1.5rem, 4vw, 4rem);
  font-size: clamp(3.2rem, 14vw, 12rem);
  line-height: 0.84;
  letter-spacing: -0.065em;
  color: var(--c-ink-strong);
}

.heroTitlePrimary {
  display: block;
  margin: 0;
  font-size: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  font-weight: 950;
  text-shadow: 0.035em 0.035em 0 var(--c-accent-yellow);
}

.heroBottom {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2vw;
  align-items: end;
}

.heroMeta p {
  margin: 0;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid var(--c-ink-strong);
  border-radius: 999px;
  padding: 0.58rem 0.8rem;
  background: var(--c-bg-2);
  box-shadow: 0 0.22rem 0 var(--c-ink-strong);
}

.heroSummary {
  grid-column: 8 / 13;
  margin: 0;
  padding: clamp(1rem, 2vw, 1.4rem);
  border: 2px solid var(--c-ink-strong);
  border-radius: 1.6rem;
  background: var(--c-surface-paper);
  box-shadow: 0 0.6rem 0 var(--c-ink-strong);
  font-size: clamp(1rem, 1.2vw, 1.2rem);
  line-height: 1.8;
  font-weight: 500;
  color: var(--c-ink-strong);
}

.heroSummaryRotating {
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  padding: 0.16em 0.82em 0.2em;
  margin: 0 0.08em;
  border-radius: 0.55em;
  background: var(--c-accent-coral);
  box-shadow: 0 0.12em 0 var(--c-ink-strong);
  color: var(--c-surface-paper);
  font-weight: 800;
  vertical-align: baseline;
  overflow: hidden;
  isolation: isolate;
}
```

- [ ] **Step 3: Restyle sections, cards, projects, gears, archive, and experience**

Append these overrides near the related existing selector sections, or replace matching selectors if they already exist:

```scss
.section {
  padding: 12vh 0;
}

.sectionHeader {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 8vh;
}

.sectionTitle {
  white-space: nowrap;
  color: var(--c-ink-strong);
  font-weight: 900;
  padding: 0.5rem 0.85rem;
  border: 2px solid var(--c-ink-strong);
  border-radius: 999px;
  background: var(--c-accent-yellow);
  box-shadow: 0 0.25rem 0 var(--c-ink-strong);
}

.sectionLine {
  flex: 1;
  height: 2px;
  background-color: var(--c-ink-strong);
}

.philosophyContent {
  max-width: 1040px;
  margin: 0 auto;
  padding: clamp(1.4rem, 4vw, 3.5rem);
  border: 2px solid var(--c-ink-strong);
  border-radius: clamp(2rem, 4vw, 3.5rem);
  background: var(--c-accent-mint);
  box-shadow: 0 0.9rem 0 var(--c-ink-strong);
  text-align: center;
}

.statementTitle {
  margin: 0 0 48px;
  font-size: clamp(2.5rem, 5vw, 5.8rem);
  font-weight: 950;
  line-height: 0.95;
  letter-spacing: -0.055em;
}

.capGridFull,
.gearGridFull {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(1rem, 2vw, 1.4rem);
  background: transparent;
  border: 0;
}

.capCard,
.gearCard {
  border: 2px solid var(--c-ink-strong);
  border-radius: 1.7rem;
  background: var(--c-surface-paper);
  box-shadow: 0 0.55rem 0 var(--c-ink-strong);
  transition:
    transform 260ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 260ms cubic-bezier(0.16, 1, 0.3, 1),
    background 260ms ease;
}

.capCard:nth-child(4n + 1),
.gearCard:nth-child(4n + 1) {
  background: var(--c-accent-yellow);
}

.capCard:nth-child(4n + 2),
.gearCard:nth-child(4n + 2) {
  background: var(--c-accent-sky);
}

.capCard:nth-child(4n + 3),
.gearCard:nth-child(4n + 3) {
  background: var(--c-accent-mint);
}

.capCard:nth-child(4n),
.gearCard:nth-child(4n) {
  background: var(--c-accent-lilac);
}

@media (hover: hover) {
  .capCard:hover,
  .gearCard:hover {
    transform: translateY(-0.45rem) rotate(-1deg);
    box-shadow: 0 0.9rem 0 var(--c-ink-strong);
  }
}

.projectVisual {
  width: 100%;
  aspect-ratio: 16 / 10;
  border: 2px solid var(--c-ink-strong);
  border-radius: clamp(1.5rem, 3vw, 2.6rem);
  position: relative;
  overflow: hidden;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0.85rem 0 var(--c-ink-strong);
}

.projectPosterBadge {
  position: absolute;
  left: 1.2rem;
  top: 1.2rem;
  z-index: 2;
  padding: 0.55rem 0.8rem;
  border: 2px solid var(--c-ink-strong);
  border-radius: 999px;
  background: var(--c-accent-yellow);
  color: var(--c-ink-strong);
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.visualLight {
  background: var(--c-accent-sky);
}

.visualDark {
  background: var(--c-ink-strong);
}

.projectInfo {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: clamp(1rem, 2vw, 1.4rem);
  border: 2px solid var(--c-ink-strong);
  border-radius: 1.7rem;
  background: var(--c-surface-paper);
  box-shadow: 0 0.55rem 0 var(--c-ink-strong);
}

.fullWidthList {
  display: flex;
  flex-direction: column;
  border-top: 2px solid var(--c-ink-strong);
}

.expItemFull {
  border-bottom: 2px solid var(--c-ink-strong);
}

@media (hover: hover) {
  .expItemFull:hover {
    padding-left: 24px;
    padding-right: 24px;
    border-radius: 999px;
    background-color: var(--c-accent-yellow);
  }
}
```

- [ ] **Step 4: Add reduced motion and responsive handling**

Add this near the end of `src/app/page.module.scss`:

```scss
@media (prefers-reduced-motion: reduce) {
  .capCard,
  .gearCard,
  .projectVisual,
  .expItemFull,
  .iconArrow {
    transition: none;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 1rem;
    border-radius: 1.8rem;
  }

  .heroEyes {
    position: relative;
    top: auto;
    right: auto;
    align-self: flex-end;
    margin-top: 1.2rem;
  }

  .heroOrbit {
    display: none;
  }
}
```

- [ ] **Step 5: Run homepage test and verify it passes**

Run:

```bash
pnpm test -- src/app/test/page.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit integration and styling**

Run:

```bash
git add src/components/home-page/HomePage.tsx src/app/page.module.scss src/styles/scss/_tokens.scss src/app/test/page.test.tsx
git commit -m "style(home): apply playful editorial theme"
```

Expected: commit succeeds.

## Task 7: Visual verification in the browser

**Files:**

- No source files should be modified unless the visual check reveals a concrete issue.

- [ ] **Step 1: Start the dev server**

Run:

```bash
pnpm dev
```

Expected: Next.js starts on `http://localhost:3001`.

- [ ] **Step 2: Open the homepage**

Use a browser automation tool or manually open:

```text
http://localhost:3001/
```

Expected: homepage loads without runtime errors.

- [ ] **Step 3: Check required visual outcomes**

Verify these items:

- Top navigation appears and behaves as before.
- Hero uses warm cream/editorial surface rather than stark white/black.
- Cursor-following eyes are visible in the hero and pupils move on pointer hover.
- Capability and gear cards use multiple accent colors.
- Project visuals look like poster tiles with `SYS.*` badges.
- Archive FlowingMenu uses the new playful palette.
- Mobile width around 390px does not create horizontal overflow.

- [ ] **Step 4: If visual tweaks are needed, make only targeted CSS changes**

If a concrete issue appears, edit only the relevant selector in `src/app/page.module.scss` or `src/components/home-page/CursorEyes.module.scss`, then rerun:

```bash
pnpm test -- src/app/test/page.test.tsx src/components/home-page/test/CursorEyes.test.tsx
```

Expected: PASS.

## Task 8: Final verification

**Files:**

- No source changes expected.

- [ ] **Step 1: Run lint**

Run:

```bash
pnpm lint
```

Expected: PASS.

- [ ] **Step 2: Run typecheck**

Run:

```bash
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 3: Run targeted tests**

Run:

```bash
pnpm test -- src/app/test/page.test.tsx src/components/home-page/test/CursorEyes.test.tsx src/components/home-page/test/TechLogoLoop.test.tsx
```

Expected: PASS.

- [ ] **Step 4: Run format check**

Run:

```bash
pnpm format:check
```

Expected: PASS. If it fails only on touched files, run `pnpm format`, then rerun `pnpm format:check`.

- [ ] **Step 5: Final commit if verification formatting changed files**

If Step 4 caused formatting changes, run:

```bash
git add src/components/home-page src/app/page.module.scss src/styles/scss/_tokens.scss src/app/test/page.test.tsx
git commit -m "chore(home): format playful editorial redesign"
```

Expected: commit succeeds or there are no changes to commit.

## Self-Review

- Spec coverage: global tokens are handled in Task 5; homepage styling and markup in Tasks 4 and 6; cursor-following eyes in Tasks 1 and 2; FlowingMenu palette in Task 4; reduced-motion and accessibility concerns in Tasks 2 and 6; verification in Tasks 7 and 8.
- Placeholder scan: no unresolved placeholders remain in implementation steps.
- Type consistency: the component is consistently named `CursorEyes`, uses `data-testid="cursor-eyes"`, and style hooks referenced by tests match `.heroDecor`, `.heroEyes`, and `.projectPosterBadge`.
