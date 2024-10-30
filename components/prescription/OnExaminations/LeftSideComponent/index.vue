<script lang="ts" setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { useObservationStore } from '~/stores/prescription/useObservationStore';
import { useConfigsStore } from '~/stores/useConfigsStore';
const { modalHeight, nonGroupHeight, groupHeight } = storeToRefs(useConfigsStore());

const group = usePrescriptionGroupStore();
const { deleteGroup } = group;
const { groupForObservation } = storeToRefs(group);
const groupList = computed(() => groupForObservation?.value?.data || []);

const tabs = [
    {
        label: 'General Examination ',
        key: 'general',
    },
    {
        label: 'Observation',
        key: 'non-group',
    },
    {
        label: 'Observation  Group',
        key: 'group',
    },
];
const observationStore = useObservationStore();
const {
    initialize,
    toggleForCreateGroup,
    saveGroup,
    addNewItem,
    searchObservation,
    checkedOrUncheckedItem,
    remove,
    selectedGroup,
    editGroup,
    updateGroupInfo,
    resetGroupEdit,
} = observationStore;

const {
    addItemsList,
    groupName,
    activeIndex,
    selectedGroupNames,
    isSelectedMode,
    selectItemsForCreateGroup,
    groupInputStatus,
} = storeToRefs(observationStore);

onMounted(() => {
    initialize();
});

const loading = ref(false);

async function search(query: string) {
    if (query === '') return [];
    loading.value = true;
    const result = await searchObservation(query);
    loading.value = false;
    return result;
}

const searchValue = ref('');

const customItemAdd = (searchQuery: string): any => {
    if (!searchQuery) return;
    addNewItem({ name: searchQuery, uuid: getUuid(searchQuery) });
    searchValue.value = '';
};

const generalForm = computed(() => modalHeight.value - 180);
</script>

<template>
    <ClientOnly>
        <UTabs
            :items="tabs"
            @change="(value) => (activeIndex = value)"
        >
            <template #item="{ item }">
                <PrescriptionBaseComponentsItems
                    v-if="item.key === 'general'"
                    :max-height="generalForm"
                >
                    <PrescriptionOnExaminationsLeftSideComponentGeneralForm />
                </PrescriptionBaseComponentsItems>

                <div v-if="item.key === 'non-group'">
                    <div class="px-0.5">
                        <PrescriptionBaseComponentsSearch
                            v-model:query="searchValue"
                            :search="search"
                            :loading="loading"
                            option-attribute="name"
                            placeholder="Search/Add Observation"
                            @select-item="addNewItem"
                            @custom-create="customItemAdd"
                        />
                    </div>

                    <PrescriptionBaseComponentsCreateGroupSection
                        v-if="addItemsList.length > 0"
                        v-model="groupName"
                        name="List of Observation:"
                        :status="groupInputStatus"
                        @save-group="saveGroup"
                        @status="toggleForCreateGroup"
                    >
                        <button
                            v-if="groupInputStatus === 3"
                            class="ml-2 rounded-full bg-gray-100 px-2.5 py-2.5 hover:bg-gray-200 2xl:px-3 2xl:py-3"
                            @click="resetGroupEdit"
                        >
                            <XMarkIcon class="block h-4 w-4 text-slate-500"></XMarkIcon>
                        </button>
                    </PrescriptionBaseComponentsCreateGroupSection>

                    <PrescriptionBaseComponentsItems :max-height="nonGroupHeight">
                        <FieldArray
                            v-slot="{ fields }"
                            name="observations"
                        >
                            <PrescriptionBaseComponentsItem
                                v-for="(field, idx) in fields"
                                :key="field.key"
                                :is-selected="isSelectedMode && selectItemsForCreateGroup.includes(field?.value?.name)"
                            >
                                <PrescriptionOnExaminationsLeftSideComponentSingleItem
                                    :name="`observations[${idx}]`"
                                    :field="field"
                                    :idx="idx"
                                >
                                    <PrescriptionBaseComponentsDeleteAndCheckbox
                                        :is-selected-mode="isSelectedMode"
                                        :checked="selectItemsForCreateGroup.includes(field?.value?.name)"
                                        @delete-item="remove(idx)"
                                        @checked-or-unchecked="checkedOrUncheckedItem(field?.value?.name)"
                                    />
                                </PrescriptionOnExaminationsLeftSideComponentSingleItem>
                            </PrescriptionBaseComponentsItem>
                        </FieldArray>
                    </PrescriptionBaseComponentsItems>
                </div>

                <div v-if="item.key === 'group'">
                    <KeepAlive>
                        <PrescriptionBaseComponentsGroupViewSection v-if="groupList.length > 0">
                            <template
                                v-for="groupItem in groupList"
                                :key="groupItem.name"
                            >
                                <PrescriptionBaseComponentsGroupActions
                                    :is-selected="selectedGroupNames.includes(groupItem.name)"
                                    :group="groupItem"
                                    @selected-group="selectedGroup"
                                    @delete-group="deleteGroup($event, 'observation')"
                                    @edit-group="editGroup"
                                />
                            </template>
                        </PrescriptionBaseComponentsGroupViewSection>
                    </KeepAlive>

                    <PrescriptionBaseComponentsCreateGroupSection
                        v-if="addItemsList.length > 0"
                        v-model="groupName"
                        name="List of Observation:"
                        :status="groupInputStatus"
                        @save-group="saveGroup"
                        @updated:group="updateGroupInfo"
                        @status="toggleForCreateGroup"
                    >
                        <button
                            v-if="groupInputStatus === 2"
                            class="ml-2 rounded-full bg-gray-100 px-2.5 py-2.5 hover:bg-gray-200 2xl:px-3 2xl:py-3"
                            @click="resetGroupEdit"
                        >
                            <XMarkIcon class="block h-4 w-4 text-slate-500"></XMarkIcon>
                        </button>
                    </PrescriptionBaseComponentsCreateGroupSection>

                    <PrescriptionBaseComponentsItems :max-height="groupHeight">
                        <FieldArray
                            v-slot="{ fields }"
                            name="observations"
                        >
                            <PrescriptionBaseComponentsItem
                                v-for="(field, idx) in fields"
                                :key="field.key"
                                :is-selected="isSelectedMode && selectItemsForCreateGroup.includes(field?.value?.name)"
                            >
                                <PrescriptionOnExaminationsLeftSideComponentSingleItem
                                    :name="`observations[${idx}]`"
                                    :field="field"
                                    :idx="idx"
                                >
                                    <PrescriptionBaseComponentsDeleteAndCheckbox
                                        :is-selected-mode="isSelectedMode"
                                        :checked="selectItemsForCreateGroup.includes(field?.value?.name)"
                                        @delete-item="remove(idx)"
                                        @checked-or-unchecked="checkedOrUncheckedItem(field?.value?.name)"
                                    />
                                </PrescriptionOnExaminationsLeftSideComponentSingleItem>
                            </PrescriptionBaseComponentsItem>
                        </FieldArray>
                    </PrescriptionBaseComponentsItems>
                </div>
            </template>
        </UTabs>
    </ClientOnly>
</template>
