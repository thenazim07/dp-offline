<script setup lang="ts">
import { useEhrStore } from '~/stores/ehr/';
import { useEhrDiseaseStoreRoot } from '~/stores/ehr/useDiseaseStoreRoot';
import { useEhrDrugStoreRoot } from '~/stores/ehr/useDrugStoreRoot';
import { useEhrFamilyStoreRoot } from '~/stores/ehr/useFamilyStoreRoot';
import { useEhrInvestigationStoreRoot } from '~/stores/ehr/useInvestigationStoreRoot';
import { useEhrLifeStyleStoreRoot } from '~/stores/ehr/useLifeStyleStoreRoot';
import { useOtherHistoryStoreRoot } from '~/stores/ehr/useOtherHistoryRoot';
const { ehrFeatures, isShowingPastHistoryEditor, selectedListIndexToFocus, currentTabIndex } =
    storeToRefs(useEhrStore());

const ehrDiseaseStoreRoot = useEhrDiseaseStoreRoot();
const ehrInvestigationStoreRoot = useEhrInvestigationStoreRoot();
const ehrFamilyStoreRoot = useEhrFamilyStoreRoot();
const ehrDrugStoreRoot = useEhrDrugStoreRoot();
const ehrLifrStyleStoreRoot = useEhrLifeStyleStoreRoot();
const otherHistoryStoreRoot = useOtherHistoryStoreRoot();
const { surgicalList } = storeToRefs(otherHistoryStoreRoot);
const { diseaseList } = storeToRefs(ehrDiseaseStoreRoot);
const { investigationList } = storeToRefs(ehrInvestigationStoreRoot);
const { familyList } = storeToRefs(ehrFamilyStoreRoot);
const { drugList } = storeToRefs(ehrDrugStoreRoot);
const { lifeStyleList } = storeToRefs(ehrLifrStyleStoreRoot);

const container = ref<HTMLDivElement | null>(null);
onClickOutside(
    container,
    (event) => {
        const vue3select = document.querySelector('.vs__dropdown-menu');

        if (checkDulplicateDataInAllEhrTabs.value)
            if (!vue3select?.contains(event.target as Node)) {
                isShowingPastHistoryEditor.value = false;
            }
    },
    {
        ignore: [
            document.querySelector('.EhrSectionClass'),
            document.querySelector('#teleports'),
            document.querySelector('#vs3__listbox'),
        ],
    },
);

const checkDulplicateDataInAllEhrTabs = computed(() => {
    if (
        checkDuplicateDiseases() &&
        checkDuplicateinvestIgations() &&
        checkDuplicateFamilies() &&
        checkDuplicateDrugs() &&
        checkDuplicateLifeStyle() &&
        checkDuplicateSurgicals()
    ) {
        return true;
    }
    return false;
});

function checkDuplicateDiseases() {
    return useHasUniquePropertyValuesOfObjects(
        diseaseList.value.filter((diseases) => diseases.disease.trim() !== ''),
        'disease',
    );
}

function checkDuplicateinvestIgations() {
    return useHasUniquePropertyValuesOfObjects(
        investigationList.value.filter((investigation) => investigation.name.trim() !== ''),
        'name',
    );
}
function checkDuplicateFamilies() {
    return useHasUniquePropertyValuesOfObjects(
        familyList.value.filter((family) => family.disease.trim() !== ''),
        'disease',
    );
}
function checkDuplicateDrugs() {
    return useHasUniquePropertyValuesOfObjects(
        drugList.value.filter((drug) => drug.name.trim() !== ''),
        'drug_ref',
    );
}

function checkDuplicateLifeStyle() {
    return useHasUniquePropertyValuesOfObjects(
        lifeStyleList.value.filter((lifeStle) => lifeStle.type?.trim() !== ''),
        'type',
    );
}

function checkDuplicateSurgicals() {
    return useHasUniquePropertyValuesOfObjects(
        surgicalList.value.filter((surgical) => surgical.name?.trim() !== ''),
        'name',
    );
}

