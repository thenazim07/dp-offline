<script lang="ts" setup>
import { PlusCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { useConfigsStore } from '~/stores/useConfigsStore';
import { useHistoryStore } from '~/stores/history/useHistoryStore';
const { durationTypes } = storeToRefs(useConfigsStore());
const historyStore = useHistoryStore();
const { initialize, selectSurgicalInfo, immunizedUpdate, periodUpdateOrCreate } = historyStore;
const { surgicalType } = storeToRefs(historyStore);
initialize();
const { nonGroupHeight } = storeToRefs(useConfigsStore());

const initialValuesForSurgical: Object = {
    surgicals: [{}],
};

const checkedForImmunize = ref(false);
const period_type = ref('');
const note = ref('');
const createPeriod = () => {
    periodUpdateOrCreate({
        period_type: period_type.value,
        note: note.value,
    });
};
</script>

<template>
    <div
        :class="nonGroupHeight"
        class="max-h-[27rem] min-h-72 w-auto space-y-3 overflow-y-auto py-2 pb-8 pl-1 pr-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-md scrollbar-w-1.5 2xl:max-h-[30rem]"
    >
        <section>
            <p class="font-poppins-bold pb-2 text-base text-slate-800">Surgical History</p>

            <VForm
                v-slot="{ values }"
                :initial-values="initialValuesForSurgical"
                @submit="selectSurgicalInfo"
            >
                <FieldArray
                    v-slot="{ fields, push, remove }"
                    name="surgicals"
                >
                    <div class="flex items-end justify-between">
                        <div class="flex w-full flex-wrap">
                            <div
                                v-for="(surgical, index) in fields"
                                :key="index"
                                class="relative mt-3 flex w-full items-center"
                            >
                                <div class="w-full">
                                    <VField
                                        :id="`surgicals[${index}].name`"
                                        :name="`surgicals[${index}].name`"
                                        as="select"
                                        value="Appendectomy"
                                        class="block h-12 w-full rounded border pl-3 pr-20 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        @change="selectSurgicalInfo(values)"
                                    >
                                        <option
                                            v-for="(type, key) in surgicalType"
                                            :key="key"
                                            :value="type.name"
                                        >
                                            {{ type.name }}
                                        </option>
                                    </VField>
                                </div>

                                <div class="mx-3 w-full">
                                    <div class="relative col-span-2">
                                        <VField
                                            :id="`surgicals[${index}].duration`"
                                            :name="`surgicals[${index}].duration`"
                                            type="number"
                                            class="font-poppins-regular block h-12 w-full appearance-none rounded-md border bg-white px-3 py-3 text-xs font-medium text-gray-900 focus:outline-none focus:ring-0 2xl:text-sm"
                                            placeholder=" "
                                            @blur="selectSurgicalInfo(values)"
                                        />

                                        <div class="absolute inset-y-0 right-0 flex items-center">
                                            <label
                                                for="duration_type"
                                                class="sr-only"
                                            >
                                                Duration
                                            </label>
                                            <div class="relative">
                                                <VField
                                                    :id="`surgicals[${index}].duration_type`"
                                                    value="days"
                                                    :name="`surgicals[${index}].duration_type`"
                                                    as="select"
                                                    class="h-full rounded border-0 bg-transparent py-0 pl-2 text-right text-xs text-gray-500 focus:ring-0 focus:ring-inset focus:ring-blue-600 2xl:text-sm"
                                                    @change="selectSurgicalInfo(values)"
                                                >
                                                    <option
                                                        v-for="(type, key) in durationTypes"
                                                        :key="key"
                                                        :value="key"
                                                        :selected="value && value.includes(key)"
                                                    >
                                                        {{ type }}
                                                    </option>
                                                </VField>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    v-if="index > 0"
                                    class="absolute -top-2 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs"
                                    @click="remove(index)"
                                >
                                    <XMarkIcon class="h-3 w-3 text-white"></XMarkIcon>
                                </button>
                            </div>
                        </div>

                        <div class="w-38 flex-shrink-0 text-right">
                            <button
                                class="font-poppins-regular inline-flex items-center rounded-lg bg-slate-100 px-7 py-3 font-medium text-slate-500 hover:bg-slate-200"
                                @click="push({ email: '', name: '' })"
                            >
                                <PlusCircleIcon class="mr-1 h-5 w-5 text-slate-500"></PlusCircleIcon>
                                Add More
                            </button>
                        </div>
                    </div>
                </FieldArray>
            </VForm>
        </section>

        <div class="py-6">
            <hr />
        </div>

        <div
            v-if="false"
            class="py-6"
        >
            <hr />
        </div>

        <section>
            <div class="flex items-center">
                <label
                    for="inline-checkbox"
                    class="font-poppins-regular ml-2 mr-3 text-sm font-semibold text-gray-900 dark:text-gray-300"
                >
                    Immunization
                </label>

                <input
                    id="inline-checkbox"
                    type="checkbox"
                    :checked="checkedForImmunize"
                    class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                    @input="checkedForImmunize = $event.target.checked"
                    @click="immunizedUpdate(checkedForImmunize)"
                />
            </div>
        </section>

        <div class="py-6">
            <hr />
        </div>

        <section class="-mt-1">
            <p class="font-poppins-bold pb-2 text-base text-slate-800">Period History</p>

            <div class="grid grid-cols-2">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input
                            id="regular"
                            type="checkbox"
                            :checked="period_type === 'regular'"
                            class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
                            @click="
                                {
                                    (period_type = 'regular'), createPeriod();
                                }
                            "
                        />
                        <label
                            for="regular"
                            class="font-poppins-regular ml-2 mr-3 text-sm font-semibold text-gray-900 dark:text-gray-300"
                        >
                            Regular
                        </label>
                    </div>

                    <div class="flex items-center">
                        <input
                            id="irregular"
                            type="checkbox"
                            :checked="period_type === 'irregular'"
                            class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
                            @click="
                                {
                                    (period_type = 'irregular'), createPeriod();
                                }
                            "
                        />
                        <label
                            for="irregular"
                            class="font-poppins-regular ml-2 mr-3 text-sm font-semibold text-gray-900"
                        >
                            Irregular
                        </label>
                    </div>

                    <div class="flex items-center">
                        <input
                            id="menopause"
                            type="checkbox"
                            :checked="period_type === 'menopause'"
                            class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            @click="
                                {
                                    (period_type = 'menopause'), createPeriod();
                                }
                            "
                        />
                        <label
                            for="menopause"
                            class="font-poppins-regular ml-2 mr-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                            Menopause
                        </label>
                    </div>
                </div>

                <div class="mr-3 w-full">
                    <div class="relative">
                        <input
                            id="note"
                            ref="input"
                            v-model="note"
                            type="text"
                            class="input-style peer"
                            placeholder=" "
                            @blur="createPeriod"
                        />
                        <label
                            for="note"
                            class="font-poppins-regular absolute left-2 top-2 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-slate-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2"
                        >
                            Note
                        </label>
                    </div>
                    <VErrorMessage
                        name="contact_no"
                        class="font-poppins-regular text-xs italic text-red-500"
                    ></VErrorMessage>
                </div>
            </div>
        </section>
    </div>
</template>
