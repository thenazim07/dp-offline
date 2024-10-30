<script lang="ts" setup>
const props = defineProps({
    item: {
        type: Object,
        default: null,
    },

    isActiveItem: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['select:item']);
const hasItems = computed<string>(() =>
    props.item?.description?.length > 0 ? 'i-heroicons-chevron-down-20-solid' : '',
);

const selectData = (item: object, des: string | null) => {
    emit('select:item', { ...item, duration_type: 'days', des });
};

const arrayOfObjectsDescriptions = computed(() =>
    props.item?.description?.map((value: string) => [
        {
            label: value,
            click: () => {
                selectData(props.item, value);
            },
        },
    ]),
);

const buttonConfig = {
    strategy: 'override',
    rounded: 'rounded-none',
    color: {
        white: {
            solid: 'border-0 bg-white shadow-none focus:outline-none focus:ring-0 focus:border-0  focus:text-blue-600',
        },
    },
};
</script>

<template>
    <div class="flex items-center">
        <div
            v-if="!props?.item?.description"
            :title="props?.item?.name"
        >
            <UButton
                variant="ghost"
                class="rounded-full border border-slate-200 bg-white px-4"
                color="white"
                :ui="buttonConfig"
                :trailing-icon="hasItems"
                @click="selectData(props.item, null)"
            >
                <div class="max-w-[14rem] truncate">
                    <span
                        class="cursor-pointer text-left hover:text-blue-500"
                        :class="isActiveItem ? 'text-blue-500' : ''"
                    >
                        {{ item.name }}
                    </span>
                    <span
                        v-if="item?.description"
                        class="ml-1 mr-2 text-sm"
                    >
                        ({{ item?.description?.length }})
                    </span>
                </div>
            </UButton>
        </div>

        <template v-else>
            <div
                :title="props?.item?.name"
                :popper="{ placement: 'top', arrow: true }"
            >
                <UButtonGroup
                    size="sm"
                    :ui="{ rounded: 'rounded-full', shadow: 'shadow-none' }"
                    class="mr-2 items-center border bg-white py-1.5 pl-2"
                    orientation="horizontal"
                >
                    <UButton
                        label="Action"
                        :ui="{
                            strategy: 'override',
                            rounded: 'rounded-none',
                            color: {
                                white: {
                                    solid: 'px-2 border-0 hover:text-blue-500 bg-white shadow-none focus:outline-none focus:ring-0 focus:border-0  focus:text-blue-600',
                                },
                            },
                        }"
                        color="white"
                        :padded="false"
                        @click="selectData(props.item, null)"
                    >
                        <div
                            :class="isActiveItem ? 'text-blue-500' : ' '"
                            class="max-w-[14rem] truncate hover:text-blue-500"
                        >
                            <span class="cursor-pointer text-left">
                                {{ item.name }}
                            </span>
                            <span
                                v-if="item?.description"
                                class="ml-1 mr-2 text-sm"
                            >
                                ({{ item?.description?.length }})
                            </span>
                        </div>
                    </UButton>

                    <UDropdown
                        :ui="{ height: 'max-h-72', width: 'w-64' }"
                        :items="arrayOfObjectsDescriptions"
                        :popper="{ offsetDistance: 0, arrow: true }"
                    >
                        <UButton
                            icon="i-heroicons-chevron-down-20-solid"
                            color="white"
                            :ui="{
                                strategy: 'override',
                                rounded: 'rounded-none',
                                color: {
                                    white: {
                                        solid: 'pr-2 border-0 hover:text-blue-500 bg-white shadow-none focus:outline-none focus:ring-0 focus:border-0  focus:text-blue-600',
                                    },
                                },
                            }"
                            :padded="false"
                            @keyup.enter="selectData(props.item, null)"
                        >
                        </UButton>

                        <!-- eslint-disable -->
                        <template #item="{ item }">
                            <span class="text-left">{{ item.label }}</span>
                        </template>
                    </UDropdown>
                </UButtonGroup>
            </div>
        </template>
    </div>
</template>
