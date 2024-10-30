import { defineStore } from 'pinia';
import type { ILifeStyle, IMostUsedLifeStyle } from '~/repository/modules/EHR/LifestyleHistory/types';
import { v4 as uuid } from 'uuid';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';

export const useEhrLifeStyleStoreRoot = defineStore('ehr-life-style-store-root', () => {
    const { $api } = useNuxtApp();
    const lifeStyleList: Ref<ILifeStyle[]> = ref([emptyLifeStyle()]);
    const mostUsedLifeStyleList = ref<IMostUsedLifeStyle[]>([]);

    //helper method
    const getAvailableLifeStyle = computed(() => lifeStyleList.value.slice(0, -1));

    const getOnlySelectedLifeStyleNames = computed(() =>
        getAvailableLifeStyle.value.map((lifeStyle: ILifeStyle) => lifeStyle.type),
    );

    function updateIndication<T extends keyof ILifeStyle>(index: number, key: T, value: ILifeStyle[T]) {
        lifeStyleList.value.splice(index, 1, {
            ...lifeStyleList.value[index],
            [key]: value,
        });

        if (index === lifeStyleList.value.length - 1) {
            addNewBlankLifeStyle();
        }
    }

    function addNewBlankLifeStyle() {
        lifeStyleList.value.push(emptyLifeStyle());
    }

    function addNewLifeStyle<T extends keyof ILifeStyle>(data?: Record<T, ILifeStyle[T]>) {
        const index = lifeStyleList.value.length === 0 ? 0 : lifeStyleList.value.length - 1;
        lifeStyleList.value = [
            ...lifeStyleList.value.slice(0, index),
            emptyLifeStyle(data),
            ...lifeStyleList.value.slice(index),
        ];
    }

    function emptyLifeStyle<T extends keyof ILifeStyle>(data?: Record<T, ILifeStyle[T]>): ILifeStyle {
        const defaultLifeStyle: ILifeStyle = {
            life_style_type_id: undefined,
            value: '',
            type: '',
            duration: undefined,
            duration_type: '',
            duration_locale: 'en',
            note: '',
            uuid: uuid(),
        };

        return {
            ...defaultLifeStyle,
            ...data,
        };
    }

    function deleteLifeStyle(index: number): void {
        lifeStyleList.value = lifeStyleList.value.filter((_, i) => i !== index);
    }

    function isAlreadySelected(name: string): boolean {
        return getOnlySelectedLifeStyleNames.value.includes(name);
    }

    const savingStatusStore = usePrescriptionSavingStatusStore();
    const { status } = storeToRefs(savingStatusStore);
    const toast = useToast();

    const syncWithServer = async () => {
        try {
            status.value.past_history_life_style.status = 'pending';

            const list = useRemoveObjectWithEmptyProperty(getAvailableLifeStyle.value, 'type').map((item) => {
                const _item = { ...item };
                delete _item.type;
                return _item;
            });

            const response = await $api.lifeStyle.create_life_style(getPayload('life_styles', list));

            console.log(response, 'success-ehr-life-style-store-api');

            updateServerData(response?.data);

            savingStatusStore.changeStatusSuccess('past_history_life_style');
        } catch (e) {
            // console.log('lifestyle save error',e);
            status.value.past_history_life_style.status = 'failed';
            toast.add({
                title: 'Your internet connection is slow </br> Some changes could not be saved',
                color: 'red',
            });
        } finally {
            // status.value.past_history_life_style.loading = false;
        }
    };

    function updateServerData(_lifeStyle: ILifeStyle[]) {
        lifeStyleList.value = [..._lifeStyle.map((lifeStyle) => ({ ...lifeStyle, uuid: uuid() })), emptyLifeStyle()];
    }

    function removeLifeStyleFromPrescription(uuid: string) {
        const lifeStyle = lifeStyleList.value.find((item) => item.uuid === uuid);

        if (!lifeStyle) return;

        lifeStyleList.value = lifeStyleList.value.filter((item) => item.uuid !== lifeStyle.uuid);

        if (!lifeStyle.ref) return;

        $api.lifeStyle.delete(getPayload(undefined, lifeStyle));
    }

    async function fetchMostUsedLifeStyle() {
        try {
            const response = await $api.lifeStyle.mostUsed();
            if (response) {
                mostUsedLifeStyleList.value = response.data || [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    function $reset() {
        lifeStyleList.value = [emptyLifeStyle()];
    }

    return {
        // states
        mostUsedLifeStyleList,

        //getters
        lifeStyleList,
        getAvailableLifeStyle,

        //actions
        syncWithServer,
        updateServerData,
        addNewLifeStyle,
        updateIndication,
        isAlreadySelected,
        deleteLifeStyle,
        removeLifeStyleFromPrescription,
        fetchMostUsedLifeStyle,
        $reset,
    };
});
