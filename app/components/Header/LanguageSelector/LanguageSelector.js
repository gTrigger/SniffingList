"use client";

import styles from "./LanguageSelector.module.scss";
import Button from "@/components/common/Button/Button";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";

const SUPPORTED_LOCALES = ["en", "de", "ru"];

export default function LanguageSelector() {
    const { locale, setLocale } = useAppSettingsStore();

    return (
        <div className={styles.languageSelector}>
            {SUPPORTED_LOCALES.map((lang, index) => {
                const isLast = index === SUPPORTED_LOCALES.length - 1;
                const isActive = locale === lang;

                return (
                    <div key={lang}>
                        <Button
                            label={lang.toUpperCase()}
                            className={`${styles.languageButton} ${isActive ? styles.active : ""}`.trim()}
                            onClick={() => setLocale(lang)}
                        />
                        {!isLast && <span>/</span>}
                    </div>
                );
            })}
        </div>
    );
}