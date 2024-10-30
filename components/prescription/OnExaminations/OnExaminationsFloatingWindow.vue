<script setup lang="ts">
import GeneralExaminationForm from './GeneralExaminationForm.vue';
import ObservationForm from './ObservationForm.vue';
import { useOnExaminationStoreRoot } from '~/stores/prescription/useOnExaminationStoreRoot';

const onExaminationStoreRoot = useOnExaminationStoreRoot();

const {
    isShowingOnExaminationEditor,
    selectedObservationListIndexToFocus,
    currentTabIndex,
    observations,
    generalExamination,
} = storeToRefs(onExaminationStoreRoot);

const container = ref<HTMLDivElement | null>(null);

onClickOutside(
    container,
    () => {
        if (checkDuplicateDataInAllOnExaminationTabs.value) {
            isShowingOnExaminationEditor.value = false;
        }
    },
    {
        ignore: [document.querySelector('.OnExaminationSectionClass')],
    },
);

const tabs = ref([
    {
        label: 'General Examination ',
        key: 'general',
        component: GeneralExaminationForm,
        disabled: false,
    },
    {
        label: 'Observation',
        key: 'observation',
        component: ObservationForm,
        disabled: false,
    },
]);

const checkDuplicateDataInAllOnExaminationTabs = computed(() => {
    if (checkDuplicateObservations() && validateGeneralExamination.value) {
        return true;
    }
    return false;
});

const validateGeneralExamination = computed(() => {
    const hasRefOne = generalExamination.value.vitals.bp.systolic !== '';
    const hasRefTwo = generalExamination.value.vitals.bp.diastolic !== '';
    return hasRefOne === hasRefTwo; // Valid if both are filled or both are empty
});

// watchEffect(() => {
//     if (!generalExamination.value.vitals.bp.systolic) {
//         document.getElementById('systolicInput')?.classList.add(' border border-red-500');
//     }

//     if (!generalExamination.value.vitals.bp.diastolic) {
//         document.getElementById('diastolicInput')?.classList.add(' border border-red-500');
//     }
// });

function checkDuplicateObservations() {
    return useHasUniquePropertyValuesOfObjects(
        observations.value.filter((observation) => observation.name.trim() !== ''),
        'name',
    );
}

watch(
    () => checkDuplicateDataInAllOnExaminationTabs.value,
    (newDupliateStatus) => {
        if (!newDupliateStatus) {
            tabs.value.forEach((tab) => (tab.disabled = true));
        } else {
            tabs.value.forEach((tab) => (tab.disabled = false));
        }
    },
    {
        immediate: true,
    },
);
</script>

<template>
    <div
        ref="container"
        class="z-10 min-w-full rounded-lg !bg-slate-200 p-2"
    >
        <UTabs
            :items="tabs"
            :ui="{
                list: { base: 'mb-0', tab: { inactive: '!bg-slate-200' } },
            }"
            :default-index="currentTabIndex"
            unmount
        >
            <template #item="{ item }">
                <component :is="item.component" />
            </template>
        </UTabs>
    </div>
</template>
