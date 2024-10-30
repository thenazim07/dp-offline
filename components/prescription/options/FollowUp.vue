<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useFollowUpStoreRoot } from '~/stores/prescription/useFollowUpStoreRoot';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';

const { prescription_body_sections } = storeToRefs(useConfigsStore());
const { bodySectionFormData } = storeToRefs(useLayoutsStore());
const tiltle = computed(
    () =>
        bodySectionFormData.value.body.columns.column0.items.follow_up?.label.text ||
        bodySectionFormData.value.body.columns.column1.items.follow_up?.label.text,
);

const followUpStoreRoot = useFollowUpStoreRoot();
const { isShowingFollowUpEditor, selectedFollowUpListIndexToFocus } = storeToRefs(followUpStoreRoot);

const reference = ref(null);
const floating = ref(null);
const { floatingStyles } = useFloatingElement(reference, floating, {
    placement: 'top',
});

function openFollowUpEditor() {
    if (useCheckAllFloatingWindowClosed()) {
        selectedFollowUpListIndexToFocus.value = null;
        isShowingFollowUpEditor.value = true;
    }
}

const onFollowUpListClickHandler = (index: any) => {
    if (useCheckAllFloatingWindowClosed()) {
        selectedFollowUpListIndexToFocus.value = index;
        isShowingFollowUpEditor.value = true;
    }
};

const savingStatusStore = usePrescriptionSavingStatusStore();
const { status } = storeToRefs(savingStatusStore);

function retryForSaving() {
    followUpStoreRoot.syncWithServer();
}
</script>

<template>
    <div
        ref="reference"
        class="FollowUpSectionClass pb-4"
        :class="[
            status.follow_up.status === 'pending' ? ' bg-[#F8FAFC] pt-2' : '',
            status.follow_up.status === 'failed' ? ' bg-[#FFF7F7] pt-2' : '',
        ]"
    >
        <div class="flex justify-between">
            <div class="inline-block cursor-pointer">
                <PrescriptionCommonPrescriptionSectionTitle
                    :title="tiltle || prescription_body_sections.find((x) => x.value == 'follow_up')?.name"
                    :is-empty-text="tiltle === '' || tiltle === null || tiltle === undefined"
                    :active="isShowingFollowUpEditor"
                    @click="openFollowUpEditor"
                />
            </div>
            <PrescriptionCommonPrescriptionCreateSavingStatus
                :status="status.follow_up"
                @retry="retryForSaving"
            />
        </div>

        <PrescriptionFollowUpList @on-list-click="onFollowUpListClickHandler" />
    </div>
    <div
        v-if="isShowingFollowUpEditor"
        ref="floating"
        class="z-10 w-[1036px] overflow-visible scrollbar-thin scrollbar-stable max-1919:w-[966px] max-1599:w-[870px]"
        :style="floatingStyles"
    >
        <PrescriptionFollowUpFloatingWindow />
    </div>
</template>
