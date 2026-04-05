import { FileX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import { EmptyState } from "@components/generics";
import { useDebounce } from "@hooks/useDebounce";
import { useEditorMode } from "@stores/editor.store";
import { useNotes, useNotesActions } from "@stores/notes.store";

import { FloatingToolbar, NoteEditor, Toolbar, useEditorCommands } from "./editor";
import NoteFooter from "./NoteFooter";
import NoteTitle from "./NoteTitle";
import { NoteViewer } from "./viewer";

function Note() {
    const { noteId } = useParams<{ noteId: string }>();

    const mode = useEditorMode();
    const selectedNote = useNotes().find((note) => note.id === noteId);

    const { updateNote } = useNotesActions();
    const { debouncedCallback: debouncedUpdateTitle } = useDebounce(
        (noteId: string, title: string) => updateNote(noteId, { title })
    );
    const { debouncedCallback: debouncedUpdateContent } = useDebounce(
        (noteId: string, content: string) => updateNote(noteId, { content })
    );

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const phantomRef = useRef<HTMLDivElement>(null);

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        if (selectedNote) {
            debouncedUpdateContent(selectedNote.id, newContent);
        }
    };

    const handleCursorChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        setSelection({
            start: e.currentTarget.selectionStart,
            end: e.currentTarget.selectionEnd
        });
    };

    const { toggleBlock, isBlockActive, toggleInline, isInlineActive } = useEditorCommands(
        editorRef,
        content,
        selection.start,
        handleContentChange
    );

    useEffect(() => {
        if (selectedNote) {
            setTitle(selectedNote.title);
            setContent(selectedNote.content);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNote?.id]);

    if (!selectedNote) {
        return (
            <EmptyState
                body="This note may have been deleted."
                icon={<FileX size={16} strokeWidth={1.5} />}
                title="Note not found"
            />
        );
    }

    const wordCount = content.trim() === "" ? 0 : content.trim().split(/\s+/).length;

    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
        debouncedUpdateTitle(selectedNote.id, newTitle);
    };

    return (
        <div className="flex h-full flex-col">
            <div
                className={`overflow-hidden transition-[height,opacity] duration-200 ease-out ${
                    mode === "edit" ? "h-10 opacity-100" : "h-0 opacity-0"
                }`}
            >
                <Toolbar isBlockActive={isBlockActive} onToggleBlock={toggleBlock} />
            </div>

            <div className="flex-1 overflow-auto px-6 py-12">
                <div
                    className={`mx-auto flex w-full flex-col gap-2 ${mode === "edit" ? "max-w-[72ch]" : "max-w-180"}`}
                >
                    <NoteTitle
                        date={selectedNote.updatedAt}
                        mode={mode}
                        title={title}
                        onChange={handleTitleChange}
                    />
                    {mode === "edit" ? (
                        <>
                            <NoteEditor
                                ref={editorRef}
                                content={content}
                                phantomRef={phantomRef}
                                onChange={handleContentChange}
                                onCursorChange={handleCursorChange}
                            />
                            <FloatingToolbar
                                editorRef={editorRef}
                                isInlineActive={isInlineActive}
                                phantomRef={phantomRef}
                                selection={selection}
                                onToggleInline={toggleInline}
                            />
                        </>
                    ) : (
                        <NoteViewer content={content} />
                    )}
                </div>
            </div>

            <NoteFooter wordCount={wordCount} />
        </div>
    );
}

export default Note;
