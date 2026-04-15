import { useEffect, useState } from "react";

import PreviewError from "./PreviewError";
import { renderMarkdown } from "./renderMarkdown";

type NoteViewerProps = {
    content: string;
    onSwitchToWrite: () => void;
};

function NoteViewer({ content, onSwitchToWrite }: NoteViewerProps) {
    const [htmlNote, setHtmlNote] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        renderMarkdown(content)
            .then((html) => {
                setHtmlNote(html);
                setError(false);
            })
            .catch(() => {
                setError(true);
            });
    }, [content]);

    return (
        <>
            {error && <PreviewError onSwitchToWrite={onSwitchToWrite} />}
            <div className="ardoise-preview" dangerouslySetInnerHTML={{ __html: htmlNote }} />
        </>
    );
}

export default NoteViewer;
