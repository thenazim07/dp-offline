<script setup lang="ts">
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { createPopper } from '@popperjs/core';

const model = defineModel<any>();

const isLoading = ref(false); // Track the loading state of the search
const observer = ref<IntersectionObserver | null>(null); // Reference for the observer
const selectRef = ref(null); // Reference to the select element

const props = defineProps({
    search: {
        type: Function,
        default: null,
    },
    options: {
        type: Array,
        default: () => [],
    },
    label: {
        type: String,
        default: 'value',
    },
    reduce: {
        type: Function,
        default: (option) => option,
    },
    class: {
        type: String,
        default: '',
    },
    placeholder: {
        type: String,
        default: 'Search...',
    },
    appendToBody: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['selected', 'close']);

const recentResults = ref([]);
const optionList = ref([]);

watch(
    () => props.options,
    (newValue) => {
        optionList.value = [...newValue];
    },
    {
        immediate: true,
    },
);

const onSearchHandler = useDebounceFn(async (query, loading) => {
    if (query?.toString()?.trim()?.length === 0 && recentResults.value.length > 0) {
        optionList.value = recentResults.value;
        return;
    }

    isLoading.value = true;
    // loading(true);

    try {
        await props?.search(query);
        if (query?.toString()?.trim()?.length === 0) {
            recentResults.value = optionList.value;
        }
    } catch (error) {
        // loading(false);
    } finally {
        // loading(false);
        isLoading.value = false;
    }
}, 500);

function withPopper(dropdownList, component, { width }) {
    /**
     * We need to explicitly define the dropdown width since
     * it is usually inherited from the parent with CSS.
     */
    dropdownList.style.width = width;

    /**
     * Here we position the dropdownList relative to the $refs.toggle Element.
     *
     * The 'offset' modifier aligns the dropdown so that the $refs.toggle and
     * the dropdownList overlap by 1 pixel.
     *
     * The 'toggleClass' modifier adds a 'drop-up' class to the Vue Select
     * wrapper so that we can set some styles for when the dropdown is placed
     * above.
     */
    const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: 'bottom',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, -1],
                },
            },
            {
                name: 'flip', // Enable the flip behavior
                options: {
                    fallbackPlacements: ['top'], // Flip to the top if bottom doesn't have space
                },
            },
            {
                name: 'toggleClass',
                enabled: true,
                phase: 'write',
                fn({ state }) {
                    component.$el.classList.toggle('drop-up', state.placement === 'top');
                },
            },
        ],
    });

    /**
     * To prevent memory leaks Popper needs to be destroyed.
     * If you return function, it will be called just before dropdown is removed from DOM.
     */
    return () => popper.destroy();
}

function onSearchFocusHandler() {
    onSearchHandler('', () => {});
}

async function onOptionSelectedHandler(selected: any) {
    await nextTick();
    emit('selected', selected);
}

onMounted(() => {
    // Create the observer when the component mounts
    // observer.value = new IntersectionObserver(handleVisibilityChange, {
    //     root: null, // Viewport or scrollable modal
    //     threshold: 0, // Trigger when any part of the element is out of view
    // });
    // Observe the select input's visibility
    // if (selectRef.value?.$refs.toggle) {
    //     observer.value.observe(selectRef.value.$refs.toggle);
    // }
    // onSearchHandler('', () => {});
});

onBeforeUnmount(() => {
    // Disconnect the observer when the component unmounts
    if (observer.value) {
        observer.value.disconnect();
    }
});

function onCloseHandler() {
    optionList.value = recentResults.value;
    emit('close');
}
</script>

<template>
    <div class="vue-searchable-select">
        <v-select
            ref="selectRef"
            v-model="model"
            :loading="isLoading"
            :filterable="false"
            :options="optionList"
            :append-to-body="props.appendToBody"
            :label="props.label"
            :calculate-position="withPopper"
            :reduce="props.reduce"
            :clearable="false"
            :class="[props.class, 'bg-white']"
            :placeholder="props.placeholder"
            @search="onSearchHandler"
            @search:focus="onSearchFocusHandler"
            @option:selected="onOptionSelectedHandler"
            @close="onCloseHandler"
        >
            <template #spinner="{ loading }">
                <div v-if="loading">
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
            </template>

            <template #option="item">
                <slot
                    v-if="$slots.option"
                    name="option"
                    :drug="item"
                />

                <div
                    v-else
                    class="overflow-hidden text-ellipsis py-1"
                >
                    {{ item[props.label] }}
                </div>
            </template>

            <template #selected-option="item">
                <div class="overflow-hidden text-ellipsis">
                    {{ item[props.label] }}
                </div>
            </template>

            <template
                v-if="$slots.noOption"
                #no-options="{ search, searching }"
            >
                <slot
                    name="noOption"
                    :search="search"
                    :searching="searching"
                />
            </template>
        </v-select>
    </div>
</template>

<style lang="scss">
.vue-searchable-select {
    .vs__search {
        border: none;
        padding-top: 4px;
        padding-bottom: 4px;
    }
    .vs__dropdown-toggle {
        border: none;
        padding-top: 4px;
        border-radius: 4px;
        padding-bottom: 4px;
    }
    .v-select.vs--searchable {
        border-radius: 4px;
        padding-top: 2px;
        padding-bottom: 2px;
    }
}

:root {
    --vs-dropdown-option--active-bg: #e5e7eb;
    --vs-dropdown-option--active-color: #111827;
}
</style>
