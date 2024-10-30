import { useEhrLifeStyleStore } from '~/stores/ehr/lifeStyle';

const useEhrLifeStyleSearch = () => {
    const ehrLifeStyleStore = useEhrLifeStyleStore();

    const { searchLifeStyle } = ehrLifeStyleStore;

    const searchQuery = ref('');
    const loading = ref(false);
    const result = ref<any>([]);

    async function search(newValue: string) {
        searchQuery.value = newValue;
        // if (newValue === '' || newValue.length < 2) return [];
        loading.value = true;
        result.value = await searchLifeStyle(newValue);
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

export default useEhrLifeStyleSearch;
