<script lang="ts" setup>
const props = defineProps<{
    icon?: string;
    title?: string;
    value?: string | number;
}>();
</script>

<template>
    <div class="rounded-lg border border-slate-200 p-3 text-center 2xl:p-4">
        <div
            class="mx-auto my-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 2xl:h-14 2xl:w-14"
        >
            <div>
                <NuxtImg
                    class="m-auto h-5 w-auto 2xl:h-8"
                    :src="`/images/overview/${props.icon}`"
                    alt=""
                />
            </div>
        </div>

        <p class="font-poppins-regular pb-1 text-xs font-normal text-slate-800 2xl:pb-2 2xl:text-base">
            {{ title }}
        </p>

        <p class="font-poppins-bold text-lg text-slate-800 2xl:text-3xl">
            {{ value }}
        </p>
    </div>
</template>
