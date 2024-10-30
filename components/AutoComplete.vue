<template>
    <div :class="['autocomplete', rootClass]">
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
                :placeholder="props.placeholder"
                :class="[
                    'min-h-12 w-full rounded-md border border-gray-300 px-4 py-2 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500',
                    inputClass,
                ]"
            />
            <div class="loading-icon-container absolute right-2 flex items-center">
                <slot
                    name="loading-icon"
                    :isLoading="isLoading"
                >
                    <div
                        v-if="isLoading"
                        class="loading-icon text-xl"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                            class="h-4 w-4 animate-spin text-slate-500"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </div>
                </slot>
            </div>
        </div>
        <teleport to="body">
            <ul
                v-if="computedShowSuggestions && suggestions.length > 0"
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
                    :suggestions="suggestions"
                    :highlightedIndex="highlightedIndex"
                    :selectSuggestion="selectSuggestion"
                    :onMouseOver="onMouseOver"
                ></slot>
                <template v-else>
                    <li
                        v-for="(suggestion, index) in suggestions"
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

export interface Suggestion {
    name: string;
}

interface Props {
    modelValue: string;
    isOpen?: boolean;
    fetchSuggestions: (query: string) => Promise<Suggestion[]>;
    initialSuggestions?: Suggestion[];
    autofocus?: boolean;
    rootClass?: string;
    inputParentClass?: string;
    inputClass?: string;
    ulClass?: string;
    liClass?: string;
    useSearchApi?: boolean; // Prop to control whether API search or local filtering is used
    initialApiCall?: boolean; // Prop to control if API should be called initially
    placeholder?: string;
}

interface Emit {
    (event: 'update:modelValue', value: string): void;
    (event: 'select', suggestion: Suggestion): void;
    (event: 'onEnter', value: string): void; // New event for handling Enter key press on input
}

const props = withDefaults(defineProps<Props>(), {
    isOpen: true,
    initialSuggestions: () => [],
    autofocus: false,
    rootClass: '',
    inputParentClass: '',
    inputClass: '',
    ulClass: '',
    liClass: '',
    useSearchApi: true, // Default to true, meaning API will be used unless specified otherwise
    initialApiCall: true, // Default to true, meaning API will call initially if useSearchApi is true
    placeholder: 'Search...',
});

const emit = defineEmits<Emit>();

// State
const internalValue = ref<string>(props.modelValue);
const suggestions = ref<Suggestion[]>(props.initialSuggestions);
const showSuggestions = ref<boolean>(false);
const suggestionStyle = ref<Record<string, string>>({});
const debounceTimeout = ref<number | null>(null);
const highlightedIndex = ref<number>(-1); // Reset the index to -1 initially
const isInputVisible = ref<boolean>(true);
const isLoading = ref<boolean>(false);
const inputElement = ref<HTMLInputElement | null>(null);
const suggestionList = ref<HTMLElement | null>(null);

// Watch modelValue prop to sync internalValue
watch(
    () => props.modelValue,
    (newValue) => {
        internalValue.value = newValue;
    },
);

// Computed property for showing suggestions
const computedShowSuggestions = computed<boolean>(() => {
    return props.isOpen && showSuggestions.value && isInputVisible.value && suggestions.value?.length > 0;
});

// Handle input events
const onInput = () => {
    showSuggestions.value = true;
    highlightedIndex.value = -1; // Reset the index when input changes
    emit('update:modelValue', internalValue.value);
    debounceFetchSuggestions();
    updateSuggestionPosition();
};

// Handle focus events
const onFocus = () => {
    if (props.isOpen && isInputVisible.value) {
        showSuggestions.value = true;
        debounceFetchSuggestions();
        updateSuggestionPosition();
    }
};

// Keyboard navigation
const onArrowDown = () => {
    if (highlightedIndex.value < suggestions.value.length - 1) {
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
    // Only trigger select if dropdown is visible and a valid index is highlighted
    if (computedShowSuggestions.value && highlightedIndex.value !== -1) {
        selectSuggestion(suggestions.value[highlightedIndex.value]);
    } else {
        // Emit the onEnter event if the input is focused and no suggestion is selected
        emit('onEnter', internalValue.value);
    }
};

// Handle Escape key
const onEsc = () => {
    showSuggestions.value = false;
    highlightedIndex.value = -1; // Reset the index when the dropdown is closed
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
        // Filter from initialSuggestions
        const filteredSuggestions =
            props.initialSuggestions?.filter((suggestion) =>
                suggestion.name.toLowerCase().includes(internalValue.value.toLowerCase()),
            ) || [];
        suggestions.value = filteredSuggestions;
    } else {
        // Fetch from API
        isLoading.value = true;
        try {
            const results = await props.fetchSuggestions(internalValue.value);
            suggestions.value = results;
        } finally {
            isLoading.value = false;
        }
    }

    // Reset the scroll of the suggestion list to the top
    await nextTick(); // Ensure the DOM is updated
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
    internalValue.value = suggestion.name;
    showSuggestions.value = false;
    suggestions.value = [];
    isLoading.value = false;
    emit('update:modelValue', internalValue.value);
    emit('select', suggestion);
};

// Handle blur event
const onBlur = () => {
    setTimeout(() => {
        showSuggestions.value = false;
        highlightedIndex.value = -1; // Reset the index when dropdown is hidden
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

    // Handle autofocus if the prop is true
    if (props.autofocus && inputElement.value) {
        inputElement.value.focus();
    }

    // Check if initialApiCall is true, and API should be used, then call the API initially
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
