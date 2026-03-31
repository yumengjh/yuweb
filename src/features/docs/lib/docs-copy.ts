import type { SiteLocale } from "@/lib/i18n";

type DocsCopy = {
  loading: string;
  loadingMore: string;
  continueToLoad: string;
  retryLoadMore: string;
  emptyTitle: string;
  emptyDocs: string;
  emptyContent: string;
  listLoadFailedTitle: string;
  detailLoadFailedTitle: string;
  workspaceLoadFailedTitle: string;
  workspaceOwnerLabel: string;
  refreshList: string;
  unknownWorkspace: string;
  unknownWorkspaceDescription: string;
  unknownUser: string;
  loadingLabel: string;
  authorLabel: string;
  timeLabel: string;
  readTimeLabel: string;
  loadedBlocksLabel: string;
  remainingBlocksLabel: string;
  versionLabel: string;
  hasMoreLabel: string;
  renderedBlocksLabel: string;
  updatedAtLabel: string;
  docIdLabel: string;
  publishedVersionLabel: string;
  minuteUnit: string;
  yes: string;
  no: string;
  untitledDocument: string;
  unknownTime: string;
};

const zhCN: DocsCopy = {
  loading: "正在加载文档…",
  loadingMore: "正在加载更多内容…",
  continueToLoad: "继续下滑以加载更多内容",
  retryLoadMore: "重试加载",
  emptyTitle: "这里还没有内容",
  emptyDocs: "当前工作空间暂无已发布文档",
  emptyContent: "暂无已发布内容",
  listLoadFailedTitle: "文档列表加载失败",
  detailLoadFailedTitle: "文档加载失败",
  workspaceLoadFailedTitle: "工作空间信息加载失败",
  workspaceOwnerLabel: "所有者",
  refreshList: "刷新列表",
  unknownWorkspace: "未配置工作空间",
  unknownWorkspaceDescription: "暂无工作空间描述",
  unknownUser: "未知用户",
  loadingLabel: "加载中…",
  authorLabel: "作者",
  timeLabel: "时间",
  readTimeLabel: "预计阅读",
  loadedBlocksLabel: "已加载",
  remainingBlocksLabel: "剩余",
  versionLabel: "状态：已发布",
  hasMoreLabel: "未加载完",
  renderedBlocksLabel: "渲染中",
  updatedAtLabel: "更新于",
  docIdLabel: "文档 ID",
  publishedVersionLabel: "已发布版本",
  minuteUnit: "分钟",
  yes: "是",
  no: "否",
  untitledDocument: "未命名文档",
  unknownTime: "时间未知",
};

const enUS: DocsCopy = {
  loading: "Loading documents…",
  loadingMore: "Loading more content…",
  continueToLoad: "Scroll down to load more content",
  retryLoadMore: "Retry",
  emptyTitle: "Nothing here yet",
  emptyDocs: "No published documents are available in this workspace yet.",
  emptyContent: "No published content yet.",
  listLoadFailedTitle: "Failed to load document list",
  detailLoadFailedTitle: "Failed to load document",
  workspaceLoadFailedTitle: "Failed to load workspace information",
  workspaceOwnerLabel: "Owner",
  refreshList: "Refresh",
  unknownWorkspace: "Workspace not configured",
  unknownWorkspaceDescription: "No workspace description yet.",
  unknownUser: "Unknown user",
  loadingLabel: "Loading…",
  authorLabel: "Author",
  timeLabel: "Time",
  readTimeLabel: "Read time",
  loadedBlocksLabel: "Loaded",
  remainingBlocksLabel: "Remaining",
  versionLabel: "Status: published",
  hasMoreLabel: "Has more",
  renderedBlocksLabel: "Rendering",
  updatedAtLabel: "Updated",
  docIdLabel: "Document ID",
  publishedVersionLabel: "Published version",
  minuteUnit: "min",
  yes: "Yes",
  no: "No",
  untitledDocument: "Untitled document",
  unknownTime: "Unknown time",
};

export function getDocsCopy(locale: SiteLocale): DocsCopy {
  return locale === "en-US" ? enUS : zhCN;
}
