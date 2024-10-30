<!-- eslint-disable prettier/prettier -->
<template>
    <!-- Scrollable container with overflow auto -->
    <div class="w-full">
        <input
            ref="inputField"
            v-model="inputValue"
            type="text"
            placeholder="Duration"
            class="h-[48px] w-full"
            @focus="onFocus"
            @keydown="(e) => e.preventDefault()"
            @keydown.enter="onKeyDownEnter"
        />
        <!-- Teleport the floating calculator to body -->
        <teleport to="#teleports">
            <div
                v-if="isCalculatorShown"
                ref="floatingCalculator"
                class="fixed z-[9999]"
            >
                <div class="flex w-[224px] gap-1 rounded-[4px] bg-[#FFFFFF] p-1 text-sm">
                    <div class="flex w-2/3 flex-shrink flex-grow flex-col gap-1">
                        <div class="flex h-1/4 w-full gap-1">
                            <button
                                class="h-full w-1/3 bg-[#F8FAFC] active:bg-slate-300 disabled:opacity-50"
                                @click="addNumber(durationValues.number.one)"
                            >
                                {{ inputDurationLangValue == 'en' ? 1 : '১' }}
                            </button>
                            <button
                                class="h-full w-1/3 bg-[#F8FAFC] active:bg-slate-300 disabled:opacity-50"
                                @click="addNumber(durationValues.number.two)"
                            >
                                {{ inputDurationLangValue == 'en' ? 2 : '২' }}
                            </button>
                            <button
                                class="h-full w-1/3 bg-[#F8FAFC] active:bg-slate-300 disabled:opacity-50"
                                @click="addNumber(durationValues.number.three)"
                            >
                                {{ inputDurationLangValue == 'en' ? 3 : '৩' }}
                            </button>
                        </div>
                        <div class="flex h-1/4 w-full gap-1">
                            <button
                                class="h-full w-1/3 bg-[#F8FAFC] active:bg-slate-300 disabled:opacity-50"
                                @click="addNumber(durationValues.number.four)"
                            >
                                {{ inputDurationLangValue == 'en' ? 4 : '৪' }}
                            </button>
                            <button
                                class="h-full w-1/3 bg-[#F8FAFC] active:bg-slate-300 disabled:opacity-50"
                                @click="addNumber(durationValues.number.five)"
                            >
                                {{ inputDurationLangValue == 'en' ? 5 : '৫' }}
                            </button>
                            <button
                                class="h-full w-1/3 bg-[#F8FAFC] active:bg-slate-300 disabled:opacity-50"
                                @click="addNumber(durationValues.number.six)"
                            >
                                {{ inputDurationLangValue == 'en' ? 6 : '৬' }}
                            </button>
                        </div>
                        <div class="flex h-1/4 w-full gap-1">
                            <button
                                class="h-full w-1/3 bg-[#F8FAFC] active:bg-slate-300 disabled:opacity-50"
                                @click="addNumber(durationValues.number.seven)"
                            >
                                {{ inputDurationLangValue == 'en' ? 7 : '৭' }}
                            </button>
                            <button
                                class="h-full w-1/3 bg-[#F8FAFC] active:bg-slate-300 disabled:opacity-50"
                                @click="addNumber(durationValues.number.eight)"
                            >
                                {{ inputDurationLangValue == 'en' ? 8 : '৮' }}
                            </button>
                            <button
                                class="h-full w-1/3 bg-[#F8FAFC] active:bg-slate-300 disabled:opacity-50"
                                @click="addNumber(durationValues.number.nine)"
                            >
                                {{ inputDurationLangValue == 'en' ? 9 : '৯' }}
                            </button>
                        </div>
                        <div class="flex h-1/4 w-full gap-1">
                            <button
                                class="h-full w-1/3 bg-[#F8FAFC] active:bg-slate-300 disabled:opacity-50"
                                @click="toggleLanguage()"
                            >
                                {{ inputDurationLangValue == 'en' ? 'বাংলা' : 'Eng' }}
                            </button>
                            <button
                                class="h-full w-1/3 bg-[#F8FAFC] active:bg-slate-300 disabled:opacity-50"
                                @click="addNumber(durationValues.number.zero)"
                            >
                                {{ inputDurationLangValue == 'en' ? 0 : '০' }}
                            </button>
                            <button
                                class="flex h-full w-1/3 items-center justify-center bg-[#F8FAFC] active:bg-slate-300 disabled:opacity-50"
                                @click="removeNumber()"
                            >
                                <svg
                                    width="18"
                                    height="14"
                                    viewBox="0 0 18 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M15.0859 1H7.15101C5.99756 1 4.90026 1.49792 4.1407 2.36598L1.23832 5.68299C0.578525 6.43704 0.578525 7.56296 1.23832 8.31701L4.1407 11.634C4.90026 12.5021 5.99756 13 7.15101 13H15.0859C15.4838 13 15.8653 12.842 16.1466 12.5607C16.4279 12.2794 16.5859 11.8978 16.5859 11.5V2.5C16.5859 2.10218 16.4279 1.72064 16.1466 1.43934C15.8653 1.15804 15.4838 1 15.0859 1Z"
                                        stroke="#1E293B"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M12.3359 4.75L7.83594 9.25"
                                        stroke="#1E293B"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M7.83594 4.75L12.3359 9.25"
                                        stroke="#1E293B"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="flex w-1/3 flex-col gap-1">
                        <button
                            v-if="shownDurationTypes.includes(durationValues.type.day)"
                            class="w-full border border-[#E2E8F0] py-1 active:bg-slate-300 disabled:opacity-50"
                            :class="
                                inputDurationTypeValue === durationValues.type.day ? ' bg-primary-500 text-white' : ''
                            "
                            :disabled="!inputDurationNumberValue"
                            @click="addDurationType(durationValues.type.day)"
                        >
                            {{ inputDurationLangValue === 'en' ? 'Day' : 'দিন'
                            }}{{ isInputIsMoreThanOne() && inputDurationLangValue === 'en' ? 's' : '' }}
                        </button>
                        <button
                            v-if="shownDurationTypes.includes(durationValues.type.week)"
                            class="w-full border border-[#E2E8F0] py-1 active:bg-slate-300 disabled:opacity-50"
                            :class="
                                inputDurationTypeValue === durationValues.type.week ? ' bg-primary-500 text-white' : ''
                            "
                            :disabled="!inputDurationNumberValue"
                            @click="addDurationType(durationValues.type.week)"
                        >
                            {{ inputDurationLangValue === 'en' ? 'Week' : 'সপ্তাহ'
                            }}{{ isInputIsMoreThanOne() && inputDurationLangValue === 'en' ? 's' : '' }}
                        </button>
                        <button
                            v-if="shownDurationTypes.includes(durationValues.type.month)"
                            class="w-full border border-[#E2E8F0] py-1 active:bg-slate-300 disabled:opacity-50"
                            :class="
                                inputDurationTypeValue === durationValues.type.month ? ' bg-primary-500 text-white' : ''
                            "
                            :disabled="!inputDurationNumberValue"
                            @click="addDurationType(durationValues.type.month)"
                        >
                            {{ inputDurationLangValue === 'en' ? 'Month' : 'মাস'
                            }}{{ isInputIsMoreThanOne() && inputDurationLangValue === 'en' ? 's' : '' }}
                        </button>
                        <button
                            v-if="shownDurationTypes.includes(durationValues.type.year)"
                            class="w-full border border-[#E2E8F0] py-1 active:bg-slate-300 disabled:opacity-50"
                            :class="
                                inputDurationTypeValue === durationValues.type.year ? ' bg-primary-500 text-white' : ''
                            "
                            :disabled="!inputDurationNumberValue"
                            @click="addDurationType(durationValues.type.year)"
                        >
                            {{ inputDurationLangValue === 'en' ? 'Year' : 'বছর'
                            }}{{ isInputIsMoreThanOne() && inputDurationLangValue === 'en' ? 's' : '' }}
                        </button>
                        <button
                            v-if="shownDurationTypes.includes(durationValues.type.once)"
                            class="w-full border border-[#E2E8F0] py-1 active:bg-slate-300"
                            :class="
                                inputDurationTypeValue === durationValues.type.once ? ' bg-primary-500 text-white' : ''
                            "
                            @click="addDurationType(durationValues.type.once)"
                        >
                            {{ inputDurationLangValue === 'en' ? 'Once' : 'একবার' }}
                        </button>
                        <button
                            v-if="shownDurationTypes.includes(durationValues.type.continue)"
                            class="w-full border border-[#E2E8F0] py-1 active:bg-slate-300"
                            :class="
                                inputDurationTypeValue === durationValues.type.continue
                                    ? ' bg-primary-500 text-white'
                                    : ''
                            "
                            @click="addDurationType(durationValues.type.continue)"
                        >
                            {{ inputDurationLangValue === 'en' ? `Cont.` : 'চলবে' }}
                        </button>
                        <button
                            v-if="shownDurationTypes.includes(durationValues.type.not_required)"
                            class="w-full border border-[#E2E8F0] py-1 active:bg-slate-300"
                            :class="
                                inputDurationTypeValue === durationValues.type.not_required
                                    ? ' bg-primary-500 text-white'
                                    : ''
                            "
                            @click="addDurationType(durationValues.type.not_required)"
                        >
                            N/A
                        </button>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { number } from 'zod';
