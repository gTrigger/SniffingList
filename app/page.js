"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { i18n } from "./i18n";
import { useAppSettingsStore } from "./store/useAppSettingsStore";
import { useItemsStore } from "./store/useItemsStore";
import { useFilterStore } from './store/useFilterStore';
import styles from "./page.module.css";
import ParallaxCard from "./components/ParallaxCard/ParallaxCard";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import AddPerfumePopup from "@/components/Popups/AddPerfumePopup/AddPerfumePopup";
import LoadCollectionPopup from "@/components/Popups/LoadCollectionPopup/LoadCollectionPopup";
import Button from "@/components/common/Button/Button";

function HomeContent() {
    const observer = useRef(null);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isMounted, setIsMounted] = useState(false);

    const [isAddPerfumePopupOpen, setIsAddPerfumePopupOpen] = useState(false);
    const [isLoadCollectionPopupOpen, setIsLoadCollectionPopupOpen] = useState(false);

    const [visibleCount, setVisibleCount] = useState(12);

    const { locale } = useAppSettingsStore();
    const { items, removeItem } = useItemsStore();
    const {
        searchQuery,
        sortOrder,
        filterBrand,
        filterGroup,
        filterNote,
    } = useFilterStore();

    const initFromParams = useFilterStore(state => state.initFromParams);

    useEffect(() => {
        initFromParams(searchParams);
    }, [searchParams, initFromParams]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        if (searchQuery) params.set('q', searchQuery); else params.delete('q');
        if (sortOrder) params.set('sort', sortOrder); else params.delete('sort');
        if (filterBrand) params.set('brand', filterBrand); else params.delete('brand');
        if (filterGroup) params.set('group', filterGroup); else params.delete('group');
        if (filterNote) params.set('note', filterNote); else params.delete('note');

        router.replace(`${pathname}?${params.toString()}`);
    }, [searchQuery, sortOrder, filterBrand, filterGroup, filterNote, router, pathname]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleRemoveOne = (id) => {
        removeItem(id);
    };

    const filteredItems = items.filter(item => {
        const query = searchQuery.toLowerCase();
        const matchesQuery = !query ||
            (item.name?.toLowerCase().includes(query)) ||
            (item.brand?.toLowerCase().includes(query)) ||
            (item.group?.some(g => g[locale]?.toLowerCase().includes(query))) ||
            (item.notes?.some(n => n[locale]?.toLowerCase().includes(query)));

        const matchesBrand = !filterBrand || item.brand === filterBrand;
        const matchesGroup = !filterGroup || item.group?.some(g => g.en === filterGroup);
        const matchesNote = !filterNote || item.notes?.some(n => n.en === filterNote);

        return matchesQuery && matchesBrand && matchesGroup && matchesNote;
    }).sort((a, b) => {
        const nameA = `${a.brand} ${a.name}`.toLowerCase();
        const nameB = `${b.brand} ${b.name}`.toLowerCase();
        return sortOrder === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
    });

    const displayedItems = filteredItems.slice(0, visibleCount);

    const lastItemRef = useCallback((node) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && visibleCount < filteredItems.length) {
                setVisibleCount(prev => prev + 12);
            }
        });
        if (node) observer.current.observe(node);
    }, [visibleCount, filteredItems.length]);

    if (!isMounted) {
        return null;
    }

    return (
        <div className={styles.container}>
            {items.length === 0 && (
                <div className={styles.emptyCollection}>
                    <img src={'/assets/EmptyCollection.gif'} alt={i18n[locale]?.emptyCollection}/>

                    <div className="title">{i18n[locale]?.emptyCollectionTitle} 👁👄👁</div>
                    <p className="subtitle">
                        {i18n[locale]?.emptyCollectionSubtitle}
                        &nbsp;
                        <Button
                            className={styles.linkButton}
                            label={i18n[locale]?.emptyCollectionSubtitleAddPerfume}
                            onClick={() => setIsAddPerfumePopupOpen(true)}
                        />
                        &nbsp;
                        {i18n[locale]?.or}
                        &nbsp;
                        <Button
                            className={styles.linkButton}
                            label={i18n[locale]?.emptyCollectionSubtitleLoadCollection}
                            onClick={() => setIsLoadCollectionPopupOpen(true)}
                        />
                        ?
                    </p>
                </div>
            )}
            {items.length > 0 && (
                <>
                    <div className={`${styles.stats} subtitle`}>
                        {searchQuery || filterBrand || filterGroup || filterNote ? (
                            <p>{i18n[locale]?.found}: {filteredItems.length} {i18n[locale]?.of} {items.length}</p>
                        ) : (
                            <p>{i18n[locale]?.total}: {items.length}</p>
                        )}
                    </div>

                    <div className={styles.grid}>
                        {displayedItems.map((item, index) => (
                            <div ref={index === displayedItems.length - 1 ? lastItemRef : null} key={item.id}>
                                <ParallaxCard
                                    item={item}
                                    onDeleteClick={handleRemoveOne}
                                />
                            </div>
                        ))}
                    </div>

                    <ScrollToTop />
                </>
            )}
            <AddPerfumePopup
                isOpen={isAddPerfumePopupOpen}
                onClose={() => setIsAddPerfumePopupOpen(false)}
            />

            <LoadCollectionPopup
                isOpen={isLoadCollectionPopupOpen}
                onClose={() => setIsLoadCollectionPopupOpen(false)}
            />
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HomeContent />
        </Suspense>
    );
}