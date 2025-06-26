import { join } from "node:path";

import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import rehypeExternalLinks from "rehype-external-links";
import toHtml from "rehype-stringify";
import fromMarkdown from "remark-parse";
import toHast from "remark-rehype";
import { read } from "to-vfile";
import { unified } from "unified";

import { MainContent } from "@/components/ui/main-content";

const processor = unified()
	.use(fromMarkdown)
	.use(toHast)
	.use(rehypeExternalLinks, { target: "_blank" })
	.use(toHtml);

interface StaticPageProps {
	params: Promise<{
		segments: Array<string>;
	}>;
}

/**
 * Only a root `not-found.tsx` automatically handles unmatched URLs.
 * Since we want localised 404 pages, we need this manual trigger in a catch-all route.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */
export default async function StaticPage(props: Readonly<StaticPageProps>): Promise<ReactNode> {
	const { segments } = await props.params;
	try {
		// TODO add support for locales
		const filePath = join(process.cwd(), "content", `${segments.join("/")}.md`);

		const vfile = await read(filePath);
		const result = await processor.process(vfile);
		return (
			<MainContent className="m-auto w-2xl">
				<section dangerouslySetInnerHTML={{ __html: String(result) }} className="prose" />
			</MainContent>
		);
		/* eslint-disable @typescript-eslint/no-unused-vars */
	} catch (error) {
		notFound();
	}
}
