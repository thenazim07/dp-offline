<script setup lang="ts">
import { useOnExaminationStoreRoot } from '~/stores/prescription/useOnExaminationStoreRoot';
import { usePrescriptionStore } from '~/stores/prescription/usePrescriptionStore';

const onExaminationStoreRoot = useOnExaminationStoreRoot();
const PrescriptionStoreRoot = usePrescriptionStore();

const { generalExamination } = storeToRefs(onExaminationStoreRoot);
const { selectedPatient } = storeToRefs(PrescriptionStoreRoot);

onUnmounted(() => {
    onExaminationStoreRoot.syncGeneralExaminationWithServer();
});

watch(
    [
        () => generalExamination?.value?.patient_data?.height_in_feet,
        () => generalExamination?.value?.patient_data?.height_in_inch,
    ],
    ([height_in_feet, height_in_inch]) => {
        if (height_in_feet && height_in_feet) {
            const heightInInches = height_in_feet * 12 + height_in_inch;
            generalExamination.value.patient_data.ideal_weight = calculateIdealWeight(
                heightInInches,
                selectedPatient?.value?.gender,
            );

            generalExamination.value.patient_data.ideal_bmi = calculateBMI(
                generalExamination?.value?.patient_data.ideal_weight,
                heightInInches,
            );
        }
    },
);

function onKeyUpEnterHandler(event: KeyboardEvent) {
    const nodeList = document.querySelectorAll('.custom-input-focus-class');
    for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i] === event.target) {
            nodeList[i + 1]?.focus();
            break;
        }
    }
}

const weight = computed({
    get: () =>
        generalExamination.value.patient_data.weight
            ? generalExamination.value.patient_data.weight
            : selectedPatient.value.weight,

    set: (value) => {
        generalExamination.value.patient_data.weight = value;
        selectedPatient.value.weight = value;
    },
});

const height_in_feet = computed({
    get: () =>
        generalExamination.value.patient_data.height_in_feet
            ? generalExamination.value.patient_data.height_in_feet
            : selectedPatient.value.height_in_feet,

    set: (value) => {
        generalExamination.value.patient_data.height_in_feet = value;
        selectedPatient.value.height_in_feet = value;
    },
});

const height_in_inch = computed({
    get: () =>
        generalExamination.value.patient_data.height_in_inch
            ? generalExamination.value.patient_data.height_in_inch
            : selectedPatient.value.height_in_inch,

    set: (value) => {
        generalExamination.value.patient_data.height_in_inch = value;
        selectedPatient.value.height_in_inch = value;
    },
});

// const weight = computed({
//     get: () =>
//         generalExamination.value.patient_data.weight
//             ? generalExamination.value.patient_data.weight
//             : selectedPatient.value.weight,

//     set: (value) => {
//         generalExamination.value.patient_data.weight = value;
//         selectedPatient.value.weight = value;
//     },
// });

const refSystolicError = ref(false);
const refDiastolicError = ref(false);

watch(
    [() => generalExamination.value.vitals.bp.systolic, () => generalExamination.value.vitals.bp.diastolic],
    ([newSystolic, newDiastolic]) => {
        const systolic = newSystolic !== '';
        const diastolic = newDiastolic !== '';

        // Set validity and error flags
        const isValid = systolic === diastolic;
        refSystolicError.value = !isValid && diastolic && !systolic;
        refDiastolicError.value = !isValid && systolic && !diastolic;
    },
);
</script>

