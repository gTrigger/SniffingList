"use client";

import styles from "./LanguageSelector.module.css";
import Button from "@/components/common/Button/Button";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";

export default function LanguageSelector() {
    const {
        locale, setLocale
    } = useAppSettingsStore();

    return (
        <div className={styles.languageSelector}>
            <Button
                label="EN"
                className={`${styles.button} ${locale === 'en' ? styles.active : ""}`}
                onClick={() => setLocale('en')}
            />
            /
            <Button
                label="DE"
                className={`${styles.button} ${locale === 'de' ? styles.active : ""}`}
                onClick={() => setLocale('de')}
            />
            /
            <Button
                label="RU"
                className={`${styles.button} ${locale === 'ru' ? styles.active : ""}`}
                onClick={() => setLocale('ru')}
            />
        </div>
    );
}