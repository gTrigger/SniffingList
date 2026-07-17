"use client";

import styles from './ScrollToTop.module.css';
import { useState, useEffect } from 'react';
import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import Button from "@/components/common/Button/Button";

export default function ScrollToTop() {
    const { locale } = useAppSettingsStore();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <Button
            className={`${styles.scrollButton} ${isVisible ? styles.visible : ''}`}
            label={'^'}
            ariaLabel={i18n[locale].scrollToTop}
            onClick={scrollToTop}
        />
    );
}