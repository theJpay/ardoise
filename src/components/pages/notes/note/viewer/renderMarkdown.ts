import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export async function renderMarkdown(content: string) {
    const html = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeHighlight)
        .use(rehypeSanitize, { ...buildSchema() })
        .use(rehypeStringify)
        .process(content);

    return html.toString();
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
