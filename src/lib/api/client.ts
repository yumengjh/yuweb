const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID ?? "";
const API_USERNAME = process.env.NEXT_PUBLIC_API_USERNAME ?? "";
const API_PASSWORD = process.env.NEXT_PUBLIC_API_PASSWORD ?? "";

interface TokenCache {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

async function apiLogin(): Promise<TokenCache> {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      emailOrUsername: API_USERNAME,
      password: API_PASSWORD,
    }),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(`Login failed: ${json.error?.message ?? "unknown"}`);
  }

  const cache: TokenCache = {
    accessToken: json.data.accessToken,
    refreshToken: json.data.refreshToken,
    expiresAt: Date.now() + 23 * 60 * 60 * 1000,
  };
  tokenCache = cache;
  return cache;
}

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }
  const cache = await apiLogin();
  return cache.accessToken;
}

async function apiRefresh(): Promise<void> {
  if (!tokenCache) {
    await apiLogin();
    return;
  }

  const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: tokenCache.refreshToken }),
  });

  const json = await res.json();
  if (json.success) {
    tokenCache = {
      accessToken: json.data.accessToken,
      refreshToken: json.data.refreshToken,
      expiresAt: Date.now() + 23 * 60 * 60 * 1000,
    };
  } else {
    await apiLogin();
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = await getAccessToken();

  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    await apiRefresh();
    const retryToken = await getAccessToken();
    const retryRes = await fetch(`${API_BASE}/api/v1${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${retryToken}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    const retryJson = await retryRes.json();
    if (!retryJson.success) {
      throw new Error(retryJson.error?.message ?? "API request failed");
    }
    return retryJson.data as T;
  }

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error?.message ?? "API request failed");
  }
  return json.data as T;
}

// ── Types ──

export interface ApiDocument {
  docId: string;
  workspaceId: string;
  title: string;
  icon: string;
  status: string;
  visibility: string;
  publishedHead: number;
  parentId: string | null;
  sortOrder: number;
  tags: string[];
  category: string;
  viewCount: number;
  favoriteCount: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiBlockNode {
  blockId: string;
  type: string;
  payload: Record<string, unknown>;
  parentId: string;
  sortKey: string;
  indent: number;
  collapsed: boolean;
  children: ApiBlockNode[];
}

export interface ApiContentResponse {
  docId: string;
  docVer: number;
  title: string;
  tree: ApiBlockNode;
  pagination: {
    totalBlocks: number;
    returnedBlocks: number;
    hasMore: boolean;
    nextStartBlockId: string | null;
  };
}

export interface ApiDocListResponse {
  items: ApiDocument[];
  total: number;
  page: number;
  pageSize: number;
}

// ── Document APIs ──

export async function fetchDocuments(
  workspaceId?: string
): Promise<ApiDocListResponse> {
  const wsId = workspaceId || WORKSPACE_ID;
  return apiFetch<ApiDocListResponse>(
    `/documents?workspaceId=${encodeURIComponent(wsId)}&sortBy=updatedAt&sortOrder=DESC&pageSize=100`
  );
}

export async function fetchDocument(docId: string): Promise<ApiDocument> {
  return apiFetch<ApiDocument>(`/documents/${encodeURIComponent(docId)}`);
}

export async function fetchDocumentContent(
  docId: string
): Promise<ApiContentResponse> {
  return apiFetch<ApiContentResponse>(
    `/documents/${encodeURIComponent(docId)}/content?limit=10000`
  );
}
