"use client";

import { useEffect } from "react";
import styles from "./Popup.module.css";
import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import Button from "@/components/common/Button/Button";

export default function Popup({
    isOpen,
    title,
    subtitle,
    children,
    footer,
    onClose,
    className = ""
                              }) {
    const { locale } = useAppSettingsStore();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className={`${styles.modalOverlay} ${className}`.trim()}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <Button
                    className={styles.closeButton}
                    label="x"
                    ariaLabel={i18n[locale]?.removePerfume || "Close popup"}
                    onClick={onClose}
                />

                {title && <h2 className={styles.modalTitle}>{title}</h2>}

                {subtitle && <p className={styles.modalSubtitle}>{subtitle}</p>}

                {children && <div className={styles.modalBody}>{children}</div>}

                {footer && <div className={styles.modalFooter}>{footer}</div>}
            </div>
        </div>
    );
}