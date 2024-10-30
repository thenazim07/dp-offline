import { useChiefComplaintsStore } from '~/stores/prescription/useChiefComplaintsStore';

const useIndicationSearch = (_searchQuery: string = '') => {
    const chiefComplaintsStore = useChiefComplaintsStore();

    const { searchChiefComplaints } = chiefComplaintsStore;

    const searchQuery = ref('');
    const loading = ref(false);
    const result = ref<any>([]);

    const search = async function (newValue: string) {
        return await searchChiefComplaints(newValue);
        searchQuery.value = newValue;
        loading.value = true;
        try {
            //result.value = await searchChiefComplaints(newValue);
        } catch (error) {
            console.log('Error searching for chief complaints', error);
            result.value = [];
        } finally {
            loading.value = false;
        }

        return result.value;
    };

    return {
        searchQuery,
        loading,
        result,
        search,
    };
};

export default useIndicationSearch;