import type { duration_locale_persist_store_types } from '~/repository/modules/ConfigModule/types';

// Props for initial values
const props = defineProps({
    modelValueDurationNumber: {
        type: String,
        default: '',
    },
    modelValueDurationType: {
        type: String,
        default: '',
    },
    modelValueDurationLang: {
        type: String,
        default: 'en',
    },
    shownDurationTypes: {
        type: Array as PropType<string[]>, // Declare as array of strings
        default: () => [],
    },
    durationLocalePersistStoreType: {
        type: String as PropType<keyof duration_locale_persist_store_types>,
        default: '',
    },
});

const SettingStore = useSettingsStore();
const { durationLocales } = storeToRefs(SettingStore);
function determineLocale() {
    if (!props.modelValueDurationNumber && !props.modelValueDurationType)
        return durationLocales.value[props.durationLocalePersistStoreType] || props.modelValueDurationLang;

    if (props.modelValueDurationNumber || props.modelValueDurationType) return props.modelValueDurationLang;
}

const inputDurationNumberValue = ref(props.modelValueDurationNumber || '');
const inputDurationTypeValue = ref(props.modelValueDurationType || '');
const inputDurationLangValue = ref(determineLocale());

// if (!props.modelValueDurationNumber && !props.modelValueDurationType) {
//     SettingStore.setDurationLocale(
//         props.durationLocalePersistStoreType,
//         durationLocales.value[props.durationLocalePersistStoreType] || props.modelValueDurationLang,
//     );
// }

