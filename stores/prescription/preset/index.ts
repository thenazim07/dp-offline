import { defineStore } from 'pinia';
import type { IdenticalName } from '~/repository/modules/ConfigModule/types';

export const usePrescriptionPresetStore = defineStore('prescription-preset-store', () => {
    const presetSearchLoading: Ref<Boolean | false> = ref(false);
    const presetsForChiefComplients: Ref<Array<any>> = ref([]);
    const presetsForDiagnosis: Ref<Array<any>> = ref([]);
    const presetsForAdvice: Ref<Array<any>> = ref([]);
    const presetsForDrug: Ref<Array<any>> = ref([]);
    const presetsForObservation: Ref<Array<any>> = ref([]);
    const presetsForInvestigation: Ref<Array<any>> = ref([]);
    const presetCreateLoading: Ref<Boolean | false> = ref(false);
    const presetUpdateLoading: Ref<Boolean | false> = ref(false);

    // EHR
    const presetForIcdCode: Ref<Array<any>> = ref([]);
    const presetForLifeStyleData: Ref<Array<any>> = ref([]);
    const presetForInvestigationHistory: Ref<Array<any>> = ref([]);

    const toast = useToast();
    const { $api } = useNuxtApp();

    const searchPreset = useDebounceFn(async (query: string, identicalName: string) => {
        if (typeof query === 'object') return;
        const querySearch = query === 'searchReset' ? ' ' : query;
        presetSearchLoading.value = true;
        try {
            const response = await $api.prescriptionPreset.get(
                `?item_identical_name=${identicalName}&search_key=${querySearch}`,
            );
            if (response) {
                setPrestListData(response, identicalName);
                presetSearchLoading.value = false;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            presetSearchLoading.value = false;
        }
    }, 500);

    async function fetchPresetData(identicalName: IdenticalName) {
        try {
            const response = await $api.prescriptionPreset.featchPresetByIdenticalName(identicalName);

            if (response) {
                setPrestListData(response, identicalName);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching preset data data:', error);
        }
    }

    const presetsMap = new Map([
        ['chief_complain', presetsForChiefComplients],
        ['diagnosis', presetsForDiagnosis],
        ['observation', presetsForObservation],
        ['investigation', presetsForInvestigation],
        ['medicine', presetsForDrug],
        ['advice', presetsForAdvice],
        ['icd_code', presetForIcdCode],
        ['life_style_type', presetForLifeStyleData],
        ['investigation_history', presetForInvestigationHistory],
    ]);

    const setPrestListData = (data: any, identicalName: string) => {
        const preset = presetsMap.get(identicalName);
        if (preset) {
            preset.value = data;
        }
    };

    async function createPreset(data: Object) {
        presetCreateLoading.value = true;

        const response = await $api.prescriptionPreset.create(data);
        if (response) {
            setPreset(response.data, data.item_identical_name);
            presetCreateLoading.value = false;
        }

        presetCreateLoading.value = false;

        return response;
    }

    async function updatePresetInfo(data: Object) {
        presetUpdateLoading.value = true;
        try {
            const response = await $api.prescriptionPreset.update(data);
            if (response) {
                updatePresetForLocal(response.data, data.item_identical_name);
                presetUpdateLoading.value = false;
                return true;
            }
        } catch (error) {
            presetUpdateLoading.value = false;
            return false;
        }
    }

    async function deletePreset(data: Object, identicalName: string) {
        removedPreset(data, identicalName);
        try {
            const response = await $api.prescriptionPreset.delete(data.id);
            if (response) {
                toast.add({ title: response.message });
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    }

    // For Ehr
    const searchForEhr = useDebounceFn(async (query: String, identicalName: string) => {
        if (typeof query === 'object') return;
        const querySearch = query === 'searchReset' ? ' ' : query;
        presetSearchLoading.value = true;
        try {
            const response = await $api.prescriptionPreset.getForEhr(
                `?item_identical_name=${identicalName}&search_key=${querySearch}`,
            );
            if (response) {
                const name = presetsMap.get(identicalName);
                if (name === !undefined) {
                    name.value = response;
                }
                presetSearchLoading.value = false;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            presetSearchLoading.value = false;
        }
    }, 500);

    async function fetchPresetDataForEhr(identicalName: string) {
        try {
            const response = await $api.prescriptionPreset.featchPresetByIdenticalNameForEhr(identicalName);
            if (response) {
                const name = presetsMap.get(identicalName);
                if (name !== undefined) {
                    name.value = response;
                }
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching preset data data:', error);
        }
    }

    async function createForEhr(data: Object, identicalName: string) {
        presetCreateLoading.value = true;
        data.item_identical_name = identicalName;
        const { code = '', ref = '', title = '' } = data;
        data.item_code = code;
        data.item_ref = ref;
        data.item_name = title;
        if (identicalName === 'investigation_history') {
            data.description = [];
        }
        try {
            const response = await $api.prescriptionPreset.createForEhr(data);
            if (response) {
                const name = presetsMap.get(identicalName);
                if (name !== undefined) {
                    name.value.data.push(response.data);
                }
                presetCreateLoading.value = false;
            }
        } catch (error) {
            presetCreateLoading.value = false;
        }
    }

    async function updateForEhr(data: Object) {
        presetUpdateLoading.value = true;
        try {
            const response = await $api.prescriptionPreset.updateForEhr(data);
            if (response) {
                const name = presetsMap.get(data.item_identical_name);
                if (name !== undefined) {
                    updateArrayData(name.value.data, 'id', data, response.data);
                }
                presetUpdateLoading.value = false;
                return true;
            }
        } catch (error) {
            presetUpdateLoading.value = false;
            return false;
        }
    }

    function updateArrayData(array, key, originalData, newData) {
        const hasIndex = array.findIndex((item) => item[key] === originalData[key]);
        if (hasIndex !== -1) {
            array.splice(hasIndex, 1, newData);
        }
    }

    async function deleteItemForEhr(data: Object, identicalName: string) {
        try {
            removedPreset(data, identicalName);
            const response = await $api.prescriptionPreset.deleteForEhr(data);
            if (response) {
                const presetData = presetsMap.get(identicalName);
                if (presetData !== undefined) {
                    const hasIndex = presetData.value.data.findIndex((item) => item.id === data.id);
                    presetData.value.data.splice(hasIndex, 1);
                }
                toast.add({ title: response.message });
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    }

    // healper
    function modifyPreset(action: string, data: any, presets: any) {
        const presetIndex = presets.value.data.findIndex((preset: any) => preset.id === data.id);

        switch (action) {
            case 'set':
                presets.value.data.push(data);
                break;

            case 'update':
                if (presetIndex !== -1) {
                    presets.value.data.splice(presetIndex, 1, data);
                }
                break;

            case 'remove':
                if (presetIndex !== -1) {
                    presets.value.data.splice(presetIndex, 1);
                }
                break;

            default:
                // eslint-disable-next-line no-console
                console.error(`Unsupported action: ${action}`);
                break;
        }
    }

    // Usage
    async function setPreset(data: any, identicalName: string) {
        await modifyPreset('set', data, presetsMap.get(identicalName));
    }

    async function updatePresetForLocal(data: any, identicalName: string) {
        await modifyPreset('update', data, presetsMap.get(identicalName));
    }

    async function removedPreset(data: any, identicalName: string) {
        await modifyPreset('remove', data, presetsMap.get(identicalName));
    }

    const generatePresetsComputed = (presets: any) => {
        return computed(() => {
            const { value } = presets;

            const data = (value?.data || []).map((item) => ({
                ...item,
                uuid: getUuid(item.name),
            }));

            return {
                data,
                meta: value?.meta || {},
                links: value?.links || {},
            };
        });
    };

    const chiefComplaintsPresets = generatePresetsComputed(presetsForChiefComplients);
    const diagnosisPresets = generatePresetsComputed(presetsForDiagnosis);
    const advicePresets = generatePresetsComputed(presetsForAdvice);
    const observationPresets = generatePresetsComputed(presetsForObservation);

    const drugPresets = computed(() => {
        if (!presetsForDrug.value.data) return { data: [], meta: {}, links: {} };
        const data = Object.assign(presetsForDrug.value).data.map((item) => {
            return {
                ...item,
                uuid: item.item_id,
                drug_ref: item.ref,
                drug_id: item.item_id,
            };
        });
        return {
            data,
            meta: presetsForDrug.value.meta,
            links: presetsForDrug.value.links,
        };
    });

    const investigationPresets = computed(() => {
        if (!presetsForInvestigation.value.data) return { data: [], meta: {}, links: {} };
        const data = Object.assign(presetsForInvestigation.value).data.map((item) => {
            return {
                ...item,
                uuid: getUuid(item.name),
            };
        });
        return {
            data,
            meta: presetsForInvestigation.value.meta,
            links: presetsForInvestigation.value.links,
        };
    });

    const presetForLifeStyle = computed(() => {
        if (!presetForLifeStyleData.value.data) return { data: [], meta: {}, links: {} };
        const data = Object.assign(presetForLifeStyleData.value).data.map((item) => {
            return {
                ...item,
                uuid: getUuid(item.name),
                life_style_type_id: item.item_id,
            };
        });
        return {
            data,
            meta: presetForLifeStyleData.value.meta,
            links: presetForLifeStyleData.value.links,
        };
    });

    return {
        presetCreateLoading,
        presetSearchLoading,
        presetUpdateLoading,
        chiefComplaintsPresets,
        diagnosisPresets,
        observationPresets,
        advicePresets,
        drugPresets,
        investigationPresets,
        fetchPresetData,
        searchPreset,
        createPreset,
        updatePresetInfo,
        deletePreset,
        // Ehr
        presetForIcdCode,
        presetForLifeStyle,
        presetForInvestigationHistory,
        searchForEhr,
        createForEhr,
        updateForEhr,
        fetchPresetDataForEhr,
        deleteItemForEhr,
    };
});
