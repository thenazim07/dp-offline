<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';

const { durationTypes } = useConfigsStore();

interface Props {
    chiefComplain?: {
        title?: string;
        duration?: string;
        durationType?: string;
        durationLocale?: string;
        durationText: string;
        note?: string;
        uuid?: string;
    };
    index?: number;
}

const props = withDefaults(defineProps<Props>(), {
    chiefComplain: () => ({
        title: '',
        duration: '',
        durationType: '',
        durationLocale: 'en',
        durationText: '',
        note: '',
        uuid: '',
    }),
    index: 0,
});

const emit = defineEmits<{
    onDeleteClick: [uuid?: string];
    onListClick: [index: number];
}>();

const { convertToBangla, convertDurationToBangla } = useBanglaNumbers();

const generateDuration = computed(() => {
    if (props.chiefComplain.durationText) {
        return `(${props.chiefComplain.durationText})`;
    }

    if (props.chiefComplain.durationType === 'not_required') {
        return ``;
    }

    // if (props.chiefComplain.durationLocale === 'en') {
    //     return `(for  ${props.chiefComplain.duration} ${durationTypes?.find((x) => x.name === props.chiefComplain?.durationType)?.value.en})`;
    // } else {
    //     return (
    //         convertToBangla(props.chiefComplain?.duration) +
    //         ' ' +
    //         durationTypes?.find((x) => x.name === props.chiefComplain?.durationType)?.value.bn
    //     );
    // }
});
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
                        {{ props.chiefComplain?.title }}
                        <span class="text-slate-500">
                            {{ generateDuration }}
                        </span>
                    </p>
                    <p
                        v-if="props.chiefComplain?.note"
                        class="text-xs"
                    >
                        Note: {{ props.chiefComplain?.note }}
                    </p>
                </div>
            </div>
            <button
                type="button"
                class="cursor-pointer p-1.5"
                @click.stop="emit('onDeleteClick', props.chiefComplain?.uuid)"
            >
                <TrashIcon class="h-5 w-5 font-semibold text-red-600" />
            </button>
        </div>
    </div>
</template>
