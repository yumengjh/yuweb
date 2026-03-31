import { cache } from "react";

import {
  DEFAULT_WORKSPACE_PREFERENCE_SETTINGS,
  DocsApiError,
  getDocument,
  getDocumentContent,
  getUserProfile,
  getWorkspaceDetail,
  getWorkspacePreferenceSettings,
  listPublishedDocs,
  listWorkspaceTags,
} from "@/features/docs/lib/docs-api";
import { getDocsPublicEnv, requireWorkspaceId } from "@/features/docs/lib/docs-env";
import { DOC_READER_SSR_LIMIT } from "@/features/docs/lib/docs-reader";
import {
  contentTreeToFlatBlocks,
  resolvePagination,
  toRenderBlocks,
} from "@/features/docs/lib/docs-transform";
import type {
  PreferenceSettings,
  PublishedDocPageData,
  TagMeta,
  WorkspaceMeta,
} from "@/features/docs/lib/docs-types";
import { createTagMap } from "@/features/docs/lib/docs-view";

export type DocsListPageData = {
  docs: Awaited<ReturnType<typeof listPublishedDocs>>["items"];
  docsError: Error | null;
  workspace: WorkspaceMeta | null;
  workspaceError: Error | null;
  ownerProfile: Awaited<ReturnType<typeof getUserProfile>>;
  tags: TagMeta[];
  tagMap: Record<string, TagMeta>;
  settings: PreferenceSettings;
  workspaceId: string;
  showDocDebugMeta: boolean;
};

export type DocsDetailPageData = {
  pageData: PublishedDocPageData;
  tags: TagMeta[];
  tagMap: Record<string, TagMeta>;
  settings: PreferenceSettings;
  showDocDebugMeta: boolean;
  docsApiBaseUrl: string;
};

export const getDocsListPageData = cache(async (): Promise<DocsListPageData> => {
  const env = getDocsPublicEnv();
  const workspaceId = requireWorkspaceId();

  const [docsResult, workspaceResult, tagsResult, settingsResult] = await Promise.allSettled([
    listPublishedDocs({ workspaceId, page: 1, pageSize: 50 }),
    getWorkspaceDetail(workspaceId),
    listWorkspaceTags({ workspaceId, page: 1, pageSize: 100 }),
    getWorkspacePreferenceSettings(workspaceId),
  ]);

  const workspace = workspaceResult.status === "fulfilled" ? workspaceResult.value : null;
  const ownerProfile =
    workspace?.ownerId && workspace.ownerId.trim()
      ? await getUserProfile(workspace.ownerId.trim())
      : null;
  const tags = tagsResult.status === "fulfilled" ? tagsResult.value.items || [] : [];

  return {
    docs: docsResult.status === "fulfilled" ? docsResult.value.items || [] : [],
    docsError: docsResult.status === "rejected" ? toError(docsResult.reason) : null,
    workspace,
    workspaceError: workspaceResult.status === "rejected" ? toError(workspaceResult.reason) : null,
    ownerProfile,
    tags,
    tagMap: createTagMap(tags),
    settings:
      settingsResult.status === "fulfilled"
        ? settingsResult.value
        : DEFAULT_WORKSPACE_PREFERENCE_SETTINGS,
    workspaceId,
    showDocDebugMeta: env.showDocDebugMeta,
  };
});

export const getDocsDetailPageData = cache(async (docId: string): Promise<DocsDetailPageData> => {
  const env = getDocsPublicEnv();
  const normalizedDocId = String(docId || "").trim();
  if (!normalizedDocId) {
    throw new DocsApiError("缺少 docId", 400);
  }

  const meta = await getDocument(normalizedDocId);
  const publishedHead = typeof meta.publishedHead === "number" ? meta.publishedHead : 0;
  if (publishedHead <= 0) {
    throw new DocsApiError("当前文档尚未发布", 404);
  }

  const workspaceId = meta.workspaceId?.trim() || requireWorkspaceId();
  const [content, authorProfile, tagsResult, settingsResult] = await Promise.all([
    getDocumentContent(normalizedDocId, {
      version: publishedHead,
      limit: DOC_READER_SSR_LIMIT,
    }),
    getUserProfile(meta.createdBy),
    listWorkspaceTags({ workspaceId, page: 1, pageSize: 100 }).catch(() => ({
      items: [] as TagMeta[],
    })),
    getWorkspacePreferenceSettings(workspaceId).catch(() => DEFAULT_WORKSPACE_PREFERENCE_SETTINGS),
  ]);

  const initialItems = toRenderBlocks(contentTreeToFlatBlocks(content));
  const initialCount = initialItems.length;
  const pagination = resolvePagination(
    content.pagination,
    {
      totalBlocks: content.totalBlocks,
      hasMore: content.hasMore,
      nextStartBlockId: content.nextStartBlockId,
    },
    initialCount,
    0,
  );
  const fallbackNext =
    initialItems.length > 0 ? initialItems[initialItems.length - 1]?.blockId : null;
  const nextStartBlockId =
    pagination.responseNextStartBlockId ||
    (pagination.responseHasMore || pagination.inferredHasMore ? fallbackNext : null);
  const hasMore = Boolean(
    (pagination.responseHasMore || pagination.inferredHasMore) && nextStartBlockId,
  );
  const tags = tagsResult.items || [];

  return {
    pageData: {
      meta: {
        ...meta,
        authorDisplayName:
          authorProfile?.displayName ||
          meta.authorDisplayName ||
          meta.displayName ||
          meta.createdByDisplayName ||
          meta.authorName ||
          meta.createdByName,
        authorUsername: authorProfile?.username || meta.authorUsername,
      },
      publishedHead,
      initialState: {
        items: initialItems,
        totalBlocks: pagination.totalBlocks,
        returnedBlocks: initialCount,
        hasMore,
        nextStartBlockId: nextStartBlockId || null,
      },
    },
    tags,
    tagMap: createTagMap(tags),
    settings: settingsResult,
    showDocDebugMeta: env.showDocDebugMeta,
    docsApiBaseUrl: env.docsApiBaseUrl,
  };
});

function toError(error: unknown) {
  return error instanceof Error ? error : new Error("请求失败，请稍后重试");
}
