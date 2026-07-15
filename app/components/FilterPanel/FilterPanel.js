"use client";

import styles from "./FilterPanel.module.css";
import { i18n } from "@/i18n";
import { useAppSettingsStore } from "@/store/useAppSettingsStore";
import { useFilterStore } from "@/store/useFilterStore";
import { useItemsStore } from "@/store/useItemsStore";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import Select from "@/components/common/Select/Select";

export default function FilterPanel() {
    const { locale } = useAppSettingsStore();
    const { items } = useItemsStore();
    const {
        searchQuery, setSearchQuery,
        sortOrder, setSortOrder,
        filterBrand, setFilterBrand,
        filterGroup, setFilterGroup,
        filterNote, setFilterNote
    } = useFilterStore();

    const sortOptions = [
        { id: "asc", label: i18n[locale]?.ascending },
        { id: "desc", label: i18n[locale]?.descending },
    ];

    const uniqueBrands = [...new Set(items.map(item => item.brand).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    const uniqueGroups = Array.from(new Map(items.flatMap(item => item.group || []).map(g => [g.en, g])).values())
        .sort((a, b) => a.en.localeCompare(b.en));
    const uniqueNotes = Array.from(new Map(items.flatMap(item => item.notes || []).map(n => [n.en, n])).values())
        .sort((a, b) => a.en.localeCompare(b.en));


    const resetAllFilters = () => {
        setSearchQuery("");
        setFilterBrand("");
        setFilterGroup("");
        setFilterNote("");
    }

    return (
        <div className={styles.filterPanel}>
            <div className={styles.panelRow}>
                <Input
                    id={"searchInput"}
                    label={i18n[locale]?.searchInput}
                    value={searchQuery}
                    placeholder={i18n[locale]?.searchInputPlaceholder}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select
                    id="sortSelect"
                    isSmall
                    label={i18n[locale]?.sortSelectLabel}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    options={sortOptions}
                    getLabel={(option) => option.label}
                    getValue={(option) => option.id}
                />
            </div>
            <div className={styles.panelRow}>
                <Select
                    id="brandSelect"
                    label={i18n[locale]?.brandSelectLabel}
                    value={filterBrand}
                    onChange={setFilterBrand}
                    onClear={() => setFilterBrand("")}
                    options={uniqueBrands}
                    placeholder={i18n[locale]?.allBrands}
                />

                <Select
                    id="groupSelect"
                    label={i18n[locale]?.groupSelectLabel}
                    value={filterGroup}
                    onChange={setFilterGroup}
                    onClear={() => setFilterGroup("")}
                    options={uniqueGroups}
                    placeholder={i18n[locale]?.allGroups}
                    getLabel={(g) => g[locale]}
                    getValue={(g) => g.en}
                />

                <Select
                    id="noteSelect"
                    label={i18n[locale]?.noteSelectLabel}
                    value={filterNote}
                    onChange={setFilterNote}
                    onClear={() => setFilterNote("")}
                    options={uniqueNotes}
                    placeholder={i18n[locale]?.allNotes}
                    getLabel={(g) => g[locale]}
                    getValue={(g) => g.en}
                />
            </div>

            <div className={styles.panelRow}>
                <Button
                    label={i18n[locale]?.reset}
                    isHidden={!(searchQuery || filterBrand || filterGroup || filterNote)}
                    onClick={resetAllFilters}
                />
            </div>
        </div>
    );
}