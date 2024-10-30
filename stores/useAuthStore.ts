import { defineStore } from 'pinia';
export const useAuthStore = defineStore('useAuthStore', () => {
    const { $api } = useNuxtApp();
    const toast = useToast();
    const { startCountdown } = useCountDown();

    const userInfo: Ref<Object | null> = ref({});
    const isLoginLoading: Ref<Boolean | false> = ref(false);

    const login = async (credentials: any) => {
        try {
            const response = await $api.auth.login(credentials);
            if (response) {
                const token = useCookie<any>('accessInfo');
                token.value = response.data?.access;
                setUserInfo(response?.data?.user);
                await navigateTo(`/dashboard`);
            }
        } catch (error) {
            toast.add({ title: error.data.message, color: 'red' });
        }
    };

    const register = (account: any): Promise<any> => {
        return $api.auth
            .register(account)
            .then((response) => {
                if (response) {
                    redirectForNextStep(response, account.contact_no);
                }
                startCountdown();
                return response.data;
            })
            .catch((error) => {
                throw error;
            });
    };

    const getProfile = async () => {
        try {
            const response = await $api.auth.getProfile();
            if (response) {
                setUserInfo(response?.data);
            }
            return response;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('user-profile-fetch:', error);
        }
    };

    const redirectForNextStep = async (response: any) => {
        if (response.data && !response.data?.OTP) {
            await navigateTo(`/otp-verify?code=+88&phone=${response.data.contact_no}`);
        }

        if (response.data?.OTP) {
            await navigateTo(`/otp-verify?code=+88&phone=${response.data.contact_no}&otp=${response.data?.OTP}`);
        }
    };

    const sendOTP = async (otp: String) => {
        try {
            const response = await $api.auth.otp(otp);
            if (response) {
                toast.add({ title: error.data.message });
                redirectForNextStep(response);
            }
        } catch (error) {
            toast.add({ title: error.data.message, color: 'red' });
        }
    };

    const changePassword = async (passwords: object) => {
        try {
            const response = await $api.auth.changePassword(passwords);
            if (response) {
                toast.add({ title: response.message });
            }
        } catch (error) {
            toast.add({ title: error.data.message, color: 'red' });
        }
    };

    const changeProfilePhoto = async (photo: object) => {
        try {
            const response = await $api.auth.profilePhoto(photo);
            if (response) {
                setUserInfo(response.data.user);
                toast.add({ title: response.message });
            }
        } catch (error) {
            toast.add({ title: error.data.message, color: 'red' });
        }
    };

    const uploadDocument = async (document: object) => {
        useLoading(true);
        try {
            const response = await $api.auth.uploadDocument(document);
            if (response) {
                removedSessionStorage('/doctors/documents');
                useLoading(false);
                window.location.href = '/dashboard/settings/profile';
                toast.add({ title: response.message });
            }
        } catch (error) {
            useLoading(false);
            toast.add({ title: response.message });
        }
    };

    const otpRequest = async (numberWithCountryCode: object) => {
        try {
            const response = await $api.auth.resendOTP(numberWithCountryCode);
            if (response) {
                toast.add({ title: response.message });
                response.data.contact_no = numberWithCountryCode.contact_no;
                redirectForNextStep(response);
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const verifyOTP = async (otp: Object) => {
        try {
            const response = await $api.auth.verifyOTP(otp);
            if (response) {
                const token = useCookie<any>('accessInfo');
                token.value = response.data?.access;
                setUserInfo(response?.data?.user);
                await navigateTo(`/dashboard`);
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const logoutUser = async () => {
        const token = useCookie<any>('accessInfo');
        const prescriptionInfo = useCookie<any>('prescription_initialized_info');

        try {
            const response = await $api.auth.logout();
            if (response) {
                prescriptionInfo.value = null;
                token.value = null;
                setUserInfo({});
                removedSessionStorage('/doctors/page-layout');
                window.location.href = '/login';
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    const isAuthenticated = computed(() => {
        return !!(userInfo.value && userInfo.value.id);
    });

    const user = computed(() => {
        return userInfo.value ? userInfo.value : '';
    });

    const setUserInfo = (user: object) => (userInfo.value = user);

    return {
        isLoginLoading,
        isAuthenticated,
        userInfo,
        user,
        login,
        register,
        sendOTP,
        otpRequest,
        uploadDocument,
        verifyOTP,
        logoutUser,
        getProfile,
        changePassword,
        changeProfilePhoto,
    };
});
