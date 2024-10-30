import { usePrescriptionDrugStore } from '~/stores/prescription/useDrugStore';


const useEhrDrugSearch = () => {
    const prescriptionDrugStore = usePrescriptionDrugStore();

    const { searchDrug } = prescriptionDrugStore;

    const searchQuery = ref('');
    const loading = ref(false);
    const result = ref<any>([]);

    async function search(newValue: string) {
        searchQuery.value = newValue;
        // if (newValue === '') return [];
        loading.value = true;
        result.value = await searchDrug(newValue);
        loading.value = false;
        return result.value;
    }

    async function initialDrugSearchListFetch() {
        loading.value = true;
        result.value = await searchDrug('');
        loading.value = false;
        return result.value;
    }

    return {
        searchQuery,
        loading,
        result,
        search,
        initialDrugSearchListFetch,
    };
};

export default useEhrDrugSearch;