const emit = defineEmits([
    'update:modelValueDurationNumber',
    'update:modelValueDurationType',
    'update:modelValueDurationLang',
    'keyDownEnter',
]);

// Watchers for props to keep data synchronized
watch(
    () => props.modelValueDurationNumber,
    (newValue) => {
        inputDurationNumberValue.value = newValue;
    },
);

watch(
    () => props.modelValueDurationType,
    (newValue) => {
        inputDurationTypeValue.value = newValue;
    },
);

watch(
    () => props.modelValueDurationLang,
    (newValue) => {
        inputDurationLangValue.value = newValue;
        SettingStore.setDurationLocale(props.durationLocalePersistStoreType, newValue);
    },
);

function addNumber(number: string) {
    if (inputDurationTypeValue.value) {
        inputDurationNumberValue.value = '';
        inputDurationTypeValue.value = '';
    }

    if (inputDurationNumberValue.value.length < 3) {
        inputDurationNumberValue.value += number;

        emit('update:modelValueDurationNumber', inputDurationNumberValue.value);
    }

    updateLocale();
}

async function addDurationType(durationType: string) {
    inputDurationTypeValue.value = durationType;

    emit('update:modelValueDurationType', inputDurationTypeValue.value);

    await nextTick();

    if (inputDurationNumberValue.value || isNumberButtonsDisable()) {
        isCalculatorShown.value = false;
    }

    updateLocale();
}

