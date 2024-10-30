<script lang="ts" setup>
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
const group = usePrescriptionGroupStore();
const { groupForChiefComplients } = storeToRefs(group);
const groupList = computed(() => groupForChiefComplients?.value?.data || []);
</script>

<template>
    <!-- :is-selected="selectedGroupNames.includes(groupItem.name)" -->
    <!-- @selected-group="selectedGroup" -->
    <!-- @delete-group="deleteGroup($event, 'chief_complain')" -->
    <!-- @edit-group="editGroup" -->

    <PrescriptionBaseComponentsGroupActions
        v-for="groupItem in groupList"
        :key="groupItem.name"
        :group="groupItem"
    />
</template>
