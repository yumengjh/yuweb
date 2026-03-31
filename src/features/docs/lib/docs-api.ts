// cspell:ignore Consolas Menlo

import type {
  ApiEnvelope,
  AuthUserProfile,
  DeepPartial,
  DocumentContent,
  DocumentContentQuery,
  DocumentMeta,
  PaginatedResult,
  PreferenceSettings,
  TagMeta,
  WorkspaceMeta,
} from "@/features/docs/lib/docs-types";
import { requireDocsApiBaseUrl, requireWorkspaceId } from "@/features/docs/lib/docs-env";

type ListPublishedDocsParams = {
  workspaceId?: string;
  page?: number;
  pageSize?: number;
};

type ListWorkspaceTagsParams = {
  workspaceId?: string;
  page?: number;
  pageSize?: number;
};

type SettingsPayload = {
  settings?: DeepPartial<PreferenceSettings> | null;
};

export const DEFAULT_WORKSPACE_PREFERENCE_SETTINGS: PreferenceSettings = {
  reader: { contentWidth: 800, fontSize: 16 },
  editor: { contentWidth: 800, fontSize: 16 },
  advanced: {
    compactList: true,
    codeFontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace',
  },
};

export class DocsApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "DocsApiError";
    this.status = status;
  }
}

function normalizeMessage(message: unknown): string {
  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (Array.isArray(message)) {
    const joined = message.filter((item) => typeof item === "string").join("��");
    if (joined.trim()) {
      return joined;
    }
  }

  return "����ʧ�ܣ����Ժ�����";
}

export function unwrapApiEnvelope<T>(envelope: ApiEnvelope<T>): T {
  if (envelope?.success === true && envelope.data !== undefined) {
    return envelope.data;
  }

  throw new Error(normalizeMessage(envelope?.error?.message));
}

function joinApiPath(...segments: string[]) {
  return [requireDocsApiBaseUrl(), "api/v1", ...segments]
    .map((segment, index) => {
      const value = index === 0 ? segment.replace(/\/+$/, "") : segment.replace(/^\/+|\/+$/g, "");
      return value;
    })
    .filter(Boolean)
    .join("/");
}

function toPositiveInteger(value: unknown, fallback: number) {
  const normalized = Number(value);

  if (!Number.isFinite(normalized)) {
    return fallback;
  }

  const rounded = Math.round(normalized);
  return rounded > 0 ? rounded : fallback;
}

function clamp(value: unknown, min: number, max: number, fallback: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, Math.round(value)));
}

function extractSettings(payload: unknown): DeepPartial<PreferenceSettings> | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const root = payload as Record<string, unknown>;
  const fromSettings = root.settings;

  if (fromSettings && typeof fromSettings === "object") {
    return fromSettings as DeepPartial<PreferenceSettings>;
  }

  if ("reader" in root || "editor" in root || "advanced" in root) {
    return payload as DeepPartial<PreferenceSettings>;
  }

  return null;
}

export function resolveWorkspacePreferenceSettings(
  payload?: SettingsPayload | DeepPartial<PreferenceSettings> | null,
): PreferenceSettings {
  const source = extractSettings(payload) || {};

  return {
    reader: {
      contentWidth: clamp(
        source.reader?.contentWidth,
        680,
        1200,
        DEFAULT_WORKSPACE_PREFERENCE_SETTINGS.reader.contentWidth,
      ),
      fontSize: clamp(
        source.reader?.fontSize,
        13,
        22,
        DEFAULT_WORKSPACE_PREFERENCE_SETTINGS.reader.fontSize,
      ),
    },
    editor: {
      contentWidth: clamp(
        source.editor?.contentWidth,
        680,
        1200,
        DEFAULT_WORKSPACE_PREFERENCE_SETTINGS.editor.contentWidth,
      ),
      fontSize: clamp(
        source.editor?.fontSize,
        13,
        22,
        DEFAULT_WORKSPACE_PREFERENCE_SETTINGS.editor.fontSize,
      ),
    },
    advanced: {
      compactList:
        typeof source.advanced?.compactList === "boolean"
          ? source.advanced.compactList
          : DEFAULT_WORKSPACE_PREFERENCE_SETTINGS.advanced.compactList,
      codeFontFamily:
        typeof source.advanced?.codeFontFamily === "string" &&
        source.advanced.codeFontFamily.trim().length > 0
          ? source.advanced.codeFontFamily.trim()
          : DEFAULT_WORKSPACE_PREFERENCE_SETTINGS.advanced.codeFontFamily,
    },
  };
}

async function fetchDocsApi<T>(path: string, query?: Record<string, string | number | undefined>) {
  const url = new URL(path);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new DocsApiError(`����ʧ�ܣ�${response.status}��`, response.status);
  }

  const envelope = (await response.json()) as ApiEnvelope<T>;
  return unwrapApiEnvelope(envelope);
}

export function filterPublishedDocuments(items: DocumentMeta[]) {
  return items.filter((item) => typeof item?.publishedHead === "number" && item.publishedHead > 0);
}

export async function listPublishedDocs(params: ListPublishedDocsParams = {}) {
  const workspaceId = params.workspaceId || requireWorkspaceId();
  const page = toPositiveInteger(params.page, 1);
  const pageSize = toPositiveInteger(params.pageSize, 20);
  const data = await fetchDocsApi<PaginatedResult<DocumentMeta>>(joinApiPath("documents"), {
    workspaceId,
    page,
    pageSize,
    sortBy: "updatedAt",
    sortOrder: "DESC",
  });
  const items = filterPublishedDocuments(data.items || []);

  return {
    ...data,
    items,
    total: items.length,
    page,
    pageSize,
  };
}

export async function getDocument(docId: string) {
  return fetchDocsApi<DocumentMeta>(joinApiPath("documents", encodeURIComponent(docId)));
}

export async function getDocumentContent(docId: string, query: DocumentContentQuery = {}) {
  return fetchDocsApi<DocumentContent>(
    joinApiPath("documents", encodeURIComponent(docId), "content"),
    query as Record<string, string | number | undefined>,
  );
}

export async function listWorkspaceTags(params: ListWorkspaceTagsParams = {}) {
  const workspaceId = params.workspaceId || requireWorkspaceId();
  const page = toPositiveInteger(params.page, 1);
  const pageSize = Math.min(100, toPositiveInteger(params.pageSize, 100));

  return fetchDocsApi<PaginatedResult<TagMeta>>(joinApiPath("tags"), {
    workspaceId,
    page,
    pageSize,
  });
}

export async function getWorkspaceDetail(workspaceId = requireWorkspaceId()) {
  return fetchDocsApi<WorkspaceMeta>(joinApiPath("workspaces", encodeURIComponent(workspaceId)));
}

export async function getUserProfile(userId?: string) {
  const normalizedUserId = String(userId || "").trim();
  if (!normalizedUserId) {
    return null;
  }

  try {
    return await fetchDocsApi<AuthUserProfile>(
      joinApiPath("auth", "users", encodeURIComponent(normalizedUserId)),
    );
  } catch {
    return null;
  }
}

export async function getWorkspacePreferenceSettings(workspaceId = requireWorkspaceId()) {
  const payload = await fetchDocsApi<SettingsPayload | DeepPartial<PreferenceSettings>>(
    joinApiPath("workspaces", encodeURIComponent(workspaceId), "settings"),
  );

  return resolveWorkspacePreferenceSettings(payload);
}
