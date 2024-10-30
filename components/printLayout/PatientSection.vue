<template>
    <div class="flex flex-col items-center justify-center p-11">
        <!-- visual patient section -->
        <div
            class="relative mb-9 flex h-[275px] w-full max-w-[1024px] flex-col justify-end bg-[#F1F5F9] px-[32px] py-[26px]"
        >
            <div class="absolute left-0 right-0 top-[26px] m-auto flex w-full items-center px-[32px]">
                <div class="h-[1px] w-full bg-black"></div>
                <div class="flex w-1/3 justify-center whitespace-nowrap text-sm">
                    <p>Total Page Width: {{ pageSetupFormData.width }} {{ ' ' }}{{ pageSetupFormData.unit }}</p>
                </div>
                <div class="h-[1px] w-full bg-black"></div>
            </div>
            <div class="absolute left-0 right-0 top-[50px] m-auto flex w-[90%] items-center px-[32px]">
                <div class="h-[1px] w-full bg-black"></div>
                <div class="flex w-1/3 justify-center whitespace-nowrap text-sm">
                    <p>
                        Maximum Width:
                        {{ widthWithoutMargin }}
                        {{ ' ' }}{{ pageSetupFormData.margins.unit }}
                    </p>
                </div>
                <div class="h-[1px] w-full bg-black"></div>
            </div>
            <div
                ref="whitePapperRef"
                class="flex h-[164px] w-full bg-white pt-[23px]"
            >
                <!-- left margin -->
                <div
                    class="relative h-full border-t-[1px] border-t-[#64748B] bg-transparent"
                    :style="{
                        width:
                            pageSetupFormData?.margins?.unit === 'in'
                                ? WidthPixelPerInch * pageSetupFormData?.margins?.left + 'px'
                                : pageSetupFormData?.margins?.left + ' ' + pageSetupFormData?.margins?.unit,
                    }"
                >
                    <div class="absolute -top-10 text-sm">
                        <span class="">Margin </span>
                        <span class="whitespace-nowrap text-sm">{{
                            pageSetupFormData?.margins?.left + ' ' + pageSetupFormData.margins.unit
                        }}</span>
                    </div>
                </div>
                <div class="w-full overflow-hidden pt-[9px]">
                    <!-- rootstyle section -->
                    <div
                        class="w-full overflow-hidden border-[#CBD5E1]"
                        :style="generateStyle(currentPatientSection.rootStyles)"
                    >
                        <!-- row section  style -->
                        <div
                            v-for="(row, rowIndex) in currentPatientSectionRow"
                            :key="rowIndex"
                            class="flex w-full overflow-hidden"
                            :style="generateStyle(row.styles)"
                        >
                            <!-- section style -->
                            <div
                                v-for="(column, columnIndex) in currentPatientSectionRow[rowIndex].columns"
                                class="flex w-fit text-xs leading-[18px] text-[#1E293B]"
                                :key="columnIndex"
                                :style="generateStyle(column.styles)"
                            >
                                <!-- label style -->
                                <div
                                    class="whitespace-nowrap font-[600]"
                                    :style="generateStyle(column.label.styles)"
                                >
                                    <span v-show="column.label.printable">{{ column.label.text }}:</span>
                                </div>
                                <!-- value style -->
                                <div
                                    class="cursor-pointer overflow-hidden whitespace-nowrap font-[500]"
                                    :style="generateStyle(column.value.styles)"
                                >
                                    <span v-if="column.item == 'name' && !selectedPatientForPatientSection.id">
                                        <PrintLayoutPatientSectionPatientSearch />
                                    </span>
                                    <span v-else>{{ selectedPatientForPatientSection[column.item] }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- right margin -->
                <div
                    class="relative h-full border-t-[1px] border-t-[#64748B] bg-transparent"
                    :style="{
                        width:
                            pageSetupFormData?.margins?.unit === 'in'
                                ? WidthPixelPerInch * pageSetupFormData?.margins?.right + 'px'
                                : pageSetupFormData?.margins?.right + ' ' + pageSetupFormData?.margins?.unit,
                    }"
                >
                    <div class="absolute -top-10 text-sm">
                        <span class="">Margin </span>
                        <span class="whitespace-nowrap text-sm">{{
                            pageSetupFormData.margins.right + ' ' + pageSetupFormData.margins.unit
                        }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-[14px] flex w-[90%] max-w-[1024px] justify-between">
            <div class="flex items-center gap-2">
                <span class="text-sm font-bold">Patient Basic info</span>
                <svg
                    width="20"
                    height="19"
                    viewBox="0 0 20 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    ref="referencePatientSectionSettings"
                    @click="() => (isPatientSectionEdit = true)"
                    :class="{ ' bg-slate-300': isPatientSectionEdit }"
                    class="cursor-pointer"
                >
                    <path
                        d="M18.303 6.73828C17.9362 6.68496 17.5862 6.54959 17.279 6.34225C16.9717 6.13491 16.7152 5.86093 16.5286 5.54072C16.3419 5.22052 16.2299 4.86233 16.2008 4.49282C16.1717 4.12331 16.2264 3.75201 16.3607 3.40656C16.4465 3.18103 16.4595 2.93431 16.3981 2.70098C16.3366 2.46766 16.2036 2.25941 16.0179 2.10542C15.1956 1.41501 14.2597 0.872668 13.2519 0.502562C13.0224 0.417264 12.7718 0.406556 12.5359 0.471965C12.3 0.537373 12.0907 0.675562 11.9379 0.866848C11.708 1.1608 11.4142 1.39854 11.0788 1.56205C10.7434 1.72556 10.3752 1.81054 10.002 1.81054C9.62887 1.81054 9.26062 1.72556 8.92521 1.56205C8.58979 1.39854 8.29602 1.1608 8.06616 0.866848C7.91335 0.675562 7.70407 0.537373 7.46814 0.471965C7.23221 0.406556 6.98165 0.417264 6.75216 0.502562C5.82035 0.844011 4.94907 1.33217 4.1713 1.94856C3.97558 2.10358 3.83463 2.31719 3.76908 2.55811C3.70352 2.79903 3.71682 3.0546 3.80702 3.28742C3.95194 3.64188 4.0118 4.02535 3.98181 4.40711C3.95182 4.78888 3.83281 5.1583 3.63432 5.48578C3.43584 5.81326 3.16339 6.08969 2.83882 6.2929C2.51425 6.49612 2.14659 6.62047 1.76531 6.65599C1.51763 6.68253 1.28502 6.78788 1.1017 6.95654C0.91839 7.12519 0.794062 7.34824 0.74702 7.59285C0.630091 8.17212 0.571229 8.76161 0.571305 9.35256C0.570361 9.84729 0.610211 10.3412 0.690448 10.8294C0.730616 11.0825 0.853214 11.3152 1.03921 11.4914C1.2252 11.6676 1.46417 11.7775 1.71902 11.804C2.10889 11.8406 2.48434 11.97 2.81391 12.1815C3.14349 12.3929 3.41762 12.6803 3.61335 13.0194C3.80907 13.3586 3.9207 13.7397 3.93889 14.1309C3.95707 14.522 3.88129 14.9118 3.71788 15.2677C3.61074 15.4993 3.58409 15.7601 3.64218 16.0086C3.70026 16.2571 3.83974 16.479 4.03845 16.6391C4.85636 17.3173 5.78395 17.8509 6.7813 18.2171C6.90873 18.2614 7.04244 18.2848 7.1773 18.2866C7.36222 18.2862 7.54434 18.2415 7.7084 18.1562C7.87245 18.0708 8.01366 17.9474 8.12016 17.7963C8.34422 17.4698 8.64458 17.203 8.99516 17.019C9.34573 16.835 9.73594 16.7393 10.1319 16.7403C10.5151 16.7412 10.8928 16.8314 11.2351 17.0039C11.5773 17.1763 11.8746 17.4262 12.1033 17.7337C12.2556 17.9384 12.4714 18.087 12.717 18.1563C12.9625 18.2256 13.2241 18.2117 13.461 18.1168C14.3722 17.75 15.2204 17.243 15.975 16.6143C16.1651 16.458 16.3007 16.2454 16.3623 16.0071C16.4239 15.7688 16.4084 15.5171 16.3179 15.2883C16.1699 14.938 16.1055 14.5581 16.1297 14.1786C16.1539 13.7991 16.2661 13.4304 16.4573 13.1017C16.6485 12.7731 16.9136 12.4934 17.2316 12.2848C17.5495 12.0762 17.9117 11.9445 18.2893 11.9C18.5339 11.866 18.7614 11.7551 18.9387 11.5833C19.1161 11.4115 19.2342 11.1877 19.2759 10.9443C19.3733 10.4192 19.4243 9.88658 19.4284 9.35256C19.4285 8.78887 19.3757 8.22641 19.2707 7.67256C19.2279 7.43498 19.1114 7.21691 18.9377 7.04923C18.764 6.88155 18.542 6.77276 18.303 6.73828ZM13.1422 9.35342C13.1422 9.97511 12.9578 10.5828 12.6124 11.0997C12.267 11.6167 11.776 12.0195 11.2016 12.2574C10.6273 12.4953 9.99524 12.5575 9.38551 12.4361C8.77577 12.3148 8.21572 12.0153 7.77618 11.5757C7.33664 11.136 7.03735 10.5759 6.91617 9.96609C6.79498 9.35633 6.85735 8.72432 7.09538 8.15C7.33341 7.57568 7.73641 7.08485 8.25341 6.73958C8.77041 6.39431 9.37819 6.21011 9.99988 6.21028C10.8335 6.21028 11.633 6.54143 12.2224 7.13088C12.8119 7.72034 13.1422 8.51981 13.1422 9.35342Z"
                        fill="#136AFB"
                    />
                </svg>
            </div>
            <div
                v-if="isPatientSectionEdit"
                ref="floatingPatientSectionEditor"
                class="z-50 flex w-[580px] flex-col gap-6 border border-[#136AFB] bg-white p-6"
                :style="floatingStyles"
            >
                <div class="flex items-center gap-6">
                    <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Unit</div>
                    <div class="flex-grow">
                        <USelectMenu
                            v-model="currentPatientSection.rootStylesExtras.unit"
                            :options="['in', '%']"
                            :ui="{ base: 'w-[80px] h-[48px]' }"
                            @change="changeAllRelatedUnit"
                        />
                    </div>
                </div>
                <div class="flex items-center gap-6">
                    <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Width</div>
                    <div>
                        <div
                            :class="
                                tailwindMerge('flex cursor-pointer items-center border border-[#E2E8F0] px-2 py-[1px]')
                            "
                        >
                            <div class="flex w-[50px] items-center gap-[2px]">
                                <input
                                    v-model="currentPatientSection.rootStyles.width.value"
                                    type="number"
                                    class="w-[30px] border !border-transparent py-0 pl-[2px] pr-0"
                                    @change="
                                        (e) => {
                                            currentPatientSection.rootStyles.width.value =
                                                e.target.value <= 0 ? '0' : e.target.value.toString();
                                        }
                                    "
                                />
                                {{ ' ' + currentPatientSection.rootStyles.width.unit }}
                            </div>
                            <div class="flex flex-col">
                                <img
                                    src="~/assets/images/preview/patientSection/UpArrow.svg"
                                    @click.stop="increasePatientSectionWidth"
                                />
                                <img
                                    src="~/assets/images/preview/patientSection/DownArrow.svg"
                                    @click.stop="decreasePatientSectionWidth"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-6">
                    <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Border</div>
                    <div class="flex flex-grow gap-0">
                        <button
                            class="h-[44px] w-[94px] rounded-l-md border border-[#E2E8F0] text-sm"
                            :class="{
                                'bg-[#136AFB] text-white':
                                    currentPatientSection.rootStyles['border-left-width'].value !== '',
                            }"
                            @click="
                                currentPatientSection.rootStyles['border-left-width'].value =
                                    currentPatientSection.rootStyles['border-left-width'].value === '' ? '1' : ''
                            "
                        >
                            Left
                        </button>
                        <button
                            class="h-[44px] w-[94px] border border-[#E2E8F0] text-sm"
                            :class="{
                                'border-l-[#136AFB] bg-[#136AFB] text-white':
                                    currentPatientSection.rootStyles['border-right-width'].value !== '',
                            }"
                            @click="
                                currentPatientSection.rootStyles['border-right-width'].value =
                                    currentPatientSection.rootStyles['border-right-width'].value === '' ? '1' : ''
                            "
                        >
                            Right
                        </button>
                        <button
                            class="h-[44px] w-[94px] border border-[#E2E8F0] text-sm"
                            :class="{
                                'border-l-[#136AFB] bg-[#136AFB] text-white':
                                    currentPatientSection.rootStyles['border-top-width'].value !== '',
                            }"
                            @click="
                                currentPatientSection.rootStyles['border-top-width'].value =
                                    currentPatientSection.rootStyles['border-top-width'].value === '' ? '1' : ''
                            "
                        >
                            Top
                        </button>
                        <button
                            class="h-[44px] w-[94px] rounded-r-md border border-[#E2E8F0] text-sm"
                            :class="{
                                'rounded-r-md border-l-[#136AFB] bg-[#136AFB] text-white':
                                    currentPatientSection.rootStyles['border-bottom-width'].value !== '',
                            }"
                            @click="
                                currentPatientSection.rootStyles['border-bottom-width'].value =
                                    currentPatientSection.rootStyles['border-bottom-width'].value === '' ? '1' : ''
                            "
                        >
                            Bottom
                        </button>
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
                                v-model="currentPatientSection.rootStyles['padding-left'].value"
                                @change="
                                    (e) => {
                                        currentPatientSection.rootStyles['padding-left'].value =
                                            e.target.value <= 0 ? '0' : e.target.value.toString();
                                    }
                                "
                                type="number"
                                class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                            />
                        </div>
                        <div
                            class="flex h-[43px] w-[93px] items-center justify-center gap-[2px] border border-[#E2E8F0]"
                        >
                            <div class="flex h-[22px] w-[24px] items-center justify-end border border-[#CBD5E1]">
                                <div class="mr-1 h-[18px] w-[2px] border border-[#000000] bg-[#000000]"></div>
                            </div>
                            <input
                                v-model="currentPatientSection.rootStyles['padding-right'].value"
                                @change="
                                    (e) => {
                                        currentPatientSection.rootStyles['padding-right'].value =
                                            e.target.value <= 0 ? '0' : e.target.value.toString();
                                    }
                                "
                                type="number"
                                class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                            />
                        </div>
                        <div
                            class="flex h-[43px] w-[93px] items-center justify-center gap-[2px] border border-[#E2E8F0]"
                        >
                            <div class="flex h-[22px] w-[24px] justify-center border border-[#CBD5E1]">
                                <div class="mt-1 h-[2px] w-[18px] border border-[#000000] bg-[#000000]"></div>
                            </div>
                            <input
                                v-model="currentPatientSection.rootStyles['padding-top'].value"
                                @change="
                                    (e) => {
                                        currentPatientSection.rootStyles['padding-top'].value =
                                            e.target.value <= 0 ? '0' : e.target.value.toString();
                                    }
                                "
                                type="number"
                                class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                            />
                        </div>
                        <div
                            class="flex h-[43px] w-[93px] items-center justify-center gap-[2px] rounded-r-md border border-[#E2E8F0]"
                        >
                            <div class="flex h-[22px] w-[24px] items-end justify-center border border-[#CBD5E1]">
                                <div class="mb-1 h-[2px] w-[18px] border border-[#000000] bg-[#000000]"></div>
                            </div>
                            <input
                                v-model="currentPatientSection.rootStyles['padding-bottom'].value"
                                @change="
                                    (e) => {
                                        currentPatientSection.rootStyles['padding-bottom'].value =
                                            e.target.value <= 0 ? '0' : e.target.value.toString();
                                    }
                                "
                                type="number"
                                class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                            />
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-6">
                    <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Margin</div>
                    <div class="flex flex-grow">
                        <div
                            class="flex h-[43px] w-[93px] items-center justify-center gap-[2px] rounded-l-md border border-[#E2E8F0]"
                        >
                            <div class="relative flex h-[22px] w-[24px] items-center border border-[#CBD5E1]">
                                <div
                                    class="absolute -left-[10px] ml-1 h-[18px] w-[2px] border border-[#000000] bg-[#000000]"
                                ></div>
                            </div>
                            <input
                                v-model="currentPatientSection.rootStyles['margin-left'].value"
                                @change="
                                    (e) => {
                                        currentPatientSection.rootStyles['margin-left'].value =
                                            e.target.value <= 0 ? '0' : e.target.value.toString();
                                    }
                                "
                                type="number"
                                class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                            />
                        </div>
                        <div
                            class="flex h-[43px] w-[93px] items-center justify-center gap-[2px] border border-[#E2E8F0]"
                        >
                            <div
                                class="relative flex h-[22px] w-[24px] items-center justify-end border border-[#CBD5E1]"
                            >
                                <div
                                    class="absolute -right-[10px] mr-1 h-[18px] w-[2px] border border-[#000000] bg-[#000000]"
                                ></div>
                            </div>
                            <input
                                v-model="currentPatientSection.rootStyles['margin-right'].value"
                                @change="
                                    (e) => {
                                        currentPatientSection.rootStyles['margin-right'].value =
                                            e.target.value <= 0 ? '0' : e.target.value.toString();
                                    }
                                "
                                type="number"
                                class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                            />
                        </div>
                        <div
                            class="flex h-[43px] w-[93px] items-center justify-center gap-[2px] border border-[#E2E8F0]"
                        >
                            <div class="relative flex h-[22px] w-[24px] justify-center border border-[#CBD5E1]">
                                <div
                                    class="absolute -top-[10px] mt-1 h-[2px] w-[18px] border border-[#000000] bg-[#000000]"
                                ></div>
                            </div>
                            <input
                                v-model="currentPatientSection.rootStyles['margin-top'].value"
                                @change="
                                    (e) => {
                                        currentPatientSection.rootStyles['margin-top'].value =
                                            e.target.value <= 0 ? '0' : e.target.value.toString();
                                    }
                                "
                                type="number"
                                class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                            />
                        </div>
                        <div
                            class="flex h-[43px] w-[93px] items-center justify-center gap-[2px] rounded-r-md border border-[#E2E8F0]"
                        >
                            <div
                                class="relative flex h-[22px] w-[24px] items-end justify-center border border-[#CBD5E1]"
                            >
                                <div
                                    class="absolute -bottom-[10px] mb-1 h-[2px] w-[18px] border border-[#000000] bg-[#000000]"
                                ></div>
                            </div>
                            <input
                                v-model="currentPatientSection.rootStyles['margin-bottom'].value"
                                @change="
                                    (e) => {
                                        currentPatientSection.rootStyles['margin-bottom'].value =
                                            e.target.value <= 0 ? '0' : e.target.value.toString();
                                    }
                                "
                                type="number"
                                class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <button
                class="h-[39px] w-[122px] rounded-3xl bg-[#DBEAFE] text-sm"
                @click="patientSectionLayoutStore.addRow"
            >
                + New Row
            </button>
        </div>

        <PrintLayoutPatientSectionRow
            v-for="(row, rowIndex) in currentPatientSectionRow"
            :key="rowIndex"
            :row-index="rowIndex"
        />

        <div
            class="flex w-full justify-end"
            style="border-left: '1px;'"
        >
            <UButton
                label="Save"
                color="blue"
                size="xl"
                :ui="{
                    strategy: 'override',
                    color: {
                        blue: {
                            solid: 'bg-[#136afb] text-white',
                        },
                    },
                    padding: {
                        xl: 'px-0 py-3',
                    },
                    base: 'w-[190px] flex justify-center items-center',
                }"
                type="submit"
                @click="savePatientSection"
            >
                <template #leading>
                    <LibIconDisk />
                </template>
            </UButton>
        </div>
    </div>
