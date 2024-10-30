<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline';
const reference = ref(null);
const floating = ref(null);
const isActiveChiefComplaintEditor = ref(false);
const { floatingStyles } = useFloatingElement(reference, floating);
</script>

<template>
    <div>
        <div
            ref="reference"
            class="cursor-pointer rounded-lg bg-slate-100 p-3"
            @click="isActiveChiefComplaintEditor = !isActiveChiefComplaintEditor"
        >
            <button
                type="button"
                class="font-bold text-slate-800"
            >
                Chief Complaints
                <span>+</span>
            </button>

            <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between gap-2">
                    <input
                        type="text"
                        value="Fever"
                        class="w-full rounded-sm border-none text-sm"
                    />
                    <input
                        type="text"
                        value="(For 3 days)"
                        class="w-full rounded-sm border-none text-sm"
                    />
                    <span class="size-6">
                        <PlusIcon class="h-5 w-5 font-semibold text-slate-900" />
                    </span>
                </div>
                <div>
                    <input
                        type="text"
                        value="Note:"
                        class="w-full rounded-sm border-none text-sm"
                    />
                </div>
            </div>
        </div>
        <div
            v-if="isActiveChiefComplaintEditor"
            ref="floating"
            class="rounded-lg bg-slate-100 p-4"
            :style="floatingStyles"
        >
            <PrescriptionRndModalComponent />
        </div>
    </div>
</template>
