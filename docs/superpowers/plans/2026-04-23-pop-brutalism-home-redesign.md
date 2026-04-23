<!-- cspell:words Brutalism brutal YUMENGJH RotatingSceneNavigator reducedmotion conic springy agentic srgb -->

# Pop Brutalism Home Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first Pop Brutalism redesign slice: reusable brutal design tokens, a 7-scene rotating homepage navigator, and a visually adapted but structurally unchanged top navigation bar.

**Architecture:** Add a focused `rotating-scene-navigator` feature under `src/components/home-page/` with scene data separated from rendering. Keep `TopNavigationBar.tsx` logic intact and change only its SCSS module. Keep the standalone `TechLogoLoop` below the hero for the full logo carousel while adding a compact Tech Stack scene inside the new navigator.

**Tech Stack:** Next.js App Router, React 19, TypeScript, SCSS modules, `motion/react`, Vitest, Testing Library, existing i18n helpers and `siteConfig`.

---

## File Structure

Create:

- `src/components/home-page/rotating-scene-navigator/scene-data.ts`
  - Builds the 7 localized scene records from `siteConfig.homePage`, `createTranslator`, and `localizeHref`.
- `src/components/home-page/rotating-scene-navigator/RotatingSceneNavigator.tsx`
  - Client component for the wheel, drag area, arrows, central card, scene chips, and CSS/SVG illustrations.
- `src/components/home-page/rotating-scene-navigator/RotatingSceneNavigator.module.scss`
  - All Pop Brutalism wheel, card, button, responsive, and reduced-motion styles.
- `src/components/home-page/rotating-scene-navigator/index.ts`
  - Public export for the component.
- `src/components/home-page/rotating-scene-navigator/test/scene-data.test.ts`
  - Scene count, locale, and link behavior tests.
- `src/components/home-page/rotating-scene-navigator/test/RotatingSceneNavigator.test.tsx`
  - Render, current scene, next/previous button tests.
- `src/styles/scss/test/tokens.test.ts`
  - Source-level test proving brutal tokens exist.

Modify:

- `src/styles/scss/_tokens.scss`
  - Add `--c-brutal-*`, `--brutal-border-*`, `--brutal-shadow-*`, `--brutal-radius-*` tokens to light and dark theme scopes.
- `src/components/home-page/HomePage.tsx`
  - Replace the old hero section with `RotatingSceneNavigator`; keep `HomeSmoothScroll`, stickers, `TechLogoLoop`, and downstream sections.
- `src/app/page.module.scss`
  - Remove unused old hero styles after HomePage no longer references them; add transitional page background styles.
- `src/app/test/page.test.tsx`
  - Update homepage expectations from the old TextPressure hero to the new scene navigator while preserving core content and link assertions.
- `src/components/top-navigation-bar/TopNavigationBar.module.scss`
  - Adapt colors, borders, shadows, active states, dropdown, mobile drawer, and small decorative pseudo-elements.
- `src/components/top-navigation-bar/test/TopNavigationBar.test.tsx`
  - Add a source-level assertion that top navigation logic file does not import a new component or change data structure; keep behavior tests unchanged and run them.

---

### Task 1: Add failing tests for brutal tokens

**Files:**

- Create: `src/styles/scss/test/tokens.test.ts`
- Modify in Step 3: `src/styles/scss/_tokens.scss`

- [ ] **Step 1: Write the failing token test**

Create `src/styles/scss/test/tokens.test.ts`:

```ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Pop Brutalism design tokens", () => {
  const tokensSource = readFileSync(
    path.resolve(process.cwd(), "src/styles/scss/_tokens.scss"),
    "utf8",
  );

  it("defines reusable brutal color tokens", () => {
    expect(tokensSource).toContain("--c-brutal-ink:");
    expect(tokensSource).toContain("--c-brutal-paper:");
    expect(tokensSource).toContain("--c-brutal-green:");
    expect(tokensSource).toContain("--c-brutal-red:");
    expect(tokensSource).toContain("--c-brutal-yellow:");
    expect(tokensSource).toContain("--c-brutal-blue:");
    expect(tokensSource).toContain("--c-brutal-pink:");
    expect(tokensSource).toContain("--c-brutal-purple:");
  });

  it("defines reusable brutal shape tokens", () => {
    expect(tokensSource).toContain("--brutal-border-md:");
    expect(tokensSource).toContain("--brutal-shadow-md:");
    expect(tokensSource).toContain("--brutal-radius-lg:");
    expect(tokensSource).toContain("--brutal-radius-pill:");
  });
});
```

- [ ] **Step 2: Run the token test to verify it fails**

Run:

```bash
pnpm test -- src/styles/scss/test/tokens.test.ts
```

Expected: FAIL because `--c-brutal-ink:` is not present in `_tokens.scss`.

- [ ] **Step 3: Add the brutal tokens**

In `src/styles/scss/_tokens.scss`, add the light tokens inside the first root block after `--c-shadow-soft`:

```scss
--c-brutal-ink: #111827;
--c-brutal-paper: #ffffff;
--c-brutal-green: #96d48c;
--c-brutal-red: #ff4102;
--c-brutal-yellow: #fcd34d;
--c-brutal-blue: #2563eb;
--c-brutal-pink: #ec4899;
--c-brutal-purple: #8b5cf6;
--brutal-border-sm: 3px;
--brutal-border-md: 4px;
--brutal-border-lg: 6px;
--brutal-border-xl: 8px;
--brutal-shadow-sm: 4px 4px 0 var(--c-brutal-ink);
--brutal-shadow-md: 8px 8px 0 var(--c-brutal-ink);
--brutal-shadow-lg: 12px 12px 0 var(--c-brutal-ink);
--brutal-radius-sm: 10px;
--brutal-radius-md: 16px;
--brutal-radius-lg: 28px;
--brutal-radius-pill: 999px;
```

Inside `@mixin dark-theme`, add readable dark fallbacks after `--c-shadow-soft`:

```scss
--c-brutal-ink: #05070a;
--c-brutal-paper: #f8fafc;
--c-brutal-green: #96d48c;
--c-brutal-red: #ff5a22;
--c-brutal-yellow: #fcd34d;
--c-brutal-blue: #60a5fa;
--c-brutal-pink: #f472b6;
--c-brutal-purple: #a78bfa;
--brutal-border-sm: 3px;
--brutal-border-md: 4px;
--brutal-border-lg: 6px;
--brutal-border-xl: 8px;
--brutal-shadow-sm: 4px 4px 0 var(--c-brutal-ink);
--brutal-shadow-md: 8px 8px 0 var(--c-brutal-ink);
--brutal-shadow-lg: 12px 12px 0 var(--c-brutal-ink);
--brutal-radius-sm: 10px;
--brutal-radius-md: 16px;
--brutal-radius-lg: 28px;
--brutal-radius-pill: 999px;
```

- [ ] **Step 4: Run the token test to verify it passes**

Run:

```bash
pnpm test -- src/styles/scss/test/tokens.test.ts
```

Expected: PASS with 2 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/styles/scss/_tokens.scss src/styles/scss/test/tokens.test.ts
git commit -m "style(theme): add pop brutalism tokens"
```

---

### Task 2: Add failing scene data tests

**Files:**

- Create: `src/components/home-page/rotating-scene-navigator/test/scene-data.test.ts`
- Create in Step 3: `src/components/home-page/rotating-scene-navigator/scene-data.ts`

- [ ] **Step 1: Write the failing scene data test**

Create `src/components/home-page/rotating-scene-navigator/test/scene-data.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  HOME_SCENE_NAVIGATOR_COUNT,
  buildHomeSceneNavigatorScenes,
} from "../scene-data";

