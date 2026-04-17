type SelectOption<T extends string> = {
    value: T;
    label: string;
};

type SelectProps<T extends string> = {
    value: T;
    options: SelectOption<T>[];
    onChange: (value: T) => void;
};

function Select<T extends string>({ value, options, onChange }: SelectProps<T>) {
    return (
        <select
            className="text-ui-sm bg-bg border-border text-muted cursor-pointer rounded border px-2 py-1 outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value as T)}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

export default Select;
