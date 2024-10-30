<template>
    <div
        ref="dropdownContainer"
        class="relative"
    >
        <!-- Button that shows the selected option -->
        <button
            @click="toggleDropdown"
            @keydown="handleKeydown"
            :class="['w-full cursor-pointer rounded border p-2 text-left', buttonClasses]"
            ref="inputElement"
        >
            {{ selectedLabel || 'Select an option' }}
        </button>

        <!-- Teleported dropdown list with overflow-hidden class -->
        <teleport to="#teleports">
            <div
                v-if="isOpen"
                :style="dropdownStyles"
                :class="['z-10 overflow-hidden rounded border bg-white shadow-md', dropdownWrapperClasses]"
            >
                <!-- Search input outside of the scrollable list, fixed at the top -->
                <div class="border-b p-2">
                    <input
                        ref="searchInput"
                        v-model="searchQuery"
                        @input="debounceSearch"
                        placeholder="Search..."
                        class="w-full p-2"
                        @keydown="handleKeydown"
                    />
                </div>

                <!-- Scrollable list of options -->
                <div
                    class="max-h-60 overflow-y-auto"
                    ref="dropdownList"
                >
                    <!-- Loading spinner -->
                    <div
                        v-if="isLoading"
                        class="p-2 text-gray-500"
                    >
                        Loading...
                    </div>

                    <!-- List of filtered options -->
                    <ul
                        :class="['', ulClasses]"
                        v-if="!isLoading"
                    >
                        <li
                            v-for="(option, index) in filteredOptions"
                            :key="option.value"
                            @mousedown.prevent="selectOption(option)"
                            :class="[
                                { 'bg-gray-200': index === focusedOptionIndex },
                                'cursor-pointer p-2 hover:bg-gray-200',
                                liClasses,
                            ]"
                            :ref="index === focusedOptionIndex ? 'focusedOption' : null"
                        >
                            {{ option.label }}
                        </li>
                        <li
                            v-if="filteredOptions.length === 0"
                            class="p-2 text-gray-500"
                        >
                            No results found
                        </li>
                    </ul>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';

// Define props with defineProps
const props = defineProps({
    modelValue: {
        type: Object,
        default: null,
    },
    options: {
        type: Array,
        required: true,
    },
    searchFunction: {
        type: Function,
        default: null, // Optional search function
    },
    useApiSearch: {
        type: Boolean,
        default: false, // Determines whether to use API search or internal filtering
    },
    initialApiSearch: {
        type: Boolean,
        default: false, // Determines whether to trigger an initial API search
    },
    autoDetectScrollContainer: {
        type: Boolean,
        default: true, // Whether to automatically detect nearest scroll container
    },
    buttonClasses: {
        type: String,
        default: '', // Custom classes for button
    },
    ulClasses: {
        type: String,
        default: '', // Custom classes for ul
    },
    liClasses: {
        type: String,
        default: '', // Custom classes for li
    },
    dropdownWrapperClasses: {
        type: String,
        default: '', // Custom classes for dropdown wrapper
    },
});

// Define emits with defineEmits
const emit = defineEmits(['update:modelValue', 'selected']); // Added 'selected' event

// Reactive state variables
const isOpen = ref(false);
const searchQuery = ref(''); // Input query for search
const searchInput = ref(null); // Ref for the search input
const inputElement = ref(null); // Ref to the button element
const dropdownContainer = ref(null); // Ref to the dropdown container
const dropdownList = ref(null); // Ref to the dropdown list
const dropdownStyles = ref({}); // Dynamic styles for dropdown positioning
const isLoading = ref(false);
const apiResults = ref([]); // API results
const scrollableParent = ref(null); // To hold the scrollable parent element
const focusedOptionIndex = ref(-1); // Index of the currently focused option

// Utility function to find the nearest scrollable parent
const getScrollableParent = (element) => {
    let parent = element.parentNode;
    while (parent && parent !== document.body) {
        const overflowY = window.getComputedStyle(parent)['overflowY'];
        if (overflowY === 'scroll' || overflowY === 'auto') {
            return parent;
        }
        parent = parent.parentNode;
    }
    return window; // Fallback to window if no scrollable parent is found
};

// Computed property for the selected label
const selectedLabel = computed(() => props.modelValue?.label || '');

// Computed property for filtered options
const filteredOptions = computed(() => {
    if (props.useApiSearch) {
        return apiResults.value.length > 0 ? apiResults.value : props.options;
    } else {
        if (searchQuery.value.trim() === '') {
            return props.options;
        }
        return props.options.filter((option) => option.label.toLowerCase().includes(searchQuery.value.toLowerCase()));
    }
});

// Watch for changes in modelValue to reset search and options
watch(
    () => props.modelValue,
    () => {
        searchQuery.value = '';
    },
);

// Function to toggle dropdown visibility and position it
const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        positionDropdown();
        nextTick(() => {
            if (searchInput.value) {
                searchInput.value.focus();
            }
        });
    } else {
        focusedOptionIndex.value = -1; // Reset focus when closing dropdown
    }
};

// Function to select an option
const selectOption = (option) => {
    emit('update:modelValue', option); // Update v-model
    emit('selected', option); // Emit the selected event
    isOpen.value = false;
    focusedOptionIndex.value = -1; // Reset focus after selection
};

// Custom debounce function
const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

// Debounced function to search using the provided search function or local filtering
const debounceSearch = debounce(async () => {
    if (props.useApiSearch && props.searchFunction) {
        await search(props.searchFunction);
    }
}, 300);

