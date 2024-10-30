<template>
    <div>
        <ClientOnly>
            <Teleport to="#navbar">
                <div class="mr-0 flex w-full max-w-[100rem] items-center justify-between sm:pr-8">
                    <!--Breadcrumbs-->
                    <nav
                        class="flex"
                        aria-label="breadcrumb"
                    >
                        <ol
                            role="list"
                            class="flex items-center space-x-1"
                        >
                            <li>
                                <div class="flex items-center">
                                    <NuxtLink
                                        to="/dashboard/prescription/create"
                                        class="font-poppins-regular text-sm text-[#64748B] hover:text-gray-700 2xl:text-base"
                                    >
                                        New Prescription
                                    </NuxtLink>
                                </div>
                            </li>

                            <li>
                                <div class="flex items-center">
                                    <svg
                                        class="h-5 w-5 flex-shrink-0 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    <NuxtLink
                                        to="/dashboard/prescription/edit-prescription-layout"
                                        class="font-poppins-regular text-sm font-medium text-gray-500 hover:text-gray-700 2xl:text-base"
                                    >
                                        Edit prescription layout
                                    </NuxtLink>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <!--End--Breadcrumbs-->
                    <!-- right side -->
                    <div class="flex gap-4">
                        <!-- <PrescriptionEditPrescriptionLayoutNavigationPrescriptionLayoutButton /> -->
                        <!-- <button
                            class="font-poppins-semibold group mr-2 inline-flex w-[224px] max-w-xs items-center justify-center rounded-md border border-[#136AFB] bg-white px-4 py-2.5 text-center text-sm font-semibold text-skin-base shadow-sm hover:bg-skin-button-accent-hover hover:text-white focus:outline-none 2xl:mr-4 2xl:text-base"
                        >
                            <span class="mr-2 h-6 w-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <g
                                        class="stroke-[#136afb] group-hover:stroke-white"
                                        fill="none"
                                        stroke="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="1.5"
                                        data-name="Group 28293"
                                    >
                                        <path
                                            d="M13.228 21h-8.8A1.458 1.458 0 0 1 3 19.519V4.479a1.458 1.458 0 0 1 1.433-1.48h11.819a1.458 1.458 0 0 1 1.433 1.48v4.44"
                                            data-name="Path 26400"
                                        />
                                        <path
                                            d="M5.571 8.252h7.657"
                                            data-name="Line 796"
                                        />
                                        <path
                                            d="M5.6 11.498h4"
                                            data-name="Line 797"
                                        />
                                        <path
                                            d="M5.629 14.744H8"
                                            data-name="Line 798"
                                        />
                                        <g
                                            data-name="Ellipse 1497"
                                            transform="translate(10.543 10.371)"
                                        >
                                            <circle
                                                cx="4.5"
                                                cy="4.5"
                                                r="4.5"
                                                stroke="none"
                                            />
                                            <circle
                                                cx="4.5"
                                                cy="4.5"
                                                r="3.75"
                                            />
                                        </g>
                                        <path
                                            d="m21 21-3.229-3.229"
                                            data-name="Line 799"
                                        />
                                    </g>
                                </svg>
                            </span>
                            <span>
                                <LibIconLoadingCircle />
                            </span>
                            <span>{{ false ? 'Processing...' : ' Print Preview ' }} </span>
                        </button> -->
                    </div>
                </div>
            </Teleport>
        </ClientOnly>

        <!-- main section -->
        <div class="mb-[100px] bg-[#F8FAFC]">
            <div class="max-w-100rem flex gap-4">
                <!-- left side -->
                <div class="flex w-[75%] flex-col gap-[.88rem]">
                    <div class="flex h-[65px] items-center gap-[10px] rounded-lg bg-white px-[5px]">
                        <div class="flex items-center gap-3">
                            <div class="text-[12px] font-bold leading-[22px] text-[#1E293B]">Unit</div>
                            <div class="flex-grow">
                                <USelectMenu
                                    v-model="bodySectionFormData.body.extras.unit"
                                    :options="['in']"
                                    :ui="{ base: 'w-[60px] h-[45px]' }"
                                    :ui-menu="{ base: 'w-[80px]' }"
                                    @change="changeAllRelatedUnit"
                                />
                            </div>
                        </div>

                        <div class="flex items-center gap-1">
                            <div class="whitespace-nowrap text-[12px] font-bold leading-[22px] text-[#1E293B]">
                                Available width
                            </div>
                            <div>
                                <div :class="tailwindMerge('flex cursor-pointer items-center py-[1px]')">
                                    <div class="flex w-[50px] items-center gap-[2px]">
                                        <span class="w-[30px] whitespace-nowrap py-0 pl-[2px] pr-0">
                                            {{ widthWithoutMargin + ' ' + pageSetupFormData.unit }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex w-[190px] items-center gap-6">
                            <div class="w-1/3 whitespace-nowrap text-[12px] font-bold leading-[22px] text-[#1E293B]">
                                Left Section
                            </div>
                            <div class="w-2/3">
                                <div
                                    :class="
                                        tailwindMerge(
                                            'flex h-[45px] w-[97px] cursor-pointer items-center rounded border border-[#E2E8F0] px-2 py-[1px]',
                                        )
                                    "
                                >
                                    <div class="flex w-1/3 items-center gap-[2px]">
                                        <input
                                            v-model="leftSection"
                                            type="number"
                                            class="w-[30px] border !border-transparent py-0 pl-[2px] pr-0"
                                        />
                                        <!-- @change="
                                                (e) => {
                                                    currentPatientSection.rootStyles.width.value =
                                                        e.target.value <= 0 ? '0' : e.target.value.toString();
                                                }
                                            " -->
                                    </div>
                                    <div class="w-1/3 text-center">{{ bodySectionFormData.body.extras.unit }}</div>
                                    <div class="flex w-1/3 flex-col">
                                        <button>
                                            <img
                                                class="min-h-[20px] w-[24px]"
                                                src="~/assets/images/preview/patientSection/UpArrow.svg"
                                                @click.stop="increaseLeftSection"
                                            />
                                        </button>

                                        <button>
                                            <img
                                                class="min-h-[20px] w-[24px]"
                                                src="~/assets/images/preview/patientSection/DownArrow.svg"
                                                @click.stop="decreaseLeftSection"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex w-[200px] items-center gap-7">
                            <div class="w-1/3 whitespace-nowrap text-[12px] font-bold leading-[22px] text-[#1E293B]">
                                Right Section
                            </div>
                            <div class="w-1.5/3">
                                <div
                                    :class="
                                        tailwindMerge(
                                            'flex h-[45px] w-[97px] cursor-pointer items-center rounded border border-[#E2E8F0] px-2 py-[1px]',
                                        )
                                    "
                                >
                                    <div class="flex w-1/3 items-center gap-[2px]">
                                        <input
                                            v-model="rightSection"
                                            type="number"
                                            class="w-[30px] border !border-transparent py-0 pl-[2px] pr-0"
                                        />
                                        <!-- @change="
                                                (e) => {
                                                    currentPatientSection.rootStyles.width.value =
                                                        e.target.value <= 0 ? '0' : e.target.value.toString();
                                                }
                                            " -->
                                    </div>
                                    <div class="w-1/3 text-center">{{ bodySectionFormData.body.extras.unit }}</div>
                                    <div class="flex w-1/3 flex-col">
                                        <button>
                                            <img
                                                class="min-h-[20px] w-[24px]"
                                                src="~/assets/images/preview/patientSection/UpArrow.svg"
                                                @click.stop="increaseRightSection"
                                            />
                                        </button>

                                        <button>
                                            <img
                                                class="min-h-[20px] w-[24px]"
                                                src="~/assets/images/preview/patientSection/DownArrow.svg"
                                                @click.stop="decreaseRightSection"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex">
                            <input
                                id="bottoLine"
                                v-model="bodySectionFormData.bottom_line"
                                type="checkbox"
                                class="h-5 w-5 checked:bg-[#136AFB]"
                            />
                            <label
                                for="bottoLine"
                                class="ml-2 whitespace-nowrap text-xs"
                            >
                                Add Bottom Line
                            </label>
                        </div>
                    </div>

                    <!-- prescription section -->
                    <div
                        class="flex min-h-[71.4rem] w-full flex-col gap-[21px] rounded-lg bg-white px-[36px] pb-[25px] pt-[34px]"
                    >
                        <!-- skeleton -->
                        <div class="flex h-[1073] w-full flex-col gap-2">
                            <div class="flex w-full justify-between">
                                <USkeleton
                                    :ui="{ base: '', background: 'bg-slate-300', rounded: '' }"
                                    class="h-[23px] w-[183px]"
                                />
                                <USkeleton
                                    :ui="{ base: '', background: 'bg-slate-300', rounded: '' }"
                                    class="h-[21px] w-[158px]"
                                />
                            </div>

                            <USkeleton
                                :ui="{ base: '', background: 'bg-slate-200', rounded: '' }"
                                class="h-[18px] w-[108px]"
                            />
                            <USkeleton
                                :ui="{ base: '', background: 'bg-slate-200', rounded: '' }"
                                class="h-[18px] w-[161px]"
                            />

                            <USkeleton
                                :ui="{ base: '', background: 'bg-slate-200', rounded: '' }"
                                class="h-[18px] w-[277px]"
                            />
                            <USkeleton
                                :ui="{ base: '', background: 'bg-slate-200', rounded: '' }"
                                class="h-[18px] w-[149px]"
                            />
                            <div class="flex w-full justify-start gap-[20%] border border-x-0 border-y-slate-300 py-3">
                                <USkeleton
                                    :ui="{ base: '', background: 'bg-slate-200', rounded: '' }"
                                    class="h-[18px] w-[112px]"
                                />
                                <USkeleton
                                    :ui="{ base: '', background: 'bg-slate-200', rounded: '' }"
                                    class="h-[18px] w-[63px]"
                                />
                                <USkeleton
                                    :ui="{ base: '', background: 'bg-slate-200', rounded: '' }"
                                    class="h-[18px] w-[35px]"
                                />
                                <USkeleton
                                    :ui="{ base: '', background: 'bg-slate-200', rounded: '' }"
                                    class="h-[18px] w-[61px]"
                                />
                            </div>
                        </div>

                        <!-- prescription main section -->
                        <div
                            class="flex h-full border border-transparent"
                            :class="{
                                '  border-b-slate-300': bodySectionFormData.bottom_line,
                            }"
                        >
                            <!-- left column -->
                            <div
                                class="h-full w-1/3 overflow-hidden border border-transparent"
                                :class="{
                                    '  border-r-slate-300': bodySectionFormData.divider_line,
                                }"
                                :style="`width: ${bodySectionFormData.left_section_width}%`"
                            >
                                <template v-for="(value, key) in bodySectionFormData.body.columns.column0.items">
                                    <PrescriptionEditPrescriptionLayoutSectionsIndictaion
                                        v-if="key === 'indication'"
                                        :key="key"
                                    />
                                    <PrescriptionEditPrescriptionLayoutSectionsHistory
                                        v-if="key === 'past_history'"
                                        :key="key"
                                    />
                                    <PrescriptionEditPrescriptionLayoutSectionsDiagnosis
                                        v-if="key === 'diagnosis'"
                                        :key="key"
                                    />
                                    <PrescriptionEditPrescriptionLayoutSectionsOnEaxamination
                                        v-if="key === 'on_examination'"
                                        :key="key"
                                    />
                                    <PrescriptionEditPrescriptionLayoutSectionsInvestigation
                                        v-if="key === 'investigation'"
                                        :key="key"
                                    />
                                    <PrescriptionEditPrescriptionLayoutSectionsMedicine
                                        v-if="key === 'drug'"
                                        :key="key"
                                    />
                                    <PrescriptionEditPrescriptionLayoutSectionsFollowUp
                                        v-if="key === 'follow_up'"
                                        :key="key"
                                    />
                                    <!-- <PrescriptionEditPrescriptionLayoutSectionsSpecialNote
                                        v-if="key === 'indication'"
                                        :key="key"
                                    /> -->
                                    <PrescriptionEditPrescriptionLayoutSectionsAdvise
                                        v-if="key === 'advise'"
                                        :key="key"
                                    />
                                    <PrescriptionEditPrescriptionLayoutSectionsSignature
                                        v-if="key === 'signature'"
                                        :key="key"
                                    />
                                </template>
                            </div>
                            <!-- right column -->
                            <div
                                class="w-2/3 overflow-hidden"
                                :style="`width: ${bodySectionFormData.right_section_width}%`"
                            >
                                <template v-for="(value, key) in bodySectionFormData.body.columns.column1.items">
                                    <PrescriptionEditPrescriptionLayoutSectionsIndictaion
                                        v-if="key === 'indication'"
                                        :key="key"
                                    />
                                    <PrescriptionEditPrescriptionLayoutSectionsHistory
                                        v-if="key === 'past_history'"
                                        :key="key"
                                    />
                                    <PrescriptionEditPrescriptionLayoutSectionsDiagnosis
                                        v-if="key === 'diagnosis'"
                                        :key="key"
                                    />
                                    <PrescriptionEditPrescriptionLayoutSectionsOnEaxamination
                                        v-if="key === 'on_examination'"
                                        :key="key"
                                    />
                                    <PrescriptionEditPrescriptionLayoutSectionsInvestigation
                                        v-if="key === 'investigation'"
                                        :key="key"
                                    />
                                    <PrescriptionEditPrescriptionLayoutSectionsMedicine
                                        v-if="key === 'drug'"
                                        :key="key"
                                    />
                                    <PrescriptionEditPrescriptionLayoutSectionsFollowUp
                                        v-if="key === 'follow_up'"
                                        :key="key"
                                    />
                                    <!-- <PrescriptionEditPrescriptionLayoutSectionsSpecialNote
                                        v-if="key === 'indication'"
                                        :key="key"
                                    /> -->
                                    <PrescriptionEditPrescriptionLayoutSectionsAdvise
                                        v-if="key === 'advise'"
                                        :key="key"
                                    />
                                    <PrescriptionEditPrescriptionLayoutSectionsSignature
                                        v-if="key === 'signature'"
                                        :key="key"
                                    />
                                </template>
                                <!-- <PrescriptionEditPrescriptionLayoutModalsLayoutEditModal /> -->
                            </div>
                        </div>
                    </div>
                </div>
                <!-- right side -->
                <div class="flex w-[25%] flex-col gap-[.88rem]">
                    <!-- reset and save buttons -->
                    <div class="flex gap-2">
                        <button
                            class="h-[65px] w-[40%] rounded-lg border border-red-500 px-4 py-6 text-sm text-red-500 hover:bg-red-500 hover:text-white"
                            @click.stop="isResetAllSection = true"
                        >
                            Reset
                        </button>
                        <button
                            class="h-[65px] w-[60%] rounded-lg bg-[#136AFB] px-4 py-6 text-sm text-white hover:text-slate-200"
                            @click="saveBodySection"
                        >
                            Save & continue
                        </button>
                    </div>

                    <!-- prescription layout selection section -->
                    <div class="flex min-h-[71.4rem] w-full flex-grow flex-col gap-6 rounded-lg bg-white p-4">
                        <div class="flex w-full justify-between">
                            <div class="text-[14px] font-bold leading-[22px] text-[#1E293B]">Sections</div>
                            <div>
                                <input
                                    id="sectionLine"
                                    v-model="bodySectionFormData.divider_line"
                                    type="checkbox"
                                    class="h-5 w-5 checked:bg-[#136AFB]"
                                />
                                <label
                                    for="sectionLine"
                                    class="ml-1 whitespace-nowrap text-xs"
                                >
                                    Add Section Separator
                                </label>
                            </div>
                        </div>

                        <div class="flex h-[31.3rem] flex-col gap-3 overflow-auto px-2">
                            <div
                                v-for="(item, index) in prescription_body_sections"
                                :key="index"
                                class="flex w-full justify-between"
                            >
                                <div>
                                    <input
                                        :id="index"
                                        v-model="selectedBodySections"
                                        type="checkbox"
                                        class="h-5 w-5 checked:bg-[#136AFB]"
                                        :value="item.value"
                                    />
                                    <label
                                        :for="index"
                                        class="ml-3 whitespace-nowrap text-sm"
                                    >
                                        {{ item.name }}
                                    </label>
                                </div>
                                <div class="flex gap-2">
                                    <button
                                        :disabled="!selectedBodySections.includes(item.value)"
                                        :class="{ 'opacity-50': !selectedBodySections.includes(item.value) }"
                                        @click="updateSection(item.value)"
                                    >
                                        <img
                                            src="~/assets/images/preview/editPrescriptionLayout/edit.svg"
                                            alt="edit"
                                        />
                                    </button>

                                    <UPopover :popper="{ placement: 'bottom-start' }">
                                        <button
                                            class="pt-2"
                                            :disabled="!selectedBodySections.includes(item.value)"
                                            :class="{ 'opacity-50': !selectedBodySections.includes(item.value) }"
                                        >
                                            <img
                                                src="~/assets/images/preview/editPrescriptionLayout/reset.svg"
                                                alt="reset"
                                            />
                                        </button>

                                        <template #panel="{ close }">
                                            <div class="flex flex-col gap-4 rounded-lg border border-[#136AFB] p-4">
                                                <div class="flex flex-col gap-1">
                                                    <div class="text-center font-semibold text-red-500">
                                                        Are you sure?
                                                    </div>
                                                    <div class="w-[266px] text-center text-sm text-[#EA5656]">
                                                        All the changes you made in “{{ item.name }}” will be lost. Are
                                                        you sure you want to reset all changes?
                                                    </div>
                                                </div>
                                                <div class="flex gap-2">
                                                    <button
                                                        class="w-1/2 rounded-lg border border-[#136AFB] bg-white px-3 py-4 text-base text-[#136AFB]"
                                                        @click.stop="close"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        class="w-1/2 rounded-lg bg-red-500 px-3 py-4 text-base text-white"
                                                        @click.stop="
                                                            async () => {
                                                                await resetSingleSectionConfig(
                                                                    item.value,
                                                                    item.default_styles,
                                                                    item.default_position,
                                                                );
                                                                close();
                                                            }
                                                        "
                                                    >
                                                        Confirm
                                                    </button>
                                                </div>
                                            </div>
                                        </template>
                                    </UPopover>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <PrescriptionEditPrescriptionLayoutModalsResetAllSectionModal
            v-if="isResetAllSection"
            @cancel="isResetAllSection = false"
            @confirm="
                () => {
                    resetAllSelectedSections();
                    isResetAllSection = false;
                }
            "
        />
    </div>
