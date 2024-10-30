import { v4 as uuid } from 'uuid';
import { usePrescriptionSavingStatusStore } from '../usePrescriptionSavingStatusStore';
import type { IFollowUpAdvice, IFollowUp, IFollowUpNote } from '~/repository/modules/Prescription/FollowUpModule/types';
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';

export const useFollowUpStoreRoot = defineStore('follow-up-store-root', () => {
    const { $api } = useNuxtApp();
    const isShowingFollowUpEditor = ref(false);
    const followUp = ref<IFollowUp>(emptyFollowUp());
    // const followUpNotes = ref<IFollowUpNote[]>([emptyFollowUpNote()]);
    const followUpAdvice = ref<IFollowUpAdvice[]>([emptyFollowUpAdvice()]);
    const prescriptionTemplateStore = usePrescriptionTemplateStore();
    const selectedFollowUpListIndexToFocus = ref<number | null>(null);

    // const getAvailableFollowUpNotes = computed(() => followUp.value.follow_up_notes.slice(0, -1));
    const getAvailableFollowUpAdvice = computed(() => followUp.value.advice.slice(0, -1));

    // const getOnlySelectedFollowUpNoteContents = computed(() =>
    //     getAvailableFollowUpNotes.value.map((followUpNote) => followUpNote.content),
    // );

    function updateFollowUp<T extends keyof IFollowUp>(key: T, value: IFollowUp[T]): void {
        followUp.value = {
            ...followUp.value,
            [key]: value,
        };
    }

    function updateFollowUpAdvise<T extends keyof IFollowUpAdvice>(
        index: number,
        key: T,
        value: IFollowUpAdvice[T],
    ): void {
        followUp.value.advice.splice(index, 1, {
            ...followUp.value.advice[index],
            [key]: value,
        });

        followUpAdvice.value.splice(index, 1, {
            ...followUpAdvice.value[index],
            [key]: value,
        });

        if (index === followUpAdvice.value.length - 1) {
            // addNewBlankFollowUpNote();
            addNewBlankFollowUpAdvice();
        }
    }

    // function addNewBlankFollowUpNote() {
    //     followUp.value.follow_up_notes.push(emptyFollowUpNote());

    //     followUpNotes.value.push(emptyFollowUpNote());
    // }
    function addNewBlankFollowUpAdvice() {
        followUp.value.advice.push(emptyFollowUpAdvice());

        followUpAdvice.value.push(emptyFollowUpAdvice());
    }

    // function addNewFollowUpNote<T extends keyof IFollowUpNote>(data?: Record<T, IFollowUpNote[T]>) {
    //     const index = followUp.value.follow_up_notes.length === 0 ? 0 : followUp.value.follow_up_notes.length - 1;
    //     followUp.value = {
    //         ...followUp.value,
    //         follow_up_notes: [
    //             ...followUp.value.follow_up_notes.slice(0, index),
    //             emptyFollowUpNote(data),
    //             ...followUp.value.follow_up_notes.slice(index),
    //         ],
    //     };
    // }

    function emptyFollowUp(): IFollowUp {
        return {
            description: null,
            date: '',
            within: '',
            // follow_up_notes: [emptyFollowUpNote()],
            advice: [emptyFollowUpAdvice()],
            prescription_ref: undefined,
            duration: '',
            duration_type: '',
            duration_locale: 'en',
            follow_up_date: '',
            ref: undefined,
        };
    }

    // function emptyFollowUpNote<T extends keyof IFollowUpNote>(data?: Record<T, IFollowUpNote[T]>): IFollowUpNote {
    //     const defaultFollowUp: IFollowUpNote = {
    //         prescription_ref: '',
    //         ref: '',
    //         id: undefined,
    //         note_id: undefined,
    //         content: '',
    //         section: 'follow_up',
    //         uuid: uuid(),
    //     };

    //     return {
    //         ...defaultFollowUp,
    //         ...data,
    //     };
    // }

    function emptyFollowUpAdvice<T extends keyof IFollowUpAdvice>(
        data?: Record<T, IFollowUpAdvice[T]>,
    ): IFollowUpAdvice {
        const defaultAdvice: IFollowUpAdvice = {
            prescription_ref: '',
            ref: '',
            weight: 1,
            name: '',
            advice_id: null,
            uuid: uuid(),
        };

        return {
            ...defaultAdvice,
            ...data,
        };
    }

    // function isAlreadySelected(name: string): boolean {
    //     return getOnlySelectedFollowUpNoteContents.value.includes(name);
    // }

    const savingStatusStore = usePrescriptionSavingStatusStore();
    const { status } = storeToRefs(savingStatusStore);
    const toast = useToast();

    async function syncWithServer() {
        try {
            status.value.follow_up.status = 'pending';

            const info = usePrescriptionInitializedInfo();

            const _followUp = { ...followUp.value };

            if (_followUp.follow_up_date) {
                delete _followUp.duration_type;
                delete _followUp.duration;
                delete _followUp.within;
            } else {
                delete _followUp.follow_up_date;
                if (_followUp.duration) _followUp.within = `${_followUp.duration} ${_followUp.duration_type}`;
                else _followUp.within = '';
            }

            console.log('syncWithServer', _followUp);

            const followUpPayload = getPayload(undefined, {
                ..._followUp,
                prescription_ref: info?.prescription_ref,
            });

            let advicePayload = useRemoveObjectWithEmptyProperty(
                followUpAdvice.value.map((advice) => ({ name: advice.name, weight: 1 })),
                'name',
            );

            advicePayload = getPayload('advices', advicePayload, 'follow_up');

            const isPrescriptionTemplateEditMode =
                prescriptionTemplateStore.isPrescriptionTemplateEditMode &&
                prescriptionTemplateStore.currentPrescriptionTemplate?.prescription_ref;
            if (isPrescriptionTemplateEditMode) {
                followUpPayload.prescription_ref =
                    prescriptionTemplateStore.currentPrescriptionTemplate?.prescription_ref;
                advicePayload.prescription_ref =
                    prescriptionTemplateStore.currentPrescriptionTemplate?.prescription_ref;
            }

            const response = await $api.followUp.createFollowUpAdvice(advicePayload);

            $api.followUp.create(followUpPayload).then((response) => {
                // followUp.value = JSON.parse(JSON.stringify(response?.data)) as IFollowUp;
                if (response?.data) updateServerData(response?.data);
            });

            // if (response.data) {
            //     followUp.value.follow_up_notes = response.data as IFollowUpNote[];
            // }

            savingStatusStore.changeStatusSuccess('follow_up');
        } catch (e) {
            // console.log('indication error',e);
            status.value.follow_up.status = 'failed';
            toast.add({ title: 'Your internet connection is slow</br>Some changes could not be saved', color: 'red' });
        } finally {
            // status.value.follow_up.loading = false;
        }
    }

    function updateServerData(_followup: IFollowUp) {
        followUp.value = {
            description: _followup?.description,
            within: _followup?.within,
            duration: _followup?.duration,
            date: _followup.date,
            prescription_ref: _followup?.prescription_ref,
            duration_type: _followup?.duration_type,
            duration_locale: _followup?.duration_locale,
            duration_text: _followup?.duration_text,
            follow_up_date: followUp.value.follow_up_date,
            // follow_up_notes: [
            //     ..._followup?.follow_up_notes.map((followUpNote) => ({ ...followUpNote, uuid: uuid() })),
            //     emptyFollowUpNote(),
            // ],
            advice: [
                ..._followup?.advice.map((followUpAdvice) => ({ ...followUpAdvice, uuid: uuid() })),
                emptyFollowUpAdvice(),
            ],
            ref: _followup.ref,
        };

        // followUpNotes.value = [
        //     ..._followup?.follow_up_notes.map((note) => {
        //         const _note = { ...note };

        //         _note.uuid = uuid();
        //         _note.name = note.content;
        //         _note.content = note.content;

        //         return _note;
        //     }),
        //     emptyFollowUpNote(),
        // ];

        followUpAdvice.value = [
            ..._followup?.advice.map((advice) => {
                const _advice = { ...advice };

                _advice.uuid = uuid();
                _advice.name = advice?.name;
                _advice.ref = advice?.ref;
                _advice.weight = advice?.weight;
                _advice.ref = advice?.ref;
                _advice.advice_id = advice?.advice_id;
                _advice.prescription_ref = advice?.prescription_ref;

                return _advice;
            }),
            emptyFollowUpAdvice(),
        ];
    }

    // function deleteFollowUpNote(noteIndex: number) {
    //     followUpNotes.value = followUpNotes.value.filter((_, index) => index !== noteIndex);
    //     followUp.value.follow_up_notes = followUp.value.follow_up_notes.filter((_, index) => index !== noteIndex);
    // }

    function deleteFollowUpAdvice(noteIndex: number) {
        followUpAdvice.value = followUpAdvice.value.filter((_, index) => index !== noteIndex);
        followUp.value.advice = followUp.value.advice.filter((_, index) => index !== noteIndex);
    }

    function deleteFollowUpAdviceFromServer(noteIndex: number) {
        const followUpAdviceToRemove = followUpAdvice.value[noteIndex];

        deleteFollowUpAdvice(noteIndex);

        if (followUpAdviceToRemove) {
            $api.followUp.deleteAdvice(
                getPayload(undefined, {
                    ref: followUpAdviceToRemove.ref,
                }),
            );
        }
    }

    function deleteFollowUp() {
        if (followUp) {
            $api.followUp
                .delete({
                    prescription_ref: followUp.value.prescription_ref,
                    ref: followUp.value.ref,
                })
                .then((res) => {
                    $reset();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    function $reset() {
        followUp.value = emptyFollowUp();
        // followUpNotes.value = [emptyFollowUpNote()];
        followUpAdvice.value = [emptyFollowUpAdvice()];
    }

    return {
        // state
        isShowingFollowUpEditor,
        followUp,
        // followUpNotes,
        followUpAdvice,
        selectedFollowUpListIndexToFocus,

        // getters
        // getAvailableFollowUpNotes,
        // getOnlySelectedFollowUpNoteContents,
        getAvailableFollowUpAdvice,

        // actions
        updateFollowUpAdvise,
        // addNewBlankFollowUpNote,
        addNewBlankFollowUpAdvice,
        // addNewFollowUpNote,
        updateFollowUp,
        // deleteFollowUpNote,
        deleteFollowUpAdvice,
        // isAlreadySelected,
        syncWithServer,
        updateServerData,
        deleteFollowUp,
        deleteFollowUpAdviceFromServer,
        $reset,
    };
});
