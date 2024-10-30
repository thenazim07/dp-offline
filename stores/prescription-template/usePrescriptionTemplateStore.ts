import { defineStore } from 'pinia';
import { usePrescriptionStore } from '../prescription/usePrescriptionStore';
import { useDoctorVisitsStore } from '../doctor/visits';
import type {
    IFullPrescriptionTemplate,
    IPrescriptionTemplate,
    IPrescriptionTemplateDeletePayload,
    IPrescriptionTemplateStorePayload,
    IPrescriptionTemplateUpdatePayload,
} from '~/repository/modules/PrescriptionTemplateModule/types';

export const usePrescriptionTemplateStore = defineStore('prescription-template', () => {
    const { $api } = useNuxtApp();
    const showTemplateListView = ref<boolean>(false);
    const searchQuery: Ref<string> = ref('');
    const isTemplateLoading = ref(false);

    // state
    const storePrescriptionTemplatePayload: Ref<IPrescriptionTemplateStorePayload> = ref(
        emptyStorePrescriptionTemplatePayload(),
    );
    const currentPrescriptionTemplate: Ref<IPrescriptionTemplate | null> = ref(null);
    const fullPrescriptionTemplate: Ref<IFullPrescriptionTemplate | null> = ref(null);
    const isPrescriptionTemplateEditMode: Ref<boolean> = ref(false);
    const prescriptionTemplates: Ref<IPrescriptionTemplate[]> = ref([]);

    function emptyStorePrescriptionTemplatePayload(): IPrescriptionTemplateStorePayload {
        return {
            name: '',
            description: '',
            score: 0,
        };
    }

    // getters
    const filteredPrescriptionTemplates = computed(() => {
        if (searchQuery.value) {
            return prescriptionTemplates.value.filter((prescriptionTemplate) =>
                prescriptionTemplate.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
            );
        }

        return prescriptionTemplates.value;
    });

    // actions
    async function storePrescriptionTemplate(
        payload: IPrescriptionTemplateStorePayload,
        isSetAsCurrentPrescriptionTemplate: boolean = false,
    ): Promise<void> {
        const response = await $api.prescriptionTemplate.createPrescriptionTemplate(payload);

        if (isSetAsCurrentPrescriptionTemplate) {
            currentPrescriptionTemplate.value = response.data;
        }
    }

    async function fetchFullPrescriptionTemplate(id: string | number): Promise<void> {
        const response = await $api.prescriptionTemplate.fetchPrescriptionTemplate(id);
        fullPrescriptionTemplate.value = response.data;
    }

    async function updatePrescriptionTemplate(payload: IPrescriptionTemplateUpdatePayload, id: number): Promise<void> {
        await $api.prescriptionTemplate.updatePrescriptionTemplate(payload, id);
    }

    async function createPrescriptionSaveAsTemplate(): Promise<void> {
        const prescriptionInfo = usePrescriptionInitializedInfo();
        await $api.prescriptionTemplate.createPrescriptionSaveAsTemplate(
            storePrescriptionTemplatePayload.value,
            prescriptionInfo?.prescription_ref,
        );
        storePrescriptionTemplatePayload.value = emptyStorePrescriptionTemplatePayload();
    }

    async function fetchPrescriptionTemplates(): Promise<void> {
        isTemplateLoading.value = true;
        const response = await $api.prescriptionTemplate.fetchPrescriptionTemplates();

        prescriptionTemplates.value = response.data || [];
        isTemplateLoading.value = false;
    }

    async function deletePrescriptionTemplate(payload: IPrescriptionTemplateDeletePayload): Promise<void> {
        await $api.prescriptionTemplate.deletePrescriptionTemplate(payload);
    }

    function deletePrescriptionTemplateFromList(id: number): void {
        prescriptionTemplates.value = prescriptionTemplates.value.filter(
            (prescriptionTemplate) => prescriptionTemplate.id !== id,
        );
    }

    function turnOnPrescriptionTemplateEditMode(): void {
        isPrescriptionTemplateEditMode.value = true;
    }

    function turnOffPrescriptionTemplateNotEditMode(): void {
        isPrescriptionTemplateEditMode.value = false;
    }

    function resetSearchQuery(): void {
        searchQuery.value = '';
    }

    return {
        // state
        storePrescriptionTemplatePayload,
        prescriptionTemplates,
        isPrescriptionTemplateEditMode,
        currentPrescriptionTemplate,
        fullPrescriptionTemplate,
        showTemplateListView,
        searchQuery,
        isTemplateLoading,

        // getters
        filteredPrescriptionTemplates,
        // actions
        storePrescriptionTemplate,
        fetchPrescriptionTemplates,
        deletePrescriptionTemplate,
        deletePrescriptionTemplateFromList,
        turnOnPrescriptionTemplateEditMode,
        turnOffPrescriptionTemplateNotEditMode,

        updatePrescriptionTemplate,
        fetchFullPrescriptionTemplate,
        createPrescriptionSaveAsTemplate,
        resetSearchQuery,
    };
});
