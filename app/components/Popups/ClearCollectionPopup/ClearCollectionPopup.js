"use client";

import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import { useItemsStore } from "@/store/useItemsStore";
import { useToastStore } from "@/store/useToastStore";
import { useFilterStore } from '@/store/useFilterStore';
import Popup from "@/components/common/Popup/Popup";
import Button from "@/components/common/Button/Button";

export default function ClearCollectionPopup({ isOpen, onClose }) {
    const { locale } = useAppSettingsStore();
    const { addToast } = useToastStore();
    const { removeAll } = useItemsStore();
    const { resetAllFilters } = useFilterStore();

    const confirmClearCollection = () => {
        removeAll();
        resetAllFilters();
        onClose();

        return addToast(i18n[locale]?.clearCollectionSuccess, "success");
    };

    return (
        <Popup
            title={i18n[locale]?.clearCollectionTitle}
            subtitle={i18n[locale]?.clearCollectionSubtitle}
            footer={
                <>
                    <Button
                        className="button"
                        label={i18n[locale]?.cancelClearCollection}
                        onClick={onClose}
                    />
                    <Button
                        className="button"
                        label={i18n[locale]?.confirmClearCollection}
                        onClick={() => confirmClearCollection()}
                    />
                </>
            }
            isOpen={isOpen}
            onClose={onClose}
        />
    );
}