<script lang="ts" setup>
const props = defineProps({
    item: {
        type: [Object],
        default: null,
    },
});
const formatted = useDateFormat(props?.item?.visit_date, 'DD-MMM-YYYY');
</script>

<template>
    <td class="font-poppins-regular whitespace-nowrap py-2.5 text-sm font-normal text-gray-500">
        <div class="font-poppins-regular pl-6 text-slate-900">
            {{ formatted }}
        </div>
    </td>

    <td class="font-poppins-regular w-64 whitespace-nowrap px-3 py-2.5 text-sm font-normal text-gray-500">
        <div class="text-gray-900">
            <NuxtLink
                :to="`/patients/details/${item.patient_id}`"
                class="font-poppins-regular hover:text-blue-500"
            >
                {{ item.patient_name }}
            </NuxtLink>
        </div>
    </td>

    <td class="font-poppins-regular whitespace-nowrap px-3 py-2.5 text-sm font-normal text-gray-500">
        <div class="max-w-xs whitespace-break-spaces text-gray-900">
            {{ item?.indications?.map((item: any) => item.name).toString() }}
        </div>
    </td>

    <td class="font-poppins-regular whitespace-nowrap px-3 py-2.5 text-sm font-normal text-gray-500">
        <div class="max-w-xs whitespace-break-spaces text-gray-900">
            {{ item?.diagnoses?.map((item: any) => item.name).toString() }}
        </div>
    </td>

    <td class="font-poppins-regular whitespace-nowrap px-3 py-2.5 text-sm font-normal text-gray-500">
        <div class="max-w-xs whitespace-break-spaces text-gray-900">
            {{ item?.investigations?.map((item: any) => item.name).toString() }}
        </div>
    </td>

    <!-- <td
    class="relative whitespace-nowrap py-4 text-left font-poppins-regular text-sm font-medium"
  >
    <div class="text-slate-800">
      <span
        :class="
          item.prescription_src
            ? 'bg-green-100 text-green-600'
            : 'bg-red-100 text-red-600'
        "
        class="rounded-full px-2 py-0.5 font-poppins-regular text-xs"
      >
        {{ item.prescription_src ? "Succeeded" : "Incomplete" }}
      </span>
    </div>
  </td> -->

    <td class="font-poppins-regular relative whitespace-nowrap py-2.5 text-sm font-medium">
        <NuxtLink :to="item.prescription_src ? item.prescription_src : '#'">
            <div class="mx-auto h-auto w-10 flex-shrink-0">
                <img
                    v-if="item.prescription_src"
                    class="h-12 w-12 rounded border object-cover shadow-sm"
                    src="~/assets/images/preview/templeate_prescription.svg"
                />
                <span
                    v-else
                    class="font-poppins-regular flex h-10 w-full items-center justify-center rounded-sm bg-slate-100 text-xs text-red-500"
                >
                    N/A
                </span>
            </div>
        </NuxtLink>
    </td>
</template>
