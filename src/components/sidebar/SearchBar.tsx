import { Search, X } from "lucide-react";

import type { RefObject } from "react";

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    ref: RefObject<HTMLInputElement | null>;
};

function SearchBar({ value, onChange, ref }: SearchBarProps) {
    const hasValue = value.length > 0;

    return (
        <div className="bg-bg border-border focus-within:border-accent hover:border-muted hover:focus-within:border-accent flex h-8 items-center gap-2 rounded border px-2.5 transition-colors duration-100">
            <Search className="text-subtle shrink-0" size={12} strokeWidth={1.5} />
            <input
                ref={ref}
                aria-label="Search notes"
                className="text-ui-sm text-text placeholder:text-dim flex-1 bg-transparent font-mono outline-none"
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
                <span className="text-ui-xs text-subtle bg-surface border-border-soft shrink-0 rounded-sm border px-1 py-px font-mono">
                    ⌘K
                </span>
            )}
        </div>
    );
}

export default SearchBar;
