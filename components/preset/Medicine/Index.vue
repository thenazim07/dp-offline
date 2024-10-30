<script lang="ts" setup>
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue';
import { usePrescriptionDrugStore } from '~/stores/prescription/drug';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
const useDrug = usePrescriptionDrugStore();
const group = usePrescriptionGroupStore();
const preset = usePrescriptionPresetStore();
const { createPreset, updatePresetInfo, deletePreset } = preset;
const { createGroup, searchGroup, updateGroup, deleteGroup, deleteGroupItem } = group;
const { groupForDrug, searchGroupLoading, createGroupLoading } = storeToRefs(group);
const { presetUpdateLoading, drugPresets } = storeToRefs(preset);
const { initialize, searchDrug } = useDrug;
initialize();
const title = ref('Medicine');
const identicalName = ref('medicine');

const presetList = computed(() => getSortedArray(drugPresets));
const groupList = computed(() => getSortedArray(groupForDrug));
const to = computed(() => drugPresets?.value?.meta?.to || '');
const totalPrestCount = computed(() => drugPresets?.value?.meta?.total || '');

const query = ref('');
const hasFound = computed(() => presetList.value.length === 0 && query.value !== '');
const hasFoundForGroup = computed(() => groupList.value.length === 0 && query.value !== '');

const toast = useToast();

const onSearchFroGroup = (queryForGroup: string) => {
    searchGroup(queryForGroup, identicalName.value);
    query.value = queryForGroup;
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

const createPresetForMedicine = async (drug: any) => {
    try {
        await createPreset({
            item_id: drug.drug_id,
            weight: drug.weight,
            description: drug.description,
            item_identical_name: identicalName.value,
        });
    } catch (error) {
        toast.add({ title: error?.data?.message, color: 'red' });
    }
};

const createPresetsGroup = (values: any) => {
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
        item_ids: item.group_item ? item.group_item.map((item) => item.id).concat(item.value) : [item.value],
    });
};

const deleteItemInGroup = (item: any) => {
    deleteGroupItem(item, identicalName.value);
};

const drugDataList: Ref<any> = ref([]);
const loading: Ref<boolean> = ref(false);

const searchDrugData = async (query: string) => {
    if (query.length === 0) {
        drugDataList.value = [];
        return;
    }
    loading.value = true;
    const res = await searchDrug(query);
    loading.value = false;
    drugDataList.value = res;
};
onMounted(() => {
    preset.fetchPresetData('medicine');
    group.fetchGroupData('medicine');
});

onUnmounted(() => {
    useDrug.$dispose();
});
</script>

<template>
    <PresetTabTitle :title="title">
        <span v-if="to && totalPrestCount">(Showing {{ to }} of {{ totalPrestCount }} Results)</span>
    </PresetTabTitle>

    <TabGroup>
        <TabList
            as="div"
            class="relative z-0 mb-8 inline-flex w-full"
        >
            <Tab
                v-slot="{ selected }"
                as="template"
            >
                <PrescriptionTabsTab
                    :is-active="selected"
                    class-name="h-10 border text-sm 2xl:h-12 2xl:text-base"
                    :name="title"
                />
            </Tab>

            <Tab
                v-slot="{ selected }"
                as="template"
            >
                <PrescriptionTabsTab
                    :is-active="selected"
                    class-name="h-10 border text-sm 2xl:h-12 2xl:text-base"
                    :name="`${title} Group`"
                />
            </Tab>
        </TabList>

        <TabPanels>
            <TabPanel>
                <PresetMedicineNonGroup
                    :has-found="hasFound"
                    :presets="presetList"
                    :title="title"
                    :update-loading="Boolean(presetUpdateLoading)"
                    placeholder="Hi"
                    @onUpdate="presetUpdate"
                    @deleteItem="deletePreset($event, identicalName)"
                >
                    <PresetMedicineSearch
                        placeholder="Search"
                        :is-loading="loading"
                        :list="drugDataList"
                        holder="Add Medicine"
                        @change="searchDrugData"
                        @selectDrugItem="createPresetForMedicine"
                    />
                </PresetMedicineNonGroup>
            </TabPanel>

            <TabPanel>
                <PresetMedicineGroup
                    :has-found="hasFoundForGroup"
                    :groups="groupList"
                    :title="title"
                    :update-loading="Boolean(presetUpdateLoading)"
                    placeholder="Medicine"
                    @onUpdate="groupUpdate"
                    @deleteGroup="deleteGroup($event, identicalName)"
                    @deleteGroupItem="deleteItemInGroup"
                >
                    <template #default>
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
                    </template>

                    <template #search="{ groupItem }">
                        <PresetMedicineSearchInGroupToAddItem
                            :group="groupItem"
                            :is-loading="loading"
                            :list="drugDataList"
                            placeholder="Add Medicine"
                            @change="searchDrugData"
                            @selectGroupItem="selectedGroupItem"
                        >
                        </PresetMedicineSearchInGroupToAddItem>
                    </template>
                </PresetMedicineGroup>
            </TabPanel>
        </TabPanels>
    </TabGroup>
</template>
