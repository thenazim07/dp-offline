<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
// import { usePrescriptionFollowUpStore } from '~/stores/prescription/followUp/index';
import { useFollowUpStoreRoot } from '~/stores/prescription/useFollowUpStoreRoot';
// const followUpStore = usePrescriptionFollowUpStore();
const followUpStoreRoot = useFollowUpStoreRoot();
// const { followup } = storeToRefs(followUpStore);
const { followUp, followUpNotes, getAvailableFollowUpNotes, getAvailableFollowUpAdvice } = storeToRefs(followUpStoreRoot);

// const { deleteFollowUpNote } = followUpStore;
// const followUPInfo = computed(() => followup.value ?? null);
// const followUpNoteList = computed(() => followup?.value?.follow_up_notes ?? []);

function onDeleteClickHandler(index: number) {
    followUpStoreRoot.deleteFollowUpAdviceFromServer(index);
}

function onDeleteFollowUp() {
    followUpStoreRoot.deleteFollowUp();
}

const emit = defineEmits<{
    onListClick: [index: number | null];
}>();
</script>

<template>
    <ClientOnly>
        <div class="ml-2.5 pb-3 pr-2">
            <ul role="list">
                <li
                    v-if="followUp?.within"
                    class="flex w-full justify-between space-x-2 py-0.5 pr-2"
                >
                    <p
                        class="cursor-pointer"
                        @click.stop="emit('onListClick', null)"
                    >
                        <span class="inline-block h-2 w-2 rounded-full bg-slate-400"></span>

                        <!-- <span>{{ `${followUp.date} (within ${followUp?.within})` }}</span> -->
                        <span>{{ ' ' + (followUp?.duration_text || '') }}</span>
                    </p>
                    <button
                        type="button"
                        @click.stop="onDeleteFollowUp()"
                    >
                        <TrashIcon class="h-4 w-4 text-red-500"></TrashIcon>
                    </button>
                </li>
                <li
                    v-for="(item, itemIndex) in getAvailableFollowUpAdvice"
                    :key="item.uuid"
                    class="group"
                >
                    <div class="flex w-full justify-between space-x-2 py-0.5 pr-2">
                        <p
                            class="cursor-pointer"
                            @click="emit('onListClick', itemIndex)"
                        >
                            <span class="inline-block h-2 w-2 rounded-full bg-slate-400"></span>
                            {{ item.name }}
                        </p>

                        <div>
                            <button
                                type="button"
                                @click.stop="onDeleteClickHandler(itemIndex)"
                            >
                                <TrashIcon class="h-4 w-4 text-red-500"></TrashIcon>
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </ClientOnly>
</template>
