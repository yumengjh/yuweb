// cspell:words Supabase
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { act, cleanup, fireEvent, render, screen, waitFor } from "@/test/render";

import {
  TECH_LOGO_LOOP_FADE_OUT,
  TECH_LOGO_LOOP_GAP,
  TECH_LOGO_LOOP_HOVER_SMOOTH_TAU,
  TECH_LOGO_LOOP_LOGO_HEIGHT,
  TECH_LOGO_LOOP_SCALE_ON_HOVER,
  TECH_LOGO_LOOP_SMOOTH_TAU,
  TechLogoLoop,
} from "../TechLogoLoop";

describe("TechLogoLoop", () => {
  const rafCallbacks = new Map<number, FrameRequestCallback>();
  let rafId = 0;

  const runFrame = (timestamp: number) => {
    const next = [...rafCallbacks.entries()].sort(([a], [b]) => a - b)[0];
    if (!next) {
      throw new Error("No pending animation frame callback");
    }

    const [id, callback] = next;
    rafCallbacks.delete(id);

    act(() => {
      callback(timestamp);
    });
  };

  beforeEach(() => {
    rafCallbacks.clear();
    rafId = 0;

    vi.spyOn(window, "requestAnimationFrame").mockImplementation(
      (callback: FrameRequestCallback) => {
        rafId += 1;
        rafCallbacks.set(rafId, callback);
        return rafId;
      },
    );

    vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id: number) => {
      rafCallbacks.delete(id);
    });

    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this.getAttribute("role") === "region") {
        return 2400;
      }

      return 0;
    });

    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this.tagName === "UL") {
        return {
          x: 0,
          y: 0,
          width: 1000,
          height: 60,
          top: 0,
          right: 1000,
          bottom: 60,
          left: 0,
          toJSON: () => null,
        } as DOMRect;
      }

      return {
        x: 0,
        y: 0,
        width: 1200,
        height: 80,
        top: 0,
        right: 1200,
        bottom: 80,
        left: 0,
        toJSON: () => null,
      } as DOMRect;
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders a full-width looping row of brand logos", () => {
    render(<TechLogoLoop />);

    const region = screen.getByRole("region", { name: "Our tech stack" });
    expect(region).toBeInTheDocument();
    expect(region.parentElement?.tagName).toBe("SECTION");
    expect(region.parentElement?.firstElementChild).toBe(region);

    expect(screen.getByRole("link", { name: "React" })).toHaveAttribute(
      "href",
      "https://react.dev/",
    );
    expect(screen.getByRole("link", { name: "Next.js" })).toHaveAttribute(
      "href",
      "https://nextjs.org/",
    );
    expect(screen.getByRole("link", { name: "TypeScript" })).toHaveAttribute(
      "href",
      "https://www.typescriptlang.org/",
    );
    expect(screen.getByRole("link", { name: "Tailwind CSS" })).toHaveAttribute(
      "href",
      "https://tailwindcss.com/",
    );
    expect(screen.getByRole("link", { name: "Vercel" })).toHaveAttribute(
      "href",
      "https://vercel.com/",
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/",
    );
    expect(screen.getByRole("link", { name: "Docker" })).toHaveAttribute(
      "href",
      "https://www.docker.com/",
    );
    expect(screen.getByRole("link", { name: "Prisma" })).toHaveAttribute(
      "href",
      "https://www.prisma.io/",
    );
    expect(screen.getByRole("link", { name: "Supabase" })).toHaveAttribute(
      "href",
      "https://supabase.com/",
    );
    expect(screen.getByRole("link", { name: "Stripe" })).toHaveAttribute(
      "href",
      "https://stripe.com/",
    );

    const reactLink = screen.getByRole("link", { name: "React" });
    const reactItem = reactLink.closest("li");
    const iconNode = reactLink.querySelector("span");

    expect(reactItem).toHaveStyle({
      marginRight: `${TECH_LOGO_LOOP_GAP}px`,
      fontSize: `${TECH_LOGO_LOOP_LOGO_HEIGHT}px`,
    });

    if (TECH_LOGO_LOOP_SCALE_ON_HOVER) {
      expect(iconNode).toHaveStyle({ transition: expect.stringContaining("transform") });
    } else {
      expect(iconNode).not.toHaveStyle({ transition: expect.stringContaining("transform") });
    }

    const fadeOverlays = Array.from(region.children).filter(
      (child) => child.getAttribute("aria-hidden") === "true",
    );
    expect(fadeOverlays).toHaveLength(TECH_LOGO_LOOP_FADE_OUT ? 2 : 0);
  });

  it("preserves track position when hover state changes", () => {
    render(<TechLogoLoop />);

    runFrame(0);
    runFrame(100);
    runFrame(1100);

    const region = screen.getByRole("region", { name: "Our tech stack" });
    const track = region.querySelector("div:last-child") as HTMLDivElement;

    expect(track.style.transform).not.toBe("");
    expect(track.style.transform).not.toBe("translate3d(0px, 0, 0)");

    const transformBeforeHover = track.style.transform;

    act(() => {
      fireEvent.mouseEnter(track);
    });

    expect(track.style.transform).toBe(transformBeforeHover);
  });

  it("renders enough identical copies to keep the loop continuous on wide screens", async () => {
    render(<TechLogoLoop />);

    const region = screen.getByRole("region", { name: "Our tech stack" });

    await waitFor(() => {
      expect(region.querySelectorAll("ul[role='list']")).toHaveLength(5);
    });

    const [firstList, secondList] = Array.from(
      region.querySelectorAll("ul[role='list']"),
    ) as HTMLUListElement[];
    expect(firstList?.style.marginRight).toBe(secondList?.style.marginRight);
  });

  it("groups related logos together inside the same loop", () => {
    render(<TechLogoLoop />);

    const region = screen.getByRole("region", { name: "Our tech stack" });
    const firstList = region.querySelector("ul[role='list']") as HTMLUListElement | null;
    expect(firstList).toBeTruthy();

    const names = Array.from(firstList?.querySelectorAll("a") ?? []).map((link) =>
      link.getAttribute("aria-label"),
    );

    expect(names.slice(0, 9)).toEqual([
      "React",
      "Next.js",
      "Vue",
      "Nuxt",
      "Svelte",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Ant Design",
    ]);
    expect(names.slice(9, 15)).toEqual([
      "NestJS",
      "Prisma",
      "Supabase",
      "MySQL",
      "PostgreSQL",
      "Rust",
    ]);
    expect(names.slice(15, 24)).toEqual([
      "Docker",
      "Vercel",
      "Stripe",
      "Cloudflare",
      "Nginx",
      "Netlify",
      "Rollup",
      "VS Code",
      "GitHub",
    ]);
    expect(names.slice(24, 27)).toEqual(["OpenAI", "Gemini", "Claude"]);
  });

  it("exposes stable timing config for normal and hover motion", () => {
    expect(TECH_LOGO_LOOP_SMOOTH_TAU).toBeGreaterThan(0);
    expect(TECH_LOGO_LOOP_HOVER_SMOOTH_TAU).toBeGreaterThan(0);
    expect(TECH_LOGO_LOOP_HOVER_SMOOTH_TAU).toBeGreaterThan(TECH_LOGO_LOOP_SMOOTH_TAU);
  });
});
