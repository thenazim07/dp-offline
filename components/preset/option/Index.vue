<script lang="ts" setup>
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue';

const props = defineProps({
    title: {
        type: String,
        default: '',
        required: true,
    },

    to: {
        type: [Number, String],
        default: '',
        required: true,
    },

    totalPrestCount: {
        type: [Number, String],
        default: '',
        required: true,
    },
});
</script>

<template>
    <PresetTabTitle :title="title">
        <span v-if="to && totalPrestCount">(Showing {{ to }} of {{ totalPrestCount }} Results)</span>
    </PresetTabTitle>

    <TabGroup>
        <TabList
            as="div"
            class="relative z-0 mb-8 inline-flex w-full"
        >
            <Tab
                v-slot="{ selected }"
                as="template"
            >
                <PrescriptionTabsTab
                    :is-active="selected"
                    class-name="h-10 border text-sm 2xl:h-12 2xl:text-base"
                    :name="title"
                />
            </Tab>

            <Tab
                v-slot="{ selected }"
                as="template"
            >
                <PrescriptionTabsTab
                    :is-active="selected"
                    class-name="h-10 border text-sm 2xl:h-12 2xl:text-base"
                    :name="`${props.title} Group`"
                />
            </Tab>
        </TabList>

        <TabPanels>
            <TabPanel>
                <slot name="preset"></slot>
            </TabPanel>
            <TabPanel>
                <slot name="group"></slot>
            </TabPanel>
        </TabPanels>
    </TabGroup>
</template>
