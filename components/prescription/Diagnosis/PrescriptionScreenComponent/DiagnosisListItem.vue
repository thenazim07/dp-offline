<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';

interface Props {
    diagnosis?: {
        name?: string;
        note?: string;
        uuid?: string;
    };
    index: number;
}

const props = withDefaults(defineProps<Props>(), {
    diagnosis: () => ({
        name: '',
        note: '',
        uuid: '',
    }),
    index: 0,
});

const emit = defineEmits<{
    onDeleteClick: [uuid?: string];
    onListClick: [index: number];
}>();
</script>

<template>
    <div
        class="flex items-center justify-between gap-2"
        @click="emit('onListClick', index)"
    >
        <div class="h-1.5 w-1.5 rounded-full bg-slate-300"></div>

        <div class="flex flex-grow items-center justify-between">
            <div class="flex flex-grow items-center gap-2">
                <div>
                    <p class="cursor-pointer text-sm text-slate-900">
                        {{ props.diagnosis?.name }}
                    </p>
                    <p
                        v-if="props.diagnosis.note"
                        class="text-xs"
                    >
                        {{ props.diagnosis.note }}
                    </p>
                </div>
            </div>
            <button
                type="button"
                class="cursor-pointer p-1.5"
                @click.stop="emit('onDeleteClick', props.diagnosis?.uuid)"
            >
                <TrashIcon class="h-5 w-5 font-semibold text-red-600" />
            </button>
        </div>
    </div>
</template>
