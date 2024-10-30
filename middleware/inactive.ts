import { useAuthStore } from '~/stores/useAuthStore';

export default defineNuxtRouteMiddleware(async () => {
    const { isAuthenticated, userInfo } = storeToRefs(useAuthStore());

    if (!isAuthenticated.value) {
        return await navigateTo('/login');
    }

    if (isAuthenticated.value && userInfo?.value?.is_active) {
        return await navigateTo('/dashboard');
    }
});
