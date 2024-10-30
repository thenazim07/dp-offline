<script lang="ts" setup>
import { v4 as uuid } from 'uuid';
import { usePrescriptionPresetStore } from '~~/stores/prescription/preset';
import { useEhrInvestigationStoreRoot } from '~/stores/ehr/useInvestigationStoreRoot';
import type { IInvestigation } from '~/repository/modules/EHR/InvestigationsHistory/types';

const preset = usePrescriptionPresetStore();
const { presetForInvestigationHistory } = storeToRefs(preset);
const useInvestigationRoot = useEhrInvestigationStoreRoot();

const presetList = computed(() => {
    if (presetForInvestigationHistory?.value?.data) {
        return presetForInvestigationHistory.value.data.map((item: IInvestigation) => {
            return {
                ...item,
                uuid: uuid(),
                disease: item.name,
            };
        });
    }
    return [];
});

function addNewDiseaseHandler (preset: IInvestigation) {
    if (useInvestigationRoot.isAlreadySelected(preset?.disease)) return;
    useInvestigationRoot.addNewInvestigation({
        ...preset,
        note: preset.des
    })
}
</script>

<template>
    <PrescriptionBaseComponentsPopperView
        v-for="item in presetList"
        :key="item.uuid"
        :item="item"
        :is-active-item="useInvestigationRoot.isAlreadySelected(item?.name)"
        @select:item="addNewDiseaseHandler"
    />
</template>
