"use client";

import styles from "./Popup.module.css";
import { useEffect } from 'react';
import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import Button from "@/components/common/Button/Button";

export default function Popup({ isOpen, onClose, title, subtitle, children, footer }) {
    const { locale } = useAppSettingsStore();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <dialog
            className={styles.modalOverlay}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-subtitle"
        >
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <Button
                    className={styles.closeButton}
                    label={'x'}
                    ariaLabel={i18n[locale].removePerfume}
                    onClick={onClose}
                />

                {title && <div id="modal-title" className="modalTitle">{title}</div>}

                {subtitle && (<p id="modal-subtitle" className="modalSubtitle">{subtitle}</p>)}

                {children && (<div className={styles.modalBody}>{children}</div>)}

                {footer && <div className={styles.modalFooter}>{footer}</div>}
            </div>
        </dialog>
    );
}