</template>
<script setup lang="ts">
import type { IBodyItems, IBodySectionItemDetail } from '~/repository/modules/PageLayoutModule/types';

const LayoutsStore = useLayoutsStore();
const ConfigStore = useConfigsStore();

const { bodySectionFormData, selectedBodySections, pageSetupFormData, bodysectionModalsEdit } =
    storeToRefs(LayoutsStore);
const { prescription_body_sections } = storeToRefs(ConfigStore);

const isResetAllSection = ref(false);

const widthWithoutMargin = computed(() =>
    (
        (pageSetupFormData.value?.width || 0) -
        Number(pageSetupFormData.value?.margins?.left || 0) -
        Number(pageSetupFormData.value?.margins?.right || 0)
    ).toFixed(2),
);

const leftSection = computed({
    get() {
        if (bodySectionFormData.value.body.extras.unit === 'in')
            return Number(
                (
                    (Number(widthWithoutMargin.value) * Number(bodySectionFormData.value.left_section_width)) /
                    100
                ).toFixed(2),
            );

        if (bodySectionFormData.value.body.extras.unit === '%') return bodySectionFormData.value.left_section_width;
    },
    set(newValue) {
        if (newValue <= Number(widthWithoutMargin.value))
            if (bodySectionFormData.value.body.extras.unit === 'in') {
                bodySectionFormData.value.left_section_width = Number(
                    ((newValue * 100) / Number(widthWithoutMargin.value)).toFixed(2),
                );
                rightSection.value = Number((Number(widthWithoutMargin.value) - leftSection.value).toFixed(2));
            }

        if (newValue <= 100)
            if (bodySectionFormData.value.body.extras.unit === '%') {
                bodySectionFormData.value.left_section_width = newValue;
                rightSection.value = 100 - leftSection.value;
            }
    },
});

