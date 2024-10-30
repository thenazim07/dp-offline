<script setup lang="ts">
const isOpenDropdown = ref(false);
const countries = ref([
    {
        name: '+88',
        value: '+88',
        flag: 'https://doctime-core-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/images/country-flags/flag-800.png',
    },
]);
</script>

<template>
    <div class="inline-flex w-full">
        <div
            :class="[isOpenDropdown ? 'rounded-bl-0 rounded-tl' : 'rounded-l-md']"
            class="relative flex w-32 flex-shrink-0 items-center border border-r-0 border-slate-200 px-3 focus:border-r focus:border-blue-600"
            tabindex="0"
        >
            <div
                class="pb-1 pt-0 sm:py-1"
                @click="isOpenDropdown = !isOpenDropdown"
            >
                <div class="flex cursor-pointer items-center space-x-1">
                    <div class="flex flex-shrink-0">
                        <img
                            class="h-auto w-4 sm:w-6"
                            :src="countries[0].flag"
                            alt=""
                        />
                    </div>
                    <div>
                        <p class="font-poppins-regular m-0 text-xs text-slate-700 sm:text-base">+ 88</p>
                    </div>
                </div>
            </div>

            <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-200"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
            >
                <div
                    v-if="isOpenDropdown && false"
                    class="absolute inset-x-0 top-10 z-20 mt-0.5 w-32 rounded-b-md border border-slate-300 bg-white focus:outline-none"
                >
                    <div
                        v-for="(country, index) in countries"
                        :key="index"
                        class="group flex cursor-pointer items-center space-x-1 border-b border-slate-300 px-3 py-2 hover:bg-skin-fill hover:text-white focus:bg-skin-fill focus:text-white focus:outline-none"
                        tabindex="0"
                        role="menu"
                    >
                        <div>
                            <img
                                class="h-auto w-4 sm:w-6"
                                :src="country.flag"
                                alt=""
                            />
                        </div>
                        <div>
                            <p
                                class="font-poppins-regular m-0 text-xs text-slate-800 group-hover:text-white sm:text-base"
                            >
                                + 88
                            </p>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
        <slot></slot>
    </div>
</template>
