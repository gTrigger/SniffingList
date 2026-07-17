"use client";

import styles from "./Header.module.css";
import { useEffect, useState } from "react";
import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import { useItemsStore } from "@/store/useItemsStore";
import FilterPanel from "@/components/FilterPanel/FilterPanel";
import ControlPanel from "@/components/ControlPanel/ControlPanel";
import LanguageSelector from "@/components/LanguageSelector/LanguageSelector";
import Button from "@/components/common/Button/Button";

export default function Header() {
    const {
        isExpanded, setIsExpanded,
        locale,
    } = useAppSettingsStore();
    const { items } = useItemsStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <header className={styles.header}></header>;
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
            {items.length > 0 &&
                <>
                    <div className={`${styles.panel} ${styles.filterPanel} ${isExpanded ? styles.open : ''}`}>
                        <div className={styles.expandablePanel}>
                            <FilterPanel />
                        </div>
                    </div>
                    <Button
                        className={`${styles.toggleButton} ${isExpanded ? styles.active : ''}`}
                        label={'^'}
                        ariaLabel={i18n[locale].toggleExpandablePanel}
                        onClick={() => setIsExpanded(!isExpanded)}
                    />
                </>
            }
        </header>
    );
}