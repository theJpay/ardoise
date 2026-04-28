import { lazy, Suspense, useEffect, useRef } from "react";
import { useParams } from "react-router";

import { ShareButton } from "@components/share";
import { Editor, EditorToolbar, useEditor } from "@editor";
import { useEditorMode } from "@hooks/useEditorMode";
import { useSettingsQuery } from "@queries/useSettingsQuery";
import { useDeletionState } from "@stores/deletion.store";

import DeleteBanner from "./DeleteBanner";
import NoteFooter from "./NoteFooter";
import NoteLoadingSkeleton from "./NoteLoadingSkeleton";
import NoteNotFound from "./NoteNotFound";
import NoteTitle from "./NoteTitle";
import StorageErrorBanner from "./StorageErrorBanner";
import { useNoteData } from "./useNoteData";
import { usePreserveEditState } from "./usePreserveEditState";

import type { EditorHandle } from "@editor";
import type { Note as NoteEntity } from "@entities";
import type { RefObject } from "react";

const NoteViewer = lazy(() => import("./viewer/NoteViewer"));

function Note() {
    const { noteId } = useParams<{ noteId: string }>();
    if (!noteId) {
        throw new Error("noteId is required");
    }

    const { mode, toggleMode } = useEditorMode();
    const { armed, noteTitle: armedNoteTitle } = useDeletionState();
    const { settings } = useSettingsQuery();

    const { isPending, selectedNote, title, content, saveStatus, retrySave, handleChange } =
        useNoteData(noteId);

    const editor = useEditor();
    const titleRef = useRef<HTMLInputElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    usePreserveEditState({ mode, noteId, editor, scrollContainerRef });
    useFocusOnNoteLoad(selectedNote, editor, titleRef);

    if (isPending) {
        return <NoteLoadingSkeleton />;
    }

    if (!selectedNote) {
        return <NoteNotFound />;
    }

    return (
        <div className="flex h-full flex-col">
            <div
                className={`duration-layout overflow-hidden transition-[height,opacity] ease-out ${
                    mode === "edit" ? "h-10 opacity-100" : "h-0 opacity-0"
                }`}
            >
                <EditorToolbar
                    editor={editor}
                    rightActions={<ShareButton note={{ title, content }} />}
                />
            </div>

            <div ref={scrollContainerRef} className="flex-1 scroll-pt-9 scroll-pb-48 overflow-auto">
                <div className="sticky top-0 z-10 min-h-9">
                    {armed ? (
                        <DeleteBanner noteTitle={armedNoteTitle} />
                    ) : saveStatus === "error" ? (
                        <StorageErrorBanner onRetry={retrySave} />
                    ) : null}
                </div>

                <div
                    className={`duration-base px-6 pt-12 pb-48 transition-opacity ${armed ? "opacity-40" : ""}`}
                >
                    <div
                        className={`mx-auto flex w-full flex-col gap-2 ${mode === "edit" ? "max-w-[72ch]" : "max-w-180"}`}
                    >
                        <NoteTitle
                            date={selectedNote.updatedAt}
                            inputRef={titleRef}
                            mode={mode}
                            title={title}
                            onChange={handleChange}
                        />
                        {mode === "edit" ? (
                            <>
                                <Editor
                                    editor={editor}
                                    spellCheck={settings.spellcheck}
                                    value={content}
                                    onChange={(content) => handleChange({ content })}
                                />
                                {content.length === 0 && (
                                    <div className="text-ed-body text-subtle font-mono">
                                        Type <span className="text-accent">/</span> to insert
                                        headings, code blocks, and more
                                    </div>
                                )}
                            </>
                        ) : (
                            <Suspense fallback={null}>
                                <NoteViewer content={content} onSwitchToWrite={toggleMode} />
                            </Suspense>
                        )}
                    </div>
                </div>
            </div>

            <NoteFooter noteContent={content} saveStatus={saveStatus} />
        </div>
    );
}

export default Note;

function useFocusOnNoteLoad(
    note: NoteEntity | undefined,
    editor: EditorHandle,
    titleRef: RefObject<HTMLInputElement | null>
) {
    useEffect(() => {
        if (!note) {
            return;
        }
        const engine = editor.engine;
        if (!engine) {
            return;
        }
        if (note.title.trim() === "") {
            titleRef.current?.focus();
        } else if (engine.getValue() === "") {
            engine.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [note?.id, editor.engine]);
}
