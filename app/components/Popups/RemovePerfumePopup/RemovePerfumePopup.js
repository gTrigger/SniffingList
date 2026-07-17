"use client";

import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import Popup from "@/components/common/Popup/Popup";
import Button from "@/components/common/Button/Button";

export default function RemovePerfumePopup({ isOpen, onClose, onConfirm }) {
    const { locale } = useAppSettingsStore();

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
                        onClick={onConfirm}
                    />
                </>
            }
            isOpen={isOpen}
            onClose={onClose}
        />
    );
}