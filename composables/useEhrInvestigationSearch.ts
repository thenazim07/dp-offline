import { useEhrInvestigationHistoryStore } from '~/stores/ehr/investigations';
import { useEhrInvestigationStoreRoot } from '~/stores/ehr/useInvestigationStoreRoot';

const useEhrInvestigationSearch = () => {
    const ehrInvestigationStore = useEhrInvestigationHistoryStore();

    const { searchInvestigation } = ehrInvestigationStore;

    const searchQuery = ref('');
    const loading = ref(false);
    const result = ref<any>([]);

    async function search(newValue: string) {
        searchQuery.value = newValue;
        // if (newValue === '' || newValue.length < 2) return [];
        loading.value = true;
        result.value = await searchInvestigation(newValue);
        loading.value = false;
        return result.value;
    }

    async function initialInvestigationSearchFetch(value: string = '') {
        loading.value = true;
        result.value = await searchInvestigation(value);
        investigationSearchList.value = result.value || [];
        loading.value = false;
        return result.value;
    }

    return {
        searchQuery,
        loading,
        result,
        search,
        initialInvestigationSearchFetch,
    };
};

export default useEhrInvestigationSearch;
