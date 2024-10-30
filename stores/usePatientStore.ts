import { defineStore } from 'pinia';
import { usePrescriptionStore } from '~/stores/prescription/usePrescriptionStore';
export const usePatientStore = defineStore('usePatientStore', () => {
    const { $api } = useNuxtApp();
    const { selectedPatient } = storeToRefs(usePrescriptionStore());
    const perPagePatients: Ref<Object | null> = ref({});
    const searchResult: Ref<Object | null> = ref({});
    const patientDetails: Ref<Object | null> = ref({});
    const patientDetailsInfo: Ref<Object | null> = ref({});
    const searchLoading: Ref<Boolean | false> = ref(false);
    const createLoading: Ref<Boolean | false> = ref(false);
    const isOpenPatientCreateModal: Ref<Boolean | false> = ref(false);
    const toast = useToast();

    const search = useDebounceFn(async (query: string) => {
        if (query === '') {
            searchResult.value = [];
        }
        searchLoading.value = true;
        try {
            const response = await $api.patient.get(`?query=${query}&with_operating_profiles=1&own_patient=1`);
            if (response) {
                searchResult.value = response.data;
                searchLoading.value = false;
            }
        } catch (error) {
            searchLoading.value = false;
            toast.add({ title: error.data.message, color: 'red' });
        }
    }, 500);

    const searchForOwnPatient = useDebounceFn(async (query: Object) => {
        if (typeof query === 'object' || query.length < 1) return;
        searchLoading.value = true;
        try {
            const response = await $api.patient.get(`?query=${query}&own_patient=1&with_operating_profiles=1`);
            if (response) {
                searchResult.value = response.data;
                searchLoading.value = false;
            }
        } catch (error) {
            searchLoading.value = false;
            toast.add({ title: error.data.message, color: 'red' });
        }
    }, 500);

    const patientCreateOrUpdate = (patientInfo: Object) => {
        if (patientInfo.id) {
            return update(patientInfo);
        }
        return create(patientInfo);
    };

    const create = async (patientInfo: Object) => {
        try {
            const response = await $api.patient.create(patientInfo);
            if (response) {
                isOpenPatientCreateModal.value = false;
                await usePrescriptionStore().prescriptionInit(response.data);
                return true;
            }
        } catch (error) {
            toast.add({ title: error.data.message, color: 'red' });
            return false;
        }
    };

    const update = async (patientInfo: Object) => {
        createLoading.value = true;
        try {
            const response = await $api.patient.update(patientInfo);
            if (response) {
                createLoading.value = false;
                selectedPatient.value = response.data;
                isOpenPatientCreateModal.value = false;
                removedSessionStorage(`/doctors/patients/${patientInfo.id}?visit_details=1`);
                return true;
            }
        } catch (error) {
            if (error.data && error.data.message) {
                toast.add({ title: error.data.message, color: 'red' });
            }
            createLoading.value = false;
            return false;
        }
    };

    const setPatientInfo = (patientInfo: Object) => {
        patientDetails.value = patientInfo;
    };

    const hasPatientCreate = computed(() => isOpenPatientCreateModal.value);

    const modalToggleForPatient = (value: any) => (isOpenPatientCreateModal.value = value);

    return {
        search,
        searchForOwnPatient,
        patientCreateOrUpdate,
        searchLoading,
        createLoading,
        searchResult,
        patientDetails,
        patientDetailsInfo,
        setPatientInfo,
        perPagePatients,
        hasPatientCreate,
        modalToggleForPatient,
    };
});
