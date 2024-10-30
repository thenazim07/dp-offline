<script setup lang="ts">
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { useOnExaminationStoreRoot } from '~/stores/prescription/useOnExaminationStoreRoot';
const prescriptionGroupStore = usePrescriptionGroupStore();
const onExaminationStoreRoot = useOnExaminationStoreRoot();

const { isGroupMode } = storeToRefs(onExaminationStoreRoot);
const { groupForObservation } = storeToRefs(prescriptionGroupStore);
const groupList = computed(() => groupForObservation?.value?.data || []);

function onSelectedGroupHandler(group: object) {
    if (Array.isArray(group?.group_item)) {
        group?.group_item.forEach((item: any) => {
            if (!onExaminationStoreRoot.isAlreadySelected(item?.name)) {
                onExaminationStoreRoot.addNewObservation({
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

    return group?.group_item.every((item: any) => onExaminationStoreRoot.isAlreadySelected(item?.name));
}

function onDeleteClickHandler(event: any) {
    prescriptionGroupStore.deleteGroup(event, 'observation');
}

function onEditClickHandler(group: any) {
    onExaminationStoreRoot.editGroup(group);
}

onMounted(() => {
    prescriptionGroupStore.fetchGroupData('observation');
});
</script>

<template>
    <!-- :is-selected="selectedGroupNames.includes(groupItem.name)" -->
    <!-- @selected-group="selectedGroup" -->
    <!-- @delete-group="deleteGroup($event, 'chief_complain')" -->
    <!-- @edit-group="editGroup" -->
    <div
        :class="
            tailwindMerge(
                'flex h-[200px] flex-wrap items-start justify-start gap-2 overflow-auto scrollbar-thin max-1919:h-[190px] max-1599:h-[103px]',
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
