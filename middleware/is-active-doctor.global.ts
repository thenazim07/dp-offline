import { useAuthStore } from '~/stores/useAuthStore';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { userInfo, isAuthenticated } = storeToRefs(useAuthStore());

    if (
        to.path !== '/login' &&
        to.path !== '/register' &&
        to.path !== '/doctor-inactive' &&
        to.path !== '/forgot-password' &&
        to.path !== '/forgot-password/change-password' &&
        !to.path.includes('/otp-verify')
    ) {
        if (!isAuthenticated) {
            return await navigateTo('/login');
        }

        if (!userInfo?.value?.is_active) {
            return await navigateTo('/doctor-inactive');
        }
    }
});
