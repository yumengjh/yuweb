import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { render, screen } from "@/test/render";

import { TechCounter } from "@/components/tech-counter/TechCounter";

/**
 * 这个测试覆盖模板默认交互组件的最小行为。
 */
describe("TechCounter", () => {
  it("点击按钮时会递增数字", async () => {
    const user = userEvent.setup();

    render(<TechCounter />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("0");

    await user.click(button);
    expect(button).toHaveTextContent("1");

    await user.click(button);
    expect(button).toHaveTextContent("2");
  });
});
