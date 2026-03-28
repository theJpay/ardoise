import { Search } from "lucide-react";

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
};

function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-bg border border-border rounded focus-within:border-accent hover:border-muted hover:focus-within:border-accent transition-colors duration-100">
            <Search size={12} strokeWidth={1.5} className="text-subtle shrink-0" />
            <input
                type="search"
                placeholder="Search notes..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 bg-transparent font-mono text-xs text-text placeholder:text-subtle outline-none"
            />
        </div>
    );
}

export default SearchBar;