// Generic search function that uses the provided search function from the props
const search = async (searchFn) => {
    try {
        isLoading.value = true;
        const results = await searchFn(searchQuery.value); // Pass searchQuery value (even if empty)
        apiResults.value = results;
    } catch (error) {
        console.error('Search error:', error);
        apiResults.value = [];
    } finally {
        isLoading.value = false;
    }
};

// Function to position the dropdown using fixed positioning and decide whether to open at the top or bottom
const positionDropdown = () => {
    const dropdownRect = inputElement.value.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - dropdownRect.bottom;
    const spaceAbove = dropdownRect.top;

    const dropdownHeight = Math.min(240, spaceBelow); // Max height of dropdown is 240px, adjust if needed

    if (spaceBelow > dropdownHeight) {
        // If enough space below, show dropdown at the bottom
        dropdownStyles.value = {
            position: 'fixed',
            left: `${dropdownRect.left}px`,
            top: `${dropdownRect.bottom}px`,
            width: `${dropdownRect.width}px`,
            maxHeight: `${dropdownHeight}px`,
        };
    } else {
        // Otherwise, show dropdown at the top
        dropdownStyles.value = {
            position: 'fixed',
            left: `${dropdownRect.left}px`,
            top: `${dropdownRect.top - dropdownHeight}px`,
            width: `${dropdownRect.width}px`,
            maxHeight: `${dropdownHeight}px`,
        };
    }
};

// Function to ensure the focused option is fully visible in the dropdown
const scrollFocusedOptionIntoView = () => {
    const focusedOption = dropdownList.value?.querySelector('.bg-gray-200'); // Get the focused option element
    if (focusedOption && dropdownList.value) {
        const dropdownRect = dropdownList.value.getBoundingClientRect();
        const optionRect = focusedOption.getBoundingClientRect();

        // Check if the focused option is above the visible area
        if (optionRect.top < dropdownRect.top) {
            dropdownList.value.scrollTop -= dropdownRect.top - optionRect.top;
        }
        // Check if the focused option is below the visible area
        else if (optionRect.bottom > dropdownRect.bottom) {
            dropdownList.value.scrollTop += optionRect.bottom - dropdownRect.bottom;
        }
    }
};

// Function to handle keyboard navigation
const handleKeydown = (event) => {
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            if (!isOpen.value) {
                toggleDropdown(); // Open dropdown on arrow down
            } else if (focusedOptionIndex.value < filteredOptions.value.length - 1) {
                focusedOptionIndex.value++; // Move focus down
                nextTick(() => {
                    scrollFocusedOptionIntoView(); // Ensure focused option is fully visible
                });
            }
            break;
        case 'ArrowUp':
            event.preventDefault();
            if (focusedOptionIndex.value > 0) {
                focusedOptionIndex.value--; // Move focus up
                nextTick(() => {
                    scrollFocusedOptionIntoView(); // Ensure focused option is fully visible
                });
            }
            break;
        case 'Enter':
            if (isOpen.value && focusedOptionIndex.value !== -1) {
                selectOption(filteredOptions.value[focusedOptionIndex.value]); // Select focused option
            }
            break;
        case 'Escape':
            isOpen.value = false; // Close dropdown on escape
            focusedOptionIndex.value = -1; // Reset focus
            break;
    }
};

// Function to hide the dropdown when input element is not visible in the modal
const handleScrollInContainer = () => {
    const inputRect = inputElement.value.getBoundingClientRect();
    const containerRect = scrollableParent.value?.getBoundingClientRect();

    // If input element is outside the scrollable container's view, hide the dropdown
    if (containerRect && (inputRect.bottom < containerRect.top || inputRect.top > containerRect.bottom)) {
        isOpen.value = false;
    } else {
        // Reposition the dropdown if it's still visible
        positionDropdown();
    }
};

// Close dropdown when clicking outside of it
const handleClickOutside = (event) => {
    // Prevent closing when clicking inside the search input or dropdown container
    if (
        dropdownContainer.value &&
        !dropdownContainer.value.contains(event.target) &&
        searchInput.value !== event.target
    ) {
        isOpen.value = false;
    }
};

// Intersection observer logic to hide the dropdown when the input is not visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            isOpen.value = false; // Hide the dropdown when the input is not visible
        }
    });
});

// Listen for window resize or scroll to reposition the dropdown
const handleResizeOrScroll = () => {
    if (isOpen.value) {
        positionDropdown();
    }
};

// Add event listener when component is mounted
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll);

    if (props.initialApiSearch && props.useApiSearch && props.searchFunction) {
        debounceSearch(); // Trigger the initial API search if the prop is enabled
    }

    if (inputElement.value) {
        observer.observe(inputElement.value); // Start observing the input element for visibility

        // Check if auto-detect scroll container is enabled
        if (props.autoDetectScrollContainer) {
            scrollableParent.value = getScrollableParent(inputElement.value); // Find the nearest scrollable parent
            if (scrollableParent.value) {
                scrollableParent.value.addEventListener('scroll', handleScrollInContainer);
            }
        }
    }
});

// Remove event listener and observer when component is unmounted
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('resize', handleResizeOrScroll);
    window.removeEventListener('scroll', handleResizeOrScroll);

    if (scrollableParent.value) {
        scrollableParent.value.removeEventListener('scroll', handleScrollInContainer);
    }

    if (inputElement.value) {
        observer.unobserve(inputElement.value); // Stop observing the input element
    }
});
</script>

<style scoped>
/* Add any custom styling here */
.bg-gray-200 {
    background-color: #e2e8f0;
}
</style>
