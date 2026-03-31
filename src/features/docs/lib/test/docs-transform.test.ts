import { describe, expect, it } from "vitest";

import { contentTreeToFlatBlocks, resolvePagination } from "@/features/docs/lib/docs-transform";

describe("docs-transform", () => {
  it("flattens content tree into markdown blocks", () => {
    expect(
      contentTreeToFlatBlocks({
        docId: "doc_1",
        tree: {
          blockId: "root",
          type: "root",
          children: [
            {
              blockId: "heading-1",
              type: "heading",
              payload: {
                text: "Heading",
                level: 2,
              },
            },
            {
              blockId: "paragraph-1",
              type: "paragraph",
              payload: {
                text: "Body paragraph",
              },
            },
          ],
        },
      }),
    ).toMatchObject([
      {
        blockId: "heading-1",
        markdown: "## Heading",
        normalized: {
          type: "heading",
          text: "Heading",
          level: 2,
        },
      },
      {
        blockId: "paragraph-1",
        markdown: "Body paragraph",
        normalized: {
          type: "paragraph",
          text: "Body paragraph",
        },
      },
    ]);
  });

  it("infers pagination state from response and current count", () => {
    expect(
      resolvePagination(
        {
          totalBlocks: 10,
          hasMore: false,
          nextStartBlockId: null,
        },
        {
          totalBlocks: undefined,
          hasMore: undefined,
          nextStartBlockId: undefined,
        },
        4,
        0,
      ),
    ).toEqual({
      totalBlocks: 10,
      responseHasMore: false,
      inferredHasMore: true,
      responseNextStartBlockId: null,
    });
  });
});
