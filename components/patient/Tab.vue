<script setup>
import { ref } from 'vue';
const activeTabName = ref('visit');
const emit = defineEmits(['isActiveTap']);

const activeTab = (value) => {
    activeTabName.value = value;
    emit('isActiveTap', value);
};
</script>

<template>
    <nav class="sticky top-0 z-10 overflow-hidden rounded-t-md bg-white px-6 pt-6">
        <div class="block w-full border-b border-gray-200">
            <div class="flex space-x-6">
                <div class="relative flex">
                    <button
                        type="button"
                        class="font-poppins-regular relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out hover:text-[#136AFB]"
                        :class="
                            activeTabName === 'visit'
                                ? 'border-[#136AFB] text-[#136AFB]'
                                : 'border-transparent text-slate-500'
                        "
                        @click="activeTab('visit')"
                    >
                        <span class="flex items-center py-2 font-semibold">
                            <LibIconRxSolid class="mr-1"></LibIconRxSolid>
                            Visits (3)
                        </span>
                    </button>
                </div>
                <div class="relative flex">
                    <button
                        type="button"
                        class="font-poppins-regular relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
                        :class="
                            activeTabName === 'summery'
                                ? 'border-[#136AFB] text-[#136AFB]'
                                : 'border-transparent text-slate-500'
                        "
                        @click="activeTab('summery')"
                    >
                        <span class="flex items-center py-2 font-semibold">
                            <LibIconIcSummery
                                class="mr-1"
                                :color="activeTabName === 'summery' ? '#136AFB' : '#64748b'"
                            ></LibIconIcSummery>
                            Summery
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>
