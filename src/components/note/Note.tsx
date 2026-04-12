import { FileX } from "lucide-react";
import { useParams } from "react-router";

import { EmptyState } from "@components/generics";
import { useDeletionState } from "@stores/deletion.store";
import { useEditorActions, useEditorMode } from "@stores/editor.store";

import DeleteBanner from "./DeleteBanner";
import {
    CommandPalette,
    FloatingToolbar,
    NoteEditor,
    Toolbar,
    useCommandPalette,
    useEditorCommands
} from "./editor";
import NoteFooter from "./NoteFooter";
import NoteLoadingSkeleton from "./NoteLoadingSkeleton";
import NoteTitle from "./NoteTitle";
import StorageErrorBanner from "./StorageErrorBanner";
import { useNoteState } from "./useNoteState";
import { NoteViewer } from "./viewer";

function Note() {
    const { noteId } = useParams<{ noteId: string }>();
    const mode = useEditorMode();
    const { toggleMode } = useEditorActions();
    const { armed, noteTitle: armedNoteTitle } = useDeletionState();

    const {
        isPending,
        selectedNote,
        title,
        content,
        selection,
        focused,
        editorRef,
        phantomRef,
        wordCount,
        saveStatus,
        saveError,
        retrySave,
        handleContentChange,
        handleCursorChange,
        handleTitleChange,
        setFocused
    } = useNoteState(noteId);

    const { toggleBlock, isBlockActive, toggleInline, isInlineActive, toggleLink } =
        useEditorCommands(editorRef, content, selection.start, handleContentChange);

    const {
        state: commandPaletteState,
        filteredActions: commandPaletteActions,
        executeCommand,
        handleKeyDown: handleCommandPaletteKeyDown
    } = useCommandPalette(editorRef, content, selection.start, handleContentChange);

    if (isPending) {
        return <NoteLoadingSkeleton />;
    }

    if (!selectedNote) {
        return (
            <EmptyState
                body="This note may have been deleted."
                icon={<FileX size={16} strokeWidth={1.5} />}
                title="Note not found"
            />
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div
                className={`overflow-hidden transition-[height,opacity] duration-200 ease-out ${
                    mode === "edit" ? "h-10 opacity-100" : "h-0 opacity-0"
                }`}
            >
                <Toolbar isBlockActive={isBlockActive} onToggleBlock={toggleBlock} />
            </div>

            {armed ? (
                <DeleteBanner noteTitle={armedNoteTitle} />
            ) : saveError ? (
                <StorageErrorBanner onRetry={retrySave} />
            ) : (
                <div className="h-9 shrink-0" />
            )}

            <div
                className={`flex-1 overflow-auto px-6 py-12 transition-opacity duration-150 ${armed ? "opacity-40" : ""}`}
            >
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
                                onBlur={() => setFocused(false)}
                                onChange={handleContentChange}
                                onCursorChange={handleCursorChange}
                                onFocus={() => setFocused(true)}
                                onKeyDown={handleCommandPaletteKeyDown}
                            />
                            <FloatingToolbar
                                content={content}
                                editorFocused={focused}
                                isInlineActive={isInlineActive}
                                phantomRef={phantomRef}
                                selection={selection}
                                onToggleInline={toggleInline}
                                onToggleLink={toggleLink}
                            />
                            {commandPaletteState.isOpen && (
                                <CommandPalette
                                    content={content}
                                    filteredActions={commandPaletteActions}
                                    phantomRef={phantomRef}
                                    selectedIndex={commandPaletteState.selectedIndex}
                                    selection={selection}
                                    onExecute={executeCommand}
                                />
                            )}
                        </>
                    ) : (
                        <NoteViewer content={content} onSwitchToWrite={toggleMode} />
                    )}
                </div>
            </div>

            <NoteFooter saveStatus={saveStatus} wordCount={wordCount} />
        </div>
    );
}

export default Note;
