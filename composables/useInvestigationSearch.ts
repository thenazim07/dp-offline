import { useInvestigationStore } from '~/stores/prescription/useInvestigationStore';

const useInvestigationSearch = () => {
    const investigationStore = useInvestigationStore();

    const { searchInvestigation } = investigationStore;

    const searchQuery = ref('');
    const loading = ref(false);
    const result = ref<any>([]);

    async function search(newValue: string) {
        searchQuery.value = newValue;
        if (newValue === '') return [];
        loading.value = true;
        result.value = await searchInvestigation(newValue);
        loading.value = false;
        return result.value;
    }

    return {
        searchQuery,
        loading,
        result,
        search,
    };
};

export default useInvestigationSearch;
