"use client";

import styles from "./Popup.module.css";
import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import Button from "@/components/common/Button/Button";

export default function Popup({ isOpen, onClose, title, subtitle, children, footer }) {
    const { locale } = useAppSettingsStore();

    if (!isOpen) return null;

    return (
        <div
            className={styles.modalOverlay}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-subtitle"
        >
            <div className={`${styles.modalContent} ${isOpen ? styles.open : ''}`} onClick={(e) => e.stopPropagation()}>
                <Button
                    className={styles.closeButton}
                    icon="cancel"
                    label={i18n[locale].removePerfume}
                    onClick={onClose}
                />

                {title && <div id="modal-title" className="modalTitle">{title}</div>}

                {subtitle && (<p id="modal-subtitle" className="modalSubtitle">{subtitle}</p>)}

                {children && (<div className={styles.modalBody}>{children}</div>)}

                {footer && <div className={styles.modalFooter}>{footer}</div>}
            </div>
        </div>
    );
}