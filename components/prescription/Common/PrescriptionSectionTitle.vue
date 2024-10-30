<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline';
import { useChiefComplaintsStoreRoot } from '~/stores/prescription/useChiefComplaintsStoreRoot';

interface Props {
    title?: string;
    showIcon?: boolean;
    active?: boolean;
    isEmptyText?: boolean;
}

const chiefComplaintsStoreRoot = useChiefComplaintsStoreRoot();

const { isShowingChiefComplaintEditor } = storeToRefs(chiefComplaintsStoreRoot);

const props = withDefaults(defineProps<Props>(), {
    title: '',
    showIcon: true,
    active: false,
});
</script>

<template>
    <div class="flex items-center justify-start gap-1 text-[#1E293B]">
        <div
            class="flex gap-1"
            :class="[props.active ? 'rounded bg-slate-200 px-2 py-2' : '', isEmptyText ? ' text-gray-300' : '']"
        >
            <h3
                :class="
                    tailwindMerge('text-base font-bold', {
                        ' max-1919:text-lg max-1919:leading-[27px] ': isShowingChiefComplaintEditor,
                    })
                "
            >
                {{ props.title }}
            </h3>
            <span
                v-if="props.showIcon"
                class="size-6"
            >
                <PlusIcon class="h-5 w-5 font-semibold text-slate-900" />
            </span>
        </div>
    </div>
</template>
