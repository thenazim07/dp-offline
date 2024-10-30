<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';

defineEmits(['delete']);
</script>

<template>
    <ul
        role="list"
        class="ml-2.5 pr-2"
    >
        <li
            v-for="n in 4"
            :key="n"
            class="space-y-4"
        >
            <div class="flex w-full justify-between space-x-2 py-1.5 pr-2">
                <p
                    class="before:mr- font-poppins-regular relative text-sm font-normal leading-5 text-slate-600 before:absolute before:-inset-3 before:inset-y-0 before:h-2 before:w-2 before:content-dod"
                >
                    <span class="pl-1"> Dengue Antibodies (IgG & IgM) </span>
                </p>

                <div>
                    <button
                        class=""
                        @click="$emit('delete', 1)"
                    >
                        <TrashIcon class="h-4 w-4 text-red-500"></TrashIcon>
                    </button>
                </div>
            </div>
        </li>
    </ul>
</template>
