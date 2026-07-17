"use client";

import styles from "./LoadCollectionPopup.module.css";
import { i18n } from "@/i18n";
import { useRef } from "react";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import { useItemsStore } from "@/store/useItemsStore";
import { useToastStore } from "@/store/useToastStore";
import Popup from "@/components/common/Popup/Popup";
import Button from "@/components/common/Button/Button";

export default function LoadCollectionPopup({ isOpen, onClose }) {
    const { locale } = useAppSettingsStore();
    const { addToast } = useToastStore();
    const { loadDefault, setItems } = useItemsStore();

    const fileInputRef = useRef(null);

    const confirmLoadFromDefault = () => {
        loadDefault();
        onClose();

        return addToast(i18n[locale]?.loadFromDefaultSuccess, "success");
    };

    const handleImportJson = (e) => {
        const reader = new FileReader();
        const file = e.target.files[0];

        if (!file) return;

        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);

                setItems(importedData);
            } catch (err) {
                return addToast(i18n[locale]?.jsonReadingError, "error");
            }
        };

        reader.readAsText(file);

        e.target.value = null;

        onClose();

        return addToast(i18n[locale]?.importFromJsonSuccess, "success");
    };

    return (
        <>
        <Popup
            title={i18n[locale]?.loadCollectionTitle}
            subtitle={i18n[locale]?.loadCollectionSubtitle}
            footer={
                <>
                    <Button
                        className="button"
                        label={i18n[locale]?.cancelLoadCollection}
                        onClick={onClose}
                    />
                    <div className={styles.buttonWrapper}>
                        <Button
                            className="button"
                            label={i18n[locale]?.importFromJson}
                            onClick={() => fileInputRef.current.click()}
                        />
                        <span className="subtitle">{i18n[locale]?.or}</span>
                        <Button
                            className="button"
                            label={i18n[locale]?.loadDefaultCollection}
                            onClick={() => confirmLoadFromDefault()}
                        />
                    </div>
                </>
            }
            isOpen={isOpen}
            onClose={onClose}
        />
            <input type="file" ref={fileInputRef} accept=".json" onChange={handleImportJson} style={{ display: 'none' }} />

        </>
    );
}