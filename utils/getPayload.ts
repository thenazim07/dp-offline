export default function getPayload(key: string | null = null, data: any, section: string | undefined = undefined) {
    const info = usePrescriptionInitializedInfo();

    const payload = {
        patient_client_ref: String(info?.patient_ref),
        prescription_ref: info?.prescription_ref,
        visitID: info?.visit_ref,
        visit_client_ref: String(info?.visit_ref),
        section,
    };

    return key ? { ...payload, [key]: data } : { ...payload, ...data };
}
