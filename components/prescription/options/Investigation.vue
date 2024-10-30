<script lang="ts" setup>
import { useInvestigationStoreRoot } from '~/stores/prescription/useInvestigationStoreRoot';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';

const { prescription_body_sections } = storeToRefs(useConfigsStore());
const { bodySectionFormData } = storeToRefs(useLayoutsStore());
const tiltle = computed(
    () =>
        bodySectionFormData.value.body.columns.column0.items.investigation?.label.text ||
        bodySectionFormData.value.body.columns.column1.items.investigation?.label.text,
);

const reference = ref(null);
const floating = ref(null);
const { floatingStyles } = useFloatingElement(reference, floating);

const investigationStoreRoot = useInvestigationStoreRoot();

const { getAvailableInvestigations, isShowingInvestigationEditor, selectedInvestigationListIndexToFocus } =
    storeToRefs(investigationStoreRoot);

function onDeleteClickHandler(uuid?: string) {
    investigationStoreRoot.deleteInvestigationFromList(uuid);
}

const onInvestigationListClickHandler = (index: any) => {
    if (useCheckAllFloatingWindowClosed()) {
        isShowingInvestigationEditor.value = true;
        selectedInvestigationListIndexToFocus.value = index;
    }
};

function openInvestigationEditor() {
    if (useCheckAllFloatingWindowClosed()) {
        isShowingInvestigationEditor.value = true;
    }
}

const savingStatusStore = usePrescriptionSavingStatusStore();
const { status } = storeToRefs(savingStatusStore);

function retryForSaving() {
    investigationStoreRoot.syncWithServer();
}
</script>

<template>
    <div
        ref="reference"
        class="InvestigationSectionClass pb-4"
        :class="[
            status.investigation.status === 'pending' ? ' pointer-events-none bg-[#F8FAFC] pt-2' : '',
            status.investigation.status === 'failed' ? ' bg-[#FFF7F7] pt-2' : '',
        ]"
    >
        <div class="flex justify-between">
            <div class="inline-block cursor-pointer">
                <PrescriptionCommonPrescriptionSectionTitle
                    :title="tiltle || prescription_body_sections.find((x) => x.value == 'investigation')?.name"
                    :is-empty-text="tiltle === '' || tiltle === null || tiltle === undefined"
                    :active="isShowingInvestigationEditor"
                    @click="openInvestigationEditor"
                />
            </div>
            <PrescriptionCommonPrescriptionCreateSavingStatus
                :status="status.investigation"
                @retry="retryForSaving"
            />
        </div>

        <div>
            <PrescriptionInvestigationPrescriptionScreenComponentInvestigationListItem
                v-for="(investigation, index) in getAvailableInvestigations"
                :key="investigation.uuid"
                :investigation="{
                    name: investigation.name,
                    instruction: investigation.instruction,
                    uuid: investigation.uuid,
                }"
                :index="index"
                @on-delete-click="onDeleteClickHandler"
                @onListClick="onInvestigationListClickHandler"
            />
        </div>
    </div>

    <div
        v-if="isShowingInvestigationEditor"
        ref="floating"
        class="z-10 min-h-[600px] w-[1136px] overflow-auto scrollbar-thin scrollbar-stable max-1919:w-[1036px] max-1599:max-w-[920px]"
        :style="floatingStyles"
    >
        <PrescriptionInvestigationFloatingWindow />
    </div>
</template>
