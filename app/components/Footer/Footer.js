"use client";

import styles from "./Footer.module.css";
import { useEffect, useState } from "react";
import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import LinkedInIcon from "@/components/common/icons/LinkedInIcon";
import GithubIcon from "@/components/common/icons/GithubIcon";

export default function Footer() {
    const { locale } = useAppSettingsStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <footer className={styles.footer}></footer>;
    }

    return (
        <footer className={styles.footer}>
            <a
                className={styles.socialLink}
                href="https://linkedin.com/in/anefimova"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={i18n[locale]?.linkedInLink}
            >
                <LinkedInIcon />
            </a>
            <a
                className={styles.socialLink}
                href="https://github.com/gTrigger"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={i18n[locale]?.githubLink}
            >
                <GithubIcon />
            </a>
        </footer>
    );
}