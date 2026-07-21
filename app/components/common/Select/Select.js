"use client";

import styles from "./Select.module.scss";
import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import Button from "@/components/common/Button/Button";

export default function Select({
    value,
    id,
    label,
    options = [],
    placeholder,
    isSmall,
    onChange,
    onClear,
    getLabel = (opt) => opt,
    getValue = (opt) => opt
}) {
    const { locale } = useAppSettingsStore();

    return (
        <div className={`${styles.selectWrapper} ${isSmall ? styles.small : ""}`.trim()}>
            {label && <label htmlFor={id} className={styles.label}>{label}</label>}

            <select
                id={id}
                className={styles.select}
                onChange={(e) => {
                    onChange(e.target.value);
                    e.target.blur();
                }}
                value={value}
                aria-label={label || placeholder}
            >
                {placeholder && <option value="" disabled>{placeholder}</option>}
                {options.map((opt) => (
                    <option key={getValue(opt)} value={getValue(opt)}>
                        {getLabel(opt)}
                    </option>
                ))}
            </select>

            {onClear && (
                <Button
                    className={styles.removeButton}
                    icon="cancel"
                    label={i18n[locale].cancelSelection}
                    onClick={onClear}
                />
            )}
        </div>
    );
}