function removeNumber() {
    if (inputDurationNumberValue.value.length > 0) {
        inputDurationNumberValue.value = inputDurationNumberValue.value.substring(
            0,
            inputDurationNumberValue.value.length - 1,
        );

        emit('update:modelValueDurationNumber', inputDurationNumberValue.value);
        updateLocale();
    }
}

// Function to update the language and emit the change
function toggleLanguage() {
    inputDurationLangValue.value = inputDurationLangValue.value === 'en' ? 'bn' : 'en';
    // emit('update:modelValueDurationLang', inputDurationLangValue.value);
    // SettingStore.setDurationLocale(props.durationLocalePersistStoreType, inputDurationLangValue.value);
    updateLocale();
}

function updateLocale() {
    emit('update:modelValueDurationLang', inputDurationLangValue.value);
    SettingStore.setDurationLocale(props.durationLocalePersistStoreType, inputDurationLangValue.value);
}

function isInputIsMoreThanOne() {
    return Number(inputDurationNumberValue.value) > 1;
}

const durationValues = {
    number: {
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
        six: '6',
        seven: '7',
        eight: '8',
        nine: '9',
        zero: '0',
    },
    type: {
        once: 'once',
        day: 'day',
        week: 'week',
        month: 'month',
        year: 'year',
        continue: 'continue',
        not_required: 'not_required',
    },
};

const { convertToBangla, convertDurationToBangla } = useBanglaNumbers();
const inputValue = computed(() => {
    if (!inputDurationNumberValue.value && !formatedDurationType()) return '';

    if (inputDurationNumberValue.value || inputDurationTypeValue.value) {
        if (inputDurationLangValue.value === 'bn')
            return convertToBangla(inputDurationNumberValue.value) + ' ' + formatedDurationType();

        return inputDurationNumberValue.value + ' ' + formatedDurationType();
    }

    return '';
});

function isNumberButtonsDisable() {
    return (
        inputDurationTypeValue.value === durationValues.type.not_required ||
        inputDurationTypeValue.value === durationValues.type.once ||
        inputDurationTypeValue.value === durationValues.type.continue
    );
}

watch(
    () => inputDurationTypeValue.value,
    (newValue) => {
        if (
            newValue === durationValues.type.not_required ||
            newValue === durationValues.type.once ||
            newValue === durationValues.type.continue
        ) {
            inputDurationNumberValue.value = '';
            emit('update:modelValueDurationNumber', '');
        }
    },
);

function formatedDurationType() {
    const durationType =
        inputDurationTypeValue.value === durationValues.type.not_required ? '' : inputDurationTypeValue.value;

    if (
        !inputDurationNumberValue.value &&
        inputDurationTypeValue.value !== durationValues.type.not_required &&
        inputDurationTypeValue.value !== durationValues.type.once &&
        inputDurationTypeValue.value !== durationValues.type.continue
    )
        return '';

    if (inputDurationLangValue.value === 'bn') {
        return convertDurationToBangla(durationType);
    } else {
        // eslint-disable-next-line no-lonely-if
        if (durationType.length > 0) return durationType + (Number(inputDurationNumberValue.value) > 1 ? 's' : '');
    }

    return durationType;
}

// Create refs for elements
const inputField = ref<HTMLElement | null>(null);
const floatingCalculator = ref<HTMLElement | null>(null);

