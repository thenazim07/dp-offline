<script lang="ts" setup>
import { usePrescriptionDrugStore } from '~/stores/prescription/drug/index';
const drugStore = usePrescriptionDrugStore();
const { searchGenerics, initialize } = drugStore;
const { dosageForms } = storeToRefs(drugStore);
const dosageFormsList = computed(() => dosageForms.value ?? []);
const emit = defineEmits(['change-value']);
initialize();
const props = defineProps<{
    name?: string | undefined;
    drug?: object | undefined;
}>();

// dosage form sections
const selectedDosage = ref({});
const { value: dosageFormRef } = useField<string>(() =>
    props.name ? `${props.name}.dosage_form_ref` : 'dosage_form_ref',
);
if (dosageFormRef.value && dosageFormsList.value) {
    selectedDosage.value = dosageFormsList.value.filter((item: any) => item.ref === dosageFormRef.value)[0];
}
const updateMedicineType = (value: object) => (dosageFormRef.value = value.ref);

// generic type sections
async function search(query: string) {
    if (query === '') return [];
    const result = await searchGenerics(query);
    return result;
}

const selectedGeneric = ref({
    name: props?.drug?.generic_name ?? '',
    ref: props?.drug?.generic_ref ?? '',
});

const { value: genericRef } = useField(props.name ? `${props.name}.generic_ref` : 'generic_ref');
const { value: genericName } = useField(props.name ? `${props.name}.generic_name` : 'generic_name');

const updateGenericRef = (value: object) => {
    genericRef.value = value.ref;
    genericName.value = value.name;
};

// style configruation
const configTypeMenu = {
    base: 'h-10 w-28 font-medium border',
    rounded: 'rounded-md',
    ring: 'ring-0',
    color: {
        white: {
            outline: 'ring-0 focus:ring-1 focus:ring-blue-500 shadow-none',
        },
    },
};

const configForGeneric = {
    base: 'block min-w-[250px] pl-4 h-10 w-full ring-0 shadow-none rounded-lg border focus:border-blue-500 border-slate-300 bg-white  font-poppins-regular leading-5 text-slate-500 placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm',
    padding: 'py-3 px-4',
    color: {
        white: {
            outline: 'shadow-none ring-0 focus:ring-0 focus:outline-border-blue-600 focus:ring-blue-600',
        },
    },
};

const icon = computed(() => selectedDosage?.value?.icon_url ?? '/images/dosage_form_not_selected.svg');
</script>

<template>
    <div class="mr-3 flex w-full space-x-3">
        <div class="flex items-center">
            <div class="mr-3">
                <img
                    :src="icon"
                    class="h-5 w-5 text-slate-300"
                />
            </div>
            <USelectMenu
                v-model="selectedDosage"
                :ui="configTypeMenu"
                placeholder="Select"
                :options="dosageFormsList"
                option-attribute="short_name"
                @change="emit('change-value')"
                @update:model-value="updateMedicineType"
            />
        </div>

        <div class="w-full flex-1">
            <VField
                :name="props.name ? `${props.name}.brand_name` : 'brand_name'"
                class="h-10 w-full rounded-md text-sm font-normal text-gray-900 [appearance:textfield] focus:outline-none disabled:bg-gray-100"
                type="text"
                placeholder="Enter medicine name"
                :maxlength="200"
                @change="emit('change-value')"
            />
        </div>

        <div>
            <USelectMenu
                v-model="selectedGeneric"
                :searchable="search"
                placeholder="Generic Name"
                option-attribute="name"
                trailing
                :ui="configForGeneric"
                @change="emit('change-value')"
                @update:model-value="updateGenericRef"
            />
        </div>
    </div>
</template>