const rightSection = computed({
    get() {
        if (bodySectionFormData.value.body.extras.unit === 'in')
            return Number(
                (
                    (Number(widthWithoutMargin.value) * Number(bodySectionFormData.value.right_section_width)) /
                    100
                ).toFixed(2),
            );

        if (bodySectionFormData.value.body.extras.unit === '%') return bodySectionFormData.value.right_section_width;
    },
    set(newValue) {
        if (newValue <= Number(widthWithoutMargin.value))
            if (bodySectionFormData.value.body.extras.unit === 'in') {
                bodySectionFormData.value.right_section_width = Number(
                    ((newValue * 100) / Number(widthWithoutMargin.value)).toFixed(2),
                );
                leftSection.value = Number((Number(widthWithoutMargin.value) - rightSection.value).toFixed(2));
            }

        if (newValue <= 100)
            if (bodySectionFormData.value.body.extras.unit === '%') {
                bodySectionFormData.value.right_section_width = newValue;
                leftSection.value = 100 - rightSection.value;
            }
    },
});

function increaseLeftSection() {
    if (bodySectionFormData.value.body.extras.unit === 'in')
        if (leftSection.value + 0.1 <= Number(widthWithoutMargin.value)) {
            leftSection.value = Number((leftSection.value + 0.1).toFixed(2));
            rightSection.value = Number((Number(widthWithoutMargin.value) - leftSection.value).toFixed(2));
        }

    if (bodySectionFormData.value.body.extras.unit === '%')
        if (leftSection.value + 0.1 <= 100) {
            leftSection.value = Number((leftSection.value + 0.1).toFixed(2));
            rightSection.value = Number((100 - leftSection.value).toFixed(2));
        }
}