let observer: any = null; // Declare the observer for later cleanup
const isCalculatorShown = ref<boolean>(false); // Flag to track whether input is focused

onClickOutside(
    floatingCalculator,
    () => {
        // floatingCalculator.value?.classList.add('hidden-class');
        isCalculatorShown.value = false;
        validateIfOnlyNumberIsGivenWithoutDurationType();
    },
    { ignore: [inputField] },
);

function validateIfOnlyNumberIsGivenWithoutDurationType() {
    if (inputDurationNumberValue.value && !inputDurationTypeValue.value.trim()) {
        inputDurationNumberValue.value = '';
        inputDurationTypeValue.value = '';
    }
}

// Function to position the calculator below the input
const positionCalculator = async () => {
    await nextTick();
    if (inputField?.value) {
        const inputRect = inputField?.value?.getBoundingClientRect();

        // Position the calculator relative to the viewport
        if (floatingCalculator.value) {
            floatingCalculator.value.style.position = 'fixed';
            floatingCalculator.value.style.top = `${inputRect.bottom}px`; // Below the input
            floatingCalculator.value.style.left = `${inputRect.left}px`; // Align with the input
        }

        // Only show the calculator if the input is focused
        // if (isCalculatorShown) {
        //     floatingCalculator.value?.classList.remove('hidden-class'); // Show the calculator
        // }
    }
};

// Intersection Observer callback function
const handleIntersect = (entries: any) => {
    entries.forEach((entry: any) => {
        if (entry.isIntersecting) {
            // Input is fully or partially visible, show and position the calculator if focused
            // positionCalculator();
            // console.log('is intersecting');
        } else {
            // Input is not visible, hide the calculator
            floatingCalculator?.value?.classList.add('hidden-class');
        }
    });
};

// Focus and blur event handlers
const onFocus = () => {
    isCalculatorShown.value = true; // Set focus flag
    positionCalculator(); // Position and show calculator when focused
};

// const onBlur = () => {
//     isFocused = false; // Clear focus flag
//     // setTimeout(() => {
//     //     floatingCalculator?.value?.classList.add('hidden-class');
//     // }, 200); // Delay for demo purposes, in case you want to interact with the calculator
// };

const onKeyDownEnter = () => {
    emit('keyDownEnter');
    isCalculatorShown.value = false;
};

// Setup and cleanup logic
onMounted(() => {
    observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry: IntersectionObserverEntry) => {
                if (!entry.isIntersecting) {
                    // Input is fully or partially visible, show and position the calculator if focused
                    // positionCalculator();
                    // console.log('is intersecting',entry.intersectionRatio);
                    // floatingCalculator?.value?.classList.add('hidden-class');
                    isCalculatorShown.value = false;
                    inputField.value?.blur();

                    validateIfOnlyNumberIsGivenWithoutDurationType();
                }
            });
        },
        { root: document.querySelector('.modal'), threshold: 0.1 },
    );
    observer.observe(inputField.value);

    const resizeListener = () => positionCalculator();
    window.addEventListener('resize', resizeListener);

    const scrollListener = () => positionCalculator();
    window.addEventListener('scroll', scrollListener, true);

    positionCalculator();

    // Add global click listener in capture mode
    // document.addEventListener(
    //     'click',
    //     (event) => {
    //         if (floatingCalculator.value?.contains(event.target as Node)) {
    //             event.stopPropagation(); // Stop the event as early as possible
    //         }
    //     },
    //     true, // Capture phase
    // );

    onUnmounted(() => {
        if (observer) observer.disconnect();
        window.removeEventListener('resize', resizeListener);
        window.removeEventListener('scroll', scrollListener);

        console.log('unmounted worked');

        // Remove global click listener
        // document.removeEventListener('click', (event) => {
        //     if (floatingCalculator.value?.contains(event.target as Node)) {
        //         event.stopPropagation();
        //     }
        // });
    });
});
</script>

<style scoped>
.hidden-class {
    display: none;
}
</style>
