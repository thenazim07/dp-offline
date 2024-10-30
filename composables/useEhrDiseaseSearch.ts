import { useEhrDiseaseStore } from '~/stores/ehr/disease';

const useEhrDiseaseSearch = () => {
    const ehrDiseaseStore = useEhrDiseaseStore();

    const { searchDisease } = ehrDiseaseStore;

    const searchQuery = ref('');
    const loading = ref(false);
    const result = ref<any>([]);

    async function search(newValue: string) {
        searchQuery.value = newValue;
        // if (newValue === '' || newValue.length < 2) return [];
        loading.value = true;
        result.value = await searchDisease(newValue);
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

export default useEhrDiseaseSearch;
