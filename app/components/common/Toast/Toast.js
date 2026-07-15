"use client";

import { useToastStore } from '@/store/useToastStore';
import styles from './Toast.module.css';

export default function ToastContainer() {
    const { toasts } = useToastStore();

    return (
        <div className={styles.container}>
            {toasts.map((toast) => (
                <div key={toast.id} className={`${styles.toast} ${styles[toast.type]} subtitle`}>
                    {toast.message}
                </div>
            ))}
        </div>
    );
}