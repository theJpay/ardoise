import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

type PaletteInputProps = {
    value: string;
    onChange: (value: string) => void;
};

function PaletteInput({ value, onChange }: PaletteInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="border-border-soft flex h-11 shrink-0 items-center gap-2.5 border-b px-4">
            <Search className="text-subtle shrink-0" size={14} strokeWidth={1.5} />
            <input
                ref={inputRef}
                aria-label="Search notes"
                className="text-ui-base text-text placeholder:text-dim flex-1 bg-transparent font-mono outline-none"
                placeholder="Search notes..."
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export default PaletteInput;
