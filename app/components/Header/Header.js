"use client";

import styles from "./Header.module.css";
import { useEffect, useState } from "react";
import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import ControlPanel from "@/components/ControlPanel/ControlPanel";
import LanguageSelector from "@/components/LanguageSelector/LanguageSelector";
import Button from "@/components/common/Button/Button";

export default function Header() {
    const {
        isExpanded, setIsExpanded,
        locale,
    } = useAppSettingsStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <header className={styles.header}></header>;
    }

    return (
        <header className={styles.header}>
            <div className={styles.mainPanel}>
                <h1>{i18n[locale]?.title}</h1>
                <LanguageSelector />
            </div>
            <div className={`${styles.expandablePanel} ${isExpanded ? styles.open : ''}`}>
                <div className={styles.panelInner}>
                    <ControlPanel />
                    <FilterPanel />
                </div>
            </div>
            <Button
                icon={"arrow"}
                label={i18n[locale].toggleControlPanel}
                className={`${styles.toggleButton} ${isExpanded ? styles.active : ''}`}
                onClick={() => setIsExpanded(!isExpanded)}
            />
        </header>
    );
}