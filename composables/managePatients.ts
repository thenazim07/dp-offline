import { usePatientStore } from '~~/stores/usePatientStore';

export const managePatients = () => {
    const patient = usePatientStore();

    const { searchLoading, createLoading, searchResult, perPagePatients, patientDetails, hasPatientCreate } =
        storeToRefs(patient);

    const { search, setPatientInfo, modalToggleForPatient } = patient;
    const isShowMoreInput = ref(false);

    const onSearch = useDebounceFn((query) => {
        search(query);
    }, 500);

    return {
        isShowMoreInput,

        // New
        onSearch,
        searchResult,
        setPatientInfo,
        searchLoading,
        createLoading,
        perPagePatients,
        patientDetails,
        hasPatientCreate,
        modalToggleForPatient,
    };
};
