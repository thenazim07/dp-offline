<script lang="ts" setup>
import { useEhrLifeStyleStore } from '~/stores/ehr/lifeStyle';
import { usePrescriptionPresetStore } from '~~/stores/prescription/preset';
const lifeStyle = useEhrLifeStyleStore();
const { searchLifeStyle } = lifeStyle;
const preset = usePrescriptionPresetStore();
const { createForEhr, updateForEhr, deleteItemForEhr } = preset;
const { presetUpdateLoading, presetForLifeStyle } = storeToRefs(preset);
const title = ref('Life Style');
const identicalName = ref('life_style_type');
const toast = useToast();

const presetList = computed(() => getSortedArray(presetForLifeStyle));
const to = computed(() => presetForLifeStyle?.value?.meta?.to || '');
const totalPrestCount = computed(() => presetForLifeStyle?.value?.meta?.total || '');

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

const lifeStyleDataList: Ref<any> = ref([]);
const loading: Ref<boolean> = ref(false);

const searchLifeStyleData = async (query: string) => {
    if (query.length === 0) {
        lifeStyleDataList.value = [];
        return;
    }
    loading.value = true;
    const res = await searchLifeStyle(query);
    loading.value = false;
    lifeStyleDataList.value = res;
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
                :list="lifeStyleDataList"
                :is-loading="loading"
                placeholder="Search LifeStyle"
                @change="searchLifeStyleData($event.target.value)"
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
