import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, fireEvent, render, screen, waitFor, within } from "@/test/render";

import { TopNavigationBar } from "@/components/top-navigation-bar/TopNavigationBar";
import styles from "@/components/top-navigation-bar/TopNavigationBar.module.scss";

const labels = {
  navAriaLabel: "主导航",
  desktopMenuAriaLabel: "桌面导航菜单",
  openMenuLabel: "打开导航菜单",
  closeMenuLabel: "关闭导航菜单",
};

const items = [
  {
    key: "about",
    label: "关于",
    href: "/about",
    menu: {
      kind: "groups" as const,
      groups: [
        {
          label: "维度",
          entries: [
            {
              title: "起点与来源",
              description: "关于站点的来由、表达边界与空间感。",
              href: "/about#origin",
            },
          ],
        },
      ],
    },
  },
  {
    key: "stack",
    label: "技术栈",
    href: "/stack",
    menu: {
      kind: "entries" as const,
      entries: [
        {
          title: "前端系统",
          description: "框架、样式策略与工程边界。",
          href: "/stack#frontend",
        },
      ],
    },
  },
  {
    key: "blog",
    label: "博客",
    href: "/blog",
  },
];

function setWindowScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    value,
    writable: true,
    configurable: true,
  });
}

afterEach(() => {
  setWindowScrollY(0);
  cleanup();
});

