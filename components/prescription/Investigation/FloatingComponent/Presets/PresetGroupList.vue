<script setup lang="ts">
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { useInvestigationStoreRoot } from '~/stores/prescription/useInvestigationStoreRoot';
const prescriptionGroupStore = usePrescriptionGroupStore();
const investigationStoreRoot = useInvestigationStoreRoot();

const { isGroupMode } = storeToRefs(investigationStoreRoot);
const { groupForInvestigation } = storeToRefs(prescriptionGroupStore);
const groupList = computed(() => groupForInvestigation?.value?.data || []);

function onSelectedGroupHandler(group: object) {
    if (Array.isArray(group?.group_item)) {
        group?.group_item.forEach((item: any) => {
            if (!investigationStoreRoot.isAlreadySelected(item?.name)) {
                investigationStoreRoot.addNewInvestigation({
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

    return group?.group_item.every((item: any) => investigationStoreRoot.isAlreadySelected(item?.name));
}

function onDeleteClickHandler(event: any) {
    prescriptionGroupStore.deleteGroup(event, investigationStoreRoot.identicalName);
}

function onEditClickHandler(group: any) {
    investigationStoreRoot.editGroup(group);
}
</script>

<template>
    <!-- :is-selected="selectedGroupNames.includes(groupItem.name)" -->
    <!-- @selected-group="selectedGroup" -->
    <!-- @delete-group="deleteGroup($event, 'chief_complain')" -->
    <!-- @edit-group="editGroup" -->
    <div
        :class="
            tailwindMerge(
                'flex max-h-[200px] flex-wrap items-start justify-start gap-2 overflow-auto scrollbar-thin max-1919:h-[176px] max-1599:h-[120px]',
                { 'max-1919:h-[45px] max-1599:h-[45px]': isGroupMode },
            )
        "
    >
        <PrescriptionBaseComponentsGroupActions
            v-for="groupItem in groupList"
            :key="groupItem.name"
            :group="groupItem"
            :is-selected="isGroupSelected(groupItem)"
            @selected-group="onSelectedGroupHandler"
            @delete-group="onDeleteClickHandler($event)"
            @edit-group="onEditClickHandler"
        />
    </div>
</template>
