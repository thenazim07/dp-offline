<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
const props = defineProps<{
    list: [];
}>();
</script>

<template>
    <Menu
        as="div"
        class="relative inline-block text-left"
    >
        <MenuButton>
            <ChevronDownIcon class="block h-4 w-4 text-slate-500 hover:text-slate-800" />
        </MenuButton>

        <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
        >
            <MenuItems
                v-show="props?.list && props?.list.length > 0"
                class="absolute right-0 z-10 mt-1 max-h-72 w-64 max-w-xs origin-top-right overflow-y-auto overflow-x-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-md scrollbar-w-1.5 focus:outline-none"
            >
                <MenuItem
                    v-for="item in props.list"
                    :key="item"
                    as="div"
                    class="font-poppins-regular px-3 py-1.5 hover:bg-slate-100"
                    @click="updateNote(item, values)"
                >
                    <slot :description="item"></slot>
                </MenuItem>
            </MenuItems>
        </transition>
    </Menu>
</template>
