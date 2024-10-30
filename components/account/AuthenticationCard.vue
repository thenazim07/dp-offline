<script setup>
const props = defineProps<{
    title?: string,
    subTitle?: string,
}>()
</script>

<template>
    <div class="mb-12 w-full">
        <div class="flex w-full justify-center py-5">
            <slot name="logo" />
        </div>

        <div class="mx-auto w-full overflow-hidden bg-white p-8 shadow sm:rounded-lg xl:max-w-xl 2xl:max-w-2xl">
            <article class="mb-5 2xl:mb-6">
                <h1
                    class="font-poppins-bold pb-1 text-xl font-bold tracking-normal text-skin-dark 2xl:pb-2 2xl:text-3xl"
                >
                    {{ props.title }}
                </h1>
                <p class="font-poppins-regular text-sm font-normal tracking-normal text-skin-dark 2xl:text-base">
                    {{ props.subTitle }}
                </p>
            </article>

            <slot />
        </div>
    </div>
</template>
