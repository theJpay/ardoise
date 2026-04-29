import { useEffect, useRef } from "react";

import { DepletionBar } from "@components/generics";
import { useArmedAction } from "@hooks/useArmedAction";

type DeleteRowButtonProps = {
    onConfirm: () => void;
};

function DeleteRowButton({ onConfirm }: DeleteRowButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { armed, trigger } = useArmedAction({ onConfirm });

    useEffect(() => {
        if (!armed) {
            buttonRef.current?.blur();
        }
    }, [armed]);

    return (
        <button
            ref={buttonRef}
            className={`text-ui-sm border-danger-border text-danger duration-fast relative flex h-7 items-center overflow-hidden rounded border px-2.5 transition-colors ${
                armed
                    ? "bg-danger-surface-hover"
                    : "bg-danger-surface hover:bg-danger-surface-hover"
            }`}
            onClick={trigger}
        >
            {armed ? "Delete?" : "Delete"}
            {armed && <DepletionBar />}
        </button>
    );
}

export default DeleteRowButton;
