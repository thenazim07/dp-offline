<script setup lang="ts">
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';

const prescriptionTemplateStore = usePrescriptionTemplateStore();

const { showTemplateListView } = storeToRefs(prescriptionTemplateStore);
interface Props {
    name: string;
    color: string;
    id: number;
}

const props = withDefaults(defineProps<Props>(), {
    name: 'Template',
    color: 'bg-blue-500',
});

const router = useRouter();

async function onClickHandler() {
    showTemplateListView.value = false;
    await router.push({
        name: 'dashboard-prescription-create',
        query: {
            templateId: props.id,
        },
    });

    prescriptionTemplateStore.resetSearchQuery();
}
</script>

<template>
    <div
        class="item-center flex cursor-pointer justify-between px-6 py-2.5 hover:bg-slate-100"
        @click="onClickHandler"
    >
        <div class="flex items-center space-x-3">
            <div :class="tailwindMerge('flex h-8 w-8 items-center justify-center rounded shadow', props.color)">
                <p class="font-bold text-white">
                    {{ props.name[0] || 'T' }}
                </p>
            </div>
            <div>
                <p class="text-base text-slate-500">
                    {{ props.name }}
                </p>
            </div>
        </div>
        <div @click.stop="() => {}">
            <DashboardTemplateSectionVerticalDropdown :prescription-template-id="props.id" />
        </div>
    </div>
</template>
