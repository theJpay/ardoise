import type { ReactNode } from "react";

type ModalProps = {
    open: boolean;
    className?: string;
    children: ReactNode;
};

function Modal({ open, className = "", children }: ModalProps) {
    if (!open) {
        return null;
    }
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-10 backdrop-brightness-50">
            <div className={`bg-elevated border-border shadow-float rounded border ${className}`}>
                {children}
            </div>
        </div>
    );
}

export default Modal;