function decreaseLeftSection() {
    if (bodySectionFormData.value.body.extras.unit === 'in')
        if (leftSection.value - 0.1 >= 0) {
            leftSection.value = Number((leftSection.value - 0.1).toFixed(2));
            rightSection.value = Number((Number(widthWithoutMargin.value) - leftSection.value).toFixed(2));
        }

    if (bodySectionFormData.value.body.extras.unit === '%')
        if (leftSection.value - 0.1 >= 0) {
            leftSection.value = Number((leftSection.value - 0.1).toFixed(2));
            rightSection.value = Number((100 - leftSection.value).toFixed(2));
        }
}

function increaseRightSection() {
    if (bodySectionFormData.value.body.extras.unit === 'in')
        if (rightSection.value + 0.1 <= Number(widthWithoutMargin.value)) {
            rightSection.value = Number((rightSection.value + 0.1).toFixed(2));
            leftSection.value = Number((Number(widthWithoutMargin.value) - rightSection.value).toFixed(2));
        }

    if (bodySectionFormData.value.body.extras.unit === '%')
        if (rightSection.value + 0.1 <= 100) {
            rightSection.value = Number((rightSection.value + 0.1).toFixed(2));
            leftSection.value = Number((100 - rightSection.value).toFixed(2));
        }
}

