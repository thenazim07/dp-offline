<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useEhrDiseaseStoreRoot } from '~/stores/ehr/useDiseaseStoreRoot';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';
const ehrDiseaseStoreRoot = useEhrDiseaseStoreRoot();
const { getAvailableDisease } = storeToRefs(ehrDiseaseStoreRoot);
const diseaseData = computed(() => getAvailableDisease.value ?? []);

function handleDeleteDiseaseItem(uuid: string) {
    ehrDiseaseStoreRoot.removeDiseaseFromPrescription(uuid);
}

const savingStatusStore = usePrescriptionSavingStatusStore();
const { status } = storeToRefs(savingStatusStore);

function retryForSaving() {
    ehrDiseaseStoreRoot.syncWithServer();
}

const emit = defineEmits(['onListClick']);
</script>

<template>
    <div
        v-if="diseaseData.length > 0 || status.past_history_diseases.status === 'failed'"
        class="flex items-center justify-between gap-2"
        :class="[
            status.past_history_diseases.status === 'pending' ? ' pointer-events-none bg-[#F8FAFC] pt-2' : '',
            status.past_history_diseases.status === 'failed' ? ' bg-[#FFF7F7] pt-2' : '',
        ]"
    >
        <div class="w-full">
            <div class="flex justify-between">
                <div class="inline-block cursor-pointer">
                    <p class="py-1.5 text-base font-semibold">D/H:</p>
                </div>
                <PrescriptionCommonPrescriptionCreateSavingStatus
                    :status="status.past_history_diseases"
                    @retry="retryForSaving"
                />
            </div>

            <ul
                role="list"
                class="ml-2.5 pr-2"
            >
                <li
                    v-for="(disease, index) in diseaseData"
                    :key="disease.uuid"
                    class="relative m-0 flex justify-between p-0 before:absolute before:-inset-3 before:inset-y-0 before:h-2 before:w-2 before:content-dod"
                    @click="emit('onListClick', index)"
                >
                    <div>
                        <span class="mr-1 cursor-pointer text-sm text-slate-900">
                            {{ disease.disease }}
                        </span>

                        <!-- <small
                            v-if="disease?.duration"
                            class="text-xs capitalize"
                        >
                            (For {{ disease?.duration }} {{ disease?.duration_type }})
                        </small> -->
                        <small
                            v-if="disease?.duration_text"
                            class="text-xs"
                        >
                            ({{ disease?.duration_text }})
                        </small>

                        <br v-if="disease?.note" />

                        <small
                            v-if="disease?.note"
                            class="text-xs"
                        >
                            {{ disease?.note }}
                        </small>
                    </div>

                    <div>
                        <button
                            type="button"
                            class="cursor-pointer p-1.5"
                            @click.stop="handleDeleteDiseaseItem(disease.uuid)"
                        >
                            <TrashIcon class="h-5 w-5 font-semibold text-red-600" />
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
