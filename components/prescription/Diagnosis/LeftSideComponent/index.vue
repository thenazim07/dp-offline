<script lang="ts" setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { useDiagnosisStore } from '~/stores/prescription/useDiagnosisStore';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { useConfigsStore } from '~/stores/useConfigsStore';

const group = usePrescriptionGroupStore();
const { deleteGroup } = group;
const { groupForDiagnosis } = storeToRefs(group);
const groupList = computed(() => groupForDiagnosis?.value?.data || []);
const { nonGroupHeight, groupHeight } = storeToRefs(useConfigsStore());

const tabs = [
    {
        label: 'Diagnosis',
        key: 'non-group',
    },
    {
        label: 'Diagnosis Group',
        key: 'group',
    },
];
const diagnosisStore = useDiagnosisStore();

const {
    initialize,
    toggleForCreateGroup,
    saveGroup,
    addNewItem,
    searchDiagnosis,
    checkedOrUncheckedItem,
    remove,
    selectedGroup,
    editGroup,
    updateGroupInfo,
    resetGroupEdit,
} = diagnosisStore;

const { addItemsList, groupName, selectedGroupNames, isSelectedMode, selectItemsForCreateGroup, groupInputStatus } =
    storeToRefs(diagnosisStore);

onMounted(() => {
    initialize();
});

const loading = ref(false);

async function search(query: string) {
    if (query === '') return [];
    loading.value = true;
    const result = await searchDiagnosis(query);
    loading.value = false;
    return result;
}

const searchValue = ref('');

const customItemAdd = (searchQuery: string): any => {
    if (!searchQuery) return;
    addNewItem({ name: searchQuery, uuid: getUuid(searchQuery) });
    searchValue.value = '';
};
</script>

<template>
    <ClientOnly>
        <UTabs :items="tabs">
            <template #item="{ item }">
                <div v-if="item.key === 'non-group'">
                    <div class="px-0.5">
                        <PrescriptionBaseComponentsSearch
                            v-model:query="searchValue"
                            :search="search"
                            :loading="loading"
                            option-attribute="name"
                            placeholder="Search/Add Diagnosis"
                            @select-item="addNewItem"
                            @custom-create="customItemAdd"
                        />
                    </div>

                    <PrescriptionBaseComponentsCreateGroupSection
                        v-if="addItemsList.length > 0"
                        v-model="groupName"
                        name="List of Diagnosis:"
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
                            name="diagnoses"
                        >
                            <PrescriptionBaseComponentsItemMarkup
                                v-for="(field, idx) in fields"
                                :key="field.key"
                                :is-selected="isSelectedMode && selectItemsForCreateGroup.includes(field?.value?.name)"
                            >
                                <template #title>
                                    <PrescriptionBaseComponentsItemName :name="field?.value?.name" />

                                    <PrescriptionBaseComponentsDeleteAndCheckbox
                                        :is-selected-mode="isSelectedMode"
                                        :checked="selectItemsForCreateGroup.includes(field?.value?.name)"
                                        @delete-item="remove(idx)"
                                        @checked-or-unchecked="checkedOrUncheckedItem(field?.value?.name)"
                                    />
                                </template>

                                <template #content>
                                    <PrescriptionDiagnosisLeftSideComponentSingleItem
                                        :name="`diagnoses[${idx}]`"
                                        :field="field"
                                        :idx="idx"
                                    />
                                </template>
                            </PrescriptionBaseComponentsItemMarkup>
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
                                    @delete-group="deleteGroup($event, 'diagnosis')"
                                    @edit-group="editGroup"
                                />
                            </template>
                        </PrescriptionBaseComponentsGroupViewSection>
                    </KeepAlive>

                    <PrescriptionBaseComponentsCreateGroupSection
                        v-if="addItemsList.length > 0"
                        v-model="groupName"
                        name="List of Diagnosis:"
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
                            name="diagnoses"
                        >
                            <PrescriptionBaseComponentsItemMarkup
                                v-for="(field, idx) in fields"
                                :key="field.key"
                                :is-selected="isSelectedMode && selectItemsForCreateGroup.includes(field?.value?.name)"
                            >
                                <template #title>
                                    <PrescriptionBaseComponentsItemName :name="field?.value?.name" />

                                    <PrescriptionBaseComponentsDeleteAndCheckbox
                                        :is-selected-mode="isSelectedMode"
                                        :checked="selectItemsForCreateGroup.includes(field?.value?.name)"
                                        @delete-item="remove(idx)"
                                        @checked-or-unchecked="checkedOrUncheckedItem(field?.value?.name)"
                                    />
                                </template>

                                <template #content>
                                    <PrescriptionDiagnosisLeftSideComponentSingleItem
                                        :name="`diagnoses[${idx}]`"
                                        :field="field"
                                        :idx="idx"
                                    />
                                </template>
                            </PrescriptionBaseComponentsItemMarkup>
                        </FieldArray>
                    </PrescriptionBaseComponentsItems>
                </div>
            </template>
        </UTabs>
    </ClientOnly>
</template>
