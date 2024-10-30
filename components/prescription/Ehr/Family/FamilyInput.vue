<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useEhrFamilyStoreRoot } from '~/stores/ehr/useFamilyStoreRoot';
import type { IFamily } from '~/repository/modules/EHR/FamilyHistory/types';
import { useConfigsStore } from '~/stores/useConfigsStore';

const { relations } = storeToRefs(useConfigsStore());
const ehrFamilyStoreRoot = useEhrFamilyStoreRoot();
const { familyList } = storeToRefs(ehrFamilyStoreRoot);
const { loading, search, result } = await useEhrFamilySearch();
const familyInputRef = ref<HTMLDivElement | null>(null);
const { focusToParentElementsLastChildsFirstInput, inputClassToFocus } = useFocusOnParentElementsLastInputElement();
const toast = useToast();

const props = withDefaults(
    defineProps<{
        family?: IFamily;
        index?: number;
        autofocus?: boolean;
        isRemovable?: boolean;
    }>(),
    {
        family: () => ({}) as IFamily,
        index: undefined,
        autofocus: false,
        isRemovable: true,
    },
);

const convertedRelation = computed(() => {
    if (!relations.value)
        return [
            {
                label: '',
                value: null,
            },
        ];
    return Object.entries(relations.value).map(([key, value]) => ({
        label: value,
        key,
    }));
});

const note = computed({
    get: () => props.family.note,
    set: (value) => ehrFamilyStoreRoot.updateIndication(props.index!, 'note', value),
});

const family = computed({
    get: () => props.family.disease,
    set: (value) => {
        if (!checkDuplicateFamily(value.name)) {
            toast.add({ title: 'family history already exist', color: 'red' });
            return;
        }

        ehrFamilyStoreRoot.updateIndication(props.index!, 'disease', value.name);
        ehrFamilyStoreRoot.updateIndication(props.index!, 'icd_code_ref', value.code);

        focusOnParentElementsLastInputElement();
    },
});

function checkDuplicateFamily(value: string) {
    if (!value.trim()) return false;

    if (familyList.value.filter((singleFamily) => singleFamily.disease.trim() === value.trim()).length !== 1) {
        return true;
    } else {
        return false;
    }
}

const relation = computed({
    get: () => props.family.relation,
    set: (value) => ehrFamilyStoreRoot.updateIndication(props.index!, 'relation', value),
});

function deleteItem() {
    ehrFamilyStoreRoot.deleteFamily(props.index!);
}

const configFormStyle = {
    base: inputClassToFocus + ' h-[48px] w-full focus:outline-none focus:border-none font-normal border-none',
    rounded: 'rounded',
    ring: 'ring-0',
    color: {
        white: {
            outline: 'ring-0 !focus:ring-0 focus:border-none focus:outline-none  shadow-none',
        },
    },
};

const configRelationMenu = {
    base: ' h-[48px] w-44 w-ful capitalize focus:outline-none focus:border-none font-normal border-none',
    rounded: 'rounded',
    ring: 'ring-0',
    color: {
        white: {
            outline: 'ring-0 !focus:ring-0 focus:border-none focus:outline-none  shadow-none',
        },
    },
};

const focusOnParentElementsLastInputElement = () => {
    focusToParentElementsLastChildsFirstInput(familyInputRef, `.${inputClassToFocus}`);
};

async function handleSearchableSelect(selected: any) {
    await nextTick();

    focusOnParentElementsLastInputElement();
}
</script>

<template>
    <div
        ref="familyInputRef"
        class="flex w-full items-center justify-between gap-2"
    >
        <LibIconHamBurger />
        <div class="relative w-[80%]">
            <!-- <USelectMenu
                v-model="family"
                :searchable="search"
                :options="result"
                :loading="loading"
                placeholder="Search/Add Family"
                option-attribute="name"
                option-value="name"
                trailing
                :ui="configFormStyle"
                :ui-menu="{
                    width: 'w-[47%]',
                }"
                :popper="{
                    strategy: 'fixed',
                    placement: 'bottom-start',
                }"
            >
                <template #label>
                    <span :class="family === '' ? 'text-gray-400' : 'text-gray-900'">
                        {{ family || 'Search/Add Family' }}
                    </span>
                </template>
            </USelectMenu> -->

            <VueSelect
                v-model="family"
                :class="`${inputClassToFocus} ${checkDuplicateFamily(family) ? 'border border-red-500' : ''}`"
                :options="result"
                :search="search"
                placeholder="Search/Add Family"
                label="disease"
                @selected="handleSearchableSelect"
            />
        </div>
        <div class="flex w-44 flex-shrink-0 items-center">
            <!-- <USelectMenu
                v-model="relation"
                :ui="configRelationMenu"
                :options="convertedRelation"
                value-attribute="label"
                option-attribute="label"
                placeholder="Select Relation"
            >
                <template #label>
                    <span :class="relation === '' ? 'text-gray-400' : 'text-gray-900'">
                        {{ relation || 'Select Relation' }}
                    </span>
                </template>
            </USelectMenu> -->

            <select
                v-model="relation"
                class="flex-grow rounded-r border-none p-3"
            >
                <option
                    value=""
                    disabled
                >
                    Select Relation
                </option>
                <option
                    v-for="option in convertedRelation"
                    :key="option.label"
                    :value="option.label"
                >
                    {{ option.label }}
                </option>
            </select>
        </div>
        <div class="flex w-[40%]">
            <textarea
                v-model="note"
                placeholder="Note"
                rows="1"
                class="h-[48px] w-full resize-none rounded border-none p-3 text-sm"
                @keydown.enter.exact.prevent="focusOnParentElementsLastInputElement"
            ></textarea>
        </div>

        <div
            v-if="props.isRemovable"
            class="w-[3%]"
        >
            <button
                type="button"
                @click.prevent="deleteItem"
            >
                <TrashIcon class="h-6 w-6 font-semibold text-red-600" />
            </button>
        </div>
        <div
            v-else
            class="w-[4%]"
        ></div>
    </div>
</template>
