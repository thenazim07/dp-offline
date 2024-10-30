<script setup lang="ts">
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { useDiagnosisStoreRoot } from '~/stores/prescription/useDiagnosisStoreRoot';
const prescriptionGroupStore = usePrescriptionGroupStore();
const diagnosisStoreRoot = useDiagnosisStoreRoot();

const { groupForDiagnosis } = storeToRefs(prescriptionGroupStore);
const groupList = computed(() => groupForDiagnosis?.value?.data || []);

function onSelectedGroupHandler(group: object) {
    if (Array.isArray(group?.group_item)) {
        group?.group_item.forEach((item: any) => {
            if (!diagnosisStoreRoot.isAlreadySelected(item?.name)) {
                diagnosisStoreRoot.addNewDiagnosis({
                    name: item?.name,
                });
            }
        });
    }
}

function isGroupSelected(group: object) {
    if (!Array.isArray(group?.group_item)) {
        return false;
    }

    if (group?.group_item.length === 0) {
        return false;
    }

    return group?.group_item.every((item: any) => diagnosisStoreRoot.isAlreadySelected(item?.name));
}
</script>

<template>
    <!-- :is-selected="selectedGroupNames.includes(groupItem.name)" -->
    <!-- @selected-group="selectedGroup" -->
    <!-- @delete-group="deleteGroup($event, 'chief_complain')" -->
    <!-- @edit-group="editGroup" -->
    <div class="flex max-h-[200px] flex-wrap items-center justify-start gap-2 overflow-auto scrollbar-thin">
        <PrescriptionBaseComponentsGroupActions
            v-for="groupItem in groupList"
            :key="groupItem.name"
            :group="groupItem"
            :is-selected="isGroupSelected(groupItem)"
            @selected-group="onSelectedGroupHandler"
        />
    </div>
</template>