function decreaseRightSection() {
    if (bodySectionFormData.value.body.extras.unit === 'in')
        if (rightSection.value - 0.1 >= 0) {
            rightSection.value = Number((rightSection.value - 0.1).toFixed(2));
            leftSection.value = Number((Number(widthWithoutMargin.value) - rightSection.value).toFixed(2));
        }

    if (bodySectionFormData.value.body.extras.unit === '%')
        if (rightSection.value - 0.1 >= 0) {
            rightSection.value = Number((rightSection.value - 0.1).toFixed(2));
            leftSection.value = Number((100 - rightSection.value).toFixed(2));
        }
}

const currentRowIndex = (sectionPropertyKey: string) => {
    if (Object.keys(bodySectionFormData.value.body.columns.column0.items).includes(sectionPropertyKey)) {
        return Object.keys(bodySectionFormData.value.body.columns.column0.items).indexOf(sectionPropertyKey);
    }

    return Object.keys(bodySectionFormData.value.body.columns.column1.items).indexOf(sectionPropertyKey);
};

const currentColumnIndex = (sectionPropertyKey: string) => {
    const columnIndex: number = Object.keys(bodySectionFormData.value.body.columns.column0.items).includes(
        sectionPropertyKey,
    )
        ? 0
        : 1;
    return columnIndex;
};

