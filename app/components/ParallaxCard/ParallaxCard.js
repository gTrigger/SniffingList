"use client";

import styles from "./ParallaxCard.module.css";
import { useRef, useEffect, useState } from "react";
import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import TagList from "@/components/TagList/TagList";
import Button from "@/components/common/Button/Button";
import Popup from "@/components/common/Popup/Popup";

export default function ParallaxCard({ item, onDeleteClick, className = '' }) {
    const { locale } = useAppSettingsStore();

    const [isRemovePerfumePopupOpen, setIsRemovePerfumePopupOpen] = useState(false);

    const wrapRef = useRef(null);
    const cardRef = useRef(null);
    const bgRef = useRef(null);
    const targetRef = useRef({ x: 0, y: 0 });
    const currentRef = useRef({ x: 0, y: 0 });
    const rafRef = useRef(null);

    const categoryImages = {
        "Amber": "/assets/Amber.png",
        "Animalic": "/assets/Animalic.png",
        "Aquatic": "/assets/Aquatic.png",
        "Citrus": "/assets/Citrus.png",
        "Earthy": "/assets/Earthy.png",
        "Floral": "/assets/Floral.png",
        "Fruity": "/assets/Fruity.png",
        "Gourmand": "/assets/Gourmand.png",
        "Green": "/assets/Green.png",
        "Leather": "/assets/Leather.png",
        "Mineral": "/assets/Mineral.png",
        "Musky": "/assets/Musky.png",
        "Powdery": "/assets/Powdery.png",
        "Smoky": "/assets/Smoky.png",
        "Spicy": "/assets/Spicy.png",
        "Warm Spicy": "/assets/Spicy.png",
        "Fresh Spicy": "/assets/FreshSpicy.png",
        "Sweet": "/assets/Sweet.png",
        "Woody": "/assets/Woody.png",
        "Default": "/assets/Default.png"
    };

    const descriptionId = `desc-${item.id}`;

    const currentImage = (item.group?.[0] && categoryImages[item.group[0].en]) || categoryImages.Default;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
        if (!cardRef.current || !bgRef.current) return;

        currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.08);
        currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.08);

        const rX = currentRef.current.x * 30;
        const rY = currentRef.current.y * -30;
        const tX = currentRef.current.x * -40;
        const tY = currentRef.current.y * -40;

        cardRef.current.style.transform = `rotateY(${rX}deg) rotateX(${rY}deg)`;
        bgRef.current.style.transform = `translateX(${tX}px) translateY(${tY}px)`;

        rafRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
        if (!wrapRef.current) return;

        const rect = wrapRef.current.getBoundingClientRect();

        targetRef.current.x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        targetRef.current.y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    };

    const handleMouseEnter = () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) return;

        if (!rafRef.current) {
            rafRef.current = requestAnimationFrame(animate);
        }
    };

    const handleMouseLeave = () => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }

        targetRef.current = { x: 0, y: 0 };
        currentRef.current = { x: 0, y: 0 };

        if (cardRef.current) cardRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
        if (bgRef.current) bgRef.current.style.transform = `translateX(0px) translateY(0px)`;
    };

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <>
            <div
                className={`${styles.cardWrap} ${className || ''}`}
                ref={wrapRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                tabIndex="0"
                role="article"
                aria-roledescription="perfume card"
                aria-labelledby={descriptionId}
            >
                {onDeleteClick && (
                    <Button
                        className={styles.removeButton}
                        icon="cancel"
                        label={i18n[locale].removePerfume}
                        onClick={(e) => {e.stopPropagation(); setIsRemovePerfumePopupOpen(true)}}
                    />
                )}

                <div className={styles.card} ref={cardRef}>
                    <div
                        className={styles.cardBg}
                        ref={bgRef}
                        style={{ backgroundImage: `url(${currentImage})` }}
                    ></div>

                    <div className={styles.cardContent}>
                        <div>
                            <span className={`${styles.perfumeBrand}`}>{item.brand}</span>
                            <h3 className={`${styles.perfumeTitle}`}>{item.name}</h3>
                        </div>

                        <div className={styles.cardSlideContent}>
                            <div className={styles.tagsInner}>
                                <p className={styles.tagHeading}>{i18n[locale]?.groups}</p>
                                <TagList items={item.group?.map(g => g[locale])} />
                            </div>
                            <div className={styles.tagsInner}>
                                <p className={styles.tagHeading}>{i18n[locale]?.notes}</p>
                                <TagList items={item.notes?.map(n => n[locale])} />
                            </div>
                        </div>
                    </div>

                    <div id={descriptionId} className="screenReaderOnly">
                        {
                            `${item.brand} ${item.name}.
                             ${i18n[locale]?.groups}: ${item.group.map(g => g[locale]).join(', ')}. 
                             ${i18n[locale]?.notes}: ${item.notes.map(n => n[locale]).join(', ')}`
                        }
                    </div>
                </div>
            </div>

            <Popup
                title={i18n[locale]?.removePerfumeTitle}
                subtitle={i18n[locale]?.removePerfumeSubtitle}
                footer={
                    <>
                        <Button
                            label={i18n[locale]?.cancelRemovePerfume}
                            onClick={() => setIsRemovePerfumePopupOpen(false)}
                        />
                        <Button
                            label={i18n[locale]?.confirmRemovePerfume}
                            onClick={() => onDeleteClick(item.id)}
                        />
                    </>
                }
                isOpen={isRemovePerfumePopupOpen}
                onClose={() => setIsRemovePerfumePopupOpen(false)}
            />
        </>
    );
}