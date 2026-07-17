"use client";

import styles from "./Button.module.css";
import CancelIcon from "@/components/common/icons/CancelIcon";

const iconLibrary = {
    cancel: <CancelIcon aria-hidden="true" />,
};

export default function Button({
    icon,
    label,
    ariaLabel,
    onClick,
    isDisabled = false,
    isHidden = false,
    className = "",
}) {
    const iconToRender = icon ? iconLibrary[icon] : null;

    if (isHidden) return null;

    return (
        <button
            type="button"
            className={`${styles.button} ${className}`.trim()}
            disabled={isDisabled}
            onClick={onClick}
            title={label}
            aria-label={ariaLabel || label}
        >
            {icon ? iconToRender : label}
        </button>
    );
}