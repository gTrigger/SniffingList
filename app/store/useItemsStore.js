import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import defaultData from '@/data/originalCollection.json';

const migration = (persistedState, version) => {
  if (version === 1 || !version) {
    return {
      ...persistedState,
      items: persistedState.items.map(enrichItem),
    };
  }
  return persistedState;
}

const enrichItem = (item) => ({
  ...item,
  flatGroups: item.group?.map(g => g.en) || [],
  flatNotes: item.notes?.map(n => n.en) || []
});

export const useItemsStore = create(
    persist(
        (set) => ({
            items: [],
            setItems: (newItems) => set({ items: newItems.map(enrichItem) }),
            addItem: (newItem) => set((state) => ({ items: [...state.items, enrichItem(newItem)] })),
            removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
            removeAll: () => set({ items: [] }),
            loadDefault: () => set({ items: defaultData.map(enrichItem) }),
        }),{
        name: 'perfumes',
        version: 1.1,
        migrate: migration,
      }
    )
);