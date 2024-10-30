<script lang="ts" setup>
const props = defineProps({
    icon: {
        type: String,
        required: true,
        default: '',
    },

    className: {
        type: String,
        required: false,
        default: 'text-slate-500',
    },

    name: {
        type: String,
        required: true,
        default: '',
    },

    strength: {
        type: String,
        required: true,
        default: '',
    },
});
</script>

<template>
    <div class="flex items-center">
        <div
            v-if="props?.icon"
            class="mr-1"
        >
            <img
                class="h-5 w-5 text-slate-300"
                :src="props?.icon"
                :alt="props.name"
            />
        </div>
        <p
            :class="className"
            class="inline-flex font-normal"
        >
            {{ props?.name }}
            {{ props.strength }}
        </p>
    </div>
</template>
