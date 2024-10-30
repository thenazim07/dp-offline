<script lang="ts" setup></script>

<template>
    <h1 class="font-poppins-regular pb-3 text-xl text-slate-500">Patient History</h1>

    <div class="grid grid-cols-2 gap-4 2xl:grid-cols-3">
        <div
            v-for="n in 20"
            :key="n"
            class="rounded-md border"
        >
            <div class="flex items-center justify-between border-b border-slate-200 px-3 py-2">
                <div class="">
                    <p class="font-poppins-semibold font-semibold">On Examinations</p>
                </div>

                <div>
                    <p class="font-poppins-regular text-sm text-slate-400">5/6</p>
                </div>
            </div>

            <div class="px-3 py-2">s</div>
            <div class="border-t border-slate-200 text-center">
                <button class="font-poppins-regular py-2 font-normal text-slate-500">View Details</button>
            </div>
        </div>
    </div>
</template>
