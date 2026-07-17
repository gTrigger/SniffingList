'use client';

import { useState, useEffect, useRef } from 'react';
import { i18n } from "@/i18n";
import { useItemsStore } from '@/store/useItemsStore';
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import styles from './AppLoader.module.css';

const MIN_LOADING_DELAY_MS = 3000;
const FIRST_BATCH_SIZE = 12;

function preloadCardImages(batch) {
    return new Promise((resolve) => {
        if (!batch || batch.length === 0) return resolve();

        let loadedCount = 0;
        const total = batch.length;

        const onImageLoad = () => {
            loadedCount++;
            if (loadedCount === total) resolve();
        };

        batch.forEach((item) => {
            const url = item.currentImage || item.imageUrl;
            if (!url) {
                onImageLoad();
                return;
            }

            const img = new Image();
            img.src = url;

            if (img.complete) {
                onImageLoad();
            } else {
                img.addEventListener('load', onImageLoad);
                img.addEventListener('error', onImageLoad);
            }
        });
    });
}

export default function AppLoader({ children }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const { locale, setLocale } = useAppSettingsStore();

    const { items, isInitialized } = useItemsStore();

    const loadingTriggered = useRef(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const urlLang = params.get('lang');
            if (urlLang && urlLang !== locale) {
                setLocale(urlLang);
            }
        }
    }, []);

    useEffect(() => {
        const currentLang = locale || 'ru';
        document.documentElement.setAttribute('lang', currentLang);
    }, [locale]);

    useEffect(() => {
        if (loadingTriggered.current) return;

        let isMounted = true;
        let timeoutId;

        async function waitForAssets() {
            try {
                const minimumDelay = new Promise(resolve => {
                    timeoutId = setTimeout(resolve, MIN_LOADING_DELAY_MS);
                });

                if ('fonts' in document) {
                    await document.fonts.ready;
                }

                const firstBatch = items ? items.slice(0, FIRST_BATCH_SIZE) : [];
                const imagesPromise = preloadCardImages(firstBatch);

                await Promise.all([imagesPromise, minimumDelay]);
            } catch (err) {
                console.error(i18n[locale]?.genericError);
            } finally {
                if (isMounted) {
                    setIsLoaded(true);
                }
            }
        }

        const isReadyToLoad = isInitialized !== undefined ? isInitialized : (items && items.length > 0);

        if (isReadyToLoad) {
            loadingTriggered.current = true;
            waitForAssets();
        }

        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [items, isInitialized]);

    if (!isLoaded) {
        return (
            <div className={styles.loaderContainer}>
                <video
                    src="/assets/Loading.webm"
                    muted
                    autoPlay
                    loop
                    playsInline
                    aria-label={i18n[locale]?.loading}
                >
                    {i18n[locale]?.loading}
                </video>
                <p className={styles.loaderText}>
                    {i18n[locale]?.loading}
                    <span className={styles.dots}/>
                </p>
            </div>
        );
    }

    return <>{children}</>;
}