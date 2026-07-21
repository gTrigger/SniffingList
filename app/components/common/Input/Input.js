"use client";

import styles from "./Input.module.scss";

export default function Input({
    value,
    id,
    label,
    ariaLabel,
    placeholder,
    isDisabled = false,
    onChange
}) {
    return (
        <div className={styles.inputWrapper}>
            {label && (
                <label htmlFor={id} className={styles.label}>
                    {label}
                </label>
            )}
            <input
                id={id}
                className={styles.input}
                type="text"
                value={value ?? ""}
                placeholder={placeholder}
                disabled={isDisabled}
                onChange={onChange}
                aria-label={ariaLabel || label}
            />
        </div>
    );
}