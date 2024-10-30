<script lang="ts" setup>
import { useChiefComplaintsStore } from '~/stores/prescription/useChiefComplaintsStore';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { usePrescriptionPresetStore } from '~~/stores/prescription/preset';
import type { IPreset } from '~/repository/modules/Prescription/PresetModule/types';

const useChiefComplaints = useChiefComplaintsStore();
const group = usePrescriptionGroupStore();
const preset = usePrescriptionPresetStore();
const { searchPreset, createPreset, updatePresetInfo, deletePreset } = preset;
const { createGroup, searchGroup, updateGroup, deleteGroup, deleteGroupItem } = group;
const { groupForChiefComplients, searchGroupLoading, createGroupLoading } = storeToRefs(group);
const { presetSearchLoading, presetCreateLoading, presetUpdateLoading, chiefComplaintsPresets } = storeToRefs(preset);
const { initialize, searchChiefComplaints } = useChiefComplaints;
const title = ref('Chief Complaints');
const identicalName = ref('chief_complain');
initialize();
const toast = useToast();

const presetList = computed(() => getSortedArray(chiefComplaintsPresets));
const groupList = computed(() => getSortedArray(groupForChiefComplients));
const to = computed(() => chiefComplaintsPresets?.value?.meta?.to || '');
const totalPrestCount = computed(() => chiefComplaintsPresets?.value?.meta?.total || '');

// search
const query = ref('');
const presetLoading = computed(() => presetSearchLoading?.value);
const presetCreateing = computed(() => presetCreateLoading?.value);
const hasFound = computed(() => presetList.value.length === 0 && query.value !== '');
const hasFoundForGroup = computed(() => groupList.value.length === 0 && query.value !== '');

const onSearch = (queryForPreset: string) => {
    searchPreset(queryForPreset, identicalName.value);
    query.value = queryForPreset;
};

const onSearchFroGroup = (queryForGroup: string) => {
    searchGroup(queryForGroup, identicalName.value);
    query.value = queryForGroup;
};

const createPresetFromCheifcomplaintsSearch = async (value: any) => {
    try {
        if (presetList.value.some((preset: IPreset) => preset.name.toLowerCase() === value.toLowerCase())) {
            toast.add({ title: 'Preset already exist ', color: 'red' });
            return;
        }
        const response = await createPreset({
            item_name: value,
            weight: 0,
            item_identical_name: identicalName.value,
        });

        if (response) {
            console.log('preset created', response);
        }
    } catch (error) {
        toast.add({ title: error?.data?.message, color: 'red' });
    }
};

const createPresets = async (values: any) => {
    try {
        if (
            presetList.value.some(
                (preset: IPreset) => preset.name.toLowerCase() === values.$event.item_name.toLowerCase(),
            )
        ) {
            toast.add({ title: 'Preset already exist ', color: 'red' });
            return;
        }

        await createPreset({
            ...values.$event,
            item_identical_name: identicalName.value,
        }).then((res) => {
            if (res) {
                values.close();
            }
        });
    } catch (error) {
        toast.add({ title: error?.data?.message, color: 'red' });
    }
};

const presetUpdate = (values: any) => {
    updatePresetInfo({
        ...values.$event,
        item_identical_name: identicalName.value,
    }).then((res) => {
        if (res) {
            values.close();
        }
    });
};

const updateDescriptionInChiefComplaints = (data: any) => {
    data.description = data?.description ? data?.description : [];
    const hasItem = data?.description?.find((item: object) => item === data?.new);

    if (hasItem) {
        toast.add({ title: 'Already exists', color: 'red' });
        return;
    }

    data?.description?.push(data?.new);

    updatePresetInfo({
        item_name: data.name,
        weight: data.weight,
        id: data.id,
        item_identical_name: identicalName.value,
        description: data.description,
    });
};

const removedDescriptionInPreset = (des: any) => {
    des?.description.splice(des?.index, 1);
    updatePresetInfo({
        ...des,
        item_identical_name: identicalName.value,
    });
};

