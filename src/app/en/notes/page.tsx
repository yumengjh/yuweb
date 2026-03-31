import type { Metadata } from "next";

import { DocsFailurePage } from "@/features/docs/components/DocsFailurePage";
import { DocsListPage } from "@/features/docs/components/DocsListPage";
import { getDocsCopy } from "@/features/docs/lib/docs-copy";
import { getDocsListPageData } from "@/features/docs/lib/docs-page-data";
import { buildDocsMetadata } from "@/features/docs/lib/docs-metadata";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getDocsListPageData();
    const copy = getDocsCopy("en-US");
    const title = `${data.workspace?.name?.trim() || copy.unknownWorkspace} | Notes`;
    const description = data.workspace?.description?.trim() || copy.unknownWorkspaceDescription;

    return buildDocsMetadata({
      locale: "en-US",
      pathname: "/notes",
      title,
      description,
    });
  } catch {
    return buildRouteMetadata("en-US", "notes");
  }
}

export default async function EnglishNotesPage() {
  let data: Awaited<ReturnType<typeof getDocsListPageData>>;

  try {
    data = await getDocsListPageData();
  } catch (error) {
    const copy = getDocsCopy("en-US");
    return (
      <DocsFailurePage
        body={error instanceof Error ? error.message : copy.loading}
        locale="en-US"
        title={copy.listLoadFailedTitle}
      />
    );
  }

  return <DocsListPage data={data} locale="en-US" />;
}
