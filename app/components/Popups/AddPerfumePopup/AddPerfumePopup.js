"use client";

import styles from "./AddPerfumePopup.module.css";
import { useRef, useState } from "react";
import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import { useItemsStore } from "@/store/useItemsStore";
import { useToastStore } from "@/store/useToastStore";
import ParallaxCard from "@/components/ParallaxCard/ParallaxCard";
import Popup from "@/components/common/Popup/Popup";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";

export default function AddPerfumePopup({ isOpen, onClose }) {
    const { locale } = useAppSettingsStore();
    const { addToast } = useToastStore();
    const { items, addItem } = useItemsStore();

    const [isLoading, setIsLoading] = useState(false);
    const [perfumeQuery, setPerfumeQuery] = useState("");
    const [previewItem, setPreviewItem] = useState(null);

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

    const confirmAddPerfume = () => {
        addItem(previewItem);
        closeAddPerfumePopup();

        return addToast(i18n[locale]?.addPerfumeSuccess, "success");
    };

    const closeAddPerfumePopup = () => {
        onClose();
        setPreviewItem(null);
        setPerfumeQuery("");
    };

    return (
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
            isOpen={isOpen}
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
    );
}