"use client";

import styles from "./ControlPanel.module.css";
import { i18n } from "@/i18n";
import { useState } from "react";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import Button from "@/components/common/Button/Button";
import AddPerfumePopup from "../Popups/AddPerfumePopup/AddPerfumePopup";
import ClearCollectionPopup from "../Popups/ClearCollectionPopup/ClearCollectionPopup";
import LoadCollectionPopup from "@/components/Popups/LoadCollectionPopup/LoadCollectionPopup";
import {useItemsStore} from "@/store/useItemsStore";

export default function ControlPanel() {
    const { locale } = useAppSettingsStore();
    const { items } = useItemsStore();

    const [isAddPerfumePopupOpen, setIsAddPerfumePopupOpen] = useState(false);
    const [isClearCollectionPopupOpen, setIsClearCollectionPopupOpen] = useState(false);
    const [isLoadCollectionPopupOpen, setIsLoadCollectionPopupOpen] = useState(false);

    return (
        <div className={styles.controlPanel}>
            <div className={styles.panelRow}>
                <Button
                    label={i18n[locale]?.addPerfume}
                    onClick={() => setIsAddPerfumePopupOpen(true)}
                />

                <Button
                    label={i18n[locale]?.loadCollection}
                    onClick={() => setIsLoadCollectionPopupOpen(true)}
                />

                {items.length > 0 && <Button
                    label={i18n[locale]?.removeAll}
                    onClick={() => setIsClearCollectionPopupOpen(true)}
                />}
            </div>

            <AddPerfumePopup
                isOpen={isAddPerfumePopupOpen}
                onClose={() => setIsAddPerfumePopupOpen(false)}
            />

            <LoadCollectionPopup
                isOpen={isLoadCollectionPopupOpen}
                onClose={() => setIsLoadCollectionPopupOpen(false)}
            />

            <ClearCollectionPopup
                isOpen={isClearCollectionPopupOpen}
                onClose={() => setIsClearCollectionPopupOpen(false)}
            />
        </div>
    );
}