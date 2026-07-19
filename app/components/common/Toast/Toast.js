"use client";

import styles from './Toast.module.css';
import { createPortal } from 'react-dom';
import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import { useToastStore } from '@/store/useToastStore';
import Button from "@/components/common/Button/Button";

export default function Toast() {
    const { toasts, removeToast } = useToastStore();
    const { locale } = useAppSettingsStore();

    if (toasts.length === 0) return null;

    return createPortal(
        <div
            className={styles.container}
            role="status"
            aria-live="polite"
        >
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`${styles.toast} ${styles[toast.type]} subtitle`}
                >
                    <span>{toast.message}</span>
                    <Button
                        className={styles.closeButton}
                        label="x"
                        ariaLabel={i18n[locale].removeNotification}
                        onClick={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>,
        document.body
    );
}