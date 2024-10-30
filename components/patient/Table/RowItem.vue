<script lang="ts" setup>
const { profilePhoto } = globalMethods();

defineProps({
    item: {
        type: [Object],
        default: null,
    },
});
</script>

<template>
    <td class="font-poppins-regular whitespace-nowrap py-4 pl-4 pr-3 text-sm font-normal sm:pl-6">
        <div class="flex items-center">
            <div class="h-10 w-10 flex-shrink-0">
                <NuxtImg
                    v-if="profilePhoto(item)"
                    class="h-10 w-10 rounded-full"
                    :src="profilePhoto(item)"
                    alt=""
                />
            </div>
            <div class="ml-4">
                <div class="font-medium text-slate-900">{{ item.title }} {{ item.name }}</div>
                <div class="text-slate-500">
                    {{ item.contact_no ? item.contact_no : 'N/A' }}
                </div>
            </div>
        </div>
    </td>

    <td class="font-poppins-regular whitespace-nowrap py-4 text-sm font-normal text-gray-500">
        <div
            class="font-poppins-regular flex"
            :class="item.last_visit_date ? 'text-slate-900' : ' text-red-500'"
        >
            {{ item.last_visit_date ? item.last_visit_date : 'not-visited' }}
        </div>
    </td>

    <td class="font-poppins-regular whitespace-nowrap px-3 py-4 text-sm font-normal text-gray-500">
        <div class="text-gray-900">
            {{ item.age ? item.age + 'y' : '' }}
            {{ item.age_month ? item.age_month + 'm' : '' }}
            {{ item.age_day ? item.age_day + 'd' : '' }}
        </div>
    </td>

    <td class="font-poppins-regular whitespace-nowrap px-3 py-4 text-sm font-normal text-gray-500">
        <div class="text-gray-900">{{ item.gender }}</div>
    </td>

    <td class="font-poppins-regular whitespace-nowrap px-3 py-4 text-sm font-normal text-gray-500">
        <div class="text-gray-900">{{ item.weight ? item.weight : '--' }}</div>
    </td>

    <td class="font-poppins-regular relative whitespace-nowrap py-4 text-left text-sm font-medium font-normal">
        <div class="text-slate-800">
            {{ item.generated_patient_id }}
        </div>
    </td>

    <td>
        <slot :id="item.id"></slot>
    </td>
</template>
