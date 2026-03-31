import { describe, expect, it } from "vitest";

import { parseDocsBoolean, resolveDocsPublicEnv } from "@/features/docs/lib/docs-env";

describe("docs-env", () => {
  it("parses truthy and falsy debug flags", () => {
    expect(parseDocsBoolean(true, false)).toBe(true);
    expect(parseDocsBoolean("true", false)).toBe(true);
    expect(parseDocsBoolean("1", false)).toBe(true);
    expect(parseDocsBoolean("false", true)).toBe(false);
    expect(parseDocsBoolean("", true)).toBe(false);
    expect(parseDocsBoolean(undefined, true)).toBe(true);
  });

  it("resolves docs env from NEXT_PUBLIC variables", () => {
    expect(
      resolveDocsPublicEnv({
        NEXT_PUBLIC_DOCS_API_BASE_URL: "https://docs.example.com/",
        NEXT_PUBLIC_WORKSPACE_ID: "ws_001",
        NEXT_PUBLIC_SHOW_DOC_DEBUG_META: "true",
        NODE_ENV: "production",
      }),
    ).toEqual({
      docsApiBaseUrl: "https://docs.example.com",
      workspaceId: "ws_001",
      showDocDebugMeta: true,
    });
  });

  it("falls back to non-public server env values and development debug default", () => {
    expect(
      resolveDocsPublicEnv({
        DOCS_API_BASE_URL: "http://127.0.0.1:5200/",
        WORKSPACE_ID: "workspace-dev",
        NODE_ENV: "development",
      }),
    ).toEqual({
      docsApiBaseUrl: "http://127.0.0.1:5200",
      workspaceId: "workspace-dev",
      showDocDebugMeta: true,
    });
  });
});
