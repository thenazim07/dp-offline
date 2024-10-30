<template>
    <div>
        <div class="z-50 h-[236px] min-w-[790px] rounded-lg border border-[#136AFB] bg-white shadow-lg">
            <UTabs
                :items="items"
                orientation="vertical"
                :ui="{
                    wrapper: 'flex items-start p-6 h-full',
                    container: 'relative w-full h-full border-l-[1px] border-l-[#cbd5e1] pl-6',
                    list: {
                        width: 'w-[106px]',
                        tab: {
                            base: 'z-50 relative text-[#1e293b] w-full  leading-[22px] inline-flex items-center justify-start flex-shrink-0  ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500 dark:ui-focus-visible:ring-primary-400 ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out',
                            height: 'h-[43px]',
                            size: 'text-[15px] ',
                            background: 'bg-white',
                            font: 'font-bold',
                            active: ' bg-[#136afd]/15 text-[#136afd] border-b-[0px]',
                            inactive: 'bg-[white]',
                        },
                    },
                }"
            >
                <template #item="{ item }">
                    <div
                        v-if="item.label === 'Section'"
                        class="flex flex-col gap-6"
                    >
                        <div class="flex items-center gap-6">
                            <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Section Name</div>
                            <div class="flex-grow">
                                <input
                                    v-model="formData.label.text"
                                    class="border border-[#E2E8F0] px-4 py-[13.5]"
                                    placeholder="Section Name"
                                />
                            </div>
                        </div>
                        <div class="flex items-center gap-6">
                            <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Hight</div>
                            <div class="flex items-center gap-2">
                                <!-- {{ formData.styles.height.value }} -->
                                <input
                                    id="heightStyle"
                                    type="checkbox"
                                    value="auto"
                                    :checked="formData.styles.height.value == 'auto'"
                                    @click="
                                        () => {
                                            formData.styles.height.value =
                                                formData.styles.height.value == 'auto' ? '' : 'auto';
                                            formData.styles.height.unit =
                                                formData.styles.height.value == 'auto'
                                                    ? ''
                                                    : bodySectionFormData.body.extras.unit || 'in';
                                        }
                                    "
                                />
                                <label
                                    for="heightStyle"
                                    class="cursor-pointer"
                                >
                                    Auto
                                </label>
                                <div
                                    :class="
                                        tailwindMerge(
                                            'flex cursor-pointer items-center border border-[#E2E8F0] px-2 py-[1px]',
                                            {
                                                ' opacity-50 ': formData.styles.height.value == 'auto',
                                            },
                                        )
                                    "
                                >
                                    <div class="flex w-[50px] items-center gap-[2px]">
                                        <input
                                            type="number"
                                            class="w-[30px] border !border-transparent py-0 pl-[2px] pr-0"
                                            :disabled="formData.styles.height.value == 'auto'"
                                            v-model="formData.styles.height.value"
                                            @change="
                                                (e: any) => {
                                                    formData.styles.height.value =
                                                        e.target.value <= 0 ? '' : e.target.value.toString();
                                                }
                                            "
                                        />
                                        <!-- @change="
                                                (e) => {
                                                    currentPatientSectionRow[rowIndex].columns[
                                                        currentPatientSectionColumnIndexForEdit
                                                    ].styles.width.value =
                                                        e.target.value <= 0 ? '0' : e.target.value.toString();
                                                }
                                            " -->
                                        {{
                                            ' ' + formData.styles.height.value == 'auto'
                                                ? ''
                                                : formData.styles.height.unit
                                        }}
                                    </div>
                                    <div class="flex flex-col">
                                        <button
                                            :disabled="formData.styles.height.value == 'auto'"
                                            @click.stop="
                                                formData.styles.height.value = (
                                                    Number(formData.styles.height.value || 0) + 1
                                                ).toString()
                                            "
                                        >
                                            <img src="~/assets/images/preview/patientSection/UpArrow.svg" />
                                            <!-- @click.stop="increaseSectionWidth(currentPatientSectionColumnIndexForEdit)" -->
                                        </button>

                                        <button
                                            :disabled="formData.styles.height.value == 'auto'"
                                            @click.stop="
                                                formData.styles.height.value = (
                                                    Number(formData.styles.height.value || 0) - 1
                                                ).toString()
                                            "
                                        >
                                            <img src="~/assets/images/preview/patientSection/DownArrow.svg" />
                                            <!-- @click.stop="decreaseSectionWidth(currentPatientSectionColumnIndexForEdit)" -->
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-6">
                            <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Padding</div>
                            <div class="flex flex-grow">
                                <div
                                    class="flex h-[43px] w-[93px] items-center justify-center gap-[2px] rounded-l-md border border-[#E2E8F0]"
                                >
                                    <div class="flex h-[22px] w-[24px] items-center border border-[#CBD5E1]">
                                        <div class="ml-1 h-[18px] w-[2px] border border-[#000000] bg-[#000000]"></div>
                                    </div>
                                    <input
                                        type="number"
                                        class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                                        v-model="formData.styles['padding-left'].value"
                                        @change="
                                            (e: any) => {
                                                formData.styles['padding-left'].value =
                                                    e.target.value <= 0 ? '' : e.target.value.toString();
                                            }
                                        "
                                    />
                                    <!-- @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].styles['padding-left'].value =
                                                    e.target.value <= 0 ? '0' : e.target.value.toString();
                                            }
                                        " -->
                                </div>
                                <div
                                    class="flex h-[43px] w-[93px] items-center justify-center gap-[2px] border border-[#E2E8F0]"
                                >
                                    <div
                                        class="flex h-[22px] w-[24px] items-center justify-end border border-[#CBD5E1]"
                                    >
                                        <div class="mr-1 h-[18px] w-[2px] border border-[#000000] bg-[#000000]"></div>
                                    </div>
                                    <input
                                        type="number"
                                        class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                                        v-model="formData.styles['padding-right'].value"
                                        @change="
                                            (e: any) => {
                                                formData.styles['padding-right'].value =
                                                    e.target.value <= 0 ? '' : e.target.value.toString();
                                            }
                                        "
                                    />
                                    <!-- @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].styles['padding-right'].value =
                                                    e.target.value <= 0 ? '0' : e.target.value.toString();
                                            }
                                        " -->
                                </div>
                                <div
                                    class="flex h-[43px] w-[93px] items-center justify-center gap-[2px] border border-[#E2E8F0]"
                                >
                                    <div class="flex h-[22px] w-[24px] justify-center border border-[#CBD5E1]">
                                        <div class="mt-1 h-[2px] w-[18px] border border-[#000000] bg-[#000000]"></div>
                                    </div>
                                    <input
                                        type="number"
                                        class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                                        v-model="formData.styles['padding-top'].value"
                                        @change="
                                            (e: any) => {
                                                formData.styles['padding-top'].value =
                                                    e.target.value <= 0 ? '' : e.target.value.toString();
                                            }
                                        "
                                    />
                                    <!-- @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].styles['padding-top'].value =
                                                    e.target.value <= 0 ? '0' : e.target.value.toString();
                                            }
                                        " -->
                                </div>
                                <div
                                    class="flex h-[43px] w-[93px] items-center justify-center gap-[2px] rounded-r-md border border-[#E2E8F0]"
                                >
                                    <div
                                        class="flex h-[22px] w-[24px] items-end justify-center border border-[#CBD5E1]"
                                    >
                                        <div class="mb-1 h-[2px] w-[18px] border border-[#000000] bg-[#000000]"></div>
                                    </div>
                                    <input
                                        type="number"
                                        class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                                        v-model="formData.styles['padding-bottom'].value"
                                        @change="
                                            (e: any) => {
                                                formData.styles['padding-bottom'].value =
                                                    e.target.value <= 0 ? '' : e.target.value.toString();
                                            }
                                        "
                                    />
                                    <!-- @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].styles['padding-bottom'].value =
                                                    e.target.value <= 0 ? '0' : e.target.value.toString();
                                            }
                                        " -->
                                </div>

                                <div
                                    class="ml-1 flex h-[43px] w-[79px] items-center justify-start rounded border border-[#E2E8F0]"
                                >
                                    <p class="ml-3 text-sm">{{ bodySectionFormData.body.extras.unit }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="item.label === 'List'"
                        class="flex flex-col gap-6"
                    >
                        <div class="flex items-center gap-6">
                            <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Padding</div>
                            <div class="flex flex-grow">
                                <div
                                    class="flex h-[43px] w-[93px] items-center justify-center gap-[2px] rounded-l-md border border-[#E2E8F0]"
                                >
                                    <div class="flex h-[22px] w-[24px] items-center border border-[#CBD5E1]">
                                        <div class="ml-1 h-[18px] w-[2px] border border-[#000000] bg-[#000000]"></div>
                                    </div>
                                    <input
                                        type="number"
                                        class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                                        v-model="formData.list.styles['padding-left'].value"
                                        @change="
                                            (e: any) => {
                                                formData.list.styles['padding-left'].value =
                                                    e.target.value <= 0 ? '' : e.target.value.toString();
                                            }
                                        "
                                    />
                                    <!-- @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].styles['padding-left'].value =
                                                    e.target.value <= 0 ? '0' : e.target.value.toString();
                                            }
                                        " -->
                                </div>
                                <div
                                    class="flex h-[43px] w-[93px] items-center justify-center gap-[2px] border border-[#E2E8F0]"
                                >
                                    <div
                                        class="flex h-[22px] w-[24px] items-center justify-end border border-[#CBD5E1]"
                                    >
                                        <div class="mr-1 h-[18px] w-[2px] border border-[#000000] bg-[#000000]"></div>
                                    </div>
                                    <input
                                        type="number"
                                        class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                                        v-model="formData.list.styles['padding-right'].value"
                                        @change="
                                            (e: any) => {
                                                formData.list.styles['padding-right'].value =
                                                    e.target.value <= 0 ? '' : e.target.value.toString();
                                            }
                                        "
                                    />
                                    <!-- @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].styles['padding-right'].value =
                                                    e.target.value <= 0 ? '0' : e.target.value.toString();
                                            }
                                        " -->
                                </div>
                                <div
                                    class="flex h-[43px] w-[93px] items-center justify-center gap-[2px] border border-[#E2E8F0]"
                                >
                                    <div class="flex h-[22px] w-[24px] justify-center border border-[#CBD5E1]">
                                        <div class="mt-1 h-[2px] w-[18px] border border-[#000000] bg-[#000000]"></div>
                                    </div>
                                    <input
                                        type="number"
                                        class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                                        v-model="formData.list.styles['padding-top'].value"
                                        @change="
                                            (e: any) => {
                                                formData.list.styles['padding-top'].value =
                                                    e.target.value <= 0 ? '' : e.target.value.toString();
                                            }
                                        "
                                    />
                                    <!-- @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].styles['padding-top'].value =
                                                    e.target.value <= 0 ? '0' : e.target.value.toString();
                                            }
                                        " -->
                                </div>
                                <div
                                    class="flex h-[43px] w-[93px] items-center justify-center gap-[2px] rounded-r-md border border-[#E2E8F0]"
                                >
                                    <div
                                        class="flex h-[22px] w-[24px] items-end justify-center border border-[#CBD5E1]"
                                    >
                                        <div class="mb-1 h-[2px] w-[18px] border border-[#000000] bg-[#000000]"></div>
                                    </div>
                                    <input
                                        type="number"
                                        class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                                        v-model="formData.list.styles['padding-bottom'].value"
                                        @change="
                                            (e: any) => {
                                                formData.list.styles['padding-bottom'].value =
                                                    e.target.value <= 0 ? '' : e.target.value.toString();
                                            }
                                        "
                                    />
                                </div>

                                <div
                                    class="ml-1 flex h-[43px] w-[79px] items-center justify-start rounded border border-[#E2E8F0]"
                                >
                                    <p class="ml-3 text-sm">{{ bodySectionFormData.body.extras.unit }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </UTabs>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { IBodySectionItemDetail } from '~/repository/modules/PageLayoutModule/types';

const props = defineProps<{
    modelValue: IBodySectionItemDetail | undefined;
}>();

const { bodySectionFormData } = storeToRefs(useLayoutsStore());

const emit = defineEmits(['update:modelValue', 'submit']);

const formData = reactive({ ...props.modelValue });

watch(
    formData,
    (newValue) => {
        emit('update:modelValue', newValue);
    },
    { deep: true, immediate: true },
);

const items = [
    {
        label: 'Section',
        // content: 'This is the content shown for Tab1',
    },
    {
        label: 'List',

        // content: 'And, this is the content for Tab2',
    },
];
</script>
