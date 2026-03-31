import { useEffect, useState } from "react";

import { renderMarkdown } from "./renderMarkdown";

function NoteViewer({ content }: { content: string }) {
    const [htmlNote, setHtmlNote] = useState("");

    useEffect(() => {
        renderMarkdown(content).then(setHtmlNote);
    }, [content]);

    return <div className="ardoise-preview" dangerouslySetInnerHTML={{ __html: htmlNote }} />;
}

export default NoteViewer;
