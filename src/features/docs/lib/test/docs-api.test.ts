import { describe, expect, it } from "vitest";

import {
  filterPublishedDocuments,
  resolveWorkspacePreferenceSettings,
  unwrapApiEnvelope,
} from "@/features/docs/lib/docs-api";

describe("docs-api helpers", () => {
  it("unwraps successful envelope payload", () => {
    expect(unwrapApiEnvelope({ success: true, data: { ok: true } })).toEqual({ ok: true });
  });

  it("throws a normalized message for invalid envelope", () => {
    expect(() =>
      unwrapApiEnvelope({
        success: false,
        error: {
          message: ["bad", "request"],
        },
      }),
    ).toThrow("bad；request");
  });

  it("filters documents to published items only", () => {
    expect(
      filterPublishedDocuments([
        { docId: "1", publishedHead: 3 },
        { docId: "2", publishedHead: 0 },
        { docId: "3", publishedHead: null },
        { docId: "4", publishedHead: 1 },
      ]),
    ).toEqual([
      { docId: "1", publishedHead: 3 },
      { docId: "4", publishedHead: 1 },
    ]);
  });

  it("normalizes workspace reader settings with sane defaults", () => {
    expect(
      resolveWorkspacePreferenceSettings({
        settings: {
          reader: {
            contentWidth: 12000,
            fontSize: 99,
          },
          advanced: {
            compactList: false,
            codeFontFamily: "JetBrains Mono",
          },
        },
      }),
    ).toEqual({
      reader: {
        contentWidth: 1200,
        fontSize: 22,
      },
      editor: {
        contentWidth: 800,
        fontSize: 16,
      },
      advanced: {
        compactList: false,
        codeFontFamily: "JetBrains Mono",
      },
    });
  });
});
