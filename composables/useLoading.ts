import { storeToRefs } from 'pinia';
import { useConfigsStore } from '~/stores/useConfigsStore';

const useLoading = (value: boolean) => {
    const { loading } = storeToRefs(useConfigsStore());
    loading.value = value;
};

export default useLoading;
