import { defineStore } from 'pinia';

export interface IStatus {
    // success: boolean;
    // failed: boolean;
    // loading: boolean;
    status: 'success' | 'failed' | 'pending' | null;
}

export interface ISectionSavingStatus {
    chief_complaints: IStatus;
    drug: IStatus;
    past_history_diseases: IStatus;
    past_history_drug: IStatus;
    past_history_investigation: IStatus;
    past_history_family: IStatus;
    past_history_life_style: IStatus;
    diagnosis: IStatus;
    on_examination_general_examination: IStatus;
    on_examination_observation: IStatus;
    investigation: IStatus;
    advice: IStatus;
    follow_up: IStatus;
}

type sectionSavingStatusKey = keyof ISectionSavingStatus;

export const usePrescriptionSavingStatusStore = defineStore('usePrescriptionSavingStatusStore', () => {
    const { $api } = useNuxtApp();
    const toast = useToast();

    const status = reactive<ISectionSavingStatus>({
        chief_complaints: {
            status: null,
        },
        drug: {
            status: null,
        },
        past_history_diseases: {
            status: null,
        },
        past_history_drug: {
            status: null,
        },
        past_history_investigation: {
            status: null,
        },
        past_history_family: {
            status: null,
        },
        past_history_life_style: {
            status: null,
        },
        diagnosis: {
            status: null,
        },
        on_examination_general_examination: {
            status: null,
        },
        on_examination_observation: {
            status: null,
        },
        investigation: {
            status: null,
        },
        advice: {
            status: null,
        },
        follow_up: {
            status: null,
        },
    });

    const isLoadingWhileSavingAnySection = computed(() =>
        Object.values(status).some((section) => section.status === 'pending'),
    );
    const isErrorWhileSavingAnySection = computed(() =>
        Object.values(status).some((section) => section.status === 'failed'),
    );

    function changeStatusSuccess(objectKey: sectionSavingStatusKey) {
        status[objectKey].status = 'success';

        setTimeout(() => {
            status[objectKey].status = null;
        }, 2000);
    }

    function resetAllSectionState() {
        for (const section in status) {
            status[section].status = null;
        }
    }

    return {
        status,

        isLoadingWhileSavingAnySection,
        isErrorWhileSavingAnySection,

        changeStatusSuccess,
        resetAllSectionState,
    };
});
