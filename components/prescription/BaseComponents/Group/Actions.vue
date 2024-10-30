<script lang="ts" setup>
const prop = defineProps({
    group: {
        type: Object,
        required: true,
    },

    isSelected: {
        type: Boolean,
        required: false,
    },
});

const emit = defineEmits(['selectedGroup', 'editGroup', 'deleteGroup']);
const open = ref(false);
const onFocusOpenDropdownMenu = () => {
    open.value = true;
};

const actions = [
    [
        {
            label: 'Edit',
            icon: 'i-heroicons-pencil-square-20-solid',
            click: () => {
                emit('editGroup', { ...prop.group });
            },
        },
    ],
    [
        {
            label: 'Delete',
            icon: 'i-heroicons-trash-20-solid',
            click: () => {
                emit('deleteGroup', { ...prop.group });
            },
        },
    ],
];
</script>

<template>
    <UButtonGroup
        :ui="{ rounded: 'rounded-full', shadow: 'shadow-none' }"
        class="m-1 items-center border bg-white py-1.5 pl-2"
        size="sm"
        orientation="horizontal"
    >
        <UPopover
            v-model:open="open"
            mode="hover"
            :ui="{ wrapper: '-mt-1' }"
            :popper="{ arrow: false }"
        >
            <UButton
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
                @focus="onFocusOpenDropdownMenu"
            >
                <div
                    class="-mt-3 block"
                    :class="{ 'text-blue-500': isSelected }"
                >
                    <span
                        v-if="prop.group?.name"
                        class="mr-2"
                        @click="$emit('selectedGroup', { ...prop.group })"
                    >
                        {{ prop.group?.name }}
                    </span>
                    <span>({{ prop.group?.group_item?.length }})</span>
                </div>
            </UButton>

            <template #panel>
                <div class="min-w-[150px] rounded-lg bg-black/80 px-4 py-4 text-center text-white">
                    <ul class="list-disc px-3">
                        <li
                            v-for="(group_item, key) in prop.group?.group_item"
                            :key="key"
                            class="py-.5 font-poppins-regular text-left text-sm font-normal text-white"
                        >
                            {{ group_item.name }}
                        </li>
                    </ul>
                </div>
            </template>
        </UPopover>

        <UDropdown
            :items="actions"
            :popper="{ placement: 'bottom-start' }"
            class="flex items-center border-none pr-4"
        >
            <UButton
                icon="i-heroicons-ellipsis-vertical-20-solid"
                :ui="{
                    strategy: 'override',
                    rounded: 'rounded-none',
                    color: {
                        white: {
                            solid: 'border-0 bg-white shadow-none focus:outline-none focus:ring-0 focus:border-0  focus:text-blue-600',
                        },
                    },
                }"
                color="white"
                :padded="false"
            />

            <template #item="{ item }">
                <span class="truncate">{{ item.label }}</span>
                <UIcon
                    :name="item.icon"
                    class="ms-auto h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
                />
            </template>
        </UDropdown>
    </UButtonGroup>
</template>
