<script lang="ts" setup>
const { bodySectionFormData } = storeToRefs(useLayoutsStore());
</script>
<template>
    <div
        class="w-80 flex-shrink-0 border-r border-slate-500"
        :style="`width:${bodySectionFormData.left_section_width}%`"
    >
        <div class="flex-row py-6">
            <slot></slot>
        </div>
    </div>
</template>