function resetAllSelectedSections() {
    // selectedBodySections.value.

    prescription_body_sections.value.forEach((section) => {
        if (selectedBodySections.value.includes(section.value)) {
            resetSingleSectionConfig(section.value, section.default_styles, section.default_position);
        }
    });
}

function resetSingleSectionConfig(
    sectionPropertyKey: string,
    default_styles: IBodySectionItemDetail,
    default_position: {
        column: number;
        row: number;
    },
) {
    if (Object.keys(bodySectionFormData.value.body.columns.column0.items).includes(sectionPropertyKey)) {
        bodySectionFormData.value.body.columns.column0.items[sectionPropertyKey] = JSON.parse(
            JSON.stringify(default_styles),
        );

        if (currentColumnIndex(sectionPropertyKey) === default_position.column) {
            bodySectionFormData.value.body.columns.column0.items = moveKey<IBodyItems>(
                bodySectionFormData.value.body.columns.column0.items,
                currentRowIndex(sectionPropertyKey),
                default_position.row,
            );
        } else {
            const removedSection = { ...bodySectionFormData.value.body.columns.column0.items[sectionPropertyKey] };

            delete bodySectionFormData.value.body.columns.column0.items[sectionPropertyKey];

            bodySectionFormData.value.body.columns.column1.items[sectionPropertyKey] = { ...removedSection };

            bodySectionFormData.value.body.columns.column1.items = moveKey<IBodyItems>(
                bodySectionFormData.value.body.columns.column1.items,
                currentRowIndex(sectionPropertyKey),
                default_position.row,
            );
        }
    }

    if (Object.keys(bodySectionFormData.value.body.columns.column1.items).includes(sectionPropertyKey)) {
        bodySectionFormData.value.body.columns.column1.items[sectionPropertyKey] = JSON.parse(
            JSON.stringify(default_styles),
        );

        if (currentColumnIndex(sectionPropertyKey) === default_position.column) {
            bodySectionFormData.value.body.columns.column1.items = moveKey<IBodyItems>(
                bodySectionFormData.value.body.columns.column1.items,
                currentRowIndex(sectionPropertyKey),
                default_position.row,
            );
        } else {
            const removedSection = { ...bodySectionFormData.value.body.columns.column1.items[sectionPropertyKey] };

            delete bodySectionFormData.value.body.columns.column1.items[sectionPropertyKey];

            bodySectionFormData.value.body.columns.column0.items[sectionPropertyKey] = { ...removedSection };

            bodySectionFormData.value.body.columns.column0.items = moveKey<IBodyItems>(
                bodySectionFormData.value.body.columns.column0.items,
                currentRowIndex(sectionPropertyKey),
                default_position.row,
            );
        }
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

function updateSection(sectionKey: string) {
    scrollToTheSection(sectionKey);

    setTimeout(() => {
        bodysectionModalsEdit.value[sectionKey] = true;
    }, 500);
}

function scrollToTheSection(sectionKey: string) {
    // Get the element's position relative to the viewport
    const elementPosition = document.getElementById(sectionKey)?.getBoundingClientRect();

    // Get the viewport height (client height of the window)
    const viewHeight = window.innerHeight;

    // Calculate the scroll position (140px above the middle of the viewport)
    const targetScrollPosition = window.scrollY + elementPosition?.top - viewHeight / 2 + 140;

    // Scroll the window to the calculated position
    window.scrollTo({
        top: targetScrollPosition,
        behavior: 'smooth', // Optional: Smooth scrolling effect
    });
}

const toast = useToast();

async function saveBodySection() {
    if (
        'body' in bodySectionFormData.value &&
        'left_section_width' in bodySectionFormData.value &&
        'right_section_width' in bodySectionFormData.value &&
        'divider_line' in bodySectionFormData.value &&
        'bottom_line' in bodySectionFormData.value
    ) {
        const response = await LayoutsStore.createBodySection();

        if (response) {
            toast.add({ title: 'Body section saved successfully', color: 'green' });

            return;
        }

        toast.add({ title: 'Something went wrong', color: 'red' });
    } else {
        toast.add({ title: 'Something went wrong, Please try again!!', color: 'red' });
    }
}

function changeAllRelatedUnit(unit: string) {
    // console.log(unit);

    // left section
    for (const property in bodySectionFormData.value.body.columns.column0.items) {
        for (const propertyToChange in bodySectionFormData.value.body.columns.column0.items[property].list.styles) {
            bodySectionFormData.value.body.columns.column0.items[property].list.styles[propertyToChange].unit = unit;
        }

        for (const propertyToChange in bodySectionFormData.value.body.columns.column0.items[property].styles) {
            if (propertyToChange === 'height') {
                if (
                    bodySectionFormData.value.body.columns.column0.items[property].styles[propertyToChange].value ===
                    'auto'
                ) {
                    bodySectionFormData.value.body.columns.column0.items[property].styles[propertyToChange].unit = '';
                    continue;
                }
            }
            bodySectionFormData.value.body.columns.column0.items[property].styles[propertyToChange].unit = unit;
        }
    }

    // right section
    for (const property in bodySectionFormData.value.body.columns.column1.items) {
        for (const propertyToChange in bodySectionFormData.value.body.columns.column1.items[property].list.styles) {
            bodySectionFormData.value.body.columns.column1.items[property].list.styles[propertyToChange].unit = unit;
        }

        for (const propertyToChange in bodySectionFormData.value.body.columns.column1.items[property].styles) {
            if (propertyToChange === 'height') {
                if (
                    bodySectionFormData.value.body.columns.column1.items[property].styles[propertyToChange].value ===
                    'auto'
                ) {
                    bodySectionFormData.value.body.columns.column1.items[property].styles[propertyToChange].unit = '';
                    continue;
                }
            }
            bodySectionFormData.value.body.columns.column1.items[property].styles[propertyToChange].unit = unit;
        }
    }
}

onMounted(async () => {
    useLoading(true);
    await LayoutsStore.fetchBodySection();
    await LayoutsStore.fetchPageSetup();
    useLoading(false);
});
</script>
