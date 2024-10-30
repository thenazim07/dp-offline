import { defineStore } from 'pinia';

export const useForgotPasswordStore = defineStore('useForgotPasswordStore', () => {
    const { $api } = useNuxtApp();
    const toast = useToast();

    const sendOTP = async (mobileNumberWithCountryCode: object) => {
        try {
            const response = await $api.auth.sendMobileNumber(mobileNumberWithCountryCode);
            if (response) {
                toast.add({ title: response.message });
                redirectForNextStep(response, mobileNumberWithCountryCode.contact);
            }
        } catch (error) {
            toast.add({ title: error.data.message, color: 'red' });
        }
    };

    const verifyOTP = async (otpWithCountryCode: Object) => {
        try {
            const response = await $api.auth.verifyOTPForResetPassword(otpWithCountryCode);
            if (response) {
                await navigateTo(`/forgot-password/change-password?token=${response.data.token}`);
            }
        } catch (error) {
            toast.add({ title: error.data.message, color: 'red' });
        }
    };

    const changePassword = async (passwordWithToken: Object) => {
        try {
            const response = await $api.auth.resetPassword(passwordWithToken);
            if (response) {
                toast.add({ title: 'Password changed successfully', color: 'green' });
                navigateTo('/login');
            }
        } catch (error) {
            toast.add({ title: error.data.message, color: 'red' });
        }
    };

    const redirectForNextStep = async (response: any, contact: any) => {
        if (response.data && !response.data?.OTP) {
            await navigateTo(`/forgot-password?code=+88&phone=${contact}`);
        }

        if (response.data?.OTP) {
            await navigateTo(`/forgot-password?code=+88&phone=${contact}&otp=${response.data?.OTP}`);
        }
    };

    return {
        sendOTP,
        verifyOTP,
        changePassword,
    };
});
