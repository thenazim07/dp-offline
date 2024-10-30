<template>
    <NuxtLayout class="text-base font-normal text-gray-600 antialiased">
        <NuxtPage />
        <UNotifications color="green">
            <template #title="{ title }">
                <span v-html="title" />
            </template>

            <template #description="{ description }">
                <span v-html="description" />
            </template>
        </UNotifications>
    </NuxtLayout>
</template>
