<script lang="ts" setup>
import { XMarkIcon, Bars3Icon } from '@heroicons/vue/24/outline';
import { usePrescriptionDrugStore } from '~/stores/prescription/drug';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { useConfigsStore } from '~/stores/useConfigsStore';
const { nonGroupHeight, groupHeight } = storeToRefs(useConfigsStore());
const group = usePrescriptionGroupStore();
const { deleteGroup } = group;
const { groupForDrug } = storeToRefs(group);

const groupList = computed(() => {
    if (groupForDrug?.value && groupForDrug?.value.data) {
        return groupForDrug?.value?.data.map((item: any) => {
            return { ...item, drug_id: item.id };
        });
    }
    return [];
});

const tabs = [
    { label: 'Medicine', key: 'non-group' },
    { label: 'Medicine Group', key: 'group' },
];

const drugStore = usePrescriptionDrugStore();

const {
    initialize,
    toggleForCreateGroup,
    saveGroup,
    checkedOrUncheckedItem,
    remove,
    selectedGroup,
    editGroup,
    addNewItem,
    updateGroupInfo,
    resetGroupEdit,
} = drugStore;

const { addItemsList, groupName, selectedGroupNames, isSelectedMode, selectItemsForCreateGroup, groupInputStatus } =
    storeToRefs(drugStore);

initialize();

const createOrSelect = (item: any) => {
    if (item.is_custom_drug) {
        addNewItem({ brand_name: item.brand_name, is_custom_drug: true, uuid: getUuid(item.brand_name) });
        return true;
    }

    addNewItem(item);
};
</script>

<template>
    <ClientOnly>
        <UTabs :items="tabs">
            <template #item="{ item }">
                <div v-if="item.key === 'non-group'">
                    <PrescriptionMedicineLeftSideComponentSearch @create-or-select="createOrSelect" />

                    <PrescriptionBaseComponentsCreateGroupSection
                        v-if="addItemsList.length > 0"
                        v-model="groupName"
                        name="List of Medicine:"
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
                            name="drugs"
                        >
                            <template
                                v-for="(field, idx) in fields"
                                :key="field?.value?.generate_key"
                            >
                                <LazyPrescriptionBaseComponentsItemMedicineMarkup
                                    :name="`drugs[${idx}]`"
                                    :is-selected="
                                        isSelectedMode && selectItemsForCreateGroup.includes(field?.value?.drug_id)
                                    "
                                    :drug="field.value"
                                    :key-value="field.key"
                                >
                                    <template #action>
                                        <PrescriptionBaseComponentsDeleteAndCheckbox
                                            :disabled="!field?.value?.drug_id"
                                            :is-selected-mode="isSelectedMode"
                                            :checked="selectItemsForCreateGroup.includes(field?.value?.drug_id)"
                                            @delete-item="remove(idx)"
                                            @checked-or-unchecked="checkedOrUncheckedItem(field?.value?.drug_id)"
                                        />
                                    </template>

                                    <template #content>
                                        <div class="flex pt-4">
                                            <div class="flex h-8 w-8 flex-shrink-0 items-center">
                                                <Bars3Icon class="h-5 w-5 text-slate-300" />
                                            </div>

                                            <div class="w-full">
                                                <div class="w-full">
                                                    <PrescriptionMedicineLeftSideComponentSingleItem
                                                        :name="`drugs[${idx}]`"
                                                        :field="field"
                                                        :idx="idx"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </LazyPrescriptionBaseComponentsItemMedicineMarkup>
                            </template>
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
                                    @delete-group="deleteGroup($event, 'medicine')"
                                    @edit-group="editGroup"
                                />
                            </template>
                        </PrescriptionBaseComponentsGroupViewSection>
                    </KeepAlive>

                    <PrescriptionBaseComponentsCreateGroupSection
                        v-if="addItemsList.length > 0"
                        v-model="groupName"
                        name="List of Medicine:"
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
                            name="drugs"
                        >
                            <PrescriptionBaseComponentsItemMedicineMarkup
                                v-for="(field, idx) in fields"
                                :key="field?.value?.brand_name"
                                :name="`drugs[${idx}]`"
                                :is-selected="
                                    isSelectedMode && selectItemsForCreateGroup.includes(field?.value?.drug_id)
                                "
                                :drug="field.value"
                            >
                                <template #action>
                                    <PrescriptionBaseComponentsDeleteAndCheckbox
                                        :disabled="!field?.value?.drug_id"
                                        :is-selected-mode="isSelectedMode"
                                        :checked="selectItemsForCreateGroup.includes(field?.value?.drug_id)"
                                        @delete-item="remove(idx)"
                                        @checked-or-unchecked="checkedOrUncheckedItem(field?.value?.drug_id)"
                                    />
                                </template>

                                <template #content>
                                    <div class="flex pt-4">
                                        <div class="flex h-8 w-8 flex-shrink-0 items-center">
                                            <Bars3Icon class="h-5 w-5 text-slate-300" />
                                        </div>

                                        <div class="w-full">
                                            <div class="mb-5 w-full">
                                                <PrescriptionMedicineLeftSideComponentSingleItem
                                                    :name="`drugs[${idx}]`"
                                                    :field="field"
                                                    :idx="idx"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </PrescriptionBaseComponentsItemMedicineMarkup>
                        </FieldArray>
                    </PrescriptionBaseComponentsItems>
                </div>
            </template>
        </UTabs>
    </ClientOnly>
</template>
