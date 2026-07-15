import { create } from 'zustand';

export const useFilterStore = create((set) => ({
    searchQuery: '',
    sortOrder: 'asc',
    filterBrand: '',
    filterGroup: '',
    filterNote: '',
    visibleCount: 12,

    initFromParams: (params) => set({
        searchQuery: params.get('q') || '',
        sortOrder: params.get('sort') || 'asc',
        filterBrand: params.get('brand') || '',
        filterGroup: params.get('group') || '',
        filterNote: params.get('note') || '',
    }),

    setSearchQuery: (val) => set({ searchQuery: val }),
    setSortOrder: (val) => set({ sortOrder: val }),
    setFilterBrand: (val) => set({ filterBrand: val }),
    setFilterGroup: (val) => set({ filterGroup: val }),
    setFilterNote: (val) => set({ filterNote: val }),
    setVisibleCount: (val) => set({ visibleCount: val }),

    resetFilters: () => set({
        searchQuery: '',
        sortOrder: 'asc',
        filterBrand: '',
        filterGroup: '',
        filterNote: ''
    })
}));