<template>
    <div class="flex w-full justify-center">
        <div
            ref="referencePatientSectionRow"
            class="mb-[17px] flex h-fit min-h-[72px] w-[90%] max-w-[1024px] items-center justify-between border border-[#CBD5E1] p-[0.75rem]"
        >
            <div class="relative flex w-full flex-wrap gap-3">
                <!-- {{ rowIndex }} -->
                <svg
                    width="20"
                    height="19"
                    viewBox="0 0 20 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="absolute -left-11 bottom-0 top-0 my-auto cursor-pointer"
                    :class="{ ' bg-slate-300': isCurrentPatientSectionRowEdit }"
                    @click="openCurrentPatientSectionRowConfigEditor"
                    ref="referencePatientSectionRowSettings"
                >
                    <path
                        d="M18.303 6.73828C17.9362 6.68496 17.5862 6.54959 17.279 6.34225C16.9717 6.13491 16.7152 5.86093 16.5286 5.54072C16.3419 5.22052 16.2299 4.86233 16.2008 4.49282C16.1717 4.12331 16.2264 3.75201 16.3607 3.40656C16.4465 3.18103 16.4595 2.93431 16.3981 2.70098C16.3366 2.46766 16.2036 2.25941 16.0179 2.10542C15.1956 1.41501 14.2597 0.872668 13.2519 0.502562C13.0224 0.417264 12.7718 0.406556 12.5359 0.471965C12.3 0.537373 12.0907 0.675562 11.9379 0.866848C11.708 1.1608 11.4142 1.39854 11.0788 1.56205C10.7434 1.72556 10.3752 1.81054 10.002 1.81054C9.62887 1.81054 9.26062 1.72556 8.92521 1.56205C8.58979 1.39854 8.29602 1.1608 8.06616 0.866848C7.91335 0.675562 7.70407 0.537373 7.46814 0.471965C7.23221 0.406556 6.98165 0.417264 6.75216 0.502562C5.82035 0.844011 4.94907 1.33217 4.1713 1.94856C3.97558 2.10358 3.83463 2.31719 3.76908 2.55811C3.70352 2.79903 3.71682 3.0546 3.80702 3.28742C3.95194 3.64188 4.0118 4.02535 3.98181 4.40711C3.95182 4.78888 3.83281 5.1583 3.63432 5.48578C3.43584 5.81326 3.16339 6.08969 2.83882 6.2929C2.51425 6.49612 2.14659 6.62047 1.76531 6.65599C1.51763 6.68253 1.28502 6.78788 1.1017 6.95654C0.91839 7.12519 0.794062 7.34824 0.74702 7.59285C0.630091 8.17212 0.571229 8.76161 0.571305 9.35256C0.570361 9.84729 0.610211 10.3412 0.690448 10.8294C0.730616 11.0825 0.853214 11.3152 1.03921 11.4914C1.2252 11.6676 1.46417 11.7775 1.71902 11.804C2.10889 11.8406 2.48434 11.97 2.81391 12.1815C3.14349 12.3929 3.41762 12.6803 3.61335 13.0194C3.80907 13.3586 3.9207 13.7397 3.93889 14.1309C3.95707 14.522 3.88129 14.9118 3.71788 15.2677C3.61074 15.4993 3.58409 15.7601 3.64218 16.0086C3.70026 16.2571 3.83974 16.479 4.03845 16.6391C4.85636 17.3173 5.78395 17.8509 6.7813 18.2171C6.90873 18.2614 7.04244 18.2848 7.1773 18.2866C7.36222 18.2862 7.54434 18.2415 7.7084 18.1562C7.87245 18.0708 8.01366 17.9474 8.12016 17.7963C8.34422 17.4698 8.64458 17.203 8.99516 17.019C9.34573 16.835 9.73594 16.7393 10.1319 16.7403C10.5151 16.7412 10.8928 16.8314 11.2351 17.0039C11.5773 17.1763 11.8746 17.4262 12.1033 17.7337C12.2556 17.9384 12.4714 18.087 12.717 18.1563C12.9625 18.2256 13.2241 18.2117 13.461 18.1168C14.3722 17.75 15.2204 17.243 15.975 16.6143C16.1651 16.458 16.3007 16.2454 16.3623 16.0071C16.4239 15.7688 16.4084 15.5171 16.3179 15.2883C16.1699 14.938 16.1055 14.5581 16.1297 14.1786C16.1539 13.7991 16.2661 13.4304 16.4573 13.1017C16.6485 12.7731 16.9136 12.4934 17.2316 12.2848C17.5495 12.0762 17.9117 11.9445 18.2893 11.9C18.5339 11.866 18.7614 11.7551 18.9387 11.5833C19.1161 11.4115 19.2342 11.1877 19.2759 10.9443C19.3733 10.4192 19.4243 9.88658 19.4284 9.35256C19.4285 8.78887 19.3757 8.22641 19.2707 7.67256C19.2279 7.43498 19.1114 7.21691 18.9377 7.04923C18.764 6.88155 18.542 6.77276 18.303 6.73828ZM13.1422 9.35342C13.1422 9.97511 12.9578 10.5828 12.6124 11.0997C12.267 11.6167 11.776 12.0195 11.2016 12.2574C10.6273 12.4953 9.99524 12.5575 9.38551 12.4361C8.77577 12.3148 8.21572 12.0153 7.77618 11.5757C7.33664 11.136 7.03735 10.5759 6.91617 9.96609C6.79498 9.35633 6.85735 8.72432 7.09538 8.15C7.33341 7.57568 7.73641 7.08485 8.25341 6.73958C8.77041 6.39431 9.37819 6.21011 9.99988 6.21028C10.8335 6.21028 11.633 6.54143 12.2224 7.13088C12.8119 7.72034 13.1422 8.51981 13.1422 9.35342Z"
                        fill="#136AFB"
                    />
                </svg>
                <div
                    v-if="isCurrentPatientSectionRowEdit"
                    class="absolute z-50 flex h-[227px] w-[557px] flex-col gap-6 border border-[#136AFB] bg-[white] p-6"
                    ref="floatingPatientSectionRowEditor"
                    :style="floatingStylesForRowConfigEditor"
                >
                    <div class="flex items-center gap-6">
                        <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Border</div>
                        <div class="flex flex-grow gap-0">
                            <button
                                class="h-[44px] w-[94px] rounded-l-md border border-[#E2E8F0] text-sm"
                                :class="{
                                    'bg-[#136AFB] text-white':
                                        currentPatientSectionRow[rowIndex].styles['border-left-width'].value !== '',
                                }"
                                @click="
                                    currentPatientSectionRow[rowIndex].styles['border-left-width'].value =
                                        currentPatientSectionRow[rowIndex].styles['border-left-width'].value === ''
                                            ? '1'
                                            : ''
                                "
                            >
                                Left
                            </button>
                            <button
                                class="h-[44px] w-[94px] border border-[#E2E8F0] text-sm"
                                :class="{
                                    'border-l-[#136AFB] bg-[#136AFB] text-white':
                                        currentPatientSectionRow[rowIndex].styles['border-right-width'].value !== '',
                                }"
                                @click="
                                    currentPatientSectionRow[rowIndex].styles['border-right-width'].value =
                                        currentPatientSectionRow[rowIndex].styles['border-right-width'].value === ''
                                            ? '1'
                                            : ''
                                "
                            >
                                Right
                            </button>
                            <button
                                class="h-[44px] w-[94px] border border-[#E2E8F0] text-sm"
                                :class="{
                                    'border-l-[#136AFB] bg-[#136AFB] text-white':
                                        currentPatientSectionRow[rowIndex].styles['border-top-width'].value !== '',
                                }"
                                @click="
                                    currentPatientSectionRow[rowIndex].styles['border-top-width'].value =
                                        currentPatientSectionRow[rowIndex].styles['border-top-width'].value === ''
                                            ? '1'
                                            : ''
                                "
                            >
                                Top
                            </button>
                            <button
                                class="h-[44px] w-[94px] rounded-r-md border border-[#E2E8F0] text-sm"
                                :class="{
                                    'rounded-r-md border-l-[#136AFB] bg-[#136AFB] text-white':
                                        currentPatientSectionRow[rowIndex].styles['border-bottom-width'].value !== '',
                                }"
                                @click="
                                    currentPatientSectionRow[rowIndex].styles['border-bottom-width'].value =
                                        currentPatientSectionRow[rowIndex].styles['border-bottom-width'].value === ''
                                            ? '1'
                                            : ''
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
                                    v-model="currentPatientSectionRow[rowIndex].styles['padding-left'].value"
                                    @change="
                                        (e) => {
                                            currentPatientSectionRow[rowIndex].styles['padding-left'].value =
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
                                    v-model="currentPatientSectionRow[rowIndex].styles['padding-right'].value"
                                    @change="
                                        (e) => {
                                            currentPatientSectionRow[rowIndex].styles['padding-right'].value =
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
                                    v-model="currentPatientSectionRow[rowIndex].styles['padding-top'].value"
                                    @change="
                                        (e) => {
                                            currentPatientSectionRow[rowIndex].styles['padding-top'].value =
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
                                    v-model="currentPatientSectionRow[rowIndex].styles['padding-bottom'].value"
                                    @change="
                                        (e) => {
                                            currentPatientSectionRow[rowIndex].styles['padding-bottom'].value =
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
                                    v-model="currentPatientSectionRow[rowIndex].styles['margin-left'].value"
                                    @change="
                                        (e) => {
                                            currentPatientSectionRow[rowIndex].styles['margin-left'].value =
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
                                    v-model="currentPatientSectionRow[rowIndex].styles['margin-right'].value"
                                    @change="
                                        (e) => {
                                            currentPatientSectionRow[rowIndex].styles['margin-right'].value =
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
                                    v-model="currentPatientSectionRow[rowIndex].styles['margin-top'].value"
                                    @change="
                                        (e) => {
                                            currentPatientSectionRow[rowIndex].styles['margin-top'].value =
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
                                    v-model="currentPatientSectionRow[rowIndex].styles['margin-bottom'].value"
                                    @change="
                                        (e) => {
                                            currentPatientSectionRow[rowIndex].styles['margin-bottom'].value =
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
                <div
                    class="flex items-center justify-start text-sm"
                    v-for="(column, index) in currentPatientSectionRow[rowIndex]?.columns"
                    :key="column.item"
                    @click="openCurrentPatientSectionColumnConfigEditor(index)"
                >
                    <div class="flex w-fit items-center">
                        <div
                            :class="
                                tailwindMerge('cursor-pointer whitespace-nowrap border border-[#E2E8F0] px-3 py-4', {
                                    ' border-[#136AFB] shadow-lg': currentPatientSectionColumnIndexForEdit == index,
                                })
                            "
                        >
                            <div>{{ fields?.patient_info?.find((info) => info.value === column.item)?.name }}</div>
                        </div>
                        <div
                            :class="
                                tailwindMerge(
                                    'flex cursor-pointer items-center border border-[#E2E8F0] px-2 py-[5px]',
                                    {
                                        ' border-[#136AFB] border-l-transparent shadow-lg':
                                            currentPatientSectionColumnIndexForEdit == index,
                                    },
                                )
                            "
                        >
                            <div class="w-[50px]">
                                {{ column?.styles?.width?.value + ' ' + column?.styles?.width?.unit }}
                            </div>
                            <div class="flex flex-col">
                                <img
                                    src="~/assets/images/preview/patientSection/UpArrow.svg"
                                    @click.stop="increaseSectionWidth(index)"
                                />
                                <img
                                    src="~/assets/images/preview/patientSection/DownArrow.svg"
                                    @click.stop="decreaseSectionWidth(index)"
                                />
                            </div>
                        </div>
                    </div>

                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="ml-2 cursor-pointer"
                        @click.stop="removeColumnByIndex(index, column.item)"
                    >
                        <path
                            d="M19 10C19 11.78 18.4722 13.5201 17.4832 15.0001C16.4943 16.4802 15.0887 17.6337 13.4442 18.3149C11.7996 18.9961 9.99002 19.1743 8.24419 18.8271C6.49836 18.4798 4.89472 17.6226 3.63604 16.364C2.37737 15.1053 1.5202 13.5016 1.17294 11.7558C0.82567 10.01 1.0039 8.20038 1.68509 6.55585C2.36628 4.91131 3.51983 3.50571 4.99987 2.51677C6.47991 1.52784 8.21997 1 10 1C12.387 1 14.6761 1.94821 16.364 3.63604C18.0518 5.32387 19 7.61305 19 10Z"
                            stroke="#EF4444"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M13.1816 6.82031L6.81768 13.1843"
                            stroke="#EF4444"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M6.81836 6.82031L13.1823 13.1843"
                            stroke="#EF4444"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>
            </div>
            <div
                class="relative mr-[1.25rem]"
                ref="reference"
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    @click.stop="() => (isAddNewColumnSectionEdit = true)"
                >
                    <path
                        d="M32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16Z"
                        fill="#136AFB"
                    />
                    <path
                        d="M7 16H25"
                        stroke="white"
                        stroke-width="1.5"
                    />
                    <path
                        d="M16 7V25"
                        stroke="white"
                        stroke-width="1.5"
                    />
                </svg>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="absolute -right-16 bottom-0 top-0 my-auto cursor-pointer"
                    @click.stop="removePatientSectionRow"
                >
                    <path
                        d="M19 10C19 11.78 18.4722 13.5201 17.4832 15.0001C16.4943 16.4802 15.0887 17.6337 13.4442 18.3149C11.7996 18.9961 9.99002 19.1743 8.24419 18.8271C6.49836 18.4798 4.89472 17.6226 3.63604 16.364C2.37737 15.1053 1.5202 13.5016 1.17294 11.7558C0.82567 10.01 1.0039 8.20038 1.68509 6.55585C2.36628 4.91131 3.51983 3.50571 4.99987 2.51677C6.47991 1.52784 8.21997 1 10 1C12.387 1 14.6761 1.94821 16.364 3.63604C18.0518 5.32387 19 7.61305 19 10Z"
                        stroke="#EF4444"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M13.1816 6.82031L6.81768 13.1843"
                        stroke="#EF4444"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M6.81836 6.82031L13.1823 13.1843"
                        stroke="#EF4444"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </div>
        </div>
        <div
            v-if="isAddNewColumnSectionEdit"
            ref="floating"
            class="z-50 mr-auto flex h-[480px] w-[220px] flex-col gap-2 overflow-y-auto bg-[#FFFFFF] p-6 drop-shadow-lg scrollbar-thin scrollbar-track-[#F8FAFC] scrollbar-thumb-[#CBD5E1] scrollbar-thumb-rounded-sm"
            :style="floatingStyles"
        >
            <div
                v-for="type in fields?.patient_info"
                :key="type?.value"
            >
                <input
                    :id="type.value"
                    type="checkbox"
                    :value="type.value"
                    v-model="selectedSectionTypes"
                    class="h-5 w-5 checked:bg-[#136AFB]"
                    @change="
                        (e) => {
                            if (e.target.checked) {
                                addColumn(e.target.value);
                            } else {
                                removeColumn(e.target.value);
                            }
                        }
                    "
                />
                <label
                    class="ml-3 text-sm leading-6"
                    :for="type.value"
                    >{{ type.name }}</label
                >
            </div>
        </div>
        <div
            ref="floatingPatientSectionColumnEditor"
            v-if="isCurrentPatientSectionColumnEdit"
            class="z-50 h-[372px] w-[809px] border border-[#136AFB] bg-white shadow-lg"
            :style="floatingStylesForColumnConfigEditor"
        >
            <UTabs
                :items="items"
                orientation="vertical"
                :ui="{
                    wrapper: 'flex items-start gap-4 p-6 h-full',
                    container: 'relative w-full h-full border-l-[1px] border-l-[#CBD5E1] pl-3',
                    list: {
                        width: 'w-48',
                        tab: {
                            base: 'relative text-[#1E293B]   leading-[22px] inline-flex items-center justify-start flex-shrink-0 w-[200px] ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500 dark:ui-focus-visible:ring-primary-400 ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out',
                            height: 'h-[43px]',
                            size: 'text-[15px] ',
                            background: 'bg-white',
                            font: 'font-bold',
                            active: 'bg-[#F1F5F9] text-[#1E293B] border-b-[0px]',
                            inactive: 'bg-[white]',
                        },
                    },
                }"
            >
                <template #item="{ item }">
                    <div
                        class="flex flex-col gap-6"
                        v-if="item.label === 'Section'"
                    >
                        <div class="flex items-center gap-6">
                            <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Section Name</div>
                            <div class="flex-grow">
                                <USelectMenu
                                    v-model="
                                        currentPatientSectionRow[rowIndex].columns[
                                            currentPatientSectionColumnIndexForEdit
                                        ].item
                                    "
                                    :options="fields?.patient_info"
                                    placeholder="Select Section Name"
                                    value-attribute="value"
                                    option-attribute="name"
                                    :ui="{ base: 'w-[221px] h-[48px]' }"
                                    @change="
                                        (e) => {
                                            if (!selectedSectionTypes.includes(e)) {
                                                selectedSectionTypes.push(e);
                                            }
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.text = fields?.patient_info.find((info) => info.value === e).name;
                                        }
                                    "
                                />
                            </div>
                        </div>
                        <div class="flex items-center gap-6">
                            <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Width</div>
                            <div>
                                <div
                                    :class="
                                        tailwindMerge(
                                            'flex cursor-pointer items-center border border-[#E2E8F0] px-2 py-[1px]',
                                        )
                                    "
                                >
                                    <div class="flex w-[50px] items-center gap-[2px]">
                                        <input
                                            v-model="
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].styles.width.value
                                            "
                                            type="number"
                                            class="w-[30px] border !border-transparent py-0 pl-[2px] pr-0"
                                            @change="
                                                (e) => {
                                                    currentPatientSectionRow[rowIndex].columns[
                                                        currentPatientSectionColumnIndexForEdit
                                                    ].styles.width.value =
                                                        e.target.value <= 0 ? '0' : e.target.value.toString();
                                                }
                                            "
                                        />
                                        {{ ' ' + columnForEdit.styles.width.unit }}
                                    </div>
                                    <div class="flex flex-col">
                                        <img
                                            src="~/assets/images/preview/patientSection/UpArrow.svg"
                                            @click.stop="increaseSectionWidth(currentPatientSectionColumnIndexForEdit)"
                                        />
                                        <img
                                            src="~/assets/images/preview/patientSection/DownArrow.svg"
                                            @click.stop="decreaseSectionWidth(currentPatientSectionColumnIndexForEdit)"
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
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].styles['border-left-width'].value !== '',
                                    }"
                                    @click="
                                        currentPatientSectionRow[rowIndex].columns[
                                            currentPatientSectionColumnIndexForEdit
                                        ].styles['border-left-width'].value =
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].styles['border-left-width'].value === ''
                                                ? '1'
                                                : ''
                                    "
                                >
                                    Left
                                </button>
                                <button
                                    class="h-[44px] w-[94px] border border-[#E2E8F0] text-sm"
                                    :class="{
                                        'border-l-[#136AFB] bg-[#136AFB] text-white':
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].styles['border-right-width'].value !== '',
                                    }"
                                    @click="
                                        currentPatientSectionRow[rowIndex].columns[
                                            currentPatientSectionColumnIndexForEdit
                                        ].styles['border-right-width'].value =
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].styles['border-right-width'].value === ''
                                                ? '1'
                                                : ''
                                    "
                                >
                                    Right
                                </button>
                                <button
                                    class="h-[44px] w-[94px] border border-[#E2E8F0] text-sm"
                                    :class="{
                                        'border-l-[#136AFB] bg-[#136AFB] text-white':
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].styles['border-top-width'].value !== '',
                                    }"
                                    @click="
                                        currentPatientSectionRow[rowIndex].columns[
                                            currentPatientSectionColumnIndexForEdit
                                        ].styles['border-top-width'].value =
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].styles['border-top-width'].value === ''
                                                ? '1'
                                                : ''
                                    "
                                >
                                    Top
                                </button>
                                <button
                                    class="h-[44px] w-[94px] rounded-r-md border border-[#E2E8F0] text-sm"
                                    :class="{
                                        'rounded-r-md border-l-[#136AFB] bg-[#136AFB] text-white':
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].styles['border-bottom-width'].value !== '',
                                    }"
                                    @click="
                                        currentPatientSectionRow[rowIndex].columns[
                                            currentPatientSectionColumnIndexForEdit
                                        ].styles['border-bottom-width'].value =
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].styles['border-bottom-width'].value === ''
                                                ? '1'
                                                : ''
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].styles['padding-left'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].styles['padding-left'].value =
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
                                        class="flex h-[22px] w-[24px] items-center justify-end border border-[#CBD5E1]"
                                    >
                                        <div class="mr-1 h-[18px] w-[2px] border border-[#000000] bg-[#000000]"></div>
                                    </div>
                                    <input
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].styles['padding-right'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].styles['padding-right'].value =
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].styles['padding-top'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].styles['padding-top'].value =
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
                                        class="flex h-[22px] w-[24px] items-end justify-center border border-[#CBD5E1]"
                                    >
                                        <div class="mb-1 h-[2px] w-[18px] border border-[#000000] bg-[#000000]"></div>
                                    </div>
                                    <input
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].styles['padding-bottom'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].styles['padding-bottom'].value =
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].styles['margin-left'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].styles['margin-left'].value =
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].styles['margin-right'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].styles['margin-right'].value =
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].styles['margin-top'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].styles['margin-top'].value =
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].styles['margin-bottom'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].styles['margin-bottom'].value =
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

                    <div
                        class="flex flex-col gap-6"
                        v-if="item.label === 'Label'"
                    >
                        <div class="flex items-center gap-6">
                            <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Label</div>
                            <div class="flex gap-2">
                                <UInput
                                    v-model="
                                        currentPatientSectionRow[rowIndex].columns[
                                            currentPatientSectionColumnIndexForEdit
                                        ].label.text
                                    "
                                    placeholder="Write Label"
                                    :ui="{ base: 'w-[221px] h-[48px]' }"
                                />
                                <div class="flex w-full items-center">
                                    <input
                                        id="showInPrescription"
                                        type="checkbox"
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.printable
                                        "
                                        class="h-5 w-5 checked:bg-[#136AFB]"
                                    />
                                    <label
                                        class="ml-1 text-sm leading-6"
                                        for="showInPrescription"
                                        >Show in Prescription</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-6">
                            <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Font Size</div>
                            <div class="flex flex-grow items-center justify-between">
                                <div>
                                    <div
                                        :class="
                                            tailwindMerge(
                                                'flex cursor-pointer items-center border border-[#E2E8F0] px-2 py-[1px]',
                                            )
                                        "
                                    >
                                        <div class="flex w-[60px] items-center gap-[2px]">
                                            <input
                                                v-model="
                                                    currentPatientSectionRow[rowIndex].columns[
                                                        currentPatientSectionColumnIndexForEdit
                                                    ].label.styles['font-size'].value
                                                "
                                                type="number"
                                                class="w-[40px] border !border-transparent py-0 pl-[2px] pr-0"
                                                @change="
                                                    (e) => {
                                                        currentPatientSectionRow[rowIndex].columns[
                                                            currentPatientSectionColumnIndexForEdit
                                                        ].label.styles['font-size'].value =
                                                            e.target.value <= 0 ? '0' : e.target.value.toString();
                                                    }
                                                "
                                            />
                                            {{
                                                ' ' +
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].label.styles['font-size'].unit
                                            }}
                                        </div>
                                        <div class="flex flex-col">
                                            <img
                                                src="~/assets/images/preview/patientSection/UpArrow.svg"
                                                @click.stop="
                                                    () => {
                                                        currentPatientSectionRow[rowIndex].columns[
                                                            currentPatientSectionColumnIndexForEdit
                                                        ].label.styles['font-size'].value = (
                                                            Number(
                                                                currentPatientSectionRow[rowIndex].columns[
                                                                    currentPatientSectionColumnIndexForEdit
                                                                ].label.styles['font-size'].value,
                                                            ) + 0.1
                                                        ).toFixed(1);
                                                    }
                                                "
                                            />
                                            <img
                                                src="~/assets/images/preview/patientSection/DownArrow.svg"
                                                @click.stop="
                                                    () => {
                                                        if (
                                                            currentPatientSectionRow[rowIndex].columns[
                                                                currentPatientSectionColumnIndexForEdit
                                                            ].label.styles['font-size'].value > 0
                                                        )
                                                            currentPatientSectionRow[rowIndex].columns[
                                                                currentPatientSectionColumnIndexForEdit
                                                            ].label.styles['font-size'].value = (
                                                                Number(
                                                                    currentPatientSectionRow[rowIndex].columns[
                                                                        currentPatientSectionColumnIndexForEdit
                                                                    ].label.styles['font-size'].value,
                                                                ) - 0.1
                                                            ).toFixed(1);
                                                    }
                                                "
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Font Weight</div>
                                <USelectMenu
                                    v-model="
                                        currentPatientSectionRow[rowIndex].columns[
                                            currentPatientSectionColumnIndexForEdit
                                        ].label.styles['font-weight'].value
                                    "
                                    :options="['400', '500', '600', '700']"
                                    placeholder="Select Font Weight"
                                    :ui="{ base: 'w-[98px] h-[48px]' }"
                                />
                            </div>
                        </div>
                        <div class="flex items-center gap-6">
                            <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Border</div>
                            <div class="flex flex-grow gap-0">
                                <button
                                    class="h-[44px] w-[94px] rounded-l-md border border-[#E2E8F0] text-sm"
                                    :class="{
                                        'bg-[#136AFB] text-white':
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.styles['border-left-width'].value !== '',
                                    }"
                                    @click="
                                        currentPatientSectionRow[rowIndex].columns[
                                            currentPatientSectionColumnIndexForEdit
                                        ].label.styles['border-left-width'].value =
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.styles['border-left-width'].value === ''
                                                ? '1'
                                                : ''
                                    "
                                >
                                    Left
                                </button>
                                <button
                                    class="h-[44px] w-[94px] border border-[#E2E8F0] text-sm"
                                    :class="{
                                        'border-l-[#136AFB] bg-[#136AFB] text-white':
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.styles['border-right-width'].value !== '',
                                    }"
                                    @click="
                                        currentPatientSectionRow[rowIndex].columns[
                                            currentPatientSectionColumnIndexForEdit
                                        ].label.styles['border-right-width'].value =
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.styles['border-right-width'].value === ''
                                                ? '1'
                                                : ''
                                    "
                                >
                                    Right
                                </button>
                                <button
                                    class="h-[44px] w-[94px] border border-[#E2E8F0] text-sm"
                                    :class="{
                                        'border-l-[#136AFB] bg-[#136AFB] text-white':
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.styles['border-top-width'].value !== '',
                                    }"
                                    @click="
                                        currentPatientSectionRow[rowIndex].columns[
                                            currentPatientSectionColumnIndexForEdit
                                        ].label.styles['border-top-width'].value =
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.styles['border-top-width'].value === ''
                                                ? '1'
                                                : ''
                                    "
                                >
                                    Top
                                </button>
                                <button
                                    class="h-[44px] w-[94px] rounded-r-md border border-[#E2E8F0] text-sm"
                                    :class="{
                                        'rounded-r-md border-l-[#136AFB] bg-[#136AFB] text-white':
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.styles['border-bottom-width'].value !== '',
                                    }"
                                    @click="
                                        currentPatientSectionRow[rowIndex].columns[
                                            currentPatientSectionColumnIndexForEdit
                                        ].label.styles['border-bottom-width'].value =
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.styles['border-bottom-width'].value === ''
                                                ? '1'
                                                : ''
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.styles['padding-left'].value
                                        "
                                        type="number"
                                        class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].label.styles['padding-left'].value =
                                                    e.target.value <= 0 ? '0' : e.target.value.toString();
                                            }
                                        "
                                    />
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.styles['padding-right'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].label.styles['padding-right'].value =
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.styles['padding-top'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].label.styles['padding-top'].value =
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
                                        class="flex h-[22px] w-[24px] items-end justify-center border border-[#CBD5E1]"
                                    >
                                        <div class="mb-1 h-[2px] w-[18px] border border-[#000000] bg-[#000000]"></div>
                                    </div>
                                    <input
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.styles['padding-bottom'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].label.styles['padding-bottom'].value =
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.styles['margin-left'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].label.styles['margin-left'].value =
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.styles['margin-right'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].label.styles['margin-right'].value =
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.styles['margin-top'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].label.styles['margin-top'].value =
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].label.styles['margin-bottom'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].label.styles['margin-bottom'].value =
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

                    <div
                        class="flex flex-col gap-6"
                        v-if="item.label === 'Value'"
                    >
                        <div class="flex items-center gap-6">
                            <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Font Size</div>
                            <div class="flex flex-grow items-center justify-between">
                                <div>
                                    <div
                                        :class="
                                            tailwindMerge(
                                                'flex cursor-pointer items-center border border-[#E2E8F0] px-2 py-[1px]',
                                            )
                                        "
                                    >
                                        <div class="flex w-[60px] items-center gap-[2px]">
                                            <input
                                                v-model="
                                                    currentPatientSectionRow[rowIndex].columns[
                                                        currentPatientSectionColumnIndexForEdit
                                                    ].value.styles['font-size'].value
                                                "
                                                type="number"
                                                class="w-[40px] border !border-transparent py-0 pl-[2px] pr-0"
                                                @change="
                                                    (e) => {
                                                        currentPatientSectionRow[rowIndex].columns[
                                                            currentPatientSectionColumnIndexForEdit
                                                        ].value.styles['font-size'].value =
                                                            e.target.value <= 0 ? '0' : e.target.value.toString();
                                                    }
                                                "
                                            />
                                            {{
                                                ' ' +
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].value.styles['font-size'].unit
                                            }}
                                        </div>
                                        <div class="flex flex-col">
                                            <img
                                                src="~/assets/images/preview/patientSection/UpArrow.svg"
                                                @click.stop="
                                                    () => {
                                                        currentPatientSectionRow[rowIndex].columns[
                                                            currentPatientSectionColumnIndexForEdit
                                                        ].value.styles['font-size'].value = (
                                                            Number(
                                                                currentPatientSectionRow[rowIndex].columns[
                                                                    currentPatientSectionColumnIndexForEdit
                                                                ].value.styles['font-size'].value,
                                                            ) + 0.1
                                                        ).toFixed(1);
                                                    }
                                                "
                                            />
                                            <img
                                                src="~/assets/images/preview/patientSection/DownArrow.svg"
                                                @click.stop="
                                                    () => {
                                                        if (
                                                            currentPatientSectionRow[rowIndex].columns[
                                                                currentPatientSectionColumnIndexForEdit
                                                            ].value.styles['font-size'].value > 0
                                                        )
                                                            currentPatientSectionRow[rowIndex].columns[
                                                                currentPatientSectionColumnIndexForEdit
                                                            ].value.styles['font-size'].value = (
                                                                Number(
                                                                    currentPatientSectionRow[rowIndex].columns[
                                                                        currentPatientSectionColumnIndexForEdit
                                                                    ].value.styles['font-size'].value,
                                                                ) - 0.1
                                                            ).toFixed(1);
                                                    }
                                                "
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Font Weight</div>
                                <USelectMenu
                                    v-model="
                                        currentPatientSectionRow[rowIndex].columns[
                                            currentPatientSectionColumnIndexForEdit
                                        ].value.styles['font-weight'].value
                                    "
                                    :options="['400', '500', '600', '700']"
                                    placeholder="Select Font Weight"
                                    :ui="{ base: 'w-[98px] h-[48px]' }"
                                />
                            </div>
                        </div>
                        <div class="flex items-center gap-6">
                            <div class="w-1/4 text-[15px] font-bold leading-[22px] text-[#1E293B]">Border</div>
                            <div class="flex flex-grow gap-0">
                                <button
                                    class="h-[44px] w-[94px] rounded-l-md border border-[#E2E8F0] text-sm"
                                    :class="{
                                        'bg-[#136AFB] text-white':
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].value.styles['border-left-width'].value !== '',
                                    }"
                                    @click="
                                        currentPatientSectionRow[rowIndex].columns[
                                            currentPatientSectionColumnIndexForEdit
                                        ].value.styles['border-left-width'].value =
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].value.styles['border-left-width'].value === ''
                                                ? '1'
                                                : ''
                                    "
                                >
                                    Left
                                </button>
                                <button
                                    class="h-[44px] w-[94px] border border-[#E2E8F0] text-sm"
                                    :class="{
                                        'border-l-[#136AFB] bg-[#136AFB] text-white':
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].value.styles['border-right-width'].value !== '',
                                    }"
                                    @click="
                                        currentPatientSectionRow[rowIndex].columns[
                                            currentPatientSectionColumnIndexForEdit
                                        ].value.styles['border-right-width'].value =
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].value.styles['border-right-width'].value === ''
                                                ? '1'
                                                : ''
                                    "
                                >
                                    Right
                                </button>
                                <button
                                    class="h-[44px] w-[94px] border border-[#E2E8F0] text-sm"
                                    :class="{
                                        'border-l-[#136AFB] bg-[#136AFB] text-white':
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].value.styles['border-top-width'].value !== '',
                                    }"
                                    @click="
                                        currentPatientSectionRow[rowIndex].columns[
                                            currentPatientSectionColumnIndexForEdit
                                        ].value.styles['border-top-width'].value =
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].value.styles['border-top-width'].value === ''
                                                ? '1'
                                                : ''
                                    "
                                >
                                    Top
                                </button>
                                <button
                                    class="h-[44px] w-[94px] rounded-r-md border border-[#E2E8F0] text-sm"
                                    :class="{
                                        'rounded-r-md border-l-[#136AFB] bg-[#136AFB] text-white':
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].value.styles['border-bottom-width'].value !== '',
                                    }"
                                    @click="
                                        currentPatientSectionRow[rowIndex].columns[
                                            currentPatientSectionColumnIndexForEdit
                                        ].value.styles['border-bottom-width'].value =
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].value.styles['border-bottom-width'].value === ''
                                                ? '1'
                                                : ''
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].value.styles['padding-left'].value
                                        "
                                        type="number"
                                        class="h-[22px] w-[40px] !border-[0px] p-0 pl-2 text-sm focus:outline-transparent"
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].value.styles['padding-left'].value =
                                                    e.target.value <= 0 ? '0' : e.target.value.toString();
                                            }
                                        "
                                    />
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].value.styles['padding-right'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].value.styles['padding-right'].value =
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].value.styles['padding-top'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].value.styles['padding-top'].value =
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
                                        class="flex h-[22px] w-[24px] items-end justify-center border border-[#CBD5E1]"
                                    >
                                        <div class="mb-1 h-[2px] w-[18px] border border-[#000000] bg-[#000000]"></div>
                                    </div>
                                    <input
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].value.styles['padding-bottom'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].value.styles['padding-bottom'].value =
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].value.styles['margin-left'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].value.styles['margin-left'].value =
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].value.styles['margin-right'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].value.styles['margin-right'].value =
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].value.styles['margin-top'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].value.styles['margin-top'].value =
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
                                        v-model="
                                            currentPatientSectionRow[rowIndex].columns[
                                                currentPatientSectionColumnIndexForEdit
                                            ].value.styles['margin-bottom'].value
                                        "
                                        @change="
                                            (e) => {
                                                currentPatientSectionRow[rowIndex].columns[
                                                    currentPatientSectionColumnIndexForEdit
                                                ].value.styles['margin-bottom'].value =
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
                </template>
            </UTabs>
        </div>
    </div>
</template>
<script setup lang="ts">
import { offset, useFloating } from '@floating-ui/vue';

const patientSectionLayoutStore = useLayoutsPatientSectionStore();
const { fields } = useConfigsStore();

const { currentPatientSectionRow, currentPatientSectionColumnItem } = storeToRefs(patientSectionLayoutStore);

const props = defineProps({
    rowIndex: {
        type: Number,
        required: true,
    },
});

const items = [
    {
        label: 'Section',
        // content: 'This is the content shown for Tab1',
    },
    {
        label: 'Label',

        // content: 'And, this is the content for Tab2',
    },
    {
        label: 'Value',

        // content: 'Finally, this is the content for Tab3',
    },
];

const selectedSectionTypes = ref<string[]>([]);

const currentPatientSectionColumnIndexForEdit = ref<null | number>(null);

const columnForEdit = computed(
    () => currentPatientSectionRow.value[props.rowIndex].columns[currentPatientSectionColumnIndexForEdit.value],
);

const isCurrentPatientSectionColumnEdit = ref<boolean>(false);

const isCurrentPatientSectionRowEdit = ref<boolean>(false);

const isAddNewColumnSectionEdit = ref<boolean>(false);

const reference = ref(null);
const floating = ref(null);

const { floatingStyles } = useFloating(reference, floating, {
    placement: 'left-start',
    middleware: [
        offset({
            mainAxis: 50,
            crossAxis: -50,
        }),
    ],
});

const referencePatientSectionRow = ref(null);
const floatingPatientSectionColumnEditor = ref(null);

const { floatingStyles: floatingStylesForColumnConfigEditor } = useFloating(
    referencePatientSectionRow,
    floatingPatientSectionColumnEditor,
    {
        placement: 'bottom',
    },
);

const referencePatientSectionRowSettings = ref(null);
const floatingPatientSectionRowEditor = ref(null);

const { floatingStyles: floatingStylesForRowConfigEditor } = useFloating(
    referencePatientSectionRowSettings,
    floatingPatientSectionRowEditor,
    {
        placement: 'right-start',
        middleware: [
            offset({
                mainAxis: 10,
            }),
        ],
    },
);

onClickOutside(floating, () => (isAddNewColumnSectionEdit.value = false));

onClickOutside(floatingPatientSectionColumnEditor, () => {
    isCurrentPatientSectionColumnEdit.value = false;
    currentPatientSectionColumnIndexForEdit.value = null;
    currentPatientSectionColumnItem.value = '';
});

onClickOutside(floatingPatientSectionRowEditor, () => (isCurrentPatientSectionRowEdit.value = false));

function openCurrentPatientSectionColumnConfigEditor(indexOfCurrentPatientSectionColumn: number) {
    currentPatientSectionColumnIndexForEdit.value = indexOfCurrentPatientSectionColumn;
    currentPatientSectionColumnItem.value =
        currentPatientSectionRow.value[props.rowIndex].columns[indexOfCurrentPatientSectionColumn].item;
    isCurrentPatientSectionColumnEdit.value = true;
}

function openCurrentPatientSectionRowConfigEditor() {
    isCurrentPatientSectionRowEdit.value = true;
}

function addColumn(value: string) {
    if (currentPatientSectionRow.value.length === 0)
        currentPatientSectionRow.value.push(
            JSON.parse(JSON.stringify(patientSectionLayoutStore.defaultPatientSectionRow)),
        );

    patientSectionLayoutStore.defaultColumn.item = value;
    patientSectionLayoutStore.defaultColumn.label.text = fields?.patient_info.find((info) => info.value === value)?.name;

    currentPatientSectionRow.value[props.rowIndex].columns.push(
        JSON.parse(JSON.stringify(patientSectionLayoutStore.defaultColumn)),
    );
}

function removeColumn(value: string) {
    currentPatientSectionRow.value[props.rowIndex].columns = currentPatientSectionRow.value[
        props.rowIndex
    ].columns.filter((column) => column.item !== value);
    selectedSectionTypes.value = selectedSectionTypes.value.filter((type) => type !== value);
}

function removeColumnByIndex(index: number, value: string) {
    currentPatientSectionRow.value[props.rowIndex].columns.splice(index, 1);
    if (!currentPatientSectionRow.value[props.rowIndex].columns.some((x) => x.item === value))
        selectedSectionTypes.value = selectedSectionTypes.value.filter((type) => type !== value);
}

function increaseSectionWidth(index: number) {
    if (currentPatientSectionRow.value[props.rowIndex].columns[index].styles.width.unit === '%') {
        currentPatientSectionRow.value[props.rowIndex].columns[index].styles.width.value = (
            Number(currentPatientSectionRow.value[props.rowIndex].columns[index].styles.width.value) + 10
        ).toString();
    }

    if (currentPatientSectionRow.value[props.rowIndex].columns[index].styles.width.unit === 'in') {
        currentPatientSectionRow.value[props.rowIndex].columns[index].styles.width.value = (
            Number(currentPatientSectionRow.value[props.rowIndex].columns[index].styles.width.value) + 0.1
        ).toFixed(1);
    }
}

function decreaseSectionWidth(index: number) {
    if (currentPatientSectionRow.value[props.rowIndex].columns[index].styles.width.unit === '%') {
        currentPatientSectionRow.value[props.rowIndex].columns[index].styles.width.value = (
            Number(currentPatientSectionRow.value[props.rowIndex].columns[index].styles.width.value) - 10
        ).toString();
    }

    if (currentPatientSectionRow.value[props.rowIndex].columns[index].styles.width.unit === 'in') {
        currentPatientSectionRow.value[props.rowIndex].columns[index].styles.width.value = (
            Number(currentPatientSectionRow.value[props.rowIndex].columns[index].styles.width.value) - 0.1
        ).toFixed(1);
    }
}

function removePatientSectionRow() {
    currentPatientSectionRow.value.splice(props.rowIndex, 1);
}

onMounted(() => {
    currentPatientSectionRow.value[props.rowIndex].columns.forEach((column) => {
        if (!selectedSectionTypes.value.includes(column.item)) {
            selectedSectionTypes.value.push(column.item);
        }
    });
});
</script>
