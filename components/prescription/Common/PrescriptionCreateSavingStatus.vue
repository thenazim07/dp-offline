<template>
    <div class="pr-2">
        <template v-if="props.status.status === 'pending'">
            <img
                src="/assets/images/loader.png"
                alt="loader"
                class="h-6 w-6 animate-spin"
            />
        </template>
        <div
            v-if="props.status.status === 'failed'"
            class="flex gap-[2px]"
        >
            <button
                class="flex gap-[2px] duration-700 ease-in"
                @click.stop="emit('retry')"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M14.3463 8.82682C14.3463 10.0478 13.9842 11.2413 13.3059 12.2565C12.6276 13.2716 11.6635 14.0629 10.5355 14.5301C9.40749 14.9973 8.16627 15.1196 6.96879 14.8814C5.77132 14.6432 4.67136 14.0552 3.80804 13.1919C3.23303 12.62 2.77715 11.9397 2.46681 11.1904C2.15646 10.4412 1.99781 9.63781 2.00002 8.82682C2.00002 8.71079 2.04612 8.59951 2.12816 8.51746C2.21021 8.43542 2.32149 8.38932 2.43752 8.38932C2.55355 8.38932 2.66483 8.43542 2.74688 8.51746C2.82893 8.59951 2.87502 8.71079 2.87502 8.82682C2.87502 11.7482 5.25176 14.125 8.17315 14.125C11.0945 14.125 13.4713 11.7482 13.4713 8.82682C13.4713 6.01357 11.2672 3.70579 8.49518 3.53875L9.36602 5.00347C9.42532 5.1032 9.44257 5.22241 9.41398 5.33487C9.38538 5.44732 9.31329 5.54381 9.21355 5.60311C9.11381 5.66241 8.99461 5.67966 8.88215 5.65107C8.7697 5.62248 8.6732 5.55038 8.6139 5.45064L7.20095 3.07407C7.17159 3.02469 7.15224 2.97 7.14401 2.91314C7.13578 2.85628 7.13883 2.79835 7.15299 2.74267C7.16715 2.68699 7.19213 2.63464 7.22652 2.58861C7.26091 2.54259 7.30403 2.50379 7.35342 2.47443L9.73002 1.06144C9.82975 1.00215 9.94896 0.9849 10.0614 1.0135C10.1739 1.04209 10.2704 1.11419 10.3296 1.21392C10.3889 1.31366 10.4062 1.43287 10.3776 1.54532C10.349 1.65777 10.2769 1.75426 10.1772 1.81356L8.72298 2.67814C10.2589 2.81552 11.6878 3.52276 12.7284 4.66067C13.7691 5.79859 14.3463 7.28478 14.3463 8.82682Z"
                        fill="#EF4444"
                    />
                </svg>
                <span class="text-xs text-red-500 underline">Click to retry</span>
            </button>
        </div>
        <Transition>
            <div v-if="props.status.status === 'success'">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M20 6L9 17L4 12"
                        stroke="#64748B"
                        stroke-width="2"
                        stroke-linecap="square"
                    />
                </svg>
            </div>
        </Transition>
    </div>
</template>
<script setup lang="ts">
import type { IStatus } from '~/stores/prescription/usePrescriptionSavingStatusStore';

interface Props {
    status: IStatus;
}
const props = defineProps<Props>();

const emit = defineEmits(['retry']);
</script>
<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
