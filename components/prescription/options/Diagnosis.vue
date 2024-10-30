<script lang="ts" setup>
import { useDiagnosisStoreRoot } from '~/stores/prescription/useDiagnosisStoreRoot';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';

const { prescription_body_sections } = storeToRefs(useConfigsStore());
const { bodySectionFormData } = storeToRefs(useLayoutsStore());
const tiltle = computed(
    () =>
        bodySectionFormData.value.body.columns.column0.items.diagnosis?.label.text ||
        bodySectionFormData.value.body.columns.column1.items.diagnosis?.label.text,
);

const reference = ref(null);
const floating = ref(null);
const { floatingStyles } = useFloatingElement(reference, floating);

const diagnosisStoreRoot = useDiagnosisStoreRoot();

const { getAvailableDiagnoses, isShowingDiagnosisEditor, selectedDiagnosisListIndexToFocus } =
    storeToRefs(diagnosisStoreRoot);

function onDiagnosisAreaClickHandler() {
    if (useCheckAllFloatingWindowClosed()) {
        isShowingDiagnosisEditor.value = true;
    }
}

function onDeleteClickHandler(uuid?: string) {
    diagnosisStoreRoot.deleteDiagnosisFromList(uuid);
}

const onDiagnosisListClickHandler = (index: any) => {
    if (useCheckAllFloatingWindowClosed()) {
        isShowingDiagnosisEditor.value = true;
        selectedDiagnosisListIndexToFocus.value = index;
    }
};

const savingStatusStore = usePrescriptionSavingStatusStore();
const { status } = storeToRefs(savingStatusStore);

function retryForSaving() {
    diagnosisStoreRoot.syncWithServer();
}
</script>

<template>
    <div
        ref="reference"
        class="DiagnosisSectionClass pb-4"
        :class="[
            status.diagnosis.status === 'pending' ? ' pointer-events-none bg-[#F8FAFC] pt-2' : '',
            status.diagnosis.status === 'failed' ? ' bg-[#FFF7F7] pt-2' : '',
        ]"
    >
        <div class="flex justify-between">
            <div class="inline-block cursor-pointer">
                <PrescriptionCommonPrescriptionSectionTitle
                    :title="tiltle || prescription_body_sections.find((x) => x.value == 'diagnosis')?.name"
                    :is-empty-text="tiltle === '' || tiltle === null || tiltle === undefined"
                    :active="isShowingDiagnosisEditor"
                    @click.prevent="onDiagnosisAreaClickHandler"
                />
            </div>
            <PrescriptionCommonPrescriptionCreateSavingStatus
                :status="status.diagnosis"
                @retry="retryForSaving"
            />
        </div>

        <div>
            <PrescriptionDiagnosisPrescriptionScreenComponentDiagnosisListItem
                v-for="(diagnosis, index) in getAvailableDiagnoses"
                :key="diagnosis.uuid"
                :diagnosis="{
                    name: diagnosis.name,
                    note: diagnosis.note,
                    uuid: diagnosis.uuid,
                }"
                :index="index"
                @on-delete-click="onDeleteClickHandler"
                @onListClick="onDiagnosisListClickHandler"
            />
        </div>
    </div>

    <div
        v-if="isShowingDiagnosisEditor"
        ref="floating"
        class="z-10 min-h-[600px] w-[1136px] overflow-auto scrollbar-thin scrollbar-stable max-1919:w-[1036px] max-1599:max-w-[920px]"
        :style="floatingStyles"
    >
        <PrescriptionDiagnosisFloatingWindow />
    </div>
</template>