</template>
<script setup lang="ts">
import { offset, useFloating } from '@floating-ui/vue';
import SearchPatientForPatientSection from '../prescription/SearchPatientForPatientSection.vue';

const patientSectionLayoutStore = useLayoutsPatientSectionStore();

const whitePapperRef = ref<HTMLDivElement | null>(null);

const currentHeightWidthWhitePapper = ref<{ height: number; width: number }>({ height: 0, width: 0 });

function setWhitePapperHieghtWIdth() {
    if (whitePapperRef?.value) {
        currentHeightWidthWhitePapper.value.height = whitePapperRef?.value?.clientHeight;
        currentHeightWidthWhitePapper.value.width = whitePapperRef?.value?.clientWidth;
    }
}

watch(
    () => whitePapperRef?.value,
    (element, prevElement) => {
        if (element) {
            setWhitePapperHieghtWIdth();
            window.addEventListener('resize', setWhitePapperHieghtWIdth);
        }
    },
);

const WidthPixelPerInch = computed(() => currentHeightWidthWhitePapper.value.width / pageSetupFormData.value.width);

const widthWithoutMargin = computed(
    () =>
        Number(pageSetupFormData?.value?.width) -
        Number(pageSetupFormData?.value?.margins?.left) -
        Number(pageSetupFormData?.value?.margins?.right),
);

