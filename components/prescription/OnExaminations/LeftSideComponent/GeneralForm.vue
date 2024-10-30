<script lang="ts" setup>
import { useObservationStore } from '~/stores/prescription/useObservationStore';
const { form } = useObservationStore();
const options = [
    {
        value: '1',
        label: 'Left Hand',
    },
    {
        value: '0',
        label: 'Right Hand',
    },
];
</script>

<template>
    <div class="mr-3">
        <form>
            <div class="mb-5 grid grid-cols-12">
                <div class="col-span-3">
                    <h6 class="font-poppins-bold pt-3 text-base font-semibold text-slate-800">Blood Pressure:</h6>
                </div>

                <div class="col-span-6">
                    <div class="mb-5 flex justify-between">
                        <div>
                            <input
                                v-model="form.vitals.bp.systolic"
                                class="form-control-for-on-examination"
                                type="number"
                                placeholder="Systolic"
                                autofocus
                            />
                        </div>
                        <div class="mx-3 flex items-center">
                            <p class="inline text-lg text-slate-500">/</p>
                        </div>
                        <div>
                            <input
                                v-model="form.vitals.bp.diastolic"
                                class="form-control-for-on-examination"
                                type="number"
                                placeholder="Diastolic"
                            />
                        </div>
                    </div>

                    <div class="flex items-center space-x-6">
                        <URadio
                            v-for="method of options"
                            :key="method.value"
                            v-model="form.vitals.bp.from_left_hand"
                            color="blue"
                            v-bind="method"
                        />
                    </div>

                    <!-- <div class="flex items-center space-x-6">
                        <div class="flex items-center space-x-3">
                            <input id="left" name="hand" v-model="form.vitals.bp.from_left_hand" type="radio" value="1" />
                            <label for="left">Left Hand</label>
                        </div>
                        <div class="flex items-center space-x-3">
                            <input id="right" name="hand" v-model="form.vitals.bp.from_left_hand" type="radio" value="0" />
                            <label for="right">Right Hand</label>
                        </div>
                    </div> -->
                </div>

                <div class="col-span-3">
                    <p class="font-poppins-regular pl-6 pt-3 text-base font-normal text-slate-500">mm Hg</p>
                </div>
            </div>

            <div class="mb-5 grid grid-cols-12 items-center">
                <div class="col-span-3">
                    <h6 class="font-poppins-bold text-base font-semibold text-slate-800">Pulse Rate:</h6>
                </div>

                <div class="col-span-6">
                    <div class="group relative">
                        <input
                            v-model="form.vitals.bpm"
                            class="form-control-for-on-examination"
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

            <div class="mb-5 grid grid-cols-12 items-center">
                <div class="col-span-3">
                    <h6 class="font-poppins-bold text-base font-semibold text-slate-800">Body Temperature:</h6>
                </div>

                <div class="col-span-6">
                    <div class="group relative">
                        <input
                            v-model="form.vitals.temp_as_fahrenheit"
                            class="form-control-for-on-examination"
                            type="number"
                            placeholder="Enter Temperature"
                        />
                        <select
                            class="absolute inset-y-0 right-0 rounded-r-lg border border-transparent bg-transparent text-slate-500 focus:outline-none"
                        >
                            <option value="f">F</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="mb-5 grid grid-cols-12 items-center">
                <div class="col-span-3">
                    <h6 class="font-poppins-bold text-base font-semibold text-slate-800">Oxygen Saturation:</h6>
                </div>

                <div class="col-span-6">
                    <div class="group relative">
                        <input
                            v-model="form.vitals.SPO2"
                            class="form-control-for-on-examination"
                            type="number"
                            placeholder="Oxygen Saturation"
                        />
                        <div class="font-poppins-regular absolute right-3 top-3 font-normal text-slate-500">%</div>
                    </div>
                </div>
            </div>

            <div class="mb-5 grid grid-cols-12 items-center">
                <div class="col-span-3">
                    <h6 class="font-poppins-bold text-base font-semibold text-slate-800">Glucose Level:</h6>
                </div>

                <div class="col-span-6">
                    <div class="group relative">
                        <input
                            v-model="form.vitals.A1C"
                            class="form-control-for-on-examination"
                            type="number"
                            placeholder="Enter Glucose Level"
                        />
                        <select
                            class="absolute inset-y-0 right-0 rounded-r-lg border border-transparent bg-transparent text-slate-500 focus:outline-none"
                        >
                            <option value="mmol/l">mmol/L</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="mb-5">
                <hr />
            </div>

            <div class="mb-5 grid grid-cols-12 items-center">
                <div class="col-span-3">
                    <h6 class="font-poppins-bold text-base font-semibold text-slate-800">Weight:</h6>
                </div>

                <div class="col-span-6">
                    <div class="group relative">
                        <input
                            v-model="form.patient_data.weight"
                            class="form-control-for-on-examination"
                            type="number"
                            placeholder="Weight (kg)"
                        />
                        <div class="font-poppins-regular absolute right-3 top-3 font-normal text-slate-500">KG</div>
                    </div>
                </div>
            </div>

            <div class="mb-5 grid grid-cols-12 items-center">
                <div class="col-span-3">
                    <h6 class="font-poppins-bold text-base font-semibold text-slate-800">Height:</h6>
                </div>

                <div class="col-span-6">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="mr- group relative">
                            <input
                                v-model="form.patient_data.height_in_feet"
                                class="form-control-for-on-examination"
                                type="number"
                                placeholder=" Enter feet"
                            />
                            <div class="font-poppins-regular absolute right-3 top-3 font-normal text-slate-500">
                                Feet
                            </div>
                        </div>
                        <div class="group relative">
                            <input
                                v-model="form.patient_data.height_in_inch"
                                class="form-control-for-on-examination"
                                type="number"
                                placeholder="Enter inch"
                            />
                            <div class="font-poppins-regular absolute right-3 top-3 font-normal text-slate-500">
                                Inch
                            </div>
                        </div>
                    </div>
                </div>

                <!-- <div class="col-span-3">
          <div class="pl-3 flex items-center space-x-3">
            <LibFormCheckbox :checked="false" value="" />
            <label for="" class="font-poppins-regular font-normal text-base text-slate-800">Show in Prescription</label>
          </div>
        </div> -->
            </div>

            <div class="mb-5">
                <hr />
            </div>

            <div class="mb-5 grid grid-cols-2 gap-4">
                <div class="">
                    <div class="col-span-3 mb-2">
                        <h6 class="font-poppins-bold text-base font-semibold text-slate-800">ideal Weight:</h6>
                    </div>
                    <div class="group relative">
                        <input
                            class="form-control-for-on-examination"
                            type="number"
                            placeholder="ideal Weight"
                        />
                        <div class="font-poppins-regular absolute right-3 top-3 font-normal text-slate-500">Kg</div>
                    </div>
                </div>

                <div class="">
                    <div class="col-span-3 mb-2">
                        <h6 class="font-poppins-bold text-base font-semibold text-slate-800">ideal BMI:</h6>
                    </div>
                    <div class="">
                        <input
                            class="form-control-for-on-examination"
                            type="number"
                            placeholder="ideal BMI"
                        />
                    </div>
                </div>

                <div class="">
                    <div class="col-span-3 mb-2">
                        <h6 class="font-poppins-bold text-base font-semibold text-slate-800">Extra Cal:</h6>
                    </div>
                    <div class="group relative">
                        <input
                            v-model="form.vitals.extra_cal"
                            class="form-control-for-on-examination"
                            type="number"
                            placeholder="Extra Cal"
                        />
                        <div class="font-poppins-regular absolute right-3 top-3 font-normal text-slate-500">Cal</div>
                    </div>
                </div>

                <div class="">
                    <div class="col-span-3 mb-2">
                        <h6 class="font-poppins-bold text-base font-semibold text-slate-800">Target Daily Cal:</h6>
                    </div>
                    <div class="group relative">
                        <input
                            v-model="form.vitals.target_daily_cal"
                            class="form-control-for-on-examination"
                            type="number"
                            placeholder="Target Daily Cal"
                        />
                        <div class="font-poppins-regular absolute right-3 top-3 font-normal text-slate-500">Cal</div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
