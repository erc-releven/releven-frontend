import type { Root } from "mdast";
import { toc } from "mdast-util-toc";
import type { Plugin } from "unified";

/**
 * A remark plugin that finds a specific heading (e.g., `## TOC`) and replaces it
 * with a table of contents generated from the headings that follow it.
 */
export const remarkToc: Plugin<[], Root> = () => {
	return (tree) => {
		// Find the index of the "## TOC" heading node.
		const tocNodeIndex = tree.children.findIndex((node) => {
			return (
				node.type === "heading" &&
				node.depth === 2 &&
				node.children[0]?.type === "text" &&
				node.children[0].value.toLocaleUpperCase() === "TOC"
			);
		});

		// If no `## TOC` node is found, do nothing.
		if (tocNodeIndex === -1) {
			return;
		}

		// Generate the table of contents from the subsequent content.
		const tocResult = toc(tree, { heading: "TOC", tight: true, maxDepth: 2 });

		// If a table of contents was generated (i.e., there were headings),
		// replace the `## TOC` node with the generated list.
		if (tocResult.map) {
			tree.children.splice(tocNodeIndex, 1, tocResult.map);
		} else {
			// Otherwise, if no headings were found after `## TOC`, just remove the placeholder.
			tree.children.splice(tocNodeIndex, 1);
		}
	};
};
