<script lang="ts" setup>
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { usePrescriptionDrugStore } from '~/stores/prescription/useDrugStore';

const prescriptionGroupStore = usePrescriptionGroupStore();
const prescriptionDrugStore = usePrescriptionDrugStore();

const { isGroupMode } = storeToRefs(usePrescriptionDrugStore());

const { groupForDrug } = storeToRefs(prescriptionGroupStore);
const groupList = computed(
    () =>
        groupForDrug?.value?.data?.map((group) => {
            return {
                ...group,
                group_item:
                    group.group_item?.map((groupItem) => {
                        return {
                            ...groupItem,
                            drug_id: groupItem.id,
                        };
                    }) || [],
            };
        }) || [],
);

function onSelectedGroupHandler(group: object) {
    if (Array.isArray(group?.group_item)) {
        group?.group_item.forEach((item: any) => {
            if (!prescriptionDrugStore.isAlreadySelected(item)) {
                prescriptionDrugStore.addMoreDrug(item);
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

    return group?.group_item.every((item: any) => prescriptionDrugStore.isAlreadySelected(item));
}

function onDeleteClickHandler(event: any) {
    prescriptionGroupStore.deleteGroup(event, prescriptionDrugStore.identicalName);
}

function onEditClickHandler(group: any) {
    console.log('edti medicine', group);
    prescriptionDrugStore.editGroup(group);

    onSelectedGroupHandler(group);
}
</script>

<template>
    <div
        v-if="groupList.length > 0"
        :class="
            tailwindMerge(
                ' overflow-auto p-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-slate-300 scrollbar-track-rounded-md scrollbar-thumb-rounded-md max-1919:p-3',
                { ' h-[135px] max-1919:h-[55px] ': isGroupMode },
            )
        "
    >
        <template
            v-for="groupItem in groupList"
            :key="groupItem.name"
        >
            <PrescriptionBaseComponentsGroupActions
                :is-selected="isGroupSelected(groupItem)"
                :group="groupItem"
                @selected-group="onSelectedGroupHandler"
                @delete-group="onDeleteClickHandler"
                @edit-group="onEditClickHandler"
            />
            <!--
                @delete-group="deleteGroup($event, 'medicine')"
                @edit-group="editGroup" -->
        </template>
    </div>
</template>
