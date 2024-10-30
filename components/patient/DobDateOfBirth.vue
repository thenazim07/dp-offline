<script lang="ts" setup>
import { CalendarOfMonth } from 'headless-calendar';

const startAndEndDay: Ref<number> = ref(28);

function yearsRanges(startDate = 1900) {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - startDate + 1 }, (_, index) => {
        const year = currentYear - index;
        return { name: year, value: year };
    }).reverse();
}

function allMonthName() {
    return [
        { name: 'January', position: '01', days: 31 },
        { name: 'February', position: '02', days: 29 },
        { name: 'March', position: '03', days: 31 },
        { name: 'April', position: '04', days: 30 },
        { name: 'May', position: '05', days: 31 },
        { name: 'June', position: '06', days: 30 },
        { name: 'July', position: '07', days: 31 },
        { name: 'August', position: '08', days: 31 },
        { name: 'September', position: '09', days: 30 },
        { name: 'October', position: '10', days: 31 },
        { name: 'November', position: '11', days: 30 },
        { name: 'December', position: '12', days: 31 },
    ];
}

const { value: selectYearValue } = useField<string>(() => 'dob_year');
const { value: selectMonthValue } = useField<string>(() => 'dob_month');
const { value: selectDayValue } = useField<string>(() => 'dob_day');

function onChangeUpdateDayRange() {
    if (selectYearValue.value && selectMonthValue.value) {
        startAndEndDay.value = new CalendarOfMonth(selectYearValue.value, selectMonthValue.value)?.endDate?.date;
    }
}

function range(size: number, startAt = 0) {
    return [...Array(size).keys()].map((i) => i + startAt);
}

const years = computed(() => yearsRanges(1900));
const months = computed(() => allMonthName());
const days = computed(() => {
    if (startAndEndDay.value) {
        return range(startAndEndDay.value, 1);
    }
    return [];
});

const selectMenu = {
    base: 'font-normal text-sm',
    color: {
        white: {
            outline: 'ring-slate-200 h-12 shadow-none',
        },
    },
    padding: {
        sm: 'px-4',
    },
};
</script>

<template>
    <div class="grid grid-cols-3 gap-x-4">
        <UFormGroup class="relative">
            <template #label>
                <span class="absolute -top-2 left-2 z-10 origin-[0] bg-white px-2 text-xs font-normal text-gray-400">
                    Year <span class="text-red-500">*</span>
                </span>
            </template>

            <template #default>
                <VField
                    v-slot="{ field }"
                    name="dob_year"
                >
                    <USelectMenu
                        v-model="selectYearValue"
                        v-bind="field"
                        :ui="selectMenu"
                        option-attribute="name"
                        value-attribute="value"
                        class="h-12 w-full border-red-500 lg:w-full"
                        placeholder="Select Year"
                        :options="years"
                        :model-value="selectYearValue"
                        @update:model-value="onChangeUpdateDayRange"
                    >
                    </USelectMenu>

                    <div class="h-5">
                        <VErrorMessage
                            class="font-poppins-regular text-xs italic text-red-500"
                            name="dob_year"
                        />
                    </div>
                </VField>
            </template>
        </UFormGroup>

        <UFormGroup class="relative">
            <template #label>
                <span class="absolute -top-2 left-2 z-10 origin-[0] bg-white px-2 text-xs font-normal text-gray-400">
                    Month <span class="text-red-500">*</span>
                </span>
            </template>

            <template #default>
                <VField
                    v-slot="{ field }"
                    name="dob_month"
                >
                    <USelectMenu
                        v-bind="field"
                        v-model="selectMonthValue"
                        :ui="selectMenu"
                        option-attribute="name"
                        value-attribute="position"
                        class="h-12 w-full border-red-500 lg:w-full"
                        placeholder="Select Month"
                        :options="months"
                        :model-value="selectMonthValue"
                        @update:model-value="onChangeUpdateDayRange"
                    >
                    </USelectMenu>

                    <div class="h-5">
                        <VErrorMessage
                            class="font-poppins-regular text-xs italic text-red-500"
                            name="dob_month"
                        />
                    </div>
                </VField>
            </template>
        </UFormGroup>

        <UFormGroup class="relative">
            <template #label>
                <span class="absolute -top-2 left-2 z-10 origin-[0] bg-white px-2 text-xs font-normal text-gray-400">
                    Day <span class="text-red-500">*</span>
                </span>
            </template>

            <template #default>
                <VField
                    v-slot="{ field }"
                    name="dob_day"
                >
                    <USelectMenu
                        v-model="selectDayValue"
                        v-bind="field"
                        :ui="selectMenu"
                        class="h-12 w-full border-red-500 lg:w-full"
                        placeholder="Select Day"
                        :options="days"
                    >
                    </USelectMenu>

                    <div class="h-5">
                        <VErrorMessage
                            class="font-poppins-regular text-xs italic text-red-500"
                            name="dob_day"
                        />
                    </div>
                </VField>
            </template>
        </UFormGroup>
    </div>
</template>