describe("TopNavigationBar", () => {
  it("固定导航在页面顶部时使用透明样式", async () => {
    setWindowScrollY(0);

    render(<TopNavigationBar fixed items={items} labels={labels} />);

    const header = screen.getByRole("banner");
    await waitFor(() => {
      expect(header).toHaveClass(styles.barAtTopTransparent);
      expect(header).not.toHaveClass(styles.barDropdownOpen);
    });
  });

  it("固定导航离开顶部后恢复实底样式", async () => {
    setWindowScrollY(0);

    render(<TopNavigationBar fixed items={items} labels={labels} />);

    const header = screen.getByRole("banner");
    expect(header).toHaveClass(styles.barAtTopTransparent);

    setWindowScrollY(120);
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(header).not.toHaveClass(styles.barAtTopTransparent);
    });
  });

  it("非固定导航在顶部时不启用透明样式", async () => {
    setWindowScrollY(0);

    render(<TopNavigationBar items={items} labels={labels} />);

    const header = screen.getByRole("banner");
    await waitFor(() => {
      expect(header).not.toHaveClass(styles.barAtTopTransparent);
    });
  });

  it("顶部透明态在菜单展开后会被实底样式覆盖", async () => {
    setWindowScrollY(0);
    const user = userEvent.setup();

    render(<TopNavigationBar fixed items={items} labels={labels} />);

    const header = screen.getByRole("banner");
    const aboutButton = screen.getByRole("button", { name: /关于/ });

    expect(header).toHaveClass(styles.barAtTopTransparent);

    await user.click(aboutButton);

    await waitFor(() => {
      expect(header).not.toHaveClass(styles.barAtTopTransparent);
      expect(header).toHaveClass(styles.barDropdownOpen);
    });
  });

  it("桌面端点击导航项时会展开、切换菜单并支持点击外部收起", async () => {
    const user = userEvent.setup();

    render(<TopNavigationBar activeKey="about" items={items} labels={labels} />);

    const aboutButton = screen.getByRole("button", { name: /关于/ });
    const stackButton = screen.getByRole("button", { name: /技术栈/ });
    const panelId = aboutButton.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;

    expect(panel).not.toBeNull();
    expect(aboutButton).toHaveAttribute("aria-expanded", "false");
    expect(panel).toHaveAttribute("aria-hidden", "true");

    await user.click(aboutButton);

    await waitFor(() => {
      expect(aboutButton).toHaveAttribute("aria-expanded", "true");
      expect(panel).toHaveAttribute("aria-hidden", "false");
      expect(within(panel as HTMLElement).getByText("起点与来源")).toBeInTheDocument();
    });

    await user.click(stackButton);

    await waitFor(() => {
      expect(aboutButton).toHaveAttribute("aria-expanded", "false");
      expect(stackButton).toHaveAttribute("aria-expanded", "true");
      expect(within(panel as HTMLElement).getByText("前端系统")).toBeInTheDocument();
    });

    await user.click(document.body);

    expect(stackButton).toHaveAttribute("aria-expanded", "false");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("桌面端菜单展开后，向下滚轮会触发和手动点击一致的收起逻辑", async () => {
    const user = userEvent.setup();

    render(<TopNavigationBar items={items} labels={labels} />);

    const aboutButton = screen.getByRole("button", { name: /关于/ });
    const panelId = aboutButton.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;

    expect(panel).not.toBeNull();

    await user.click(aboutButton);

    await waitFor(() => {
      expect(aboutButton).toHaveAttribute("aria-expanded", "true");
      expect(panel).toHaveAttribute("aria-hidden", "false");
    });

    await new Promise((resolve) => window.setTimeout(resolve, 560));

    fireEvent.wheel(window, { deltaY: 16 });

    expect(aboutButton).toHaveAttribute("aria-expanded", "true");
    expect(panel).toHaveAttribute("aria-hidden", "false");

    fireEvent.wheel(window, { deltaY: 40 });

    await waitFor(() => {
      expect(aboutButton).toHaveAttribute("aria-expanded", "false");
      expect(panel).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("桌面端关闭状态下悬浮其他导航项不会直接打开菜单", async () => {
    const user = userEvent.setup();

    render(<TopNavigationBar items={items} labels={labels} />);

    const aboutButton = screen.getByRole("button", { name: /关于/ });
    const panelId = aboutButton.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;

    expect(panel).not.toBeNull();

    await user.hover(aboutButton);

    expect(aboutButton).toHaveAttribute("aria-expanded", "false");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("桌面端点击打开后，悬浮其他导航项会自动切换菜单", async () => {
    const user = userEvent.setup();

    render(<TopNavigationBar items={items} labels={labels} />);

    const aboutButton = screen.getByRole("button", { name: /关于/ });
    const stackButton = screen.getByRole("button", { name: /技术栈/ });
    const panelId = aboutButton.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;

    expect(panel).not.toBeNull();

    await user.click(aboutButton);

    await waitFor(() => {
      expect(aboutButton).toHaveAttribute("aria-expanded", "true");
      expect(within(panel as HTMLElement).getByText("起点与来源")).toBeInTheDocument();
    });

    await user.hover(stackButton);

    await waitFor(() => {
      expect(aboutButton).toHaveAttribute("aria-expanded", "false");
      expect(stackButton).toHaveAttribute("aria-expanded", "true");
      expect(within(panel as HTMLElement).getByText("前端系统")).toBeInTheDocument();
    });
  });

  it("直接链接和多级导航在激活与展开时应用正确的下划线状态", async () => {
    const user = userEvent.setup();

    render(
      <TopNavigationBar
        activeKey="nested"
        items={[
          { key: "direct", label: "直接", href: "/direct" },
          {
            key: "nested",
            label: "多级",
            href: "/nested",
            menu: {
              kind: "entries",
              entries: [{ title: "查看多级", href: "/nested" }],
            },
          },
        ]}
        labels={labels}
      />,
    );

    const directLink = screen.getByRole("link", { name: "直接" });
    const nestedButton = screen.getByRole("button", { name: /多级/ });

    expect(directLink).not.toHaveClass(styles.navLinkActive);
    expect(nestedButton).toHaveClass(styles.navTriggerActive);
    expect(nestedButton).not.toHaveClass(styles.navTriggerOpen);

    await user.click(nestedButton);

    await waitFor(() => {
      expect(nestedButton).toHaveAttribute("aria-expanded", "true");
      expect(nestedButton).not.toHaveClass(styles.navTriggerActive);
      expect(nestedButton).toHaveClass(styles.navTriggerOpen);
    });
  });

  it("一级导航文字使用独立高亮包装以支持贴字下划线动画", () => {
    render(
      <TopNavigationBar
        items={[
          { key: "direct", label: "直接", href: "/direct" },
          {
            key: "nested",
            label: "多级",
            href: "/nested",
            menu: {
              kind: "entries",
              entries: [{ title: "查看多级", href: "/nested" }],
            },
          },
        ]}
        labels={labels}
      />,
    );

    const directLink = screen.getByRole("link", { name: "直接" });
    const nestedButton = screen.getByRole("button", { name: /多级/ });

    const directHighlight = directLink.querySelector(`.${styles.navLabelHighlight}`);
    const nestedHighlight = nestedButton.querySelector(`.${styles.navLabelHighlight}`);

    expect(directHighlight).not.toBeNull();
    expect(directHighlight).toHaveTextContent("直接");
    expect(nestedHighlight).not.toBeNull();
    expect(nestedHighlight).toHaveTextContent("多级");
  });

  it("桌面下拉样式保留抽屉式位移开合", () => {
    const stylesheetPath = path.resolve(
      process.cwd(),
      "src/components/top-navigation-bar/TopNavigationBar.module.scss",
    );
    const stylesheet = readFileSync(stylesheetPath, "utf8");

    expect(stylesheet).toContain("transform: translateY(-100%);");
    expect(stylesheet).toContain(".desktopDropdownPanelOpen");
    expect(stylesheet).toContain("transform: translateY(0);");
  });

  it("桌面一级导航使用接近 Figma 的字号", () => {
    const stylesheetPath = path.resolve(
      process.cwd(),
      "src/components/top-navigation-bar/TopNavigationBar.module.scss",
    );
    const stylesheet = readFileSync(stylesheetPath, "utf8");

    expect(stylesheet).toContain("font-size: 16px;");
    expect(stylesheet).toContain("line-height: 25.2px;");
  });

  it("桌面一级导航保持 Figma 的 8px 热区且 hover 不变色", () => {
    const stylesheetPath = path.resolve(
      process.cwd(),
      "src/components/top-navigation-bar/TopNavigationBar.module.scss",
    );
    const stylesheet = readFileSync(stylesheetPath, "utf8");

    expect(stylesheet).toContain("padding: 6px 16px;");
    expect(stylesheet).not.toContain(
      "&:not(.navTriggerActive):not(.navTriggerOpen):hover {\n      color: var(--nav-muted);",
    );
    expect(stylesheet).not.toContain(
      "&:not(.navLinkActive):hover {\n      color: var(--nav-muted);",
    );
  });

  it("桌面导航的 hover 自动切换能力由组件内部变量控制，箭头尺寸与间距对齐 Figma", () => {
    const stylesheetPath = path.resolve(
      process.cwd(),
      "src/components/top-navigation-bar/TopNavigationBar.module.scss",
    );
    const componentPath = path.resolve(
      process.cwd(),
      "src/components/top-navigation-bar/TopNavigationBar.tsx",
    );
    const stylesheet = readFileSync(stylesheetPath, "utf8");
    const componentSource = readFileSync(componentPath, "utf8");

    expect(componentSource).toContain("const ENABLE_HOVER_SWITCH_AFTER_OPEN = true;");
    expect(stylesheet).toContain("gap: 6px;");
    expect(stylesheet).toContain("width: 20px;");
    expect(stylesheet).toContain("height: 20px;");
  });

  it("桌面导航箭头使用新的 Figma 风格 SVG 路径", () => {
    const componentPath = path.resolve(
      process.cwd(),
      "src/components/top-navigation-bar/TopNavigationBar.tsx",
    );
    const componentSource = readFileSync(componentPath, "utf8");

    expect(componentSource).toContain('viewBox="0 0 24 24"');
    expect(componentSource).toContain('d="m19.75 8.75-7.25 7-7.25-7"');
    expect(componentSource).not.toContain('stroke="#000"');
  });

  it("桌面抽屉使用 Figma 采样得到的约 0.4s 时长与自定义缓动", () => {
    const stylesheetPath = path.resolve(
      process.cwd(),
      "src/components/top-navigation-bar/TopNavigationBar.module.scss",
    );
    const componentPath = path.resolve(
      process.cwd(),
      "src/components/top-navigation-bar/TopNavigationBar.tsx",
    );
    const stylesheet = readFileSync(stylesheetPath, "utf8");
    const componentSource = readFileSync(componentPath, "utf8");

    expect(stylesheet).toContain("--nav-drawer-duration: 0.4s;");
    expect(stylesheet).toContain("--nav-drawer-ease:");
    expect(stylesheet).toContain("linear(");
    expect(componentSource).toContain("transitionConfig");
    expect(componentSource).toContain("--nav-drawer-duration");
    expect(componentSource).toContain("--nav-drawer-ease");
  });

  it("桌面展开菜单使用更接近 Figma 的内容密度与遮罩层", () => {
    const stylesheetPath = path.resolve(
      process.cwd(),
      "src/components/top-navigation-bar/TopNavigationBar.module.scss",
    );
    const stylesheet = readFileSync(stylesheetPath, "utf8");

    expect(stylesheet).toContain("padding: 40px 0;");
    expect(stylesheet).toContain("gap: 24px 32px;");
    expect(stylesheet).toContain("font-size: 20px;");
    expect(stylesheet).toContain("line-height: 1.2;");
    expect(stylesheet).toContain("font-size: 14px;");
    expect(stylesheet).toContain("line-height: 1.5;");
    expect(stylesheet).toContain("background: rgb(0 0 0 / 25%);");
  });

  it("支持展开自定义 component 菜单内容", async () => {
    const user = userEvent.setup();

    render(
      <TopNavigationBar
        items={[
          {
            key: "journey",
            label: "旅程",
            href: "/journey",
            menu: {
              kind: "component",
              component: () => <div>这里是自定义旅程菜单</div>,
            },
          },
        ]}
        labels={labels}
      />,
    );

    const journeyButton = screen.getByRole("button", { name: /旅程/ });

    await user.click(journeyButton);

    await waitFor(() => {
      expect(journeyButton).toHaveAttribute("aria-expanded", "true");
      expect(screen.getAllByText("这里是自定义旅程菜单").length).toBeGreaterThan(0);
    });
  });

  it("全局样式为桌面端提供自定义箭头与 pointer 光标", () => {
    const stylesheetPath = path.resolve(process.cwd(), "src/app/globals.scss");
    const stylesheet = readFileSync(stylesheetPath, "utf8");

    expect(stylesheet).toContain("@media (hover: hover) and (pointer: fine)");
    expect(stylesheet).toContain("--cursor-default");
    expect(stylesheet).toContain("--cursor-pointer");
    expect(stylesheet).toContain("cursor: var(--cursor-default), auto;");
    expect(stylesheet).toContain("cursor: var(--cursor-pointer), pointer;");
    expect(stylesheet).toContain("width%3D%2224%22");
    expect(stylesheet).toContain("height%3D%2224%22");
  });
});
