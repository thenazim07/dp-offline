<template>
    <div class="group flex flex-col gap-[11px] p-3 text-[#1E293B] hover:bg-slate-50">
        <div class="relative flex w-full justify-between">
            <span class="text-sm font-bold">Special Note</span>
            <PrescriptionEditPrescriptionLayoutNavigationNavArrow />
        </div>

        <!-- list -->
        <div class="flex items-center justify-between gap-2">
            <div class="w-[1.5%]">
                <div class="h-1.5 w-1.5 rounded-full bg-[#1E293B]"></div>
            </div>

            <div class="flex items-start justify-between">
                <div class="flex flex-grow items-start gap-2">
                    <div>
                        <p class="cursor-pointer text-sm text-[#1E293B]">
                            In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to
                            demonstrate the visual form of a document or a typeface without relying on meaningful
                            content.
                        </p>
                        <!-- <p class="text-xs">This is note</p> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts"></script>
