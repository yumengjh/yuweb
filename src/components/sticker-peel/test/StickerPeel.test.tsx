import { afterEach, describe, expect, it, vi } from "vitest";
import { createRef } from "react";

import { cleanup, fireEvent, render, screen, waitFor } from "@/test/render";

const { draggableCreateMock } = vi.hoisted(() => ({
  draggableCreateMock: vi.fn(() => [
    {
      kill: vi.fn(),
      update: vi.fn(),
    },
  ]),
}));

vi.mock("gsap", () => ({
  gsap: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: vi.fn(),
    getProperty: vi.fn(() => 0),
    utils: {
      clamp: (min: number, max: number, value: number) => Math.min(Math.max(value, min), max),
    },
  },
}));

vi.mock("gsap/Draggable", () => ({
  Draggable: {
    create: draggableCreateMock,
  },
}));

import {
  mergeStickerPeelConfig,
  resolveStickerPeelConfig,
  resolveStickerPeelProfileName,
  getStickerPeelDragBounds,
  getStickerPeelVisualOverflow,
  STICKER_PEEL_DEFAULT_BASE_CONFIG,
  STICKER_PEEL_DEFAULT_RESPONSIVE_CONFIGS,
  StickerPeel,
} from "../StickerPeel";

describe("StickerPeel", () => {
  const originalVisualViewport = window.visualViewport;

  afterEach(() => {
    cleanup();
    draggableCreateMock.mockClear();
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: originalVisualViewport,
    });
  });

  it("renders with only an image source", () => {
    render(
      <StickerPeel
        imageSrc="https://img.yumg.cn/homepage/avator.png"
        alt="Homepage avatar sticker"
      />,
    );

    const sticker = screen.getByAltText("Homepage avatar sticker");
    expect(sticker).toBeInTheDocument();
    expect(sticker).toHaveAttribute("src", "https://img.yumg.cn/homepage/avator.png");
    expect(screen.getByTestId("sticker-peel")).toBeInTheDocument();
  });

  it("waits for window load before rendering the real image", async () => {
    const originalReadyState = document.readyState;

    try {
      Object.defineProperty(document, "readyState", {
        configurable: true,
        get: () => "loading",
      });

      render(
        <StickerPeel
          imageSrc="https://img.yumg.cn/homepage/avator.png"
          alt="Homepage avatar sticker"
        />,
      );

      expect(screen.queryByAltText("Homepage avatar sticker")).not.toBeInTheDocument();

      window.dispatchEvent(new Event("load"));

      await waitFor(() => {
        expect(screen.getByAltText("Homepage avatar sticker")).toBeInTheDocument();
      });
    } finally {
      Object.defineProperty(document, "readyState", {
        configurable: true,
        get: () => originalReadyState,
      });
    }
  });

  it("merges external config with internal defaults and keeps default breakpoints", () => {
    const merged = mergeStickerPeelConfig({
      width: 200,
      responsiveConfigs: [
        {
          name: "mobile",
          overrides: {
            width: 71,
          },
        },
        {
          name: "ultra-wide",
          minWidth: 1400,
          overrides: {
            width: 260,
            initialPosition: { x: 1120, y: 96 },
          },
        },
      ],
    });

    expect(merged.width).toBe(200);
    expect(merged.responsiveConfigs.map((item) => item.name)).toEqual([
      "desktop",
      "tablet",
      "mobile",
      "ultra-wide",
    ]);

    expect(resolveStickerPeelConfig(500, merged, merged.responsiveConfigs).width).toBe(71);
    expect(resolveStickerPeelConfig(1500, merged, merged.responsiveConfigs).width).toBe(260);
  });

  it("uses document width to match mobile profile in device emulation", () => {
    const originalInnerWidth = window.innerWidth;
    const clientWidthGetter = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(document.documentElement),
      "clientWidth",
    );

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1440,
    });
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: {
        width: 1440,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      get: () => 500,
    });

    render(
      <StickerPeel
        imageSrc="https://img.yumg.cn/homepage/avator.png"
        config={{
          responsiveConfigs: [
            {
              name: "mobile",
              overrides: {
                width: 71,
                initialPosition: { x: 196, y: 84 },
              },
            },
          ],
        }}
      />,
    );

    const root = screen.getByTestId("sticker-peel");
    expect(root).toHaveAttribute("data-profile", "mobile");
    expect(root).toHaveAttribute("data-viewport", "500");
    expect(root).toHaveAttribute("data-width", "71");
    expect(resolveStickerPeelProfileName(500)).toBe("mobile");

    const draggable = root.querySelector("div[style*='--sticker-width']") as HTMLDivElement | null;
    expect(draggable?.style.getPropertyValue("--sticker-width")).toBe("71px");

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: originalInnerWidth,
    });
    if (clientWidthGetter) {
      Object.defineProperty(document.documentElement, "clientWidth", clientWidthGetter);
    }
  });

  it("defaults drag bounds to the whole screen and still accepts external bounds refs", () => {
    render(<StickerPeel imageSrc="https://img.yumg.cn/homepage/avator.png" />);
    window.dispatchEvent(new Event("load"));
    fireEvent.load(screen.getByAltText("Sticker peel image"));

    expect(draggableCreateMock).toHaveBeenCalledTimes(1);

    const firstCall = draggableCreateMock.mock.calls[0] as unknown[];
    const firstOptions = firstCall[1] as { bounds?: unknown; type?: string } | undefined;

    expect(firstOptions?.type).toBe("x,y");
    expect(firstOptions?.bounds).toMatchObject({
      left: expect.any(Number),
      top: expect.any(Number),
      width: expect.any(Number),
      height: expect.any(Number),
      minX: expect.any(Number),
      minY: expect.any(Number),
      maxX: expect.any(Number),
      maxY: expect.any(Number),
    });

    cleanup();
    draggableCreateMock.mockClear();

    const boundsRef = createRef<HTMLDivElement>();
    render(
      <div ref={boundsRef}>
        <StickerPeel imageSrc="https://img.yumg.cn/homepage/avator.png" boundsRef={boundsRef} />
      </div>,
    );
    window.dispatchEvent(new Event("load"));
    fireEvent.load(screen.getByAltText("Sticker peel image"));

    const secondCall = draggableCreateMock.mock.calls[0] as unknown[];
    const secondOptions = secondCall[1] as { bounds?: unknown } | undefined;

    expect(secondOptions?.bounds).toMatchObject({
      left: expect.any(Number),
      top: expect.any(Number),
      width: expect.any(Number),
      height: expect.any(Number),
    });
  });

  it("keeps exported defaults stable", () => {
    expect(STICKER_PEEL_DEFAULT_BASE_CONFIG.width).toBeGreaterThan(0);
    expect(STICKER_PEEL_DEFAULT_BASE_CONFIG.peelDirection).toBe(0);
    expect(STICKER_PEEL_DEFAULT_RESPONSIVE_CONFIGS).toHaveLength(3);
    expect(
      STICKER_PEEL_DEFAULT_RESPONSIVE_CONFIGS.find((item) => item.name === "mobile")?.overrides
        .peelDirection,
    ).toBeUndefined();
  });

  it("calculates visual overflow and drag bounds from the visible sticker extents", () => {
    const visualOverflow = getStickerPeelVisualOverflow(
      {
        left: 100,
        top: 100,
        width: 90,
        height: 90,
      },
      {
        left: 88,
        top: 92,
        width: 112,
        height: 104,
      },
    );

    expect(visualOverflow).toEqual({
      left: 12,
      top: 8,
      right: 10,
      bottom: 6,
    });

    expect(
      getStickerPeelDragBounds(
        { width: 375, height: 720 },
        { width: 90, height: 90 },
        visualOverflow,
      ),
    ).toEqual({
      left: 12,
      top: 8,
      width: 353,
      height: 706,
      minX: 12,
      minY: 8,
      maxX: 275,
      maxY: 624,
    });
  });

  it("expands the SVG filter regions to avoid clipping the sticker edges", () => {
    const { container } = render(
      <StickerPeel imageSrc="https://img.yumg.cn/homepage/avator.png" />,
    );

    const dropShadowFilter = container.querySelector("filter#sticker-peel-drop-shadow");
    const pointLightFilter = container.querySelector("filter#sticker-peel-point-light");

    expect(dropShadowFilter).toHaveAttribute("x", "-50%");
    expect(dropShadowFilter).toHaveAttribute("y", "-50%");
    expect(dropShadowFilter).toHaveAttribute("width", "200%");
    expect(dropShadowFilter).toHaveAttribute("height", "200%");

    expect(pointLightFilter).toHaveAttribute("x", "-50%");
    expect(pointLightFilter).toHaveAttribute("y", "-50%");
    expect(pointLightFilter).toHaveAttribute("width", "200%");
    expect(pointLightFilter).toHaveAttribute("height", "200%");
  });
});
