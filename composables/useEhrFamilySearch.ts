import { useEhrFamilyStore } from '~/stores/ehr/family';

const useEhrFamilySearch = () => {
    const ehrFamilyStore = useEhrFamilyStore();

    const { searchFamily } = ehrFamilyStore;

    const searchQuery = ref('');
    const loading = ref(false);
    const result = ref<any>([]);

    async function search(newValue: string) {
        searchQuery.value = newValue;
        // if (newValue === '' || newValue.length < 2) return [];
        loading.value = true;
        result.value = await searchFamily(newValue);
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

export default useEhrFamilySearch;
