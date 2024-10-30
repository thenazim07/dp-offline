<script setup lang="ts">
definePageMeta({
    layout: 'empty',
    middleware: ['guest'],
});

const otpValue = ref('');
const { startCountdown, countdown } = useCountDown();
const { verifyOTP, otpRequest } = manageAuth();
const route = useRoute();

const countryCode = computed(() => route.query.code);
const phoneNumber = computed(() => route.query.phone);
const isEnabledConfirmButton = computed(() => String(otpValue.value || '0'));

const handleOnComplete = () => {
    const data = {
        otp: otpValue.value,
        contact_no: phoneNumber.value,
        country_calling_code: countryCode.value,
    };
    verifyOTP(data);
};

const resendOtp = () => {
    startCountdown();
    otpValue.value = undefined;
    otpRequest({
        country_calling_code: countryCode.value,
        contact_no: phoneNumber.value,
    });
};

const refreshing = ref(false);
// quick fix
const refreshAll = async () => {
    refreshing.value = true;
    try {
        await reloadNuxtApp();
    } finally {
        refreshing.value = false;
    }
};

onMounted(() => {
    refreshAll();
});
</script>

<template>
    <div class="flex min-h-screen flex-col items-center justify-between pt-6 sm:pt-0">
        <div></div>

        <div class="mx-auto max-w-xl">
            <div class="items-cneter flex justify-center pb-8">
                <img
                    class="h-auto w-auto"
                    src="~/assets/images/preview/mobile_message.svg"
                    alt=""
                />
            </div>

            <div class="mx-auto mb-12 max-w-lg text-center">
                <h2
                    class="font-poppins-bold pb-3 text-xl font-bold tracking-normal text-skin-dark 2xl:pb-6 2xl:text-4xl"
                >
                    Phone Verification
                </h2>

                <p class="font-poppins-regular text-center text-xl font-normal text-slate-500">
                    Please input the 6-digit OTP code that was sent to your contact number
                    <strong class="font-bold tracking-wider text-slate-950">{{ phoneNumber }}</strong> into the
                    designated field below.
                </p>
            </div>

            <div class="mb-6 flex justify-center">
                <UtilityOtpInput v-model="otpValue" />
            </div>

            <div class="text-center">
                <button
                    :disabled="isEnabledConfirmButton.length <= 5"
                    class="tracking-wides mb-3 inline-flex items-center justify-center rounded-md border border-transparent bg-skin-button-accent px-8 py-2 text-center text-lg font-semibold text-white transition hover:bg-skin-button-accent-hover focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 active:bg-skin-button-accent-hover disabled:opacity-25"
                    @click="handleOnComplete"
                >
                    Confirm code
                </button>
                <ClientOnly>
                    <p class="font-poppins-regular text-center text-base font-normal text-slate-800">
                        <span
                            v-if="countdown > 0 && countdown < 30"
                            class="ml-1.5"
                        >
                            Code In {{ countdown }}s
                        </span>
                        <strong
                            v-else
                            class="font-poppins-semibold cursor-pointer font-semibold hover:text-blue-500"
                            @click="resendOtp()"
                        >
                            Re-Send
                        </strong>
                    </p>
                </ClientOnly>
            </div>
        </div>

        <AccountPageFooter></AccountPageFooter>
    </div>
</template>
