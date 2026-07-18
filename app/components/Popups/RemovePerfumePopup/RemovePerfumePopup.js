"use client";

import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import { useToastStore } from "@/store/useToastStore";
import Popup from "@/components/common/Popup/Popup";
import Button from "@/components/common/Button/Button";

export default function RemovePerfumePopup({ isOpen, onClose, onConfirm }) {
    const { locale } = useAppSettingsStore();
    const { addToast } = useToastStore();

    const confirmRemovePerfume = () => {
        onConfirm();
        onClose();

        return addToast(i18n[locale]?.removePerfumeSuccess, "success");
    };

    return (
        <Popup
            title={i18n[locale]?.removePerfumeTitle}
            subtitle={i18n[locale]?.removePerfumeSubtitle}
            footer={
                <>
                    <Button
                        label={i18n[locale]?.cancelRemovePerfume}
                        onClick={onClose}
                    />
                    <Button
                        label={i18n[locale]?.confirmRemovePerfume}
                        onClick={() => confirmRemovePerfume()}
                    />
                </>
            }
            isOpen={isOpen}
            onClose={onClose}
        />
    );
}