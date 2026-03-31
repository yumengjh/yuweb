import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocDetailClient } from "@/features/docs/components/DocDetailClient";
import { DocsFailurePage } from "@/features/docs/components/DocsFailurePage";
import { getDocsCopy } from "@/features/docs/lib/docs-copy";
import { DocsApiError } from "@/features/docs/lib/docs-api";
import { getDocsDetailPageData } from "@/features/docs/lib/docs-page-data";
import { buildDocsMetadata } from "@/features/docs/lib/docs-metadata";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ docId: string }>;
}): Promise<Metadata> {
  const { docId } = await params;

  try {
    const data = await getDocsDetailPageData(docId);
    const copy = getDocsCopy("en-US");
    const title = `${data.pageData.meta.title || copy.untitledDocument} | Notes`;
    const description = data.pageData.meta.title || copy.unknownWorkspaceDescription;

    return buildDocsMetadata({
      locale: "en-US",
      pathname: `/notes/${docId}`,
      title,
      description,
    });
  } catch {
    return buildRouteMetadata("en-US", "notes");
  }
}

export default async function EnglishNoteDetailPage({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const { docId } = await params;
  let data: Awaited<ReturnType<typeof getDocsDetailPageData>>;

  try {
    data = await getDocsDetailPageData(docId);
  } catch (error) {
    if (error instanceof DocsApiError && (error.status === 404 || error.status === 400)) {
      notFound();
    }

    const copy = getDocsCopy("en-US");

    return (
      <DocsFailurePage
        body={error instanceof Error ? error.message : copy.loading}
        locale="en-US"
        title={copy.detailLoadFailedTitle}
      />
    );
  }

  return (
    <DocDetailClient
      docsApiBaseUrl={data.docsApiBaseUrl}
      locale="en-US"
      pageData={data.pageData}
      settings={data.settings}
      showDocDebugMeta={data.showDocDebugMeta}
      tagMap={data.tagMap}
    />
  );
}
