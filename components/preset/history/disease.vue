<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useEhrDiseaseStore } from '~/stores/ehr/disease';
import { usePrescriptionPresetStore } from '~~/stores/prescription/preset';
const disease = useEhrDiseaseStore();
const { searchDisease } = disease;
const preset = usePrescriptionPresetStore();
const { createForEhr, updateForEhr, deleteItemForEhr } = preset;
const { presetUpdateLoading, presetForIcdCode } = storeToRefs(preset);
const title = ref('Disease');
const identicalName = ref('icd_code');
const toast = useToast();

const presetList = computed(() => getSortedArray(presetForIcdCode));
const to = computed(() => presetForIcdCode?.value?.meta?.to || '');
const totalPrestCount = computed(() => presetForIcdCode?.value?.meta?.total || '');

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
        item_code: data.code,
        id: data.id,
        item_identical_name: identicalName.value,
        description: data.description,
    });
};

const removedDescriptionInPreset = (des: any) => {
    des?.description.splice(des?.index, 1);
    updateForEhr({
        ...des,
        item_code: des.code,
        item_identical_name: identicalName.value,
    });
};

const diseaseDataList: Ref<any> = ref([]);
const loading: Ref<boolean> = ref(false);

const searchDiseaseData = async (query: string) => {
    if (query.length === 0) {
        diseaseDataList.value = [];
        return;
    }
    loading.value = true;
    const res = await searchDisease(query);
    loading.value = false;
    diseaseDataList.value = res;
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
                :list="diseaseDataList"
                :is-loading="loading"
                placeholder="Search Disease"
                @change="searchDiseaseData($event.target.value)"
            >
                <span
                    class="inline-block w-full"
                    @click="createForEhr(item, identicalName)"
                >
                    {{ item.title }}
                </span>
            </PresetHistorySearchOrCreateSection>
        </PresetHistoryListView>
    </ClientOnly>
</template>
