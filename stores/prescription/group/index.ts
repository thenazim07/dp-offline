import { defineStore } from 'pinia';
import type { IdenticalName } from '~/repository/modules/ConfigModule/types';

interface GroupItem {
    item_identical_name: string;
    name: string;
}

export const usePrescriptionGroupStore = defineStore('prescription-group-store', () => {
    const groupForChiefComplients: Ref<Array<any>> = ref([]);
    const groupForDiagnosis: Ref<Array<any>> = ref([]);
    const groupForAdvice: Ref<Array<any>> = ref([]);
    const groupForNote: Ref<Array<any>> = ref([]);
    const groupForDrug: Ref<Array<any>> = ref([]);
    const groupForObservation: Ref<Array<any>> = ref([]);
    const groupForInvestigation: Ref<Array<any>> = ref([]);
    const searchGroupLoading: Ref<Boolean | false> = ref(false);
    const createGroupLoading: Ref<Boolean | false> = ref(false);
    const updateGroupLoading: Ref<Boolean | false> = ref(false);
    const { $api } = useNuxtApp();
    const toast = useToast();

    const searchGroup = useDebounceFn(async (query: string, identicalName: string) => {
        if (typeof query === 'object') return;
        searchGroupLoading.value = true;
        try {
            const response = await $api.prescriptionGroup.get(
                `?item_identical_name=${identicalName}&search_key=${query}`,
            );
            if (response) {
                setGroupData(response, identicalName);
                searchGroupLoading.value = false;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            searchGroupLoading.value = false;
        }
    }, 500);

    async function fetchGroupData(identicalName: IdenticalName) {
        try {
            const response = await $api.prescriptionGroup.featchGroupByIdenticalName(identicalName);

            if (response) {
                setGroupData(response, identicalName);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching group data:', error);
        }
    }

    const setGroupData = (data: any, identicalName: string) => {
        const groupMap: Record<string, any> = {
            chief_complain: groupForChiefComplients,
            diagnosis: groupForDiagnosis,
            observation: groupForObservation,
            investigation: groupForInvestigation,
            medicine: groupForDrug,
            advice: groupForAdvice,
            special_note: groupForNote,
        };

        const targetGroup = groupMap[identicalName];

        if (targetGroup) {
            Object.assign(targetGroup.value, data);
        } else {
            // eslint-disable-next-line no-console
            console.error(`Invalid group name: ${identicalName}`);
        }
    };

    const createGroup = async (data: GroupItem) => {
        createGroupLoading.value = true;
        try {
            const response = await $api.prescriptionGroup.create(data);
            if (response) {
                toast.add({ title: `${data.name} group created successfully` });
                updateGroupListForLocal(response?.data, data.item_identical_name);
                createGroupLoading.value = false;
                return response?.data;
            }
        } catch (error) {
            toast.add({ title: 'Somthing wring', color: 'red' });
            createGroupLoading.value = false;
            return false;
        }
    };

    const updateGroup = async (data: object) => {
        try {
            const response = await $api.prescriptionGroup.edit(data);
            if (response) {
                updateGroupNameWithItemsFroLocal(response.data, data.item_identical_name);
                return response.data;
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
            return false;
        }
    };

    const updateGroupNameWithItemsFroLocal = (data: any, identicalName: string) => {
        const groupDataMap = {
            chief_complain: groupForChiefComplients,
            diagnosis: groupForDiagnosis,
            observation: groupForObservation,
            investigation: groupForInvestigation,
            medicine: groupForDrug,
            advice: groupForAdvice,
            special_note: groupForNote,
        };

        const group = groupDataMap[identicalName];

        if (group) {
            const index = group.value.data.findIndex((groupItem) => groupItem.id === data.id);
            if (index !== -1) {
                group.value.data.splice(index, 1, data);
            }
        }
    };

    const updateGroupListForLocal = (data: any, identicalName: string) => {
        const groupMap = {
            chief_complain: groupForChiefComplients.value.data,
            diagnosis: groupForDiagnosis.value.data,
            observation: groupForObservation.value.data,
            investigation: groupForInvestigation.value.data,
            medicine: groupForDrug.value.data,
            advice: groupForAdvice.value.data,
            special_note: groupForNote.value.data,
        };

        const targetGroup = groupMap[identicalName];

        if (targetGroup) {
            targetGroup.push(data);
        }
    };

    const deleteGroup = async (group: object, identicalName: string) => {
        removeGroup(group, identicalName);

        try {
            const response = await $api.prescriptionGroup.deleteGroup(group.id);
            if (response) {
                return response;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    const deleteGroupItem = async (group: object, identicalName: string) => {
        removeGroupItem(group, identicalName);
        try {
            const response = await $api.prescriptionGroup.deleteItem(group);
            if (response) {
                return response;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    const removeGroup = (group: object, identicalName: string) => {
        const groupMap: Record<string, any> = {
            chief_complain: groupForChiefComplients.value.data,
            diagnosis: groupForDiagnosis.value.data,
            observation: groupForObservation.value.data,
            investigation: groupForInvestigation.value.data,
            medicine: groupForDrug.value.data,
            advice: groupForAdvice.value.data,
            special_note: groupForNote.value.data,
        };

        const targetGroup = groupMap[identicalName];

        if (targetGroup) {
            const index = targetGroup.findIndex((groupItem) => groupItem.id === group.id);
            if (index !== -1) {
                targetGroup.splice(index, 1);
            }
        }
    };

    const removeGroupItem = (group: object, identicalName: string) => {
        const groupDataMap = {
            chief_complain: groupForChiefComplients,
            diagnosis: groupForDiagnosis,
            observation: groupForObservation,
            investigation: groupForInvestigation,
            medicine: groupForDrug,
            advice: groupForAdvice,
            special_note: groupForNote,
        };

        const groupData = groupDataMap[identicalName];

        if (!groupData) {
            return; // or throw an error for invalid identicalName
        }

        const indexGroup = groupData.value.data.findIndex((groupItem) => groupItem.id === group.group_id);

        if (indexGroup !== -1) {
            const itemIndex = groupData.value.data[indexGroup].group_item.findIndex(
                (item) => item.id === group.item_id,
            );

            if (itemIndex !== -1) {
                groupData.value.data[indexGroup].group_item.splice(itemIndex, 1);
            }
        }
    };

    return {
        searchGroup,
        createGroup,
        updateGroup,
        fetchGroupData,
        searchGroupLoading,
        createGroupLoading,
        updateGroupLoading,
        groupForChiefComplients,
        groupForDiagnosis,
        groupForDrug,
        groupForObservation,
        groupForInvestigation,
        groupForAdvice,
        groupForNote,
        deleteGroup,
        deleteGroupItem,
    };
});
