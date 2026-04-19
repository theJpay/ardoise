import { useParams } from "react-router";

import { useEditorMode } from "@hooks/useEditorMode";
import { useSettingsQuery } from "@queries/useSettingsQuery";
import { useDeletionState } from "@stores/deletion.store";

import DeleteBanner from "./DeleteBanner";
import {
    CommandPalette,
    FloatingToolbar,
    handleFormattingShortcut,
    NoteEditor,
    Toolbar,
    useCommandPalette,
    useEditorCommands,
    useSmartKeys
} from "./editor";
import NoteFooter from "./NoteFooter";
import NoteLoadingSkeleton from "./NoteLoadingSkeleton";
import NoteNotFound from "./NoteNotFound";
import NoteTitle from "./NoteTitle";
import StorageErrorBanner from "./StorageErrorBanner";
import { useNoteState } from "./useNoteState";
import { NoteViewer } from "./viewer";

function Note() {
    const { noteId } = useParams<{ noteId: string }>();
    const { mode, toggleMode } = useEditorMode();
    const { armed, noteTitle: armedNoteTitle } = useDeletionState();
    const { settings } = useSettingsQuery();

    const {
        isPending,
        selectedNote,
        title,
        content,
        selection,
        focused,
        editorRef,
        titleRef,
        phantomRef,
        scrollContainerRef,
        saveStatus,
        saveError,
        retrySave,
        resetSelection,
        handleContentChange,
        handleCursorChange,
        handleScroll,
        handleTitleChange,
        setFocused
    } = useNoteState(noteId, mode);

    const { toggleBlock, isBlockActive, toggleInline, isInlineActive, toggleLink } =
        useEditorCommands(editorRef, content, handleContentChange);

    const {
        state: commandPaletteState,
        filteredActions: commandPaletteActions,
        executeCommand,
        handleKeyDown: handleCommandPaletteKeyDown
    } = useCommandPalette(editorRef, content, selection.start, handleContentChange);

    const { handleKeyDown: handleSmartKeys } = useSmartKeys(editorRef, handleContentChange);

    const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (handleFormattingShortcut(e, toggleInline, toggleLink)) {
            return;
        }
        if (handleCommandPaletteKeyDown(e)) {
            return;
        }
        handleSmartKeys(e);
    };

    if (isPending) {
        return <NoteLoadingSkeleton />;
    }

    if (!selectedNote) {
        return <NoteNotFound />;
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
                ref={scrollContainerRef}
                className={`flex-1 overflow-auto px-6 py-12 transition-opacity duration-150 ${armed ? "opacity-40" : ""}`}
                onScroll={handleScroll}
            >
                <div
                    className={`mx-auto flex w-full flex-col gap-2 ${mode === "edit" ? "max-w-[72ch]" : "max-w-180"}`}
                >
                    <NoteTitle
                        date={selectedNote.updatedAt}
                        inputRef={titleRef}
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
                                spellCheck={settings.spellcheck}
                                onBlur={() => {
                                    setFocused(false);
                                    resetSelection();
                                }}
                                onChange={handleContentChange}
                                onCursorChange={handleCursorChange}
                                onFocus={() => setFocused(true)}
                                onKeyDown={handleEditorKeyDown}
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

            <NoteFooter noteContent={content} saveStatus={saveStatus} />
        </div>
    );
}

export default Note;
