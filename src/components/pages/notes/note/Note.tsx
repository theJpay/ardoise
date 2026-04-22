import { useParams } from "react-router";

import { useEditorMode } from "@hooks/useEditorMode";
import { useSettingsQuery } from "@queries/useSettingsQuery";
import { useDeletionState } from "@stores/deletion.store";

import DeleteBanner from "./DeleteBanner";
import {
    FloatingToolbar,
    handleFormattingShortcut,
    NoteEditor,
    SlashMenu,
    Toolbar,
    useEditorCommands,
    useSlashMenu,
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
        state: slashMenuState,
        filteredActions: slashMenuActions,
        executeCommand,
        handleKeyDown: handleSlashMenuKeyDown
    } = useSlashMenu(editorRef, content, selection.start, handleContentChange);

    const { handleKeyDown: handleSmartKeys } = useSmartKeys(editorRef, handleContentChange);

    const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (handleFormattingShortcut(e, toggleInline, toggleLink)) {
            return;
        }
        if (handleSlashMenuKeyDown(e)) {
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
                className={`overflow-hidden transition-[height,opacity] duration-layout ease-out ${
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
                className={`flex-1 scroll-pb-48 overflow-auto px-6 pt-12 pb-48 transition-opacity duration-base ${armed ? "opacity-40" : ""}`}
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
                            {slashMenuState.isOpen && (
                                <SlashMenu
                                    content={content}
                                    filteredActions={slashMenuActions}
                                    phantomRef={phantomRef}
                                    selectedIndex={slashMenuState.selectedIndex}
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
