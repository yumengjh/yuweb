const CHANGELOG_HEADER = `# 变更记录

> 这是模板开发过程中的人工变更记录，用于沉淀开发过程中的重要变更，不等同于自动发布日志。
`;

const HEADER_PATTERN =
  /^(?:\p{Extended_Pictographic}\s+)?(?<type>\w+)(?:\((?<scope>[\w\-./]+)\))?:\s(?<subject>.+)$/u;
const FOOTER_LINE_PATTERN = /^(BREAKING CHANGE|[A-Za-z-]+):\s?.+/;

function normalizeText(text) {
  return text.replace(/\r\n/g, "\n").trim();
}

function splitSections(text) {
  if (!text.trim()) {
    return [];
  }

  return text
    .split(/\n{2,}/)
    .map((section) => section.trim())
    .filter(Boolean);
}

function isFooterSection(section) {
  const lines = section
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length > 0 && lines.every((line) => FOOTER_LINE_PATTERN.test(line));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parseCommitMessage(message) {
  const normalized = normalizeText(message);

  if (!normalized) {
    throw new Error("提交信息不能为空。");
  }

  const [header, ...restLines] = normalized.split("\n");
  const headerMatch = header.match(HEADER_PATTERN);

  if (!headerMatch?.groups) {
    throw new Error("提交信息格式不符合约定，无法写入 CHANGELOG.md。");
  }

  const remainder = restLines.join("\n").trim();
  const sections = splitSections(remainder);

  let body = "";
  let footer = "";

  if (sections.length === 1) {
    if (isFooterSection(sections[0])) {
      footer = sections[0];
    } else {
      body = sections[0];
    }
  } else if (sections.length > 1) {
    const footerStartIndex = sections.findIndex((section) => isFooterSection(section));

    if (footerStartIndex === -1) {
      body = sections.join("\n\n");
    } else {
      body = sections.slice(0, footerStartIndex).join("\n\n");
      footer = sections.slice(footerStartIndex).join("\n\n");
    }
  }

  return {
    type: headerMatch.groups.type,
    scope: headerMatch.groups.scope ?? "",
    subject: headerMatch.groups.subject.trim(),
    body,
    footer,
  };
}

export function formatChangelogItem(commit) {
  const scopeText = commit.scope ? `(${commit.scope})` : "";
  const lines = [`- ${commit.type}${scopeText}: ${commit.subject}`];

  if (commit.body) {
    lines.push("", ...commit.body.split("\n").map((line) => `  ${line}`));
  }

  if (commit.footer) {
    lines.push("", "  附加说明：", ...commit.footer.split("\n").map((line) => `  - ${line}`));
  }

  return lines.join("\n");
}

export function upsertChangelog(content, date, item) {
  const normalizedContent = (content || "").replace(/\r\n/g, "\n").trim();
  const baseContent = normalizedContent || CHANGELOG_HEADER.trim();
  const dateHeading = `## ${date}`;
  const datePattern = new RegExp(`^${escapeRegExp(dateHeading)}$`, "m");

  if (datePattern.test(baseContent)) {
    return baseContent.replace(datePattern, `${dateHeading}\n\n${item}`);
  }

  const headerText = CHANGELOG_HEADER.trim();
  const restContent = baseContent.startsWith(headerText)
    ? baseContent.slice(headerText.length).trim()
    : baseContent.replace(headerText, "").trim();

  const sections = [headerText, "", dateHeading, "", item];

  if (restContent) {
    sections.push("", restContent);
  }

  return sections.join("\n");
}

export function getTodayString(date = new Date()) {
  return [
    date.getFullYear(),
    `${date.getMonth() + 1}`.padStart(2, "0"),
    `${date.getDate()}`.padStart(2, "0"),
  ].join("-");
}

export { CHANGELOG_HEADER };
