import { defineStore } from 'pinia';

export const useEhrStore = defineStore('ehr-store', () => {
    const isShowingPastHistoryEditor: Ref<boolean> = ref(false);

    const ehrFeatures = ref([
        {
            label: 'Disease',
            key: 'disease',
            disabled: false,
        },
        {
            label: 'Medication',
            key: 'medication',
            disabled: false,
        },
        {
            label: 'Investigation',
            key: 'investigation',
            disabled: false,
        },
        {
            label: 'Family',
            key: 'family',
            disabled: false,
        },
        {
            label: 'Lifestyle',
            key: 'lifestyle',
            disabled: false,
        },
        {
            label: 'Others',
            key: 'others',
            disabled: false,
        },
    ]);

    const selectedListIndexToFocus = ref<number | null>(null);
    const currentTabIndex = ref<number | undefined>(0);

    return {
        //getters
        isShowingPastHistoryEditor,
        ehrFeatures,
        selectedListIndexToFocus,
        currentTabIndex,
    };
});
