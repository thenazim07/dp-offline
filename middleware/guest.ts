import { useAuthStore } from '~/stores/useAuthStore';

export default defineNuxtRouteMiddleware(async () => {
    const { isAuthenticated } = storeToRefs(useAuthStore());
    if (isAuthenticated.value) {
        return await navigateTo('/dashboard');
    }
});
