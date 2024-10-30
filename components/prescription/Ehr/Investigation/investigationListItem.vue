<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useEhrInvestigationStoreRoot } from '~/stores/ehr/useInvestigationStoreRoot';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';
const ehrInvestigationStoreRoot = useEhrInvestigationStoreRoot();
const { getAvailableInvestigation } = storeToRefs(ehrInvestigationStoreRoot);
const investigationData = computed(() => getAvailableInvestigation.value ?? []);

function handleDeleteInvestigationItem(uuid: string) {
    ehrInvestigationStoreRoot.removeInvestigationFromPrescription(uuid);
}

const savingStatusStore = usePrescriptionSavingStatusStore();
const { status } = storeToRefs(savingStatusStore);

function retryForSaving() {
    ehrInvestigationStoreRoot.syncWithServer();
}

const emit = defineEmits(['onListClick']);
</script>

<template>
    <div
        v-if="investigationData.length > 0 || status.past_history_investigation.status === 'failed'"
        class="flex items-center justify-between gap-2"
        :class="[
            status.past_history_investigation.status === 'pending' ? ' pointer-events-none bg-[#F8FAFC] pt-2' : '',
            status.past_history_investigation.status === 'failed' ? ' bg-[#FFF7F7] pt-2' : '',
        ]"
    >
        <div class="w-full">
            <div class="flex justify-between">
                <div class="inline-block cursor-pointer">
                    <div class="flex justify-between">
                        <p class="py-1.5 text-base font-semibold">I/H:</p>
                    </div>
                </div>
                <PrescriptionCommonPrescriptionCreateSavingStatus
                    :status="status.past_history_investigation"
                    @retry="retryForSaving"
                />
            </div>

            <ul
                role="list"
                class="ml-2.5 pr-2"
            >
                <li
                    v-for="(investigation, index) in investigationData"
                    :key="investigation.uuid"
                    class="w-fullbefore:mr- font-poppins-regular relative flex justify-between text-left text-sm font-normal leading-5 text-slate-600 before:absolute before:-inset-3 before:inset-y-0 before:h-2 before:w-2 before:content-dod"
                    @click="emit('onListClick', index)"
                >
                    <div>
                        <div class="flex cursor-pointer items-center">
                            <span class="pr-1 text-slate-900">{{ investigation?.name }}</span>
                            <small
                                v-if="investigation?.reporting_date"
                                class="capitalize"
                            >
                                ({{ useDateFormat(investigation.reporting_date, 'DD MMM YYYY').value }})
                            </small>
                        </div>
                        <div
                            v-if="investigation.value || investigation.note"
                            class="inline-block"
                        >
                            <small v-if="investigation?.value">
                                {{ investigation?.value }}
                            </small>
                            <small v-if="investigation.note"> - {{ investigation.note }} </small>
                        </div>
                    </div>

                    <div>
                        <button
                            type="button"
                            class="cursor-pointer p-1.5"
                            @click.stop="handleDeleteInvestigationItem(investigation.uuid)"
                        >
                            <TrashIcon class="h-5 w-5 font-semibold text-red-600" />
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
