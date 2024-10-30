<template>
    <Teleport to="body">
        <div class="fixed left-0 top-0 z-[9999] flex h-screen w-screen items-center justify-center bg-black/25">
            <div
                class="flex h-[211px] w-[474px] flex-col justify-center gap-4 rounded-lg border border-[#136AFB] bg-white p-4"
            >
                <div class="flex flex-col gap-1">
                    <div class="text-center text-2xl font-semibold text-red-500">Are you sure?</div>
                    <div class="w-full text-center text-sm text-[#EA5656]">
                        All the changes you made will be lost. Are you sure you want to reset all changes?
                    </div>
                </div>
                <div class="flex gap-2">
                    <button
                        class="w-1/2 rounded-lg border border-[#136AFB] bg-white px-3 py-4 text-base text-[#136AFB]"
                        @click.stop="emit('cancel')"
                    >
                        Cancel
                    </button>
                    <button
                        class="w-1/2 rounded-lg bg-red-500 px-3 py-4 text-base text-white"
                        @click.stop="emit('confirm')"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
<script setup lang="ts">
const emit = defineEmits(['cancel', 'confirm']);
</script>
