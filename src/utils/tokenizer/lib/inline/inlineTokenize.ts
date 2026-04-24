import { InlineTokenizer } from "./InlineTokenizer";

export function inlineTokenize(html: string): string {
    return new InlineTokenizer(html)
        .applyBoldItalic()
        .applyBold()
        .applyItalic()
        .applyStrikethrough()
        .applyLink()
        .toString();
}
