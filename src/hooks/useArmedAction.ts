import { useCallback, useEffect, useRef, useState } from "react";

export const ARM_TIMEOUT_MS = 3000;

type UseArmedActionOptions = {
    onConfirm: () => void | Promise<void>;
    onArm?: () => void;
    onCancel?: () => void;
};

export function useArmedAction({ onConfirm, onArm, onCancel }: UseArmedActionOptions) {
    const [armed, setArmed] = useState(false);
    const timerRef = useRef<number | null>(null);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const cancel = useCallback(() => {
        clearTimer();
        setArmed(false);
        onCancel?.();
    }, [clearTimer, onCancel]);

    const arm = useCallback(() => {
        clearTimer();
        setArmed(true);
        onArm?.();
        timerRef.current = window.setTimeout(cancel, ARM_TIMEOUT_MS);
    }, [clearTimer, onArm, cancel]);

    const confirm = useCallback(async () => {
        clearTimer();
        setArmed(false);
        await onConfirm();
    }, [clearTimer, onConfirm]);

    const trigger = useCallback(async () => {
        if (armed) {
            await confirm();
        } else {
            arm();
        }
    }, [armed, arm, confirm]);

    useEffect(() => clearTimer, [clearTimer]);

    return { armed, arm, cancel, confirm, trigger };
}