const { inputClassToFocus, focusOnSpecificNodelListIndexInput } = useFocusOnParentElementsLastInputElement();
const ehrDiseaseTabComponent = ref(null);
const ehrDrugTabComponent = ref(null);
const ehrInvestigationTabComponent = ref(null);
const ehrFamilyTabComponent = ref(null);
const ehrLifeStyleTabComponent = ref(null);
const ehrOthersTabComponent = ref(null);

const onListClickHandler = () => {
    if (selectedListIndexToFocus.value != null) {
        if (ehrDiseaseTabComponent.value && ehrDiseaseTabComponent.value.scrollableDivRef) {
            focusOnSpecificNodelListIndexInput(
                ehrDiseaseTabComponent.value.scrollableDivRef,
                inputClassToFocus,
                selectedListIndexToFocus.value,
            );
        }

        if (ehrDrugTabComponent.value && ehrDrugTabComponent.value.scrollableDivRef) {
            focusOnSpecificNodelListIndexInput(
                ehrDrugTabComponent.value.scrollableDivRef,
                inputClassToFocus,
                selectedListIndexToFocus.value,
            );
        }

        if (ehrInvestigationTabComponent.value && ehrInvestigationTabComponent.value.scrollableDivRef) {
            focusOnSpecificNodelListIndexInput(
                ehrInvestigationTabComponent.value.scrollableDivRef,
                inputClassToFocus,
                selectedListIndexToFocus.value,
            );
        }

        if (ehrFamilyTabComponent.value && ehrFamilyTabComponent.value.scrollableDivRef) {
            focusOnSpecificNodelListIndexInput(
                ehrFamilyTabComponent.value.scrollableDivRef,
                inputClassToFocus,
                selectedListIndexToFocus.value,
            );
        }

        if (ehrLifeStyleTabComponent.value && ehrLifeStyleTabComponent.value.scrollableDivRef) {
            focusOnSpecificNodelListIndexInput(
                ehrLifeStyleTabComponent.value.scrollableDivRef,
                inputClassToFocus,
                selectedListIndexToFocus.value,
            );
        }

        if (ehrOthersTabComponent.value && ehrOthersTabComponent.value.scrollableDivRef) {
            focusOnSpecificNodelListIndexInput(
                ehrOthersTabComponent.value.scrollableDivRef,
                inputClassToFocus,
                selectedListIndexToFocus.value,
            );
        }
    }
    selectedListIndexToFocus.value = null;
};

watch(
    () => checkDulplicateDataInAllEhrTabs.value,
    (newDupliateStatus) => {
        if (!newDupliateStatus) {
            ehrFeatures.value.forEach((feature) => (feature.disabled = true));
        } else {
            ehrFeatures.value.forEach((feature) => (feature.disabled = false));
        }
    },
    {
        immediate: true,
    },
);

onMounted(() => {
    onListClickHandler();
});

onMounted(() => {
    currentTabIndex.value = 0;
});
</script>

<template>
    <div
        ref="container"
        class="w-[1004px] max-1599:w-[892px]"
    >
        <UTabs
            :items="ehrFeatures"
            :default-index="currentTabIndex"
            :unmount="true"
            :ui="{
                list: { base: 'mb-2', tab: { inactive: '!bg-slate-200' } },
            }"
        >
            <template #item="{ item }">
                <PrescriptionEhrDisease
                    v-if="item.key === 'disease'"
                    ref="ehrDiseaseTabComponent"
                />
                <PrescriptionEhrDrug
                    v-if="item.key === 'medication'"
                    ref="ehrDrugTabComponent"
                />
                <PrescriptionEhrInvestigation
                    v-if="item.key === 'investigation'"
                    ref="ehrInvestigationTabComponent"
                />
                <PrescriptionEhrFamily
                    v-if="item.key === 'family'"
                    ref="ehrFamilyTabComponent"
                />
                <PrescriptionEhrLifeStyle
                    v-if="item.key === 'lifestyle'"
                    ref="ehrLifeStyleTabComponent"
                />
                <PrescriptionEhrOthers
                    v-if="item.key === 'others'"
                    ref="ehrOthersTabComponent"
                />
            </template>
        </UTabs>
    </div>
</template>
