<script lang="ts" setup>
interface IProps {
    patientDetails?: object;
    showAction?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
    patientDetails: undefined,
    showAction: true,
});

const $emit = defineEmits(['select']);
const route = useRoute();
</script>

<template>
    <div class="2x:p-2 rounded-lg bg-white shadow">
        <div class="grid grid-cols-12 gap-1 2xl:gap-2">
            <div class="group col-span-8">
                <NuxtLink
                    :to="`/patients/details/${props.patientDetails?.id}`"
                    class="block cursor-pointer rounded-md p-2 group-hover:bg-slate-100"
                >
                    <p class="font-poppins-regular pb-2 text-[10px] font-normal text-slate-500 2xl:text-xs">
                        Patient ID: {{ props?.patientDetails?.generated_patient_id }}
                    </p>

                    <div class="flex items-center">
                        <div class="mr-3 h-10 w-10 flex-shrink-0">
                            <NuxtImg
                                v-if="profilePhoto(patientDetails)"
                                class="mx-auto h-10 w-10 rounded-full object-cover"
                                :src="profilePhoto(patientDetails)"
                                alt=""
                            />
                        </div>

                        <div>
                            <h5
                                :title="patientDetails?.name"
                                class="font-poppins-semibold text-xs font-semibold leading-3 text-slate-800 2xl:text-sm"
                            >
                                {{ truncate(patientDetails?.name, 40) }}
                            </h5>

                            <div class="font-poppins-regular">
                                <p class="text-xs font-medium text-slate-500 sm:inline">
                                    {{ patientDetails?.gender }}
                                </p>
                                {{ '  ' }}
                                <span class="2xl::mx-2 hidden text-xs sm:mx-1 sm:inline">&#124;</span>
                                {{ '  ' }}
                                <p class="text-xs font-medium text-slate-500 sm:inline">
                                    {{ patientDetails?.weight ? patientDetails.weight + ' kg' : '--' }}
                                </p>
                                {{ '  ' }}
                                <span class="2xl::mx-2 hidden text-xs sm:mx-1 sm:inline">&#124;</span>
                                {{ '  ' }}
                                <p class="text-xs font-medium text-slate-500 sm:inline">
                                    {{ patientDetails?.age ? patientDetails?.age + 'y' : '' }}
                                    {{ patientDetails?.age_month ? patientDetails?.age_month + 'm' : '' }}
                                    {{ patientDetails?.age_day ? patientDetails?.age_day + 'd' : '' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <div class="col-span-4 flex justify-end p-2">
                <div>
                    <p class="font-poppins-regular pb-2 text-[10px] font-normal text-slate-500 2xl:pb-4 2xl:text-xs">
                        <span v-if="props.patientDetails?.last_visit_date">
                            Last Visited: {{ props.patientDetails.last_visit_date }}
                        </span>
                    </p>

                    <button
                        class="font-poppins-regular inline-flex flex-shrink-0 items-center rounded-md border border-transparent bg-[#136AFB] px-3 py-1.5 text-[8px] font-medium leading-4 text-white shadow-sm hover:bg-[#136AFB] hover:ring-1 hover:ring-[#136AFB] hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-[#136AFB] focus:ring-offset-2 2xl:py-2 2xl:text-xs"
                        @click="$emit('select', { ...patientDetails, status: 'write' })"
                    >
                        <LazyLibIconRx
                            class="-ml-0.5 mr-1 h-3 w-3 2xl:mr-2 2xl:h-4 2xl:w-4"
                            color="#ffffff"
                        ></LazyLibIconRx>
                        {{ route.name === 'dashboard-prescription-create' ? 'Select Patient' : 'New Prescription' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
