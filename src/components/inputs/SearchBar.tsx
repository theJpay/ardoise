type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
};

function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="px-3 py-2 border-b border-border-subtle">
            <input
                type="search"
                placeholder="Search notes..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
        </div>
    );
}

export default SearchBar;