const setWhitePapperWidth = () => {};

const layoutStore = useLayoutsStore();
const { pageSetupFormData } = storeToRefs(layoutStore);

const isPatientSectionEdit = ref<boolean>(false);

const { currentPatientSectionRow, currentPatientSection, selectedPatientForPatientSection } =
    storeToRefs(patientSectionLayoutStore);

const referencePatientSectionSettings = ref(null);
const floatingPatientSectionEditor = ref(null);

const { floatingStyles } = useFloating(referencePatientSectionSettings, floatingPatientSectionEditor, {
    placement: 'right-start',
    middleware: [
        offset({
            mainAxis: 10,
        }),
    ],
});

onClickOutside(floatingPatientSectionEditor, () => (isPatientSectionEdit.value = false));

function increasePatientSectionWidth() {
    if (currentPatientSection.value.rootStyles.width.unit === '%') {
        currentPatientSection.value.rootStyles.width.value = (
            Number(currentPatientSection.value.rootStyles.width.value) + 10
        ).toString();
    }

    if (currentPatientSection.value.rootStyles.width.unit === 'in') {
        currentPatientSection.value.rootStyles.width.value = (
            Number(currentPatientSection.value.rootStyles.width.value) + 0.1
        ).toFixed(1);
    }
}

function decreasePatientSectionWidth() {
    if (currentPatientSection.value.rootStyles.width.unit === '%') {
        currentPatientSection.value.rootStyles.width.value = (
            Number(currentPatientSection.value.rootStyles.width.value) - 10
        ).toString();
    }

    if (currentPatientSection.value.rootStyles.width.unit === 'in') {
        currentPatientSection.value.rootStyles.width.value = (
            Number(currentPatientSection.value.rootStyles.width.value) - 0.1
        ).toFixed(1);
    }
}

