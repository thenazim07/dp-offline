export default function (): object | undefined {
    const prescriptionInfo = useCookie<any>('prescription_initialized_info');
    if (!prescriptionInfo?.value?.prescription_ref) return undefined;

    return prescriptionInfo.value;
}
