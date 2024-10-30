<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { useObservationStore } from '~/stores/prescription/useObservationStore';
const useObservation = useObservationStore();
const { observationSelectionList, vitalsInfo } = storeToRefs(useObservation);
const { deleteObservation, singleItemUpdate, deleteVitalsItem } = useObservation;
const isVitasInf = computed(() => vitalsInfo?.value?.vitals.length > 0);
</script>

<template>
    <div>
        <template v-if="vitalsInfo.vitals">
            <p
                v-if="isVitasInf"
                class="font-poppins-regular py-1.5 text-base font-semibold"
            >
                G/E
            </p>
            <ul
                role="list"
                class="ml-2.5 pr-2"
            >
                <template
                    v-for="item in vitalsInfo.vitals"
                    :key="item.ref"
                >
                    <PrescriptionOnExaminationsLeftSideComponentItem
                        v-if="item.type === 'heart_rate'"
                        :delete-ref="item.ref"
                        @delete-item="deleteVitalsItem"
                    >
                        <span class="mr-0.5 pl-1">
                            Blood Pressure: {{ item.BP.systolic }} / {{ item.BP.diastolic }}
                        </span>
                    </PrescriptionOnExaminationsLeftSideComponentItem>

                    <PrescriptionOnExaminationsLeftSideComponentItem
                        v-if="item.type === 'BPM'"
                        :delete-ref="item.ref"
                        @delete-item="deleteVitalsItem"
                    >
                        <span class="mr-0.5 pl-1">Heart Rate: {{ item.value }} BPM</span>
                    </PrescriptionOnExaminationsLeftSideComponentItem>

                    <PrescriptionOnExaminationsLeftSideComponentItem
                        v-if="item.type === 'temperature_in_fahrenheit'"
                        :delete-ref="item.ref"
                        @delete-item="deleteVitalsItem"
                    >
                        <span class="mr-0.5 pl-1">Body Temperature: {{ item.value }} </span>
                    </PrescriptionOnExaminationsLeftSideComponentItem>

                    <PrescriptionOnExaminationsLeftSideComponentItem
                        v-if="item.type === 'SPO2'"
                        :delete-ref="item.ref"
                        @delete-item="deleteVitalsItem"
                    >
                        <span class="mr-0.5 pl-1">Oxygen Saturation: {{ item.value }} </span>
                    </PrescriptionOnExaminationsLeftSideComponentItem>

                    <PrescriptionOnExaminationsLeftSideComponentItem
                        v-if="item.type === 'A1C'"
                        :delete-ref="item.ref"
                        @delete-item="deleteVitalsItem"
                    >
                        <span class="mr-0.5 pl-1">Glucose Level: {{ item.value }} mmol/L </span>
                    </PrescriptionOnExaminationsLeftSideComponentItem>
                </template>
            </ul>
        </template>

        <p
            v-show="observationSelectionList && observationSelectionList.length > 0"
            class="font-poppins-regular py-1.5 text-base font-semibold"
        >
            O/E
        </p>

        <PrescriptionBaseComponentsSingleUpdateItemsItemMarkup :list="observationSelectionList">
            <template #title="observation">
                <div class="pl-1">
                    <span class="pr-1 text-slate-900">{{ observation?.item?.name }}</span>
                </div>
            </template>

            <template #content="observation">
                <VForm
                    v-slot="{ values }"
                    class="w-full cursor-pointer rounded-lg bg-slate-100"
                    :initial-values="{
                        name: observation?.item?.name ?? '',
                        uuid: observation?.item?.uuid ?? '',
                        ref: observation?.item.ref ?? '',
                    }"
                >
                    <PrescriptionBaseComponentsItem>
                        <PrescriptionOnExaminationsLeftSideComponentSingleItem
                            :field="observation.item"
                            @change-value="singleItemUpdate(values)"
                        />
                    </PrescriptionBaseComponentsItem>
                </VForm>
            </template>

            <template #delete="observation">
                <button
                    @click="deleteObservation(observation.item)"
                    @keyup.enter="deleteObservation(observation.item)"
                >
                    <TrashIcon class="h-4 w-4 text-red-500"></TrashIcon>
                </button>
            </template>
        </PrescriptionBaseComponentsSingleUpdateItemsItemMarkup>
    </div>
</template>
