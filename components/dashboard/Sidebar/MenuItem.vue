<script lang="ts" setup>
import { useSettingsStore } from '~~/stores/settings';
const settings = useSettingsStore();

const sidebarOpenClose = () => {
    settings.sideBarOpen();
};

defineProps({
    name: {
        type: String,
        default: '',
    },
    routeName: {
        type: String,
        default: '',
    },
    to: {
        type: String,
        default: '/',
    },
    textShow: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <NuxtLink
        :to="to"
        @click="sidebarOpenClose()"
    >
        <div
            class="mb-px flex h-[3.75rem] items-center"
            :class="[
                $route.name === routeName ? 'border-[#136AFB] ' : 'border-transparent  ',
                textShow ? 'border-l-4  hover:border-[#136AFB] hover:bg-slate-50' : 'w-auto justify-center 2xl:w-20',
                $route.name === routeName && textShow === true ? 'bg-slate-50' : '',
            ]"
        >
            <div
                class="flex items-center"
                :class="textShow ? 'ml-[1.375rem] ' : ''"
            >
                <slot></slot>
                <span
                    v-if="textShow"
                    class="font-poppins-regular text-base"
                >
                    {{ name }}
                </span>
            </div>
        </div>
    </NuxtLink>
</template>
