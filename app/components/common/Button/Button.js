"use client";

import styles from "./Button.module.css";
import CancelIcon from "@/components/common/icons/CancelIcon";
import ArrowIcon from "@/components/common/icons/ArrowIcon";
import LinkIcon from "@/components/common/icons/LinkIcon";

const iconLibrary = {
    cancel: <CancelIcon aria-hidden="true" />,
    arrow: <ArrowIcon aria-hidden="true" />,
    link: <LinkIcon aria-hidden="true" />,
};

export default function Button({ label, icon, onClick, className = '', isDisabled = false, isHidden = false }) {
    const iconToRender = icon ? iconLibrary[icon] : null;

    return (
        <button
            type="button"
            className={`${className} ${styles.button} ${isHidden ? styles.hidden : ''}`}
            disabled={isDisabled}
            onClick={onClick}
            title={icon ? label : undefined}
            aria-label={label ? label : icon}
        >
            {icon ? iconToRender : label}
        </button>
    );
}