import { usePrescriptionStore } from '~/stores/prescription/usePrescriptionStore';

export function managePrescription() {
    const prescriptionStore = usePrescriptionStore();
    const { hasSelectedPatient, prescriptionCreateInfo, selectedPatient, currentTemplateId } =
        storeToRefs(prescriptionStore);

    const { prescriptionInit, prescriptionInitForFollowUp, resetPrescription } = prescriptionStore;

    return {
        resetPrescription,
        hasSelectedPatient,
        prescriptionCreateInfo,
        selectedPatient,
        currentTemplateId,
        prescriptionInit,
        prescriptionInitForFollowUp,
    };
}
