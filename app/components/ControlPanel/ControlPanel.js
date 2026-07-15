"use client";

import styles from "./ControlPanel.module.css";
import { i18n } from "@/i18n";
import { useRef, useState } from "react";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import { useItemsStore } from "@/store/useItemsStore";
import { useToastStore } from "@/store/useToastStore";
import ParallaxCard from "@/components/ParallaxCard/ParallaxCard";
import Popup from "@/components/common/Popup/Popup";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";

export default function ControlPanel() {
    const { locale } = useAppSettingsStore();
    const { addToast } = useToastStore();
    const { items, setItems, addItem, removeAll, loadDefault } = useItemsStore();

    const [isAddPerfumePopupOpen, setIsAddPerfumePopupOpen] = useState(false);
    const [isClearCollectionPopupOpen, setIsClearCollectionPopupOpen] = useState(false);
    const [isLoadCollectionPopupOpen, setIsLoadCollectionPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [perfumeQuery, setPerfumeQuery] = useState("");
    const [previewItem, setPreviewItem] = useState(null);

    const fileInputRef = useRef(null);

    const handleImportJson = (e) => {
        const reader = new FileReader();
        const file = e.target.files[0];

        if (!file) return;

        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);

                setItems(importedData);
            } catch (err) {
                addToast(i18n[locale]?.jsonReadingError, "error");
            }
        };

        reader.readAsText(file);

        e.target.value = null;

        setIsLoadFromJsonPopupOpen(false);

        return addToast(i18n[locale]?.importFromJsonSuccess, "success");
    };

    const handleSearchPerfume = async () => {
        if (!perfumeQuery.trim()) return;

        setIsLoading(true);
        setPreviewItem(null);

        try {
            const response = await fetch('/api/generate-perfume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ perfumeName: perfumeQuery, id: items.length, locale: locale }),
            });

            const newData = await response.json();

            if (response.ok) {
                const isDuplicate = items.some(
                    (item) => item.name.toLowerCase() === newData.name.toLowerCase()
                        && item.brand.toLowerCase() === newData.brand.toLowerCase()
                );

                if (isDuplicate) {
                    return addToast(i18n[locale]?.perfumeDuplicationError, "error");
                }

                setPreviewItem(newData);
            } else {
                return addToast(i18n[locale]?.getPerfumeDataError, "error");
            }
        } catch (error) {
            return addToast(i18n[locale]?.serverError, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelPreview = () => {
        setPreviewItem(null);
    };

    const confirmLoadFromDefault = () => {
        loadDefault();
        setIsLoadCollectionPopupOpen(false);

        return addToast(i18n[locale]?.loadFromDefaultSuccess, "success");
    };

    const confirmClearCollection = () => {
        removeAll();
        setIsClearCollectionPopupOpen(false);

        return addToast(i18n[locale]?.clearCollectionSuccess, "success");
    };

    const confirmAddPerfume = () => {
        addItem(previewItem);
        closeAddPerfumePopup();

        return addToast(i18n[locale]?.addPerfumeSuccess, "success");
    };

    const closeAddPerfumePopup = () => {
        setIsAddPerfumePopupOpen(false);
        setPreviewItem(null);
        setPerfumeQuery("");
    };

    const closeLoadCollectionPopup = () => {
        setIsLoadCollectionPopupOpen(false);
    };

    const closeClearCollectionPopup = () => {
        setIsClearCollectionPopupOpen(false);
    };

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

                <Button
                    label={i18n[locale]?.removeAll}
                    onClick={() => setIsClearCollectionPopupOpen(true)}
                />

                <input type="file" ref={fileInputRef} accept=".json" onChange={handleImportJson} style={{ display: 'none' }} />
            </div>

            <Popup
                title={i18n[locale]?.findPerfumeTitle}
                subtitle={i18n[locale]?.findPerfumeSubtitle}
                footer={previewItem && <>
                    <Button
                        label={i18n[locale]?.cancelAddPerfume}
                        onClick={handleCancelPreview}
                    />
                    <Button
                        label={i18n[locale]?.confirmAddPerfume}
                        onClick={confirmAddPerfume}
                    />
                </>}
                isOpen={isAddPerfumePopupOpen}
                onClose={closeAddPerfumePopup}
            >
                <div className={styles.addPerfumeForm}>
                    <Input
                        id={"searchInput"}
                        label={i18n[locale]?.findPerfumeInput}
                        value={perfumeQuery}
                        placeholder={i18n[locale]?.findPerfumeInputPlaceholder}
                        onChange={(e) => setPerfumeQuery(e.target.value)}
                        disabled={isLoading || previewItem}
                    />
                    <Button
                        label={i18n[locale]?.findPerfumeButton}
                        onClick={handleSearchPerfume}
                    />
                </div>

                {isLoading && (
                    <img className={styles.loader} src={'/assets/Loading.gif'} alt={i18n[locale]?.loading}/>
                )}

                {previewItem && (
                    <>
                        <p className="subtitle">
                            {i18n[locale]?.previewPerfumeProfileTitle} 👀
                        </p>

                        <ParallaxCard
                            item={previewItem}
                            className={styles.previewCard}
                        />
                    </>
                )}
            </Popup>

            <Popup
                title={i18n[locale]?.loadCollectionTitle}
                subtitle={i18n[locale]?.loadCollectionSubtitle}
                footer={
                    <>
                        <Button
                            className="button"
                            label={i18n[locale]?.cancelLoadCollection}
                            onClick={() => setIsLoadFromJsonPopupOpen(false)}
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
                isOpen={isLoadCollectionPopupOpen}
                onClose={closeLoadCollectionPopup}
            />

            <Popup
                title={i18n[locale]?.clearCollectionTitle}
                subtitle={i18n[locale]?.clearCollectionSubtitle}
                footer={
                    <>
                        <Button
                            className="button"
                            label={i18n[locale]?.cancelClearCollection}
                            onClick={() => setIsClearCollectionPopupOpen(false)}
                        />
                        <Button
                            className="button"
                            label={i18n[locale]?.confirmClearCollection}
                            onClick={() => confirmClearCollection()}
                        />
                    </>
                }
                isOpen={isClearCollectionPopupOpen}
                onClose={closeClearCollectionPopup}
            />
        </div>
    );
}