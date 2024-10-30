import { useConfigsStore } from '~/stores/useConfigsStore';

export default defineNuxtPlugin(async (nuxtApp: any) => {
    const config = useConfigsStore(nuxtApp.$pinia);
    await config.initialize();
});
