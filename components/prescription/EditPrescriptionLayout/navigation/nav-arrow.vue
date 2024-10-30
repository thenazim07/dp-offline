<template>
    <div class="absolute right-0 top-0 hidden group-hover:block">
        <div class="flex items-center">
            <!-- left -->
            <button @click.stop="leftArrowClick">
                <img
                    class="hover:bg-slate-200"
                    src="~/assets/images/preview/editPrescriptionLayout/arrow.svg"
                    alt="arrow"
                />
            </button>

            <!-- top -->
            <button @click.stop="topArrowClick">
                <img
                    class="rotate-90 hover:bg-slate-200"
                    src="~/assets/images/preview/editPrescriptionLayout/arrow.svg"
                    alt="arrow"
                />
            </button>

            <!-- right -->
            <button @click.stop="rightArrowClick">
                <img
                    class="rotate-180 hover:bg-slate-200"
                    src="~/assets/images/preview/editPrescriptionLayout/arrow.svg"
                    alt="arrow"
                />
            </button>

            <!-- down -->
            <button @click.stop="downArrowClick">
                <img
                    class="-rotate-90 hover:bg-slate-200"
                    src="~/assets/images/preview/editPrescriptionLayout/arrow.svg"
                    alt="arrow"
                />
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import type {
    IBodyItems,
    IBodySectionItemDetail,
    IPrescriptionBodySection,
} from '~/repository/modules/PageLayoutModule/types';

const props = defineProps<{
    sectionKeyName: string;
    // modelValue: IPrescriptionBodySection;
}>();

const { bodySectionFormData } = storeToRefs(useLayoutsStore());

// const formData = reactive({ ...props.modelValue });

// const emit = defineEmits(['update:modelValue', 'submit']);

// watch(
//     formData,
//     (newValue) => {
//         emit('update:modelValue', newValue);
//     },
//     { deep: true },
// );

const currentColumnIndex = computed(() =>
    Object.keys(bodySectionFormData.value.body.columns.column0.items).includes(props.sectionKeyName) ? 0 : 1,
);

const currentRowIndex = computed(() => {
    if (Object.keys(bodySectionFormData.value.body.columns.column0.items).includes(props.sectionKeyName)) {
        return Object.keys(bodySectionFormData.value.body.columns.column0.items).indexOf(props.sectionKeyName);
    }

    return Object.keys(bodySectionFormData.value.body.columns.column1.items).indexOf(props.sectionKeyName);
});

function leftArrowClick() {
    if (currentColumnIndex.value === 0) return;

    const removedSection = { ...bodySectionFormData.value.body.columns.column1.items[props.sectionKeyName] };

    delete bodySectionFormData.value.body.columns.column1.items[props.sectionKeyName];

    bodySectionFormData.value.body.columns.column0.items[props.sectionKeyName] = { ...removedSection };
}

function rightArrowClick() {
    if (currentColumnIndex.value === 1) return;

    const removedSection = JSON.parse(
        JSON.stringify(bodySectionFormData.value.body.columns.column0.items[props.sectionKeyName]),
    );

    // console.log('removed section to right', removedSection);
    // console.log('section name', props.sectionKeyName);
    // console.log('removed section to right', bodySectionFormData.value);
    delete bodySectionFormData.value.body.columns.column0.items[props.sectionKeyName];

    bodySectionFormData.value.body.columns.column1.items[props.sectionKeyName] = JSON.parse(
        JSON.stringify(removedSection),
    );
}

function topArrowClick() {
    if (currentColumnIndex.value === 0) {
        if (currentRowIndex.value > 0)
            bodySectionFormData.value.body.columns.column0.items = moveKey(
                bodySectionFormData.value.body.columns.column0.items,
                currentRowIndex.value,
                currentRowIndex.value - 1,
            );
    }

    if (currentColumnIndex.value === 1) {
        if (currentRowIndex.value > 0)
            bodySectionFormData.value.body.columns.column1.items = moveKey(
                bodySectionFormData.value.body.columns.column1.items,
                currentRowIndex.value,
                currentRowIndex.value - 1,
            );
    }
}

function downArrowClick() {
    if (currentColumnIndex.value === 0) {
        if (currentRowIndex.value < Object.keys(bodySectionFormData.value.body.columns.column0.items).length - 1)
        bodySectionFormData.value.body.columns.column0.items = moveKey<IBodyItems>(
            bodySectionFormData.value.body.columns.column0.items,
                currentRowIndex.value,
                currentRowIndex.value + 1,
            );
    }

    if (currentColumnIndex.value === 1) {
        if (currentRowIndex.value < Object.keys(bodySectionFormData.value.body.columns.column1.items).length - 1)
        bodySectionFormData.value.body.columns.column1.items = moveKey<IBodyItems>(
            bodySectionFormData.value.body.columns.column1.items,
                currentRowIndex.value,
                currentRowIndex.value + 1,
            );
    }
}

function moveKey<T>(obj: T, fromIndex: number, toIndex: number): T {
    // Convert the object into an array of key-value pairs
    let entries = Object.entries(obj);

    // Remove the entry at the fromIndex
    let [removed] = entries.splice(fromIndex, 1);

    // Insert the removed entry at the toIndex
    entries.splice(toIndex, 0, removed);

    // Convert the array back to an object and return it
    return Object.fromEntries(entries);
}
</script>