function savePatientSection() {
    patientSectionLayoutStore.createPatientSection();
}

function generateStyle(styleObject: any) {
    let style = '';
    for (const property in styleObject) {
        if (styleObject[property].value) {
            if (styleObject[property].unit !== 'in') {
                style += `${property}: ${styleObject[property].value}${styleObject[property].unit};`;
            }

            if (styleObject[property].unit === 'in') {
                style += `${property}: ${Number(Number(styleObject[property].value) * WidthPixelPerInch.value).toFixed(2)}px;`;
            }
            // console.log(style);
        }
    }

    return style;
}

function changeAllRelatedUnit(unit: string) {
    for (const property in currentPatientSection.value.rootStyles) {
        if (property.includes('border') || property.includes('font')) continue;

        currentPatientSection.value.rootStyles[property].unit = unit;
    }

    currentPatientSection.value.rows.forEach((row) => {
        for (const property in row.styles) {
            if (property.includes('border') || property.includes('font')) continue;

            row.styles[property].unit = unit;
        }

        row.columns.forEach((column) => {
            for (const property in column.styles) {
                if (property.includes('border') || property.includes('font')) continue;

                column.styles[property].unit = unit;
            }

            for (const property in column.label.styles) {
                if (property.includes('border') || property.includes('font')) continue;

                column.label.styles[property].unit = unit;
            }

            for (const property in column.value.styles) {
                if (property.includes('border') || property.includes('font')) continue;

                column.value.styles[property].unit = unit;
            }
        });
    });
}

onMounted(() => {
    patientSectionLayoutStore.fetchPatientSection();
});

onUnmounted(() => {
    selectedPatientForPatientSection.value = {};
});
</script>
