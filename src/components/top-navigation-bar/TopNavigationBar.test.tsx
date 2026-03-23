import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, fireEvent, render, screen, waitFor, within } from "@/test/render";

import { TopNavigationBar } from "./TopNavigationBar";
import styles from "./TopNavigationBar.module.scss";

afterEach(() => {
  cleanup();
});

describe("TopNavigationBar", () => {
  it("桌面端点击导航项时会展开、切换菜单并支持点击外部收起", async () => {
    const user = userEvent.setup();

    render(<TopNavigationBar activeKey="about" />);

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
      expect(within(panel as HTMLElement).getByText("起源")).toBeInTheDocument();
    });

    await user.click(stackButton);

    await waitFor(() => {
      expect(aboutButton).toHaveAttribute("aria-expanded", "false");
      expect(stackButton).toHaveAttribute("aria-expanded", "true");
      expect(within(panel as HTMLElement).getByText("前端基础")).toBeInTheDocument();
    });

    await user.click(document.body);

    expect(stackButton).toHaveAttribute("aria-expanded", "false");
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("桌面端菜单展开后，向下滚轮会触发和手动点击一致的收起逻辑", async () => {
    const user = userEvent.setup();

    render(<TopNavigationBar />);

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
});
