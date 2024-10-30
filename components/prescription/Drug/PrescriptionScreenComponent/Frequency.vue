<script lang="ts" setup>
import type { IDuration } from '~/repository/modules/Prescription/DrugsModule/types';

const props = defineProps<{
    duration: IDuration;
}>();

const durationContent = computed(() => {
    const { frequency, instruction } = props?.duration ?? {};
    if (!frequency) return '';

    let content = frequency ?? '';

    if (instruction) {
        content += ' - ' + instruction;
    }

    return content;
});

const { drugDurationTypes } = useConfigsStore();
</script>

<template>
    <div class="flex items-center">
        <div class="-mb-1 w-96 pr-2">
            <p class="inline-block text-justify text-sm font-light text-slate-800">
                {{ durationContent }}
            </p>
        </div>
        <div>
            <p class="text-sm text-slate-800">
                {{ duration?.duration_text ?? null }}
                <!-- {{ duration?.duration ?? null }}
                {{ duration?.duration ? drugDurationTypes[duration?.type] ?? null : null }} -->
            </p>
        </div>
    </div>
</template>