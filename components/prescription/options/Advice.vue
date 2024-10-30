<script lang="ts" setup>
import { useAdviceStoreRoot } from '~/stores/prescription/useAdviceStoreRoot';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';

const { prescription_body_sections } = storeToRefs(useConfigsStore());
const { bodySectionFormData } = storeToRefs(useLayoutsStore());
const tiltle = computed(
    () =>
        bodySectionFormData.value.body.columns.column0.items.advise?.label.text ||
        bodySectionFormData.value.body.columns.column1.items.advise?.label.text,
);

const reference = ref(null);
const floating = ref(null);
const { floatingStyles } = useFloatingElement(reference, floating, {
    //placement: 'top',
});

const adviceStoreRoot = useAdviceStoreRoot();

const { getAvailableAdvices, isShowingAdviceEditor, selectedAdviceListIndexToFocus } = storeToRefs(adviceStoreRoot);

function onDeleteClickHandler(uuid?: string) {
    adviceStoreRoot.deleteAdviceFromList(uuid);
}

const onAdviceListClickHandler = (index: any) => {
    if (useCheckAllFloatingWindowClosed()) {
        isShowingAdviceEditor.value = true;
        selectedAdviceListIndexToFocus.value = index;
    }
};

function openAdviceEditor() {
    if (useCheckAllFloatingWindowClosed()) {
        isShowingAdviceEditor.value = true;
    }
}

const savingStatusStore = usePrescriptionSavingStatusStore();
const { status } = storeToRefs(savingStatusStore);

function retryForSaving() {
    adviceStoreRoot.syncWithServer();
}
</script>

<template>
    <div
        ref="reference"
        class="AdviceSectionClass pb-4"
        :class="[
            status.advice.status === 'pending' ? ' pointer-events-none bg-[#F8FAFC] pt-2' : '',
            status.advice.status === 'failed' ? ' bg-[#FFF7F7] pt-2' : '',
        ]"
    >
        <div class="flex justify-between">
            <div class="inline-block cursor-pointer">
                <PrescriptionCommonPrescriptionSectionTitle
                    :title="tiltle || prescription_body_sections.find((x) => x.value == 'advise')?.name"
                    :active="isShowingAdviceEditor"
                    :is-empty-text="tiltle === '' || tiltle === null || tiltle === undefined"
                    @click="openAdviceEditor"
                />
            </div>
            <PrescriptionCommonPrescriptionCreateSavingStatus
                :status="status.advice"
                @retry="retryForSaving"
            />
        </div>

        <div>
            <PrescriptionAdvicePrescriptionScreenComponentAdviceListItem
                v-for="(advice, index) in getAvailableAdvices"
                :key="advice.uuid"
                :advice="{
                    name: advice.name,
                    uuid: advice.uuid,
                }"
                :index="index"
                @on-delete-click="onDeleteClickHandler"
                @onListClick="onAdviceListClickHandler"
            />
        </div>
    </div>

    <div
        v-if="isShowingAdviceEditor"
        ref="floating"
        class="z-50 min-h-[600px] w-[1136px] overflow-auto scrollbar-thin scrollbar-stable max-1919:w-[1036px] max-1599:max-w-[920px]"
        :style="floatingStyles"
    >
        <PrescriptionAdviceFloatingWindow />
    </div>
</template>
