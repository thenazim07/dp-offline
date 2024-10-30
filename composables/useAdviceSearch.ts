import { useAdviceStore } from '~/stores/prescription/useAdviceStore';

const useInvestigationSearch = () => {
    const adviceStore = useAdviceStore();

    const { searchAdvice } = adviceStore;

    const searchQuery = ref('');
    const loading = ref(false);
    const result = ref<any>([]);

    async function search(newValue: string) {
        searchQuery.value = newValue;
        if (newValue === '') return [];
        loading.value = true;
        result.value = await searchAdvice(newValue);
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
