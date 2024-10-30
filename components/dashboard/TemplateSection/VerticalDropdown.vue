<script setup lang="ts">
import { EllipsisVerticalIcon } from '@heroicons/vue/24/solid';

import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';

const prescriptionTemplateStore = usePrescriptionTemplateStore();

interface Props {
    iconClass?: string;
    prescriptionTemplateId: number;
}

const props = withDefaults(defineProps<Props>(), {
    iconClass: '',
});

const router = useRouter();

const items = [
    [
        {
            label: 'Edit',
            click: async () => {
                await router.push({
                    name: 'dashboard-template-create',
                    query: {
                        templateId: props.prescriptionTemplateId,
                    },
                });
            },
        },
        {
            label: 'Delete',
            click: async () => {
                await prescriptionTemplateStore.deletePrescriptionTemplate({
                    id: props.prescriptionTemplateId,
                });

                await prescriptionTemplateStore.deletePrescriptionTemplateFromList(props.prescriptionTemplateId);
            },
        },
    ],
];
</script>

<template>
    <UDropdown
        :items="items"
        :popper="{ placement: 'bottom-end', arrow: true }"
        :ui="{
            width: 'w-min',
            item: {
                padding: 'px-3',
            },
        }"
    >
        <EllipsisVerticalIcon :class="tailwindMerge('h-8 cursor-pointer text-slate-500', props.iconClass)" />
    </UDropdown>
</template>