<template>
    <div
        class="max-h-[598px] overflow-auto scroll-auto bg-slate-100 p-4 scrollbar-thin scrollbar-stable max-1919:max-h-[514px] max-1599:max-h-[347px]"
        @keyup.enter="onKeyUpEnterHandler"
    >
        <div class="flex flex-col gap-3 text-black">
            <!-- Blood Pressure -->
            <div class="grid grid-cols-12 items-center gap-2 px-2">
                <div class="col-span-3 font-bold">Blood Pressure:</div>
                <div class="col-span-6">
                    <div class="flex items-center justify-center gap-2">
                        <input
                            id="systolicInput"
                            v-model="generalExamination.vitals.bp.systolic"
                            :style="{ border: refSystolicError ? ' 1px solid red' : '' }"
                            type="number"
                            class="custom-input-focus-class w-full rounded border border-gray-300 p-[11px]"
                            placeholder="Systolic"
                        />
                        /
                        <input
                            id="diastolicInput"
                            v-model="generalExamination.vitals.bp.diastolic"
                            :style="{ border: refDiastolicError ? ' 1px solid red' : '' }"
                            type="number"
                            class="custom-input-focus-class w-full rounded border border-gray-300 p-[11px]"
                            placeholder="Diastolic"
                        />
                    </div>
                </div>
                <div>mm Hg</div>
            </div>
            <div class="grid grid-cols-12 items-center gap-2 px-2">
                <div class="col-span-3"></div>
                <div class="col-span-6">
                    <div class="flex items-center justify-start gap-4">
                        <input
                            v-model="generalExamination.vitals.bp.from_left_hand"
                            type="radio"
                            placeholder="Systolic"
                            :value="1"
                        />
                        <label
                            for="left-hand"
                            class="text-black"
                        >
                            Left Hand
                        </label>

                        <input
                            v-model="generalExamination.vitals.bp.from_left_hand"
                            type="radio"
                            placeholder="Diastolic"
                            :value="0"
                        />
                        <label
                            for="input-4"
                            class="text-black"
                        >
                            Right Hand
                        </label>
                    </div>
                </div>
                <div></div>
            </div>
            <hr class="border-white" />
            <!-- Heart Rate -->
            <div class="grid grid-cols-12 items-center gap-2 px-2">
                <div class="col-span-3 font-bold">Heart Rate:</div>
                <div class="col-span-6">
                    <div class="group relative">
                        <input
                            v-model="generalExamination.vitals.bpm"
                            class="custom-input-focus-class w-full rounded border border-gray-300 p-[11px]"
                            type="number"
                            placeholder="Enter BPM"
                        />
                        <select
                            class="absolute inset-y-0 right-0 rounded-r-lg border border-transparent bg-transparent text-slate-500 focus:outline-none"
                        >
                            <option value="bpm">BPM</option>
                        </select>
                    </div>
                </div>
            </div>

            <hr class="border-white" />

            <!-- Body Temperature -->
            <div class="grid grid-cols-12 items-center gap-2 px-2">
                <div class="col-span-3 font-bold">Body Temperature:</div>
                <div class="col-span-6">
                    <div class="group relative">
                        <input
                            v-model="generalExamination.vitals.temp_as_fahrenheit"
                            class="custom-input-focus-class w-full rounded border border-gray-300 p-[11px]"
                            type="number"
                            placeholder="Enter Temperature"
                        />
                        <select
                            class="absolute inset-y-0 right-0 rounded-r-lg border border-transparent bg-transparent text-slate-500 focus:outline-none"
                        >
                            <option value="bpm">F</option>
                        </select>
                    </div>
                </div>
            </div>

            <hr class="border-white" />

            <!-- Oxygen Saturation -->
            <div class="grid grid-cols-12 items-center gap-2 px-2">
                <div class="col-span-3 font-bold">Oxygen Saturation:</div>
                <div class="col-span-6">
                    <div class="group relative">
                        <input
                            v-model="generalExamination.vitals.SPO2"
                            class="custom-input-focus-class w-full rounded border border-gray-300 p-[11px]"
                            type="number"
                            placeholder="Oxygen Saturation"
                        />
                        <select
                            class="absolute inset-y-0 right-0 rounded-r-lg border border-transparent bg-transparent text-slate-500 focus:outline-none"
                        >
                            <option value="bpm">%</option>
                        </select>
                    </div>
                </div>
            </div>

            <hr class="border-white" />

            <!-- Glucose Level -->
            <div class="grid grid-cols-12 items-center gap-2 px-2">
                <div class="col-span-3 font-bold">Glucose Level:</div>
                <div class="col-span-6">
                    <div class="group relative">
                        <input
                            v-model="generalExamination.vitals.A1C"
                            class="custom-input-focus-class w-full rounded border border-gray-300 p-[11px]"
                            type="number"
                            placeholder="Enter Glucose Level"
                        />
                        <select
                            class="absolute inset-y-0 right-0 rounded-r-lg border border-transparent bg-transparent text-slate-500 focus:outline-none"
                        >
                            <option value="bpm">mmol/L</option>
                        </select>
                    </div>
                </div>
            </div>

            <hr />

            <!-- Weight -->
            <div class="grid grid-cols-12 items-center gap-2 px-2">
                <div class="col-span-3 font-bold">Weight:</div>
                <div class="col-span-6">
                    <div class="group relative">
                        <input
                            v-model="weight"
                            class="custom-input-focus-class w-full rounded border border-gray-300 p-[11px]"
                            type="number"
                            placeholder="Enter weight"
                        />
                        <select
                            class="absolute inset-y-0 right-0 rounded-r-lg border border-transparent bg-transparent text-slate-500 focus:outline-none"
                        >
                            <option value="bpm">kg</option>
                        </select>
                    </div>
                </div>

                <div class="col-span-3 flex items-center justify-center gap-2 text-sm">
                    <input
                        id="showPrescription1"
                        v-model="generalExamination.prescription_preferences.weight"
                        type="checkbox"
                    /><label for="showPrescription1">Show in Prescription</label>
                </div>
            </div>

            <!-- Height -->
            <div class="grid grid-cols-12 items-center gap-2 px-2">
                <div class="col-span-3 font-bold">Height:</div>
                <div class="col-span-6 flex items-start gap-10">
                    <div class="flex-grow">
                        <div class="group relative flex-grow">
                            <input
                                v-model="height_in_feet"
                                class="custom-input-focus-class w-full rounded border border-gray-300 p-[11px]"
                                type="number"
                                placeholder="Enter feet"
                            />
                            <select
                                class="absolute inset-y-0 right-0 rounded-r-lg border border-transparent bg-transparent text-slate-500 focus:outline-none"
                            >
                                <option value="bpm">Feet</option>
                            </select>
                        </div>
                        <div class="mt-2 flex gap-2">
                            <label
                                :class="
                                    tailwindMerge(
                                        'flex-grow rounded border bg-white px-3 py-2 text-center max-1599:my-auto max-1599:px-[2px]',
                                        {
                                            'bg-[#8e97a4]': generalExamination.prescription_preferences.bmi,
                                        },
                                        {
                                            'text-white': generalExamination.prescription_preferences.bmi,
                                        },
                                    )
                                "
                            >
                                Show BMI
                                <input
                                    v-model="generalExamination.prescription_preferences.bmi"
                                    class="hidden"
                                    type="checkbox"
                                />
                            </label>
                            <label
                                :class="
                                    tailwindMerge(
                                        'flex-grow rounded border bg-white px-3 py-2 text-center max-1599:my-auto max-1599:px-[2px]',
                                        {
                                            'bg-[#8e97a4]': generalExamination.prescription_preferences.bsi,
                                        },
                                        {
                                            'text-white': generalExamination.prescription_preferences.bsi,
                                        },
                                    )
                                "
                            >
                                Show BSA
                                <input
                                    v-model="generalExamination.prescription_preferences.bsi"
                                    class="hidden"
                                    type="checkbox"
                                />
                            </label>
                        </div>
                    </div>

                    <div class="group relative flex-grow">
                        <input
                            v-model="height_in_inch"
                            class="custom-input-focus-class w-full rounded border border-gray-300 p-[11px]"
                            type="number"
                            placeholder="Enter inch"
                        />
                        <select
                            class="absolute inset-y-0 right-0 rounded-r-lg border border-transparent bg-transparent text-slate-500 focus:outline-none"
                        >
                            <option value="bpm">Inch</option>
                        </select>
                    </div>
                </div>
                <div class="col-span-3 flex items-start justify-center gap-2 text-sm">
                    <input
                        v-model="generalExamination.prescription_preferences.height"
                        type="checkbox"
                    /><label for="showPrescription2">Show in Prescription</label>
                    <div></div>
                </div>
            </div>

            <hr />

            <div class="grid grid-cols-2 gap-x-7 gap-y-6">
                <div class="flex flex-col gap-3">
                    <label class="font-bold">Ideal Weight</label>
                    <div class="group relative">
                        <input
                            v-model="generalExamination.patient_data.ideal_weight"
                            class="custom-input-focus-class w-full rounded border border-gray-300 p-[11px]"
                            type="number"
                            placeholder="Ideal Weight"
                        />
                        <select
                            class="absolute inset-y-0 right-0 rounded-r-lg border border-transparent bg-transparent text-slate-500 focus:outline-none"
                        >
                            <option value="bpm">kg</option>
                        </select>
                    </div>
                </div>

                <div class="flex flex-col gap-3">
                    <label class="font-bold"> Ideal BMI </label>
                    <input
                        v-model="generalExamination.patient_data.ideal_bmi"
                        class="custom-input-focus-class w-full rounded border border-gray-300 p-[11px]"
                        type="number"
                        placeholder="Ideal BMI"
                    />
                </div>

                <div class="flex flex-col gap-3">
                    <label class="font-bold">Extra Cal:</label>
                    <div class="group relative">
                        <input
                            v-model="generalExamination.vitals.extra_cal"
                            class="custom-input-focus-class w-full rounded border border-gray-300 p-[11px]"
                            type="number"
                            placeholder="Extra Cal"
                        />
                        <select
                            class="absolute inset-y-0 right-0 rounded-r-lg border border-transparent bg-transparent text-slate-500 focus:outline-none"
                        >
                            <option value="bpm">Cal</option>
                        </select>
                    </div>
                </div>

                <div class="flex flex-col gap-3">
                    <label class="font-bold">Target Daily Cal:</label>
                    <div class="group relative">
                        <input
                            v-model="generalExamination.vitals.target_daily_cal"
                            class="custom-input-focus-class w-full rounded border border-gray-300 p-[11px]"
                            type="number"
                            placeholder="Extra Cal"
                        />
                        <select
                            class="absolute inset-y-0 right-0 rounded-r-lg border border-transparent bg-transparent text-slate-500 focus:outline-none"
                        >
                            <option value="bpm">Cal</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
