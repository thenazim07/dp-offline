import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/useAuthStore';

export const manageAuth = () => {
    const authStore = useAuthStore();
    const { resetPrescription } = managePrescription();
    const { user, isAuthenticated } = storeToRefs(authStore);
    const {
        login,
        register,
        sendOTP,
        otpRequest,
        verifyOTP,
        logoutUser,
        changePassword,
        changeProfilePhoto,
        uploadDocument,
    } = authStore;

    const logout = () => {
        logoutUser().then((res: any) => {
            if (res) {
                window.location.href = '/login';
                resetPrescription();
            }
        });
    };

    return {
        isAuthenticated,
        user,
        login,
        register,
        sendOTP,
        otpRequest,
        verifyOTP,
        logout,
        changePassword,
        changeProfilePhoto,
        uploadDocument,
    };
};
