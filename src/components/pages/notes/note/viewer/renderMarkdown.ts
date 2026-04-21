import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import { highlightToHast, isRegistered } from "@utils/lowlight";

import type { Element, ElementContent, Root } from "hast";

export async function renderMarkdown(content: string) {
    const html = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeLowlight)
        .use(rehypeSanitize, { ...buildSchema() })
        .use(rehypeStringify)
        .process(content);

    return html.toString();
}

function rehypeLowlight() {
    return (tree: Root) => {
        visit(tree, "element", (node, _index, parent) => {
            if (node.tagName !== "code") {
                return;
            }
            if (!parent || parent.type !== "element" || parent.tagName !== "pre") {
                return;
            }
            const lang = extractLanguage(node);
            if (!lang || !isRegistered(lang)) {
                return;
            }
            const code = node.children
                .filter((child) => child.type === "text")
                .map((child) => child.value)
                .join("");
            const result = highlightToHast(lang, code);
            node.children = result.children as ElementContent[];
            const className = (node.properties.className as string[] | undefined) ?? [];
            node.properties.className = ["hljs", ...className];
        });
    };
}

function extractLanguage(node: Element): string | null {
    const className = node.properties.className;
    if (!Array.isArray(className)) {
        return null;
    }
    for (const value of className) {
        if (typeof value === "string" && value.startsWith("language-")) {
            return value.slice("language-".length);
        }
    }
    return null;
}

function buildSchema(): typeof defaultSchema {
    return {
        ...defaultSchema,
        attributes: {
            ...defaultSchema.attributes,
            span: [...(defaultSchema.attributes?.span || []), ["className", /^hljs-/]]
        },
        tagNames: [...(defaultSchema.tagNames || []), "span"]
    };
}
