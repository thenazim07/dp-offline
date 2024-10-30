<template>
    <div
        ref="autocompleteContainer"
        :class="['autocomplete', rootClass]"
    >
        <div :class="['input-container relative flex items-center', inputParentClass]">
            <input
                v-model="internalValue"
                @input="onInput"
                @focus="onFocus"
                @blur="onBlur"
                @keydown.down.prevent="onArrowDown"
                @keydown.up.prevent="onArrowUp"
                @keydown.enter.prevent="onEnter"
                @keydown.esc.prevent="onEsc"
                ref="inputElement"
                type="text"
                placeholder="Search..."
                :style="inputStyle"
                :class="[
                    'w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
                    inputClass,
                ]"
            />
            <!-- Clear button, only visible when an option is selected -->
            <button
                v-if="selectedSuggestion"
                @click="clearSelection"
                class="absolute right-8 text-gray-500 hover:text-gray-700"
            >
                ✕
            </button>
            <div class="loading-icon-container absolute right-2 flex items-center">
                <slot
                    name="loading-icon"
                    :isLoading="isLoading"
                >
                    <div
                        v-if="isLoading"
                        class="loading-icon text-xl"
                    >
                        🔄
                    </div>
                </slot>
            </div>
        </div>
        <teleport to="body">
            <ul
                v-if="computedShowSuggestions && filteredSuggestions.length > 0"
                :style="suggestionStyle"
                ref="suggestionList"
                :class="[
                    'suggestion-list absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg',
                    ulClass,
                ]"
            >
                <slot
                    v-if="$slots.default"
                    name="default"
                    :suggestions="filteredSuggestions"
                    :highlightedIndex="highlightedIndex"
                    :selectSuggestion="selectSuggestion"
                    :onMouseOver="onMouseOver"
                ></slot>
                <template v-else>
                    <li
                        v-for="(suggestion, index) in filteredSuggestions"
                        :key="index"
                        :class="['cursor-pointer px-4 py-2', liClass, { 'bg-gray-200': index === highlightedIndex }]"
                        @mousedown.prevent="selectSuggestion(suggestion)"
                        @mouseover="onMouseOver(index)"
                    >
                        {{ suggestion.name }}
                    </li>
                </template>
            </ul>
        </teleport>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue';

interface Suggestion {
    [key: string]: any;
}

interface Props {
    modelValue: any;
    isOpen?: boolean;
    fetchSuggestions: (query: string) => Promise<Suggestion[]>;
    initialSuggestions?: Suggestion[];
    autofocus?: boolean;
    valueKey?: string; // Dynamic key for v-model
    rootClass?: string;
    inputParentClass?: string;
    inputClass?: string;
    ulClass?: string;
    liClass?: string;
    useSearchApi?: boolean;
    initialApiCall?: boolean;
}

interface Emit {
    (event: 'update:modelValue', value: any): void;
    (event: 'select', suggestion: Suggestion): void;
}

const props = withDefaults(defineProps<Props>(), {
    isOpen: true,
    initialSuggestions: () => [],
    autofocus: false,
    valueKey: '',
    rootClass: '',
    inputParentClass: '',
    inputClass: '',
    ulClass: '',
    liClass: '',
    useSearchApi: true,
    initialApiCall: true,
});

const emit = defineEmits<Emit>();

// State
const internalValue = ref<string>(''); // Track input separately from v-model
const suggestions = ref<Suggestion[]>(props.initialSuggestions);
const filteredSuggestions = ref<Suggestion[]>([]);
const showSuggestions = ref<boolean>(false);
const suggestionStyle = ref<Record<string, string>>({});
const debounceTimeout = ref<number | null>(null);
const highlightedIndex = ref<number>(-1);
const isInputVisible = ref<boolean>(true);
const isLoading = ref<boolean>(false);
const inputElement = ref<HTMLInputElement | null>(null);
const suggestionList = ref<HTMLElement | null>(null);
const autocompleteContainer = ref<HTMLElement | null>(null); // Ref for the entire autocomplete component
const selectedSuggestion = ref<Suggestion | null>(null);
const wasDropdownVisible = ref<boolean>(false); // Track if dropdown was previously visible

// Dynamic input style to add padding when the clear button is visible
const inputStyle = computed(() => {
    return selectedSuggestion.value
        ? { paddingRight: '2.5rem' } // Adjust padding to prevent overlap with the clear button
        : {};
});

// Watch modelValue prop to set the internal value
watch(
    () => props.modelValue,
    (newValue) => {
        if (newValue) {
            internalValue.value = props.valueKey ? newValue[props.valueKey] : newValue;
        } else {
            internalValue.value = '';
        }
    },
    { immediate: true },
);

// Computed property for showing suggestions
const computedShowSuggestions = computed<boolean>(() => {
    return showSuggestions.value && filteredSuggestions.value.length > 0;
});

// Handle input events
const onInput = () => {
    // Only update internalValue, don't emit v-model change
    showSuggestions.value = true;
    highlightedIndex.value = -1; // Reset the index when input changes
    debounceFetchSuggestions();
    updateSuggestionPosition();
};

// Handle focus events
const onFocus = () => {
    wasDropdownVisible.value = true;
    showSuggestions.value = true;
    debounceFetchSuggestions();
    updateSuggestionPosition();
};

// Handle clicking outside of the component
const handleClickOutside = (event: Event) => {
    if (autocompleteContainer.value && !autocompleteContainer.value.contains(event.target as Node)) {
        showSuggestions.value = false;
    }
};

// Add event listener for detecting clicks outside the component
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

