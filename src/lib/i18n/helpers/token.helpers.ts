import zhCNMessages from "@/locales/zh-CN.json";

import type { MessageToken, TokenTree } from "../types/i18n.types";

function buildTokenTree(input: unknown, path: string[] = []): unknown {
  if (typeof input === "string") {
    return path.join(".") as MessageToken;
  }

  if (Array.isArray(input)) {
    return path.join(".") as MessageToken;
  }

  if (input == null || typeof input !== "object") {
    throw new Error(`Unsupported i18n schema at ${path.join(".") || "<root>"}`);
  }

  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, buildTokenTree(value, [...path, key])]),
  );
}

export function getMessageToken(path: string): MessageToken {
  return path as MessageToken;
}

export const keys = buildTokenTree(zhCNMessages) as TokenTree<typeof zhCNMessages>;
