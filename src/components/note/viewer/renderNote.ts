import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import type { Note } from "@entities";

export async function renderNote(note: Note) {
    const html = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeHighlight)
        .use(rehypeSanitize, { ...buildSchema() })
        .use(rehypeStringify)
        .process(getNote());

    return html.toString();

    function getNote() {
        return `# ${note.title}\n${note.content}`;
    }
}

function buildSchema(): typeof defaultSchema {
    return {
        ...defaultSchema,
        attributes: {
            ...defaultSchema.attributes,
            span: [...(defaultSchema.attributes?.span || []), ["className", /^hljs-./]]
        },
        tagNames: [...(defaultSchema.tagNames || []), "span"]
    };
}
