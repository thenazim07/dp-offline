import { defineStore } from 'pinia';
import type { LifeStyle } from '~/repository/modules/EHR/LifestyleHistory/types';

export const useEhrLifeStyleStore = defineStore('use-life-style-history-store', () => {
    const { $api } = useNuxtApp();
    const toast = useToast();

    const lifeStyleSelectedList: Ref<any | []> = ref([]);
    const lifeStyleSelectList: Ref<any | []> = ref([]);

    const searchLifeStyle = useDebounceFn(async (query: string) => {
        try {
            const response = await $api.lifeStyle.get_life_style_type(query);
            if (response) {
                return jsonFormate(response?.data, 'title');
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    }, 500);

    const updateLifeStyle = async (lifeStyle: LifeStyle) => {
        try {
            const response = await $api.lifeStyle.create_life_style(
                getPayload('life_styles', [
                    {
                        life_style_type_id: lifeStyle.life_style_type_id,
                        value: lifeStyle.value,
                        duration: lifeStyle.duration,
                        duration_type: lifeStyle.duration_type,
                        note: lifeStyle.note,
                        weight: lifeStyle.weight,
                    },
                ]),
            );

            if (response) {
                const hasIndex = lifeStyleSelectedList.value.findIndex(
                    (item) => item.life_style_type_id === response.data[0].life_style_type_id,
                );
                lifeStyleSelectedList.value.splice(hasIndex, 1, response.data[0]);
            }
        } catch (error) {
            toast.add({ title: error, color: 'red' });
        }
    };

    const removedLifeStyle = (lifeStyle: Object) => {
        lifeStyleSelectList.value.splice(hasIndex(lifeStyle.uuid), 1);
    };

    const removedLifeStyleForPrescription = async (lifeStyle: LifeStyle) => {
        lifeStyleSelectedList.value.splice(
            lifeStyleSelectedList.value.findIndex((item: LifeStyle) => item.ref === lifeStyle.ref),
            1,
        );
        try {
            await $api.lifeStyle.delete(getPayload(undefined, lifeStyle));
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    const setLifeStyleSelectedData = (data: []) => {
        lifeStyleSelectedList.value = data;
    };

    const hasIndex = (key: any) => {
        return lifeStyleSelectList.value.findIndex((lifeStyleItem: any) => lifeStyleItem.uuid === key);
    };

    return {
        lifeStyleSelectedList,
        lifeStyleSelectList,
        searchLifeStyle,
        setLifeStyleSelectedData,
        removedLifeStyle,
        updateLifeStyle,
        removedLifeStyleForPrescription,
    };
});
