"use client";

import { useEffect } from "react";
import styles from "./Popup.module.scss";
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

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            className={`${styles.modalOverlay} ${className}`.trim()}
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

                {title && <h2 className={styles.title}>{title}</h2>}

                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

                {children && <div className={styles.content}>{children}</div>}

                {footer && <div className={styles.footer}>{footer}</div>}
            </div>
        </div>
    );
}