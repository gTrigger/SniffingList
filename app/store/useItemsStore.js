import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import defaultData from '@/data/originalCollection.json';

export const useItemsStore = create(
    persist(
        (set) => ({
            items: [],
            setItems: (newItems) => set({ items: newItems }),
            addItem: (newItem) => set((state) => ({
                items: [...state.items, newItem]
            })),
            removeItem: (id) => set((state) => ({
                items: state.items.filter((item) => item.id !== id)
            })),
            removeAll: () => set({ items: [] }),
            loadDefault: () => set({ items: defaultData }),
        }),
        {
            name: 'perfumes',
        }
    )
);