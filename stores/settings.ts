import { defineStore } from 'pinia';
import type { duration_locale_persist_store_types } from '~/repository/modules/ConfigModule/types';

export const useSettingsStore = defineStore(
    'settings',
    () => {
        // state
        const isOpenSidebar = ref<boolean>(false);
        const showView = ref<'grid' | 'list'>('grid');
        const durationLocales = ref<duration_locale_persist_store_types>({
            chief_complaint: '',
            follow_up: '',
            drug: '',
            past_history_diseases: '',
            past_history_medication: '',
            past_history_life_style: '',
            past_history_others: '',
        });

        // getters
        const isSidebarOpen = computed(() => isOpenSidebar.value);
        const showViewName = computed(() => showView.value);

        // actions
        function sideBarToggle() {
            isOpenSidebar.value = !isOpenSidebar.value;
        }

        function viewToggle() {
            showView.value = showView.value === 'grid' ? 'list' : 'grid';
        }

        function sideBarOpen() {
            isOpenSidebar.value = true;
        }

        function setDurationLocale(key: keyof duration_locale_persist_store_types, value: string) {
            durationLocales.value[key] = value;
        }

        return {
            // states
            isOpenSidebar,
            showView,
            durationLocales,

            // getters
            isSidebarOpen,
            showViewName,

            // actions
            sideBarToggle,
            viewToggle,
            sideBarOpen,
            setDurationLocale,
        };
    },
    {
        persist: true,
    },
);
