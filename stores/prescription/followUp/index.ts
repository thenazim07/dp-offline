import { defineStore } from 'pinia';
import { format } from 'date-fns';

export const usePrescriptionFollowUpStore = defineStore('prescription-follow-up-store', () => {
    const followup: Ref<any | null> = ref({
        follow_up_notes: [],
    });

    const { $api } = useNuxtApp();
    const toast = useToast();
    const for_section = 'follow_up';

    const searchFollowUp = useDebounceFn(async (query: string) => {
        try {
            const response = await $api.followUp.search(query, for_section);
            if (response && response.data) {
                return response.data;
            }
            return [];
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error, 'follow up search api', error);
            return [];
        }
    }, 500);

    async function createFollowUp(data: any) {
        if (data.follow_up_date) {
            data.follow_up_date = format(data.follow_up_date, 'yyyy-MM-dd');
        }

        try {
            const response = await $api.followUp.create(getPayload(undefined, data));
            followup.value = response?.data;
            return response.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('follow-up-store-api:', error);
        }
    }

    async function createFollowUpNote(data: []) {
        try {
            const notesPayload = data.map(({ name }) => ({ content: name }));

            const response = await $api.followUp.createNote(getPayload('notes', notesPayload, 'follow_up'));

            followup.value.follow_up_notes = response.data;
            return response.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('follow-up-store-api:', error);
        }
    }

    async function deleteFollowUpNote(ref: string) {
        try {
            if (!ref) return;

            const index = followup.value?.follow_up_notes?.findIndex((item: { ref: string }) => item.ref === ref);

            if (index !== -1) {
                followup?.value?.follow_up_notes?.splice(index, 1);
            }

            await $api.followUp.deleteNote(getPayload(undefined, { ref }));
        } catch (error) {
            toast.add({ title: error, color: 'red' });
        }
    }

    function setFollowUpData(data: any) {
        followup.value = data;
    }

    function resetFollowUpData() {
        followup.value.follow_up_notes = [];
        followup.value = null;
    }

    return {
        followup,
        searchFollowUp,
        createFollowUp,
        createFollowUpNote,
        deleteFollowUpNote,
        setFollowUpData,
        resetFollowUpData,
    };
});
