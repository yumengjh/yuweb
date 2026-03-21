import { describe, expect, it } from "vitest";

import {
  CHANGELOG_HEADER,
  formatChangelogItem,
  parseCommitMessage,
  upsertChangelog,
} from "./changelog.mjs";

describe("changelog utils", () => {
  it("可以解析最小提交信息", () => {
    expect(parseCommitMessage("✨ feat(config): 完善工程配置")).toEqual({
      type: "feat",
      scope: "config",
      subject: "完善工程配置",
      body: "",
      footer: "",
    });
  });

  it("可以格式化带 body 和 footer 的变更项", () => {
    const item = formatChangelogItem({
      type: "docs",
      scope: "manual",
      subject: "补充使用说明",
      body: "新增一节提交流程说明",
      footer: "Refs: #12",
    });

    expect(item).toContain("- docs(manual): 补充使用说明");
    expect(item).toContain("  新增一节提交流程说明");
    expect(item).toContain("  附加说明：");
    expect(item).toContain("  - Refs: #12");
  });

  it("同一天会写入同一日期分组顶部", () => {
    const content = `${CHANGELOG_HEADER.trim()}

## 2026-03-11

- feat(config): 旧记录`;

    const nextContent = upsertChangelog(content, "2026-03-11", "- fix(app): 新记录");

    expect(nextContent).toContain(`## 2026-03-11\n\n- fix(app): 新记录\n\n- feat(config): 旧记录`);
  });

  it("新日期会插入到顶部", () => {
    const content = `${CHANGELOG_HEADER.trim()}

## 2026-03-10

- feat(config): 旧记录`;

    const nextContent = upsertChangelog(content, "2026-03-11", "- chore(root): 新的一天");

    expect(nextContent).toContain("## 2026-03-11");
    expect(nextContent.indexOf("## 2026-03-11")).toBeLessThan(nextContent.indexOf("## 2026-03-10"));
  });
});
