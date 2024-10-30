<script lang="ts" setup>
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';
import { usePrescriptionStore } from '~/stores/prescription/usePrescriptionStore';
import { useLayoutsStore } from '~/stores/useLayoutsStore';
const { resetPrescription } = usePrescriptionStore();
const { selectedPatient, currentTemplateId } = storeToRefs(usePrescriptionStore());
const { prescriptionLayoutsData } = storeToRefs(useLayoutsStore());
const { hasPatientCreate, modalToggleForPatient } = managePatients();
const layoutsPatientSectionStor = useLayoutsPatientSectionStore();
const { currentPatientSectionRow } = storeToRefs(layoutsPatientSectionStor);
const savingStatusStore = usePrescriptionSavingStatusStore();

const patientInfoKey = computed(() => {
    return prescriptionLayoutsData?.value?.patient_section?.row || [];
});

const resetPrescriptionData = () => {
    resetPrescription();
    currentTemplateId.value = null;

    savingStatusStore.resetAllSectionState();

};

onMounted(() => {
    layoutsPatientSectionStor.fetchPatientSection();
});
</script>

<template>
    <!-- <section
        v-if="selectedPatient && patientInfoKey[0]"
        class="flex h-auto w-full items-center space-x-2 border-b border-t border-slate-500 px-2"
    >
        <div class="w-full flex-1 py-2">
            <div
                v-for="item in patientInfoKey[0].column"
                :key="item.title"
                class="inline-flex truncate"
                :style="`width:${item.width}%`"
            >
                <PrescriptionPatientSectionItem
                    :name="item.item"
                    :title="item.title"
                    :value="item.title === 'Age' ? selectedPatient : selectedPatient[item.item]"
                />
            </div>

            <template v-if="patientInfoKey.length > 1">
                <div
                    v-for="item in patientInfoKey[1].column"
                    :key="item.name"
                    :style="`width:${item.width}%`"
                    class="inline-flex truncate"
                >
                    <PrescriptionPatientSectionItem
                        :name="item.item"
                        :title="item.title"
                        :value="selectedPatient[item.item]"
                    />
                </div>
            </template>
        </div>

        <div class="flex w-12 flex-shrink-0 items-center space-x-2">
            <div>
                <TrashIcon
                    class="h-5 w-5 cursor-pointer text-red-500"
                    @click="resetPrescriptionData"
                />
            </div>

            <div>
                <PencilSquareIcon
                    class="h-5 w-5 cursor-pointer text-gray-600"
                    @click="modalToggleForPatient(true)"
                ></PencilSquareIcon>
            </div>
        </div>
    </section> -->
    <section
        v-if="selectedPatient && currentPatientSectionRow.length > 0"
        class="flex h-auto w-full items-center space-x-2 border-b border-t border-slate-500 px-2"
    >
        <div class="flex w-full flex-col py-2">
            <div
                v-for="(row, rowIndex) in currentPatientSectionRow"
                :key="rowIndex"
                class="flex w-full flex-wrap justify-start gap-4"
            >
                <div
                    v-for="(column, columnIndex) in row.columns"
                    :key="columnIndex"
                    class="inline-flex truncate"
                    :class="column.item == 'name' || column.item == 'referred_by' ? ' capitalize' : ''"
                >
                    <PrescriptionPatientSectionItem
                        :name="column.item"
                        :title="column.label.text"
                        :value="
                            column.item === 'age' || column.item === 'height'
                                ? selectedPatient
                                : selectedPatient[column.item]
                        "
                    />
                </div>
            </div>

            <!-- <template v-if="patientInfoKey.length > 1">
                <div
                    v-for="item in patientInfoKey[1].column"
                    :key="item.name"
                    :style="`width:${item.width}%`"
                    class="inline-flex truncate"
                >
                    <PrescriptionPatientSectionItem
                        :name="item.item"
                        :title="item.title"
                        :value="selectedPatient[item.item]"
                    />
                </div>
            </template> -->
        </div>

        <div class="flex w-12 flex-shrink-0 items-center space-x-2">
            <div>
                <TrashIcon
                    class="h-5 w-5 cursor-pointer text-red-500"
                    @click="resetPrescriptionData"
                />
            </div>

            <div>
                <PencilSquareIcon
                    class="h-5 w-5 cursor-pointer text-gray-600"
                    @click="modalToggleForPatient(true)"
                ></PencilSquareIcon>
            </div>
        </div>
    </section>

    <UModal
        v-model="hasPatientCreate"
        :ui="{ width: 'w-full h-auto sm:max-w-2xl' }"
        prevent-close
    >
        <div class="flex items-start justify-between pl-6">
            <h3 class="font-poppins-regular my-6 text-xl font-normal text-slate-800 2xl:text-2xl">Edit Patient</h3>
            <div class="pr-1 pt-1.5">
                <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-x-mark-20-solid"
                    class="-my-1"
                    @click="modalToggleForPatient(false)"
                />
            </div>
        </div>

        <div class="px-6">
            <PatientRegisterForm :patient-info="selectedPatient" />
        </div>
    </UModal>
</template>