const createPresetsGroup = (values: any) => {
    console.log('shibbir', {
        groupData: {
            name: values.$event.name,
            item_identical_name: identicalName.value,
            weight: values.$event.weight,
            item_ids: [],
            item_names: [],
        },
    });

    createGroup({
        name: values.$event.name,
        item_identical_name: identicalName.value,
        weight: values.$event.weight,
        item_ids: [],
        item_names: [],
    }).then((res) => {
        if (res) {
            values.close();
        }
    });
};

const groupUpdate = (values: any) => {
    updateGroup({
        id: values.$event.id,
        name: values.$event.name,
        item_identical_name: identicalName.value,
        weight: values.$event.weight,
        item_names: values.item_names,
    }).then((res) => {
        if (res) {
            values.close();
        }
    });
};

const selectedGroupItem = (item: any) => {
    updateGroup({
        name: item.name,
        id: item.id,
        item_identical_name: identicalName.value,
        item_ref: null,
        item_names: item.group_item ? item.group_item.map((item: any) => item.name).concat(item.value) : [item.value],
    });
};

const deleteItemInGroup = (item: Object) => {
    deleteGroupItem(item, identicalName.value);
};

const chiefComplaintsDataList: Ref<any> = ref([]);
const loading: Ref<boolean> = ref(false);

const searchChiefComplaintsData = async (query: string) => {
    // if (query.length === 0) {
    //     chiefComplaintsDataList.value = [];
    //     return;
    // }
    loading.value = true;
    const res = await searchChiefComplaints(query);
    loading.value = false;
    chiefComplaintsDataList.value = res;
};

onMounted(() => {
    preset.fetchPresetData('chief_complain');
    group.fetchGroupData('chief_complain');
});
onUnmounted(() => {
    useChiefComplaints.$dispose();
});
</script>

<template>
    <ClientOnly>
        <LazyPresetOption
            :title="title"
            :to="to"
            :total-prest-count="totalPrestCount"
        >
            <template #preset>
                <PresetOptionNonGroup
                    :has-found="hasFound"
                    :presets="presetList"
                    :title="title"
                    :update-loading="Boolean(presetUpdateLoading)"
                    placeholder="Preset Name"
                    @onUpdate="presetUpdate"
                    @updateDescription="updateDescriptionInChiefComplaints"
                    @removedDescription="removedDescriptionInPreset"
                    @deleteItem="deletePreset($event, identicalName)"
                >
                    <PresetOptionSearchOrCreateSection
                        :is-loading="Boolean(presetCreateing)"
                        :title="title"
                        placeholder="Enter C/C Name"
                        @onSubmit="createPresets"
                    >
                        <PresetSearch
                            :is-loading="loading"
                            :list="chiefComplaintsDataList"
                            placeholder="Search"
                            @change="searchChiefComplaintsData"
                            @selectItem="createPresetFromCheifcomplaintsSearch"
                        />
                    </PresetOptionSearchOrCreateSection>
                </PresetOptionNonGroup>
            </template>

            <template #group>
                <PresetOptionGroup
                    :has-found="hasFoundForGroup"
                    :groups="groupList"
                    :title="title"
                    :update-loading="Boolean(presetUpdateLoading)"
                    placeholder="Hi"
                    @onUpdate="groupUpdate"
                    @deleteGroup="deleteGroup($event, identicalName)"
                    @deleteGroupItem="deleteItemInGroup"
                >
                    <PresetOptionSearchOrCreateSectionForGroup
                        :is-loading="Boolean(createGroupLoading)"
                        :title="title"
                        placeholder="Group Create"
                        @onSubmit="createPresetsGroup"
                    >
                        <PresetSearch
                            :is-loading="Boolean(searchGroupLoading)"
                            placeholder="Search"
                            @change="onSearchFroGroup"
                        />
                    </PresetOptionSearchOrCreateSectionForGroup>
                    <template #search="groupItem">
                        <PresetOptionSearchInGroupToAddItem
                            :group="groupItem"
                            :is-loading="loading"
                            :list="chiefComplaintsDataList"
                            placeholder="Add C/C"
                            @change="searchChiefComplaintsData"
                            @selectGroupItem="selectedGroupItem"
                        >
                        </PresetOptionSearchInGroupToAddItem>
                    </template>
                </PresetOptionGroup>
            </template>
        </LazyPresetOption>
    </ClientOnly>
</template>
