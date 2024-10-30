export default function () {
    const cookies = useCookie('prescriptionInitializedInfo');

    if (!cookies?.value) return undefined;

    return {
        patientInfo: cookies.value.patient,
        prescriptionInfo: cookies.value.initializedInfo,
    };
}
