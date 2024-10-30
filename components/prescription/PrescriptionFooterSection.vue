<script lang="ts" setup>
import { useLayoutsStore } from '~/stores/useLayoutsStore';
const layouts = useLayoutsStore();
const { prescriptionLayoutsData } = storeToRefs(layouts);
const footerContent = computed(() => prescriptionLayoutsData?.value?.footer_section || []);
const footerLayouts = computed(() => footerContent.value?.column || []);
</script>

<template>
    <section
        v-if="footerLayouts.length > 0"
        class="ck-content flex min-h-[8rem] pt-2"
    >
        <div
            v-for="(item, index) in footerLayouts"
            :key="index"
            :style="`width: ${item.width}%`"
        >
            <p v-html="item.content"></p>
        </div>
    </section>
</template>
