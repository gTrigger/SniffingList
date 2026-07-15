import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppSettingsStore = create(
    persist(
        (set) => ({
            isExpanded: false,
            setIsExpanded: (newState) => set({ isExpanded: newState }),

            locale: 'en',
            setLocale: (newLang) => set({ locale: newLang }),
        }),
        {
            name: 'appSettings',
        }
    )
);