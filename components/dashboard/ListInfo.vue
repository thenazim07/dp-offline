<script lang="ts" setup>
const props = defineProps<{
    title: string;
    value: string | number | undefined;
}>();
</script>

<template>
    <li class="py-2 2xl:py-4">
        <div class="flex items-center space-x-3 2xl:space-x-4">
            <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 2xl:h-14 2xl:w-14">
                <NuxtImg
                    class="m-auto h-5 w-auto 2xl:h-8"
                    src="images/overview/man.svg"
                    alt=""
                />
            </div>

            <div class="min-w-0 flex-1">
                <p class="font-poppins-regular truncate text-sm font-medium text-slate-800 2xl:text-base">
                    {{ props.title }}
                </p>
                <p class="font-poppins-bold text-lg text-slate-800 2xl:text-3xl">
                    {{ props.value }}
                </p>
            </div>
        </div>
    </li>
</template>
