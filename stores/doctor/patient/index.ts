import { defineStore } from 'pinia';
import { usePrescriptionStore } from '~/stores/prescription/usePrescriptionStore';

export const useDoctorPatientStore = defineStore('doctor-patient-store', () => {
    const { $api } = useNuxtApp();
    const initialized: Ref<boolean | false> = ref(false);

    const searchPatients = async (query: string) => {
        try {
            return await $api.doctorPatient.featchOwnPatient(query);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error, 'Search chief complaints');
            return [];
        }
    };

    async function featchPatientInfoForPrescription() {
        if (initialized.value) return;
        initialized.value = true;

        const info = usePrescriptionInitializedInfo();
        if (!info) return;

        try {
            const response = await $api.doctorPatient.featchPatientInfo(info.patient_ref);

            if (!response?.data) return;
            usePrescriptionStore().setPrescriptionPatientInfo(response.data);
            return response.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('featch-prescription-patient-api:', error);
            return [];
        }
    }

    async function featchPatientList(query: string | undefined = undefined) {
        try {
            const response = await $api.doctorPatient.featchPatientList(query);
            return response.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('featch-patient-api:', error);
            return [];
        }
    }

    async function featchPatientVisitDetails(patientID: number) {
        try {
            const response = await $api.doctorPatient.featchPatientVisitDetails(patientID);
            return response.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('featch-patient-visit-details-api:', error);
            return [];
        }
    }

    const create = (patientInfo: any): Promise<any> => {
        return $api.patient
            .create(patientInfo)
            .then((response) => {
                if (response) {
                    return response.data;
                }
                return null;
            })
            .catch((error) => {
                throw error;
            });
    };

    return {
        create,
        searchPatients,
        featchPatientInfoForPrescription,
        featchPatientList,
        featchPatientVisitDetails,
    };
});
