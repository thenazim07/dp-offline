<script lang="ts" setup>
import { useChiefComplaintsStoreRoot } from '~/stores/prescription/useChiefComplaintsStoreRoot';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';

const { prescription_body_sections } = storeToRefs(useConfigsStore());
const { bodySectionFormData } = storeToRefs(useLayoutsStore());
const tiltle = computed(
    () =>
        bodySectionFormData.value.body.columns.column0.items.indication?.label.text ||
        bodySectionFormData.value.body.columns.column1.items.indication?.label.text,
);

const reference = ref(null);
const floating = ref(null);
const { floatingStyles } = useFloatingElement(reference, floating);

const chiefComplaintsStoreRoot = useChiefComplaintsStoreRoot();

const { getAvailableChiefComplaints, isShowingChiefComplaintEditor, selectedChiefComplainListIndexToFocus } =
    storeToRefs(chiefComplaintsStoreRoot);

function onIndicationAreaClickHandler() {
    if (useCheckAllFloatingWindowClosed()) {
        isShowingChiefComplaintEditor.value = true;
    }
}

function onDeleteClickHandler(uuid?: string) {
    chiefComplaintsStoreRoot.deleteIndicationFromList(uuid);
}

const onListClickHandler = (index: any) => {
    if (useCheckAllFloatingWindowClosed()) {
        isShowingChiefComplaintEditor.value = true;
        selectedChiefComplainListIndexToFocus.value = index;
    }
};

const savingStatusStore = usePrescriptionSavingStatusStore();
const { status } = storeToRefs(savingStatusStore);

function retryForSaving() {
    chiefComplaintsStoreRoot.syncWithServer();
}
const toast = useToast();
</script>

<template>
    <div
        ref="reference"
        class="ChiefComplaintsSectionClass pb-4"
        :class="[
            status.chief_complaints.status === 'pending' ? ' pointer-events-none bg-[#F8FAFC] pt-2' : '',
            status.chief_complaints.status === 'failed' ? ' bg-[#FFF7F7] pt-2' : '',
        ]"
    >
        <div class="flex justify-between">
            <div class="inline-block cursor-pointer">
                <PrescriptionCommonPrescriptionSectionTitle
                    :title="tiltle || prescription_body_sections.find((x) => x.value == 'indication')?.name"
                    :active="isShowingChiefComplaintEditor"
                    :is-empty-text="tiltle === '' || tiltle === null || tiltle === undefined"
                    @click.prevent="onIndicationAreaClickHandler"
                />
            </div>
            <PrescriptionCommonPrescriptionCreateSavingStatus
                :status="status.chief_complaints"
                @retry="retryForSaving"
            />
        </div>

        <div>
            <PrescriptionChiefComplaintsPrescriptionScreenComponentComplaintListItem
                v-for="(chiefComplaint, index) in getAvailableChiefComplaints"
                :key="`${chiefComplaint.uuid}`"
                :chief-complain="{
                    title: chiefComplaint?.name,
                    duration: chiefComplaint?.duration?.toString(),
                    durationType: chiefComplaint?.duration_type,
                    durationLocale: chiefComplaint?.duration_locale || 'en',
                    durationText: chiefComplaint?.duration_text,
                    note: chiefComplaint?.value,
                    uuid: chiefComplaint.uuid,
                }"
                :index="index"
                @on-delete-click="onDeleteClickHandler"
                @onListClick="onListClickHandler"
            />
        </div>
    </div>

    <div
        v-if="isShowingChiefComplaintEditor"
        ref="floating"
        class="z-10 min-h-[600px] max-w-[1136px] overflow-auto scrollbar-thin scrollbar-stable max-1919:h-[484px] max-1919:w-[1036px] max-1599:max-w-[920px]"
        :style="floatingStyles"
    >
        <PrescriptionChiefComplaintsFloatingWindow />
    </div>
</template>