// Keyboard navigation
const onArrowDown = () => {
    if (highlightedIndex.value < filteredSuggestions.value.length - 1) {
        highlightedIndex.value++;
        scrollToHighlightedItem();
    }
};

const onArrowUp = () => {
    if (highlightedIndex.value > 0) {
        highlightedIndex.value--;
        scrollToHighlightedItem();
    }
};

// Handle Enter key
const onEnter = () => {
    if (computedShowSuggestions.value && highlightedIndex.value !== -1) {
        selectSuggestion(filteredSuggestions.value[highlightedIndex.value]);
    }
};

// Handle Escape key
const onEsc = () => {
    if (wasDropdownVisible.value) {
        showSuggestions.value = false;
        highlightedIndex.value = -1;
        wasDropdownVisible.value = false;
    }
};

// Handle mouseover events
const onMouseOver = (index: number) => {
    highlightedIndex.value = index;
};

// Debounce API or local search
const debounceFetchSuggestions = () => {
    if (debounceTimeout.value) {
        clearTimeout(debounceTimeout.value);
    }
    debounceTimeout.value = window.setTimeout(() => {
        fetchSuggestionsCallback();
    }, 300);
};

// Fetch suggestions from API or filter locally
const fetchSuggestionsCallback = async () => {
    if (!props.useSearchApi) {
        const filtered =
            props.initialSuggestions?.filter((suggestion) =>
                suggestion.name.toLowerCase().includes(internalValue.value.toLowerCase()),
            ) || [];
        filteredSuggestions.value = filtered;
    } else {
        isLoading.value = true;
        try {
            const results = await props.fetchSuggestions(internalValue.value);
            filteredSuggestions.value = results;
        } finally {
            isLoading.value = false;
        }
    }

    if (filteredSuggestions.value.length > 0) {
        showSuggestions.value = true;
    }

    await nextTick();
    resetScrollToTop();
    updateSuggestionPosition();
};

// Function to reset the scroll of the dropdown list to the top
const resetScrollToTop = () => {
    if (suggestionList.value) {
        suggestionList.value.scrollTop = 0;
    }
};

// Select a suggestion
const selectSuggestion = (suggestion: Suggestion) => {
    internalValue.value = suggestion[props.valueKey || 'name'];
    selectedSuggestion.value = suggestion;
    showSuggestions.value = false;
    filteredSuggestions.value = [];
    isLoading.value = false;

    // Emit the whole object if no key is specified, otherwise emit the value of the specified key
    const emitValue = props.valueKey ? suggestion[props.valueKey] : suggestion;
    emit('update:modelValue', emitValue);
    emit('select', suggestion);
};

// Clear selection method
const clearSelection = () => {
    internalValue.value = '';
    selectedSuggestion.value = null;
    emit('update:modelValue', ''); // Emit the cleared value
};

// Handle blur event
const onBlur = () => {
    setTimeout(() => {
        if (!selectedSuggestion.value) {
            internalValue.value = '';
        } else {
            internalValue.value = selectedSuggestion.value[props.valueKey || 'name'];
        }
        wasDropdownVisible.value = showSuggestions.value;
        showSuggestions.value = false;
        highlightedIndex.value = -1;
    }, 200);
};

// Update the position of the suggestion list
const updateSuggestionPosition = () => {
    if (inputElement.value) {
        const inputRect = inputElement.value.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const spaceBelow = windowHeight - inputRect.bottom;
        const spaceAbove = inputRect.top;

        if (spaceBelow < 200 && spaceAbove > 200) {
            suggestionStyle.value = {
                position: 'fixed',
                bottom: `${windowHeight - inputRect.top}px`,
                left: `${inputRect.left}px`,
                width: `${inputRect.width}px`,
                zIndex: '9999',
            };
        } else {
            suggestionStyle.value = {
                position: 'fixed',
                top: `${inputRect.bottom}px`,
                left: `${inputRect.left}px`,
                width: `${inputRect.width}px`,
                zIndex: '9999',
            };
        }
    }
};

// Scroll to highlighted suggestion
const scrollToHighlightedItem = () => {
    if (suggestionList.value && highlightedIndex.value !== -1) {
        const highlightedItem = suggestionList.value.children[highlightedIndex.value] as HTMLElement;

        if (highlightedItem) {
            const itemTop = highlightedItem.offsetTop;
            const itemBottom = itemTop + highlightedItem.offsetHeight;
            const listScrollTop = suggestionList.value.scrollTop;
            const listHeight = suggestionList.value.clientHeight;

            if (itemBottom > listScrollTop + listHeight) {
                suggestionList.value.scrollTop = itemBottom - listHeight;
            } else if (itemTop < listScrollTop) {
                suggestionList.value.scrollTop = itemTop;
            }
        }
    }
};

// Observe visibility changes for input element
const observeVisibility = () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                isInputVisible.value = entry.isIntersecting;
                if (!isInputVisible.value) {
                    showSuggestions.value = false;
                }
            });
        },
        { root: document.querySelector('.modal'), threshold: 0.1 },
    );

    if (inputElement.value) {
        observer.observe(inputElement.value);
    }
};

// Set up lifecycle hooks
onMounted(() => {
    observeVisibility();

    if (props.autofocus && inputElement.value) {
        inputElement.value.focus();
    }

    if (props.useSearchApi && props.initialApiCall) {
        fetchSuggestionsCallback();
    }

    window.addEventListener('resize', updateSuggestionPosition);
    window.addEventListener('scroll', updateSuggestionPosition, true);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateSuggestionPosition);
    window.removeEventListener('scroll', updateSuggestionPosition, true);
});
</script>

<style scoped>
/* Tailwind classes are being used, no need for additional styling here */
</style>
