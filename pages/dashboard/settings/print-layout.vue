<script lang="ts" setup>
import { useLayoutsStore } from '~/stores/useLayoutsStore';
const { initialize } = useLayoutsStore();
initialize();
definePageMeta({
    middleware: ['auth'],
});

const tabs = reactive([
    { label: 'Page Setup', key: 'setup' },
    { label: 'Header Section', key: 'header' },
    { label: 'Patient Section', key: 'patient' },
    { label: 'Body Section', key: 'body' },
    { label: 'Footer Section', key: 'footer' },
]);
</script>

<template>
    <ClientOnly>
        <Teleport to="#navbar">
            <div class="mr-0 flex w-full max-w-[100rem] items-center justify-between sm:pr-8">
                <!--Breadcrumbs-->
                <nav
                    class="flex"
                    aria-label="breadcrumb"
                >
                    <ol
                        role="list"
                        class="flex items-center space-x-1"
                    >
                        <li>
                            <div class="flex items-center">
                                <NuxtLink
                                    to="/dashboard"
                                    class="font-poppins-regular text-sm font-medium text-gray-500 hover:text-gray-700 2xl:text-base"
                                >
                                    Settings
                                </NuxtLink>
                            </div>
                        </li>

                        <li>
                            <div class="flex items-center">
                                <svg
                                    class="h-5 w-5 flex-shrink-0 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                                <a
                                    href="#"
                                    class="font-poppins-regular text-sm font-medium text-gray-500 hover:text-gray-700 2xl:text-base"
                                    aria-current="page"
                                >
                                    Print Layout</a
                                >
                            </div>
                        </li>
                    </ol>
                </nav>
                <!--End--Breadcrumbs-->
            </div>
        </Teleport>

        <div class="ck-content mr-0 max-w-[100rem]">
            <div class="mb-8 overflow-visible rounded-lg bg-white p-8 shadow">
                <UTabs
                    :unmount="true"
                    :ui="{
                        list: {
                            strategy: 'override',
                            base: 'bg-white xl:max-w-4xl 2xl:max-w-2xl ',
                        },
                    }"
                    :items="tabs"
                >
                    <template #item="{ item }">
                        <PrintLayoutPageSetup v-if="item.key === 'setup'" />
                        <PrintLayoutBodySection v-if="item.key === 'body'" />
                        <PrintLayoutPatientSection v-if="item.key === 'patient'" />
                        <PrintLayoutHeaderSection v-if="item.key === 'header'" />
                        <PrintLayoutFooterSection v-if="item.key === 'footer'" />
                    </template>
                </UTabs>
            </div>
        </div>
    </ClientOnly>
</template>
