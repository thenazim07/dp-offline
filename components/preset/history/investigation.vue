<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useEhrInvestigationHistoryStore } from '~/stores/ehr/investigations';
import { usePrescriptionPresetStore } from '~~/stores/prescription/preset';
const investigation = useEhrInvestigationHistoryStore();
const { searchInvestigation } = investigation;
const preset = usePrescriptionPresetStore();
const { createForEhr, updateForEhr, deleteItemForEhr } = preset;
const { presetUpdateLoading, presetForInvestigationHistory } = storeToRefs(preset);
const title = ref('Investgation');
const identicalName = ref('investigation_history');

const toast = useToast();

const presetList = computed(() => getSortedArray(presetForInvestigationHistory));
const to = computed(() => presetForInvestigationHistory?.value?.meta?.to || '');
const totalPrestCount = computed(() => presetForInvestigationHistory?.value?.meta?.total || '');

const presetUpdate = (values: any) => {
    updateForEhr({
        ...values.$event,
        item_identical_name: identicalName.value,
    }).then((res) => {
        if (res) {
            values.close();
        }
    });
};

const updateDescriptionInPreset = (data: any) => {
    data.description = data?.description ? data?.description : [];
    const hasItem = data?.description?.find((item: object) => item === data?.new);

    if (hasItem) {
        toast.add({ title: 'Already exists', color: 'red' });
        return;
    }

    data?.description?.push(data?.new);

    updateForEhr({
        item_name: data.name,
        weight: data.weight,
        id: data.id,
        item_ref: data.ref,
        item_identical_name: identicalName.value,
        description: data.description,
    });
};

const removedDescriptionInPreset = (des: any) => {
    des?.description.splice(des?.index, 1);
    updateForEhr({
        ...des,
        item_ref: des.ref,
        item_identical_name: identicalName.value,
    });
};

const investigationDataList: Ref<any> = ref([]);
const loading: Ref<boolean> = ref(false);

const searchInvestigationData = async (query: string) => {
    if (query.length === 0) {
        investigationDataList.value = [];
        return;
    }
    loading.value = true;
    const res = await searchInvestigation(query);
    loading.value = false;
    investigationDataList.value = res;
};
</script>

<template>
    <ClientOnly>
        <p
            v-if="to && totalPrestCount"
            class="font-poppins-rgular pb-2 text-xs text-slate-600"
        >
            Showing {{ to }} of {{ totalPrestCount }} Results
        </p>
        <PresetHistoryListView
            :has-found="false"
            :presets="presetList"
            :title="title"
            :update-loading="Boolean(presetUpdateLoading)"
            placeholder=""
            @onUpdate="presetUpdate"
            @updateDescription="updateDescriptionInPreset"
            @removedDescription="removedDescriptionInPreset"
            @deleteItem="deleteItemForEhr($event, identicalName)"
        >
            <PresetHistorySearchOrCreateSection
                v-slot="{ item }"
                :list="investigationDataList"
                :is-loading="loading"
                placeholder="Search Investigation"
                @change="searchInvestigationData($event.target.value)"
            >
                <span
                    class="inline-block w-full"
                    @click="createForEhr(item, identicalName)"
                >
                    {{ item.name }}
                </span>
            </PresetHistorySearchOrCreateSection>
        </PresetHistoryListView>
    </ClientOnly>
</template>
