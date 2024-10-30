<script setup lang="ts">
import { useOnExaminationStoreRoot } from '~/stores/prescription/useOnExaminationStoreRoot';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';

const onExaminationStoreRoot = useOnExaminationStoreRoot();
const { generalExamination } = storeToRefs(onExaminationStoreRoot);

const savingStatusStore = usePrescriptionSavingStatusStore();
const { status } = storeToRefs(savingStatusStore);

function retryForSaving() {
    onExaminationStoreRoot.syncGeneralExaminationWithServer();
}
</script>

<template>
    <div
        v-if="
            generalExamination.vitals.bpm ||
            generalExamination.vitals.temp_as_fahrenheit ||
            generalExamination.vitals.bp.systolic ||
            generalExamination.vitals.bp.diastolic ||
            generalExamination.vitals.A1C ||
            generalExamination.vitals.SPO2 ||
            status.on_examination_general_examination.status === 'failed'
        "
        :class="[
            status.on_examination_general_examination.status === 'pending' ? ' bg-[#F8FAFC] pt-2' : '',
            status.on_examination_general_examination.status === 'failed' ? ' bg-[#FFF7F7] pt-2' : '',
        ]"
    >
        <div class="flex justify-between">
            <h3 class="font-semibold">G/E</h3>
            <PrescriptionCommonPrescriptionCreateSavingStatus
                :status="status.on_examination_general_examination"
                @retry="retryForSaving"
            />
        </div>

        <div class="cursor-pointer space-y-2 text-sm">
            <div v-if="generalExamination.vitals.bpm">
                <UtilityRoundedDot />
                Heart Rate: {{ generalExamination.vitals.bpm }} BPM
            </div>
            <div v-if="generalExamination.vitals.temp_as_fahrenheit">
                <UtilityRoundedDot />
                Body Temperature : {{ generalExamination.vitals.temp_as_fahrenheit }}
            </div>
            <div v-if="generalExamination.vitals.bp.systolic || generalExamination.vitals.bp.diastolic">
                <UtilityRoundedDot />
                Blood Pressure: {{ generalExamination.vitals.bp.systolic }}/{{ generalExamination.vitals.bp.diastolic }}
            </div>
            <div v-if="generalExamination.vitals.A1C">
                <UtilityRoundedDot />
                Glucose Level: {{ generalExamination.vitals.A1C }} mmol/L
            </div>
            <div v-if="generalExamination.vitals.SPO2">
                <UtilityRoundedDot />
                Oxygen Saturation: {{ generalExamination.vitals.SPO2 }}
            </div>
        </div>
    </div>
</template>
