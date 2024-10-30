<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useEhrLifeStyleStoreRoot } from '~/stores/ehr/useLifeStyleStoreRoot';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';
const ehrLifeStyleStoreRoot = useEhrLifeStyleStoreRoot();
const { getAvailableLifeStyle } = storeToRefs(ehrLifeStyleStoreRoot);
const lifeStyleData = computed(() => getAvailableLifeStyle.value ?? []);

function handleLifeStyleFamilyItem(uuid: string) {
    ehrLifeStyleStoreRoot.removeLifeStyleFromPrescription(uuid);
}

const savingStatusStore = usePrescriptionSavingStatusStore();
const { status } = storeToRefs(savingStatusStore);

function retryForSaving() {
    ehrLifeStyleStoreRoot.syncWithServer();
}

const emit = defineEmits(['onListClick']);
</script>

<template>
    <div
        v-if="lifeStyleData.length > 0 || status.past_history_life_style.status === 'failed'"
        class="flex items-center justify-between gap-2"
        :class="[
            status.past_history_life_style.status === 'pending' ? ' pointer-events-none bg-[#F8FAFC] pt-2' : '',
            status.past_history_life_style.status === 'failed' ? ' bg-[#FFF7F7] pt-2' : '',
        ]"
    >
        <div class="w-full">
            <div class="flex justify-between">
                <div class="inline-block cursor-pointer">
                    <p class="py-1.5 text-base font-semibold">L/H:</p>
                </div>
                <PrescriptionCommonPrescriptionCreateSavingStatus
                    :status="status.past_history_life_style"
                    @retry="retryForSaving"
                />
            </div>

            <ul
                role="list"
                class="ml-2.5 pr-2"
            >
                <li
                    v-for="(lifeStyle, index) in lifeStyleData"
                    :key="lifeStyle.uuid"
                    class="w-fullbefore:mr- font-poppins-regular relative flex justify-between text-left text-sm font-normal leading-5 text-slate-600 before:absolute before:-inset-3 before:inset-y-0 before:h-2 before:w-2 before:content-dod"
                    @click="emit('onListClick', index)"
                >
                    <div>
                        <span class="mr-1 cursor-pointer text-sm text-slate-900">
                            {{ lifeStyle.type }}
                        </span>

                        <small
                            v-if="lifeStyle.value || lifeStyle.note || lifeStyle.duration_text"
                            class="mr-1"
                        >
                            - {{ lifeStyle.value }}
                            <!-- <span
                                v-if="lifeStyle.duration"
                                class="text-xs capitalize"
                            >
                                / {{ lifeStyle.duration }} {{ lifeStyle.duration_type }}
                            </span> -->
                            <span
                                v-if="lifeStyle.duration_text"
                                class="text-xs"
                            >
                                / {{ lifeStyle.duration_text }}
                            </span>
                        </small>

                        <br v-if="lifeStyle?.note" />

                        <small
                            v-if="lifeStyle?.note"
                            class="text-xs"
                        >
                            {{ lifeStyle?.note }}
                        </small>
                    </div>

                    <div>
                        <button
                            type="button"
                            class="cursor-pointer p-1.5"
                            @click.stop="handleLifeStyleFamilyItem(lifeStyle.uuid)"
                        >
                            <TrashIcon class="h-5 w-5 font-semibold text-red-600" />
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
