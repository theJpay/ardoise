import { BLOCK_SYNTAXES, TOOLBAR_ACTIONS } from "./actions";

export function tokenize(content: string): string {
    return content.split("\n").map(tokenizeLine).join("\n");
}

const HEADING_CONTENT_CLASS: Record<string, string> = {
    "heading-1": "ed-heading",
    "heading-2": "ed-heading",
    "heading-3": "ed-heading"
};

function tokenizeLine(line: string): string {
    const matchedSyntax = BLOCK_SYNTAXES.find((s) => line.startsWith(s));

    if (matchedSyntax) {
        const action = TOOLBAR_ACTIONS.find((a) => a.syntax === matchedSyntax);
        if (!action) {
            return tokenizeInline(escapeHtml(line));
        }

        const content = line.slice(matchedSyntax.length);
        const contentClass = HEADING_CONTENT_CLASS[action.name];

        if (contentClass) {
            return (
                `<span class="ed-token-dim">${escapeHtml(matchedSyntax)}</span>` +
                `<span class="${contentClass}">${escapeHtml(content)}</span>`
            );
        }

        if (action.name === "quote") {
            return (
                `<span class="ed-token-muted">${escapeHtml(matchedSyntax)}</span>` +
                `<span class="ed-quote">${escapeHtml(content)}</span>`
            );
        }
    }

    if (/^```/.test(line)) {
        return `<span class="ed-code-fence">${escapeHtml(line)}</span>`;
    }

    return tokenizeInline(escapeHtml(line));
}

function tokenizeInline(html: string): string {
    return (
        html
            // Bold **text**
            .replace(
                /\*\*(.+?)\*\*/g,
                '<span class="ed-token-muted">**</span><span class="ed-bold">$1</span><span class="ed-token-muted">**</span>'
            )
            // Italic *text*
            .replace(
                /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g,
                '<span class="ed-token-muted">*</span><span class="ed-italic">$1</span><span class="ed-token-muted">*</span>'
            )
            // Inline code `text`
            .replace(/`(.+?)`/g, '<span class="ed-code">`$1`</span>')
    );
}

function escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
