<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useOnExaminationStoreRoot } from '~/stores/prescription/useOnExaminationStoreRoot';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';

const onExaminationStoreRoot = useOnExaminationStoreRoot();

const { getAvailableObservations } = storeToRefs(onExaminationStoreRoot);

function onDeleteClickHandler(uuid?: string) {
    if (!uuid) return;
    onExaminationStoreRoot.deleteObservationFromList(uuid);
}

const savingStatusStore = usePrescriptionSavingStatusStore();
const { status } = storeToRefs(savingStatusStore);

function retryForSaving() {
    onExaminationStoreRoot.syncWithServer();
}

const emit = defineEmits(['onListClick']);
</script>

<template>
    <div
        v-if="getAvailableObservations.length > 0 || status.on_examination_observation.status === 'failed'"
        :class="[
            status.on_examination_observation.status === 'pending' ? ' pointer-events-none bg-[#F8FAFC] pt-2' : '',
            status.on_examination_observation.status === 'failed' ? ' bg-[#FFF7F7] pt-2' : '',
        ]"
    >
        <div class="flex justify-between">
            <h3 class="font-semibold">O/E</h3>
            <PrescriptionCommonPrescriptionCreateSavingStatus
                :status="status.on_examination_observation"
                @retry="retryForSaving"
            />
        </div>
        <div class="space-y-1 text-sm">
            <div
                v-for="(observation, index) in getAvailableObservations"
                :key="index"
                class="flex justify-between"
                @click="emit('onListClick', index)"
            >
                <div class="cursor-pointer">
                    <UtilityRoundedDot />
                    {{ observation?.name }}
                </div>

                <button
                    type="button"
                    class="cursor-pointer p-1.5"
                    @click.stop="onDeleteClickHandler(observation.uuid)"
                >
                    <TrashIcon class="h-5 w-5 font-semibold text-red-600" />
                </button>
            </div>
        </div>
    </div>
</template>
