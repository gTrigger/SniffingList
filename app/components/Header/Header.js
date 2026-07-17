"use client";

import styles from "./Header.module.css";
import { useEffect, useState, useMemo } from "react";
import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import { useItemsStore } from "@/store/useItemsStore";
import FilterPanel from "@/components/Header/FilterPanel/FilterPanel";
import ControlPanel from "@/components/Header/ControlPanel/ControlPanel";
import LanguageSelector from "@/components/Header/LanguageSelector/LanguageSelector";
import Button from "@/components/common/Button/Button";

export default function Header() {
    const { isExpanded, setIsExpanded, locale } = useAppSettingsStore();
    const { items } = useItemsStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const hasItems = useMemo(() => Array.isArray(items) && items.length > 0, [items]);

    if (!isMounted) {
        return <header className={styles.header} />;
    }

    return (
        <header className={styles.header}>
            <div className={`${styles.panel} ${styles.mainPanel}`}>
                <h1>{i18n[locale]?.title}</h1>
                <LanguageSelector />
            </div>

            <div className={`${styles.panel} ${styles.controlPanel}`}>
                <ControlPanel />
            </div>

            {hasItems && (
                <>
                    <section
                        className={`${styles.panel} ${styles.filterPanel} ${isExpanded ? styles.open : ''}`.trim()}
                        aria-hidden={!isExpanded}
                    >
                        <div className={styles.expandablePanel}>
                            <FilterPanel />
                        </div>
                    </section>
                    <Button
                        className={`${styles.toggleButton} ${isExpanded ? styles.active : ''}`.trim()}
                        label="^"
                        ariaLabel={i18n[locale]?.toggleExpandablePanel}
                        onClick={() => setIsExpanded(!isExpanded)}
                    />
                </>
            )}
        </header>
    );
}