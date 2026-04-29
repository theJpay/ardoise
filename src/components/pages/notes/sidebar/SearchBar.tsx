import { ArrowBigUp, Command, Search, X } from "lucide-react";

import { ShortcutKey } from "@components/generics";

import type { RefObject } from "react";

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    ref: RefObject<HTMLInputElement | null>;
};

function SearchBar({ value, onChange, ref }: SearchBarProps) {
    const hasValue = value.length > 0;

    return (
        <div className="bg-bg border-border focus-within:border-accent hover:border-muted hover:focus-within:border-accent duration-fast flex h-8 items-center gap-2 rounded border px-2.5 transition-colors">
            <Search className="text-subtle shrink-0" size={12} strokeWidth={1.5} />
            <input
                ref={ref}
                aria-label="Search notes"
                className="text-ui-sm text-text placeholder:text-dim min-w-0 flex-1 bg-transparent font-mono outline-none"
                placeholder="Search..."
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {hasValue ? (
                <button
                    aria-label="Clear search"
                    className="text-subtle hover:text-muted flex shrink-0 items-center"
                    onClick={() => onChange("")}
                >
                    <X size={11} strokeWidth={2} />
                </button>
            ) : (
                <div className="flex shrink-0 items-center gap-0.5">
                    <ShortcutKey content={Command} />
                    <ShortcutKey content={ArrowBigUp} />
                    <ShortcutKey content="F" />
                </div>
            )}
        </div>
    );
}

export default SearchBar;
