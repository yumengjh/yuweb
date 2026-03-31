type DocsEnvSource = Partial<Record<string, string | undefined>>;

export type DocsPublicEnv = {
  docsApiBaseUrl: string;
  workspaceId: string;
  showDocDebugMeta: boolean;
};

function trimEnv(value?: string) {
  return typeof value === "string" ? value.trim() : "";
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function parseDocsBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (!normalized) {
      return false;
    }

    if (["1", "true", "yes", "y", "on"].includes(normalized)) {
      return true;
    }

    if (["0", "false", "no", "n", "off"].includes(normalized)) {
      return false;
    }
  }

  return fallback;
}

export function resolveDocsPublicEnv(source: DocsEnvSource = process.env): DocsPublicEnv {
  const docsApiBaseUrl = trimTrailingSlash(
    trimEnv(source.NEXT_PUBLIC_DOCS_API_BASE_URL) || trimEnv(source.DOCS_API_BASE_URL),
  );
  const workspaceId = trimEnv(source.NEXT_PUBLIC_WORKSPACE_ID) || trimEnv(source.WORKSPACE_ID);
  const showDocDebugMeta = parseDocsBoolean(
    source.NEXT_PUBLIC_SHOW_DOC_DEBUG_META,
    trimEnv(source.NODE_ENV) !== "production",
  );

  return {
    docsApiBaseUrl,
    workspaceId,
    showDocDebugMeta,
  };
}

export function getDocsPublicEnv() {
  return resolveDocsPublicEnv(process.env);
}

export function requireDocsApiBaseUrl() {
  const { docsApiBaseUrl } = getDocsPublicEnv();

  if (!docsApiBaseUrl) {
    throw new Error("缺少 NEXT_PUBLIC_DOCS_API_BASE_URL，无法加载公开文档接口");
  }

  return docsApiBaseUrl;
}

export function requireWorkspaceId() {
  const { workspaceId } = getDocsPublicEnv();

  if (!workspaceId) {
    throw new Error("缺少 NEXT_PUBLIC_WORKSPACE_ID，无法加载工作空间文档");
  }

  return workspaceId;
}
