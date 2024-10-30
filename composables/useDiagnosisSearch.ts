import { useDiagnosisStore } from '~/stores/prescription/useDiagnosisStore';

const useDiagnosisSearch = () => {
    const diagnosisStore = useDiagnosisStore();

    const { searchDiagnosis } = diagnosisStore;

    const searchQuery = ref('');
    const loading = ref(false);
    const result = ref<any>([]);

    async function search(newValue: string) {
        searchQuery.value = newValue;
        if (newValue === '') return [];
        loading.value = true;
        result.value = await searchDiagnosis(newValue);
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

export default useDiagnosisSearch;