describe("buildHomeSceneNavigatorScenes", () => {
  it("builds the seven homepage navigator scenes", () => {
    const scenes = buildHomeSceneNavigatorScenes("zh-CN");

    expect(HOME_SCENE_NAVIGATOR_COUNT).toBe(7);
    expect(scenes).toHaveLength(7);
    expect(scenes.map((scene) => scene.id)).toEqual([
      "intro",
      "tech",
      "capabilities",
      "works",
      "gear",
      "archive",
      "experience",
    ]);
  });

  it("localizes internal links for English routes", () => {
    const scenes = buildHomeSceneNavigatorScenes("en-US");

    expect(scenes.find((scene) => scene.id === "works")?.href).toBe(
      "/en/curations",
    );
    expect(scenes.find((scene) => scene.id === "archive")?.href).toBe(
      "/en/collections",
    );
    expect(scenes.find((scene) => scene.id === "experience")?.href).toBe(
      "/en/journey",
    );
  });

  it("keeps the intro scene tied to the current homepage identity", () => {
    const scenes = buildHomeSceneNavigatorScenes("zh-CN");
    const intro = scenes[0];

    expect(intro.title).toContain("YUMENGJH");
    expect(intro.description.length).toBeGreaterThan(20);
    expect(intro.illustrationKind).toBe("workspace");
  });
});
```

- [ ] **Step 2: Run the scene data test to verify it fails**

Run:

```bash
pnpm test -- src/components/home-page/rotating-scene-navigator/test/scene-data.test.ts
```

Expected: FAIL because `../scene-data` does not exist.

- [ ] **Step 3: Implement scene data**

Create `src/components/home-page/rotating-scene-navigator/scene-data.ts`:

```ts
import { createTranslator, localizeHref, type SiteLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

export const HOME_SCENE_NAVIGATOR_COUNT = 7;

export type HomeSceneNavigatorSceneId =
  | "intro"
  | "tech"
  | "capabilities"
  | "works"
  | "gear"
  | "archive"
  | "experience";

export type HomeSceneNavigatorIllustrationKind =
  | "workspace"
  | "tech"
  | "capabilities"
  | "works"
  | "gear"
  | "archive"
  | "experience";

export type HomeSceneNavigatorScene = {
  id: HomeSceneNavigatorSceneId;
  indexLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  themeColor: string;
  illustrationKind: HomeSceneNavigatorIllustrationKind;
};

const sceneColors = {
  intro: "var(--c-brutal-blue)",
  tech: "var(--c-brutal-yellow)",
  capabilities: "var(--c-brutal-pink)",
  works: "var(--c-brutal-green)",
  gear: "var(--c-brutal-red)",
  archive: "var(--c-brutal-purple)",
  experience: "var(--c-brutal-paper)",
} as const satisfies Record<HomeSceneNavigatorSceneId, string>;

function sceneIndexLabel(index: number) {
  return `${String(index + 1).padStart(2, "0")} / ${String(HOME_SCENE_NAVIGATOR_COUNT).padStart(2, "0")}`;
}

export function buildHomeSceneNavigatorScenes(
  locale: SiteLocale,
): HomeSceneNavigatorScene[] {
  const t = createTranslator(locale);
  const homePage = siteConfig.homePage;

  return [
    {
      id: "intro",
      indexLabel: sceneIndexLabel(0),
      eyebrow: t(homePage.hero.topLeft),
      title: `${t(homePage.hero.title)} ${t(homePage.hero.titleAccent)}`.trim(),
      description: t(homePage.hero.summary),
      href: localizeHref("/about", locale),
      ctaLabel: locale === "zh-CN" ? "进入关于" : "About me",
      themeColor: sceneColors.intro,
      illustrationKind: "workspace",
    },
    {
      id: "tech",
      indexLabel: sceneIndexLabel(1),
      eyebrow: "TECH STACK",
      title: locale === "zh-CN" ? "构建工具栈" : "Build Stack",
      description:
        locale === "zh-CN"
          ? "从 React、Next.js 到 TypeScript、OpenAI 与部署工具，把工程能力压进一个可持续迭代的系统。"
          : "React, Next.js, TypeScript, OpenAI, and deployment tools shaped into a system that can keep evolving.",
      href: localizeHref("/stack", locale),
      ctaLabel: locale === "zh-CN" ? "查看技术栈" : "View stack",
      themeColor: sceneColors.tech,
      illustrationKind: "tech",
    },
    {
      id: "capabilities",
      indexLabel: sceneIndexLabel(2),
      eyebrow: t(homePage.sectionTitles.capabilities),
      title: t(homePage.capabilities[0].title),
      description: t(homePage.capabilities[0].desc),
      href: "#capabilities",
      ctaLabel: locale === "zh-CN" ? "查看能力" : "See capabilities",
      themeColor: sceneColors.capabilities,
      illustrationKind: "capabilities",
    },
    {
      id: "works",
      indexLabel: sceneIndexLabel(3),
      eyebrow: t(homePage.sectionTitles.works),
      title: t(homePage.works[0].title),
      description: `${t(homePage.works[0].type)} / ${homePage.works[0].year}`,
      href: localizeHref("/curations", locale),
      ctaLabel: t(homePage.links.exploreCase),
      themeColor: sceneColors.works,
      illustrationKind: "works",
    },
    {
      id: "gear",
      indexLabel: sceneIndexLabel(4),
      eyebrow: t(homePage.sectionTitles.gears),
      title: homePage.gears[0].name,
      description: `${homePage.gears[0].spec} — ${t(homePage.gears[0].desc)}`,
      href: localizeHref("/workspace", locale),
      ctaLabel: t(homePage.links.hardwareInventory),
      themeColor: sceneColors.gear,
      illustrationKind: "gear",
    },
    {
      id: "archive",
      indexLabel: sceneIndexLabel(5),
      eyebrow: t(homePage.sectionTitles.archive),
      title: homePage.books[0].title,
      description: `${homePage.books[0].author} / ${homePage.books[0].year}`,
      href: localizeHref("/collections", locale),
      ctaLabel: t(homePage.links.completeLibrary),
      themeColor: sceneColors.archive,
      illustrationKind: "archive",
    },
    {
      id: "experience",
      indexLabel: sceneIndexLabel(6),
      eyebrow: t(homePage.sectionTitles.experience),
      title: t(homePage.experiences[0].title),
      description: t(homePage.experiences[0].company),
      href: localizeHref("/journey", locale),
      ctaLabel: locale === "zh-CN" ? "查看旅程" : "View journey",
      themeColor: sceneColors.experience,
      illustrationKind: "experience",
    },
  ];
}
```

- [ ] **Step 4: Run the scene data test to verify it passes**

Run:

```bash
pnpm test -- src/components/home-page/rotating-scene-navigator/test/scene-data.test.ts
```

Expected: PASS with 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/home-page/rotating-scene-navigator/scene-data.ts src/components/home-page/rotating-scene-navigator/test/scene-data.test.ts
git commit -m "feat(home): add scene navigator data"
```

---

### Task 3: Add failing RotatingSceneNavigator component tests

**Files:**

- Create: `src/components/home-page/rotating-scene-navigator/test/RotatingSceneNavigator.test.tsx`
- Create in Step 3: `src/components/home-page/rotating-scene-navigator/RotatingSceneNavigator.tsx`
- Create in Step 3: `src/components/home-page/rotating-scene-navigator/RotatingSceneNavigator.module.scss`
- Create in Step 3: `src/components/home-page/rotating-scene-navigator/index.ts`

- [ ] **Step 1: Write the failing component test**

Create `src/components/home-page/rotating-scene-navigator/test/RotatingSceneNavigator.test.tsx`:

```tsx
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, fireEvent, render, screen } from "@/test/render";

import { RotatingSceneNavigator } from "../RotatingSceneNavigator";

vi.mock("motion/react", async () => {
  const React = await import("react");

  const MotionDiv = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(function MotionDiv({ children, ...props }, ref) {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  });

  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    motion: {
      div: MotionDiv,
      section: MotionDiv,
    },
    useMotionValue: () => ({
      on: vi.fn(() => vi.fn()),
      set: vi.fn(),
      get: vi.fn(() => 0),
    }),
    useTransform: () => 0,
  };
});

describe("RotatingSceneNavigator", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the seven-scene homepage navigator", () => {
    render(<RotatingSceneNavigator locale="zh-CN" />);

    expect(
      screen.getByRole("region", { name: "Homepage scene navigator" }),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("home-scene-slice")).toHaveLength(7);
    expect(screen.getByText(/YUMENGJH/)).toBeInTheDocument();
  });

  it("moves through scenes with next and previous controls", () => {
    render(<RotatingSceneNavigator locale="en-US" />);

    fireEvent.click(screen.getByRole("button", { name: "Next scene" }));
    expect(
      screen.getByRole("heading", { name: "Build Stack" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Previous scene" }));
    expect(
      screen.getByRole("heading", { name: /YUMENGJH/ }),
    ).toBeInTheDocument();
  });

  it("renders localized CTA links", () => {
    render(<RotatingSceneNavigator locale="en-US" />);

    fireEvent.click(screen.getByRole("button", { name: "Next scene" }));
    expect(screen.getByRole("link", { name: "View stack" })).toHaveAttribute(
      "href",
      "/en/stack",
    );
  });
});
```

- [ ] **Step 2: Run the component test to verify it fails**

Run:

```bash
pnpm test -- src/components/home-page/rotating-scene-navigator/test/RotatingSceneNavigator.test.tsx
```

Expected: FAIL because `../RotatingSceneNavigator` does not exist.

- [ ] **Step 3: Implement the component, styles, and export**

Create `src/components/home-page/rotating-scene-navigator/RotatingSceneNavigator.tsx` using the component implementation from the spec-aligned design notes in this task. It must export `RotatingSceneNavigator`, call `buildHomeSceneNavigatorScenes(locale)`, render a region named `Homepage scene navigator`, render 7 elements with `data-testid="home-scene-slice"`, and expose `Previous scene` and `Next scene` buttons.

Create `src/components/home-page/rotating-scene-navigator/RotatingSceneNavigator.module.scss` with the baseline classes used by the component:

```scss
.root {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  background: var(--c-brutal-green);
  color: var(--c-brutal-ink);
  isolation: isolate;
}

.sceneSlice {
  position: absolute;
  inset: 0;
  clip-path: polygon(50% 50%, 0 0, 100% 0);
  transform-origin: center;
}

.navButton {
  border: var(--brutal-border-md) solid var(--c-brutal-ink);
  border-radius: 50%;
  background: var(--c-brutal-paper);
  color: var(--c-brutal-ink);
  box-shadow: var(--brutal-shadow-sm);
}

.cardShell {
  border: var(--brutal-border-xl) solid var(--c-brutal-ink);
  border-radius: 32px;
  background: var(--c-brutal-red);
  box-shadow: var(--brutal-shadow-lg);
}

@media (prefers-reduced-motion: reduce) {
  .scenePill,
  .navButton,
  .cardLink {
    transition: none;
  }
}
```

Expand the SCSS in the implementation so every class referenced by the TSX exists. Use only CSS/SVG illustration elements and brutal tokens; do not add image assets.

Create `src/components/home-page/rotating-scene-navigator/index.ts`:

```ts
export { RotatingSceneNavigator } from "./RotatingSceneNavigator";
```

- [ ] **Step 4: Run the component test to verify it passes**

Run:

```bash
pnpm test -- src/components/home-page/rotating-scene-navigator/test/RotatingSceneNavigator.test.tsx
```

Expected: PASS with 3 tests passing.

- [ ] **Step 5: Run both navigator tests**

Run:

```bash
pnpm test -- src/components/home-page/rotating-scene-navigator/test/scene-data.test.ts src/components/home-page/rotating-scene-navigator/test/RotatingSceneNavigator.test.tsx
```

Expected: PASS with 6 tests passing.

- [ ] **Step 6: Commit**

```bash
git add src/components/home-page/rotating-scene-navigator
git commit -m "feat(home): add rotating scene navigator"
```

---

### Task 4: Integrate the navigator into HomePage with failing homepage tests first

**Files:**

- Modify: `src/app/test/page.test.tsx`
- Modify in Step 3: `src/components/home-page/HomePage.tsx`
- Modify in Step 4: `src/app/page.module.scss`

- [ ] **Step 1: Update the homepage test to expect the new navigator**

In `src/app/test/page.test.tsx`, replace the old TextPressure-specific assertion with:

```tsx
expect(
  screen.getByRole("region", { name: "Homepage scene navigator" }),
).toBeInTheDocument();
expect(screen.getAllByText(/YUMENGJH/)[0]).toBeInTheDocument();
expect(screen.getByRole("button", { name: "Next scene" })).toBeInTheDocument();
```

Add a Tech Stack preservation assertion near the existing tech logo assertions:

```tsx
expect(
  screen.getByRole("region", { name: "Our tech stack" }),
).toBeInTheDocument();
expect(screen.getByText("TECH STACK")).toBeInTheDocument();
```

Update the source-level home page test to include:

```ts
expect(homePageSource).not.toContain("<SplitText");
expect(homePageSource).not.toContain("<ScrollRevealText");
expect(homePageSource).toContain("<RotatingSceneNavigator locale={locale} />");
```

- [ ] **Step 2: Run the homepage test to verify it fails**

Run:

```bash
pnpm test -- src/app/test/page.test.tsx
```

Expected: FAIL because `HomePage` still renders the old hero and does not contain `RotatingSceneNavigator`.

- [ ] **Step 3: Replace the old hero section in HomePage**

In `src/components/home-page/HomePage.tsx`, add:

```ts
import { RotatingSceneNavigator } from "@/components/home-page/rotating-scene-navigator";
```

Remove unused `HeroSummaryRotating`, `TextPressure`, `heroTitleAccentTuning`, `heroSummaryRotatingCopy`, `heroSummaryRotatingTuning`, and `heroSummaryCopy`.

Replace the complete old hero section, from `<section className={styles.hero}>` through its matching closing `</section>`, with:

```tsx
<RotatingSceneNavigator locale={locale} />
```

Keep `<TechLogoLoop />` after the new navigator.

- [ ] **Step 4: Add transitional page styles**

In `src/app/page.module.scss`, keep `.page` and `.frame`. Add this inside `.page`:

```scss
background:
  radial-gradient(
    circle at top left,
    color-mix(in srgb, var(--c-brutal-yellow) 28%, transparent),
    transparent 34%
  ),
  linear-gradient(180deg, var(--c-brutal-green) 0%, var(--c-bg) 42rem);
```

Leave old `.hero*` styles in place for one commit if removing them creates a large noisy diff. Remove them in Task 6 after tests are passing.

- [ ] **Step 5: Run the homepage test to verify it passes**

Run:

```bash
pnpm test -- src/app/test/page.test.tsx
```

Expected: PASS with all tests in `page.test.tsx` passing.

- [ ] **Step 6: Commit**

```bash
git add src/components/home-page/HomePage.tsx src/app/page.module.scss src/app/test/page.test.tsx
git commit -m "feat(home): replace hero with scene navigator"
```

---

### Task 5: Adapt top navigation styling without changing its logic

**Files:**

- Modify: `src/components/top-navigation-bar/TopNavigationBar.module.scss`
- Run: `src/components/top-navigation-bar/test/TopNavigationBar.test.tsx`

- [ ] **Step 1: Add a source guard test for preserving navigation structure**

Open `src/components/top-navigation-bar/test/TopNavigationBar.test.tsx`. If `readFileSync` and `path` are not imported, add:

```ts
import { readFileSync } from "node:fs";
import path from "node:path";
```

Add this test:

```tsx
it("keeps top navigation as the existing component implementation", () => {
  const source = readFileSync(
    path.resolve(
      process.cwd(),
      "src/components/top-navigation-bar/TopNavigationBar.tsx",
    ),
    "utf8",
  );

  expect(source).toContain("export function TopNavigationBar");
  expect(source).toContain("function DesktopNavLabel");
  expect(source).not.toContain("RotatingSceneNavigator");
});
```

- [ ] **Step 2: Run the top navigation test before style changes**

Run:

```bash
pnpm test -- src/components/top-navigation-bar/test/TopNavigationBar.test.tsx
```

Expected: PASS. This establishes that behavior is stable before SCSS changes.

- [ ] **Step 3: Update top navigation brutal variables**

In `src/components/top-navigation-bar/TopNavigationBar.module.scss`, inside `.bar`, set:

```scss
--nav-ink: var(--c-brutal-ink);
--nav-muted: color-mix(in srgb, var(--c-brutal-ink) 68%, transparent);
--nav-muted-soft: color-mix(in srgb, var(--c-brutal-ink) 48%, transparent);
--nav-line: var(--c-brutal-ink);
--nav-line-soft: color-mix(in srgb, var(--c-brutal-ink) 28%, transparent);
--nav-surface: color-mix(in srgb, var(--c-brutal-paper) 94%, transparent);
--nav-surface-solid: var(--c-brutal-paper);
--nav-surface-soft: color-mix(
  in srgb,
  var(--c-brutal-yellow) 18%,
  var(--c-brutal-paper)
);
```

Also in `.bar`, use:

```scss
border-bottom: var(--brutal-border-sm) solid var(--c-brutal-ink);
background: var(--nav-surface);
box-shadow: 0 4px 0 var(--c-brutal-ink);
backdrop-filter: none;
-webkit-backdrop-filter: none;
```

- [ ] **Step 4: Add small decorative accents**

Replace `.bar::after` with a small non-interactive yellow stripe. Add a red dot with `.brand::after`. Add active-item capsule styling through `.navLabelHighlight::after`. Use only pseudo-elements so no TSX structure changes are needed.

Use this capsule for `.navLabelHighlight::after`:

```scss
&::after {
  content: "";
  position: absolute;
  right: -8px;
  bottom: -5px;
  left: -8px;
  z-index: -1;
  height: 1.75em;
  border: var(--brutal-border-sm) solid var(--c-brutal-ink);
  border-radius: var(--brutal-radius-pill);
  background: var(--c-brutal-yellow);
  box-shadow: 3px 3px 0 var(--c-brutal-ink);
  opacity: 0;
  transform: translateY(5px) rotate(-1deg) scale(0.96);
  transform-origin: center;
  transition:
    transform var(--nav-underline-duration) var(--nav-underline-ease),
    opacity var(--nav-underline-duration) var(--nav-underline-ease);
}
```

- [ ] **Step 5: Adapt dropdown and mobile surfaces**

In `.desktopDropdownPanel`, use brutal paper, a thick bottom border, and hard shadow. In `.desktopDropdownGroupLabel`, add a yellow bordered pill. In `.mobileMenuOverlay`, remove blur and use brutal paper. In `.menuButton`, add yellow background, black border, and hard shadow.

Concrete mobile menu button styling:

```scss
width: 44px;
height: 44px;
border: var(--brutal-border-sm) solid var(--c-brutal-ink);
border-radius: var(--brutal-radius-md);
background: var(--c-brutal-yellow);
box-shadow: 4px 4px 0 var(--c-brutal-ink);
```

- [ ] **Step 6: Run top navigation tests after style changes**

Run:

```bash
pnpm test -- src/components/top-navigation-bar/test/TopNavigationBar.test.tsx
```

Expected: PASS. No behavior assertions should fail because TSX logic is unchanged.

- [ ] **Step 7: Commit**

```bash
git add src/components/top-navigation-bar/TopNavigationBar.module.scss src/components/top-navigation-bar/test/TopNavigationBar.test.tsx
git commit -m "style(nav): adapt top navigation to pop brutalism"
```

---

### Task 6: Remove stale hero styles and run focused regression checks

**Files:**

- Modify: `src/app/page.module.scss`
- Run: focused tests

- [ ] **Step 1: Remove old hero-only SCSS that is no longer referenced**

In `src/app/page.module.scss`, remove these selectors if `HomePage.tsx` no longer references them:

```scss
.hero
.heroTop
.heroTitle
.heroTitleCopy
.heroTitlePrimary
.heroTitleAccentWrap
.heroTitleAccent
.heroBottom
.heroMeta
.heroSummary
.heroSummaryRotating
.heroSummaryRotatingSplit
.heroSummaryRotatingElement
```

Keep `.page`, `.frame`, and all section styles used below the hero.

- [ ] **Step 2: Run a source check for removed old hero hooks**

Run:

```bash
node -e "const fs=require('fs'); const src=fs.readFileSync('src/components/home-page/HomePage.tsx','utf8'); if(src.includes('HeroSummaryRotating') || src.includes('TextPressure')) process.exit(1); console.log('old hero hooks removed')"
```

Expected: prints `old hero hooks removed` and exits 0.

- [ ] **Step 3: Run focused regression tests**

Run:

```bash
pnpm test -- src/styles/scss/test/tokens.test.ts src/components/home-page/rotating-scene-navigator/test/scene-data.test.ts src/components/home-page/rotating-scene-navigator/test/RotatingSceneNavigator.test.tsx src/app/test/page.test.tsx src/components/top-navigation-bar/test/TopNavigationBar.test.tsx
```

Expected: PASS for all listed tests.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.module.scss src/components/home-page/HomePage.tsx src/app/test/page.test.tsx
git commit -m "refactor(home): remove stale hero styles"
```

---

### Task 7: Typecheck, lint, and final verification

**Files:**

- No intended source changes unless verification exposes issues.

- [ ] **Step 1: Run TypeScript typecheck**

Run:

```bash
pnpm typecheck
```

Expected: exits 0 with no TypeScript errors.

- [ ] **Step 2: Run ESLint**

Run:

```bash
pnpm lint
```

Expected: exits 0 with no ESLint errors.

- [ ] **Step 3: Run format check**

Run:

```bash
pnpm format:check
```

Expected: exits 0. If it fails, run `pnpm format`, inspect the diff, and commit formatting with the relevant source files.

- [ ] **Step 4: Run the full check chain if focused checks are clean**

Run:

```bash
pnpm check
```

Expected: exits 0 after lint, format check, typecheck, spellcheck, and tests.

- [ ] **Step 5: Inspect git diff**

Run:

```bash
git status --short
git diff --stat
```

Expected: only intentional files are modified. The untracked reference folder `rotating-scene-navigator (2)/` may remain untracked unless the user asks to commit or remove it.

- [ ] **Step 6: Commit verification fixes if any were required**

If verification required source fixes, commit them:

```bash
git add src docs package.json pnpm-lock.yaml
git commit -m "fix(home): resolve pop brutalism verification issues"
```

If no fixes were required, do not create an empty commit.

---

## Self-Review

### Spec coverage

- Pop Brutalism tokens: Task 1.
- 7-scene homepage navigator: Tasks 2 and 3.
- Homepage integration and Tech Stack preservation: Task 4.
- Top navigation structure preserved and visually adapted: Task 5.
- Stale hero cleanup: Task 6.
- Verification commands from the spec: Task 7.
- Reduced-motion styling: Task 3 SCSS includes a reduced-motion block; implementation can expand it without changing public API.

### Placeholder scan

This plan contains no planned placeholder tokens, no open-ended implementation markers, and no unspecified file paths.

### Type consistency

- Component prop is `locale: SiteLocale` in tests, implementation, and HomePage integration.
- Scene builder is consistently named `buildHomeSceneNavigatorScenes`.
- Public component is consistently named `RotatingSceneNavigator`.
- Test IDs use `home-scene-slice` consistently.
