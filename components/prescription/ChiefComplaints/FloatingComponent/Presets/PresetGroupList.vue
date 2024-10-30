<script setup lang="ts">
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { useChiefComplaintsStoreRoot } from '~/stores/prescription/useChiefComplaintsStoreRoot';
const prescriptionGroupStore = usePrescriptionGroupStore();
const chiefComplaintsStoreRoot = useChiefComplaintsStoreRoot();
const { isGroupMode } = storeToRefs(useChiefComplaintsStoreRoot());

const { groupForChiefComplients } = storeToRefs(prescriptionGroupStore);
const groupList = computed(() => groupForChiefComplients?.value?.data || []);

function onSelectedGroupHandler(group: object) {
    if (Array.isArray(group?.group_item)) {
        group?.group_item.forEach((item: any) => {
            if (!chiefComplaintsStoreRoot.isAlreadySelected(item?.name)) {
                chiefComplaintsStoreRoot.addNewIndication({
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

    return group?.group_item.every((item: any) => chiefComplaintsStoreRoot.isAlreadySelected(item?.name));
}

function onDeleteClickHandler(event: any) {
    prescriptionGroupStore.deleteGroup(event, 'chief_complain');
}

function onEditClickHandler(group: any) {
    chiefComplaintsStoreRoot.editGroup(group);
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
                'flex max-h-[200px] flex-wrap items-start justify-start overflow-auto scrollbar-thin max-1919:h-[147px] max-1599:h-[120px]',
                { ' max-1919:h-[45px] max-1599:h-[45px]': isGroupMode },
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
