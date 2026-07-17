"use client";

import { useState, useMemo } from "react";
import styles from "./ControlPanel.module.css";
import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import { useItemsStore } from "@/store/useItemsStore";
import Button from "@/components/common/Button/Button";
import AddPerfumePopup from "@/components/Popups/AddPerfumePopup/AddPerfumePopup";
import ClearCollectionPopup from "@/components/Popups/ClearCollectionPopup/ClearCollectionPopup";
import LoadCollectionPopup from "@/components/Popups/LoadCollectionPopup/LoadCollectionPopup";

export default function ControlPanel() {
    const { locale } = useAppSettingsStore();
    const { items } = useItemsStore();

    const [activePopup, setActivePopup] = useState(null);

    const hasItems = useMemo(() => Array.isArray(items) && items.length > 0, [items]);

    return (
        <div className={styles.controlPanel}>
            <div className={styles.panelRow}>
                <Button
                    label={i18n[locale]?.addPerfume}
                    onClick={() => setActivePopup("add")}
                />

                <Button
                    label={i18n[locale]?.loadCollection}
                    onClick={() => setActivePopup("load")}
                />

                {hasItems && (
                    <Button
                        label={i18n[locale]?.removeAll}
                        onClick={() => setActivePopup("clear")}
                    />
                )}
            </div>

            {activePopup === "add" && (
                <AddPerfumePopup
                    isOpen={true}
                    onClose={() => setActivePopup(null)}
                />
            )}

            {activePopup === "load" && (
                <LoadCollectionPopup
                    isOpen={true}
                    onClose={() => setActivePopup(null)}
                />
            )}

            {activePopup === "clear" && (
                <ClearCollectionPopup
                    isOpen={true}
                    onClose={() => setActivePopup(null)}
                />
            )}
        </div>
    );
}