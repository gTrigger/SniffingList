"use client";

import { useState, useMemo } from "react";
import styles from "./ControlPanel.module.scss";
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

    const exportToJson = () => {
        const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'items.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.controlPanel}>
            <div className={styles.panelRow}>
                <Button
                    label={i18n[locale]?.addPerfume}
                    onClick={() => setActivePopup("addPerfume")}
                />

                <Button
                    label={i18n[locale]?.loadCollection}
                    onClick={() => setActivePopup("loadCollection")}
                />

                <Button
                  label={i18n[locale]?.removeAll}
                  isDisabled={!hasItems}
                  onClick={() => setActivePopup("clearCollection")}
                />

                <Button
                  label={i18n[locale]?.downloadCollection}
                  isDisabled={!hasItems}
                  onClick={exportToJson}
                />
            </div>

            {activePopup === "addPerfume" && (
                <AddPerfumePopup
                    isOpen={true}
                    onClose={() => setActivePopup(null)}
                />
            )}

            {activePopup === "loadCollection" && (
                <LoadCollectionPopup
                    isOpen={true}
                    onClose={() => setActivePopup(null)}
                />
            )}

            {activePopup === "clearCollection" && (
                <ClearCollectionPopup
                    isOpen={true}
                    onClose={() => setActivePopup(null)}
                />
            )}
        </div>
    );
}