<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useEhrDrugStoreRoot } from '~/stores/ehr/useDrugStoreRoot';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';
const ehrDrugStoreRoot = useEhrDrugStoreRoot();
const { getAvailableDrug } = storeToRefs(ehrDrugStoreRoot);
const drugData = computed(() => getAvailableDrug.value ?? []);

function handleDeleteDrugItem(uuid: string) {
    ehrDrugStoreRoot.removeDrugFromPrescription(uuid);
}

const savingStatusStore = usePrescriptionSavingStatusStore();
const { status } = storeToRefs(savingStatusStore);

function retryForSaving() {
    ehrDrugStoreRoot.syncWithServer();
}

const emit = defineEmits(['onListClick']);
</script>

<template>
    <div
        v-if="drugData.length > 0 || status.past_history_drug.status === 'failed'"
        class="flex items-center justify-between gap-2"
        :class="[
            status.past_history_drug.status === 'pending' ? ' pointer-events-none bg-[#F8FAFC] pt-2' : '',
            status.past_history_drug.status === 'failed' ? ' bg-[#FFF7F7] pt-2' : '',
        ]"
    >
        <div class="w-full">
            <div class="flex justify-between">
                <div class="inline-block cursor-pointer">
                    <p class="py-1.5 text-base font-semibold">Med/H:</p>
                </div>
                <PrescriptionCommonPrescriptionCreateSavingStatus
                    :status="status.past_history_drug"
                    @retry="retryForSaving"
                />
            </div>

            <ul
                role="list"
                class="ml-2.5 pr-2"
            >
                <li
                    v-for="(drug, index) in drugData"
                    :key="drug.drug_ref ?? drug.uuid"
                    class="w-fullbefore:mr- font-poppins-regular relative flex justify-between text-left text-sm font-normal leading-5 text-slate-600 before:absolute before:-inset-3 before:inset-y-0 before:h-2 before:w-2 before:content-dod"
                    @click="emit('onListClick', index)"
                >
                    <div>
                        <span class="mr-1 cursor-pointer text-slate-900">
                            {{ drug.name }}
                        </span>

                        <br />

                        <small v-if="drug">
                            {{ drug.frequency }}
                            <!-- <span v-if="drug.duration"> - {{ `${drug.duration} ${drug.duration_type}` }}</span> -->
                            <span v-if="drug?.duration_text"> - {{ `${drug?.duration_text}` }}</span>
                        </small>
                    </div>

                    <div>
                        <button
                            type="button"
                            class="cursor-pointer p-1.5"
                            @click.stop="handleDeleteDrugItem(drug.uuid)"
                        >
                            <TrashIcon class="h-5 w-5 font-semibold text-red-600" />
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
