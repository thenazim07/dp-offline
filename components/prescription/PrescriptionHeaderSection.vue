<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useLayoutsStore } from '~/stores/useLayoutsStore';
const layouts = useLayoutsStore();
const { prescriptionLayoutsData } = storeToRefs(layouts);
const headerContent = computed(() => prescriptionLayoutsData?.value?.header_section || {});
const headersLayouts = computed(() => headerContent.value?.column || []);
</script>

<template>
    <section class="ck-content flex min-h-[8rem] pb-1">
        <div
            v-for="(item, index) in headersLayouts"
            :key="index"
            :style="`width: ${item.width}%`"
            class="pr-2"
        >
            <p v-html="item.content"></p>
        </div>
    </section>
</template>
