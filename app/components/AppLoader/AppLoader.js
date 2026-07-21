'use client';

import { useState, useEffect } from 'react';
import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import styles from './AppLoader.module.scss';

const FALLBACK_LOCALE = "en";
const MIN_LOADING_DELAY_MS = 3000;
const ASSETS = {
    images: [
        "/assets/categories/Amber.png",
        "/assets/categories/Animalic.png",
        "/assets/categories/Aquatic.png",
        "/assets/categories/Citrus.png",
        "/assets/categories/Earthy.png",
        "/assets/categories/Floral.png",
        "/assets/categories/Fruity.png",
        "/assets/categories/Gourmand.png",
        "/assets/categories/Green.png",
        "/assets/categories/Leather.png",
        "/assets/categories/Mineral.png",
        "/assets/categories/Musky.png",
        "/assets/categories/Powdery.png",
        "/assets/categories/Smoky.png",
        "/assets/categories/Spicy.png",
        "/assets/categories/Spicy.png",
        "/assets/categories/FreshSpicy.png",
        "/assets/categories/Sweet.png",
        "/assets/categories/Woody.png",
        "/assets/categories/Default.png"
    ],
    videos: [
        "/assets/Loading.webm",
        "/assets/EmptyCollection.webm",
        "/assets/Thinking.webm",
    ]
};

export const ImagePreloader = () => {
    useEffect(() => {
        ASSETS.images.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, []);
    return null;
};

export const VideoPreloader = () => (
    <div className="screenReaderOnly">
        {ASSETS.videos.map((src) => (
            <video key={src} src={src} preload="auto" muted playsInline />
        ))}
    </div>
);

export default function AppLoader({ children }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const { locale, setLocale } = useAppSettingsStore();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang');

        if (urlLang && urlLang !== locale) {
            setLocale(urlLang);
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('lang', locale || FALLBACK_LOCALE);
    }, [locale]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, MIN_LOADING_DELAY_MS);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if ('fonts' in document) {
            document.fonts.ready.catch(() => {});
        }
    }, []);

    if (!isLoaded) {
        return (
            <div className={styles.loaderContainer}>
                <ImagePreloader />
                <VideoPreloader />

                <video
                    src="/assets/Loading.webm"
                    muted
                    autoPlay
                    loop
                    playsInline
                >
                    {i18n[locale]?.loading}
                </video>
                <p>
                    {i18n[locale]?.loading}
                    <span className={styles.dots}/>
                </p>
            </div>
        );
    }

    return <>{children}</>;
}