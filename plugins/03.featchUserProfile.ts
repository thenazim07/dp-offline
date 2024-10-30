import { useAuthStore } from '~/stores/useAuthStore';

export default defineNuxtPlugin(async (nuxtApp: any) => {
    const auth = useAuthStore(nuxtApp.$pinia);
    const accessInfo = useCookie<any>('accessInfo');
    if (!accessInfo?.value?.token) return undefined;
    try {
        await auth.getProfile();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.debug('profile-api', error);
    }
});
