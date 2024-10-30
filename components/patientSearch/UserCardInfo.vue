<script lang="ts" setup>
import { truncate } from '~/utils/useHelper';
const { profilePhoto } = globalMethods();

const props = defineProps<{
    user: object;
}>();
</script>

<template>
    <div class="flex items-center space-x-2 2xl:space-x-4">
        <div class="h-10 w-10 flex-shrink-0">
            <NuxtImg
                class="mx-auto h-10 w-10 rounded-full"
                :src="profilePhoto(props.user)"
                alt=""
            />
        </div>

        <div>
            <p class="font-poppins-regular mb-0 text-sm font-semibold leading-3 text-slate-500">
                {{ truncate(props.user.name, 20) }}
            </p>
            <div>
                <p class="text-xs font-medium text-slate-500 sm:inline">
                    {{ props.user?.contact_no }}
                </p>
                {{ '  ' }}
                <span class="hidden text-xs sm:mx-2 sm:inline">&#124;</span>
                {{ '  ' }}
                <p class="text-xs font-medium text-slate-500 sm:inline">
                    {{ props.user?.generated_patient_id }}
                </p>
            </div>
        </div>
    </div>

    <div>
        <slot></slot>
    </div>
</template>
