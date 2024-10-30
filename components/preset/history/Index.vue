<script lang="ts" setup>
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue';
import { useHistoryStore } from '~/stores/history/useHistoryStore';
const useHistory = useHistoryStore();
const { initialize } = useHistory;
initialize();
</script>

<template>
    <TabGroup>
        <TabList
            as="div"
            class="relative z-0 mb-3 inline-flex w-full"
        >
            <Tab
                v-slot="{ selected }"
                as="template"
            >
                <PrescriptionTabsTab
                    :is-active="selected"
                    class-name="h-10 border text-sm 2xl:h-12 2xl:text-base"
                    name="Disease"
                />
            </Tab>

            <Tab
                v-slot="{ selected }"
                as="template"
            >
                <PrescriptionTabsTab
                    :is-active="selected"
                    class-name="h-10 border text-sm 2xl:h-12 2xl:text-base"
                    name="Investigation"
                />
            </Tab>

            <Tab
                v-slot="{ selected }"
                as="template"
            >
                <PrescriptionTabsTab
                    :is-active="selected"
                    class-name="h-10 border text-sm 2xl:h-12 2xl:text-base"
                    name="Life Style"
                />
            </Tab>
        </TabList>

        <TabPanels>
            <TabPanel>
                <PresetHistoryDisease />
            </TabPanel>

            <TabPanel>
                <PresetHistoryInvestigation />
            </TabPanel>

            <TabPanel>
                <PresetHistoryLifeStyle />
            </TabPanel>
        </TabPanels>
    </TabGroup>
</template>
