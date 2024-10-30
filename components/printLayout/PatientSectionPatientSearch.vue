<template>
    <div class="w-fit">
        <span
            ref="addPatientRef"
            class="ml-1 flex gap-1 font-bold text-[#136AFB]"
            @click="isAddPatientForPreview = true"
        >
            <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M17 9C17 10.5823 16.5308 12.129 15.6518 13.4446C14.7727 14.7602 13.5233 15.7855 12.0615 16.391C10.5997 16.9965 8.99113 17.155 7.43928 16.8463C5.88743 16.5376 4.46197 15.7757 3.34315 14.6569C2.22433 13.538 1.4624 12.1126 1.15372 10.5607C0.84504 9.00887 1.00347 7.40034 1.60897 5.93853C2.21447 4.47672 3.23985 3.22729 4.55544 2.34824C5.87103 1.46919 7.41775 1 9 1C11.1217 1 13.1566 1.84285 14.6569 3.34315C16.1571 4.84344 17 6.87827 17 9Z"
                    stroke="#136AFB"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M9 6.03516V11.9612"
                    stroke="#136AFB"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M6.03711 9H11.9631"
                    stroke="#136AFB"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
            <span>Add Patient</span>
        </span>
        <div
            v-if="isAddPatientForPreview"
            ref="patientSearchFloatingRef"
            class="z-50 w-[680px]"
            :style="patientFloatingStyle"
        >
            <SearchPatientForPatientSection @close-component="isAddPatientForPreview = false" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { offset, useFloating } from '@floating-ui/vue';
import SearchPatientForPatientSection from '../prescription/SearchPatientForPatientSection.vue';

const isAddPatientForPreview = ref<boolean>(false);

const addPatientRef = ref(null);
const patientSearchFloatingRef = ref(null);

const { floatingStyles: patientFloatingStyle } = useFloating(addPatientRef, patientSearchFloatingRef, {
    placement: 'bottom-start',
});

onClickOutside(patientSearchFloatingRef, () => (isAddPatientForPreview.value = false));
</script>
