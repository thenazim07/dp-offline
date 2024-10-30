<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useEhrFamilyStore } from '~/stores/ehr/family/index';
const { removedFamilyForPrescription, updateFamily } = useEhrFamilyStore();
const { familySelectedList } = storeToRefs(useEhrFamilyStore());

const list = computed(() => {
    return (familySelectedList.value ?? []).map((item: any) => {
        return { ...item, unique_keys: generateRandomString(10) };
    });
});
</script>

<template>
    <PrescriptionBaseComponentsSingleUpdateItemsItemMarkupHistory
        name="F/H"
        :list="list"
    >
        <template #title="family">
            <span class="mr-1 text-slate-900">{{ family?.item?.disease }} </span>
            <small
                v-if="family?.item?.relation"
                class="capitalize"
            >
                - {{ family.item.relation }}
            </small>
            <br v-if="family?.item?.note" />
            <small v-if="family?.item?.note">
                {{ family?.item?.note }}
            </small>
        </template>

        <template #content="family">
            <VForm
                v-slot="{ values }"
                class="w-full cursor-pointer rounded-lg bg-slate-100"
                as="div"
                :initial-values="{
                    disease: family?.item?.disease ?? '',
                    relation: family?.item?.relation ?? null,
                    note: family?.item?.note ?? '',
                    icd_code_ref: family?.item?.icd_code_ref ?? null,
                }"
            >
                <PrescriptionBaseComponentsItemMarkup>
                    <template #title>
                        <PrescriptionBaseComponentsItemName :name="family?.item?.disease" />
                    </template>

                    <template #content>
                        <PrescriptionHistoryFamilySingleItem
                            :field="family?.item"
                            @change-value="updateFamily(values)"
                        />
                    </template>
                </PrescriptionBaseComponentsItemMarkup>
            </VForm>
        </template>

        <template #delete="family">
            <button @click="removedFamilyForPrescription(family.item)">
                <TrashIcon class="h-4 w-4 text-red-500"></TrashIcon>
            </button>
        </template>
    </PrescriptionBaseComponentsSingleUpdateItemsItemMarkupHistory>
</template>
