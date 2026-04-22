import { ACCENTS } from "@entities";

import type { Accent } from "@entities";

const ACCENT_LABELS: Record<Accent, string> = {
    lichen: "Lichen",
    clay: "Clay",
    slate: "Slate",
    heather: "Heather",
    amber: "Amber"
};

type AccentSwatchPickerProps = {
    value: Accent;
    onChange: (accent: Accent) => void;
};

function AccentSwatchPicker({ value, onChange }: AccentSwatchPickerProps) {
    return (
        <div className="flex items-center gap-2">
            {ACCENTS.map((accent) => {
                const isActive = accent === value;
                return (
                    <button
                        key={accent}
                        aria-label={ACCENT_LABELS[accent]}
                        aria-pressed={isActive}
                        className={`bg-accent h-5 w-5 rounded-full border transition-[border-color,transform] duration-fast ${
                            isActive
                                ? "border-text scale-110"
                                : "border-border-soft hover:border-muted"
                        }`}
                        data-accent={accent}
                        title={ACCENT_LABELS[accent]}
                        onClick={() => onChange(accent)}
                    />
                );
            })}
        </div>
    );
}

export default AccentSwatchPicker;
