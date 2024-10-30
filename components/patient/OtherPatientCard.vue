<script lang="ts" setup>
const props = defineProps({
    profile: {
        type: Object,
        default: null,
    },
});

const { profilePhoto } = globalMethods();
const $emit = defineEmits(['select']);
</script>

<template>
    <button
        class="group h-24 rounded-sm border border-slate-200 p-2 hover:border-blue-500"
        @click="$emit('select', props.profile.id)"
    >
        <div class="mb-2">
            <img
                class="mx-auto h-10 w-10 rounded-full"
                :src="profilePhoto(profile)"
                alt=""
            />
        </div>
        <p class="font-poppins-regular text-center text-xs text-slate-700 group-hover:text-blue-500">
            {{ profile.name }}
        </p>
    </button>
</template>
