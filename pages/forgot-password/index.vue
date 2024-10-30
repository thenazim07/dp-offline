<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';
import { useForgotPasswordStore } from '~/stores/useForgotPasswordStore';
definePageMeta({ middleware: ['guest'], layout: 'empty' });
const { sendOTP, verifyOTP } = useForgotPasswordStore();

const validationSchema = ref({});

validationSchema.value = toTypedSchema(
    zod.object({
        contact: zod
            .string({
                required_error: 'Mobile Number is required',
            })
            .regex(/^01[3-9]\d{8}$/),
    }),
);

// Otp Section
const otpValue: Ref<any> = ref('');
const route = useRoute();
const countryCode = computed(() => route.query.code);
const phoneNumber = computed(() => route.query.phone);
const isEnabledConfirmButton = computed(() => String(otpValue.value || '0'));

const { startCountdown, countdown } = useCountDown();

const resendOtp = () => {
    startCountdown();
    sendOTP({
        contact: phoneNumber.value,
        country_calling_code: countryCode.value,
    });
    otpValue.value = undefined;
};

const handleOnComplete = () => {
    const data = {
        otp: otpValue.value,
        contact: phoneNumber.value,
        country_calling_code: countryCode.value,
    };
    verifyOTP(data);
};
</script>

<template>
    <div>
        <main
            v-if="!route.query.phone"
            class="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8"
        >
            <div class="text-center">
                <div class="mx-auto h-36 w-36">
                    <img
                        class="h-auto w-auto object-cover"
                        src="/images/lock.svg"
                        alt=""
                    />
                </div>
                <h1 class="font-poppins-bold mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Forgot Your Password?
                </h1>
                <p class="font-poppins-regular mt-4 text-center text-xl font-normal text-slate-500">
                    Please enter your mobile number. We will <br />
                    send OTP to verify your identity
                </p>
                <VForm
                    :validation-schema="validationSchema"
                    @submit="sendOTP"
                >
                    <div class="mt-10 w-full max-w-xs">
                        <div class="mb-3 w-full text-left">
                            <FormInput
                                :is-required="true"
                                type="text"
                                label="Mobile Number"
                                class="block h-12 w-full"
                                name="contact"
                            />
                        </div>

                        <button
                            type="submit"
                            :disabled="false"
                            class="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-500 px-5 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            tabindex="0"
                        >
                            Send OTP
                        </button>
                    </div>
                </VForm>
            </div>
        </main>

        <main
            v-if="route.query.phone"
            class="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8"
        >
            <div class="mx-auto max-w-xl">
                <div class="flex items-center justify-center pb-8">
                    <img
                        class="h-auto w-auto"
                        src="~/assets/images/preview/mobile_message.svg"
                        alt=""
                    />
                </div>

                <div class="mx-auto mb-12 max-w-lg text-center">
                    <h2
                        class="font-poppins-bold pb-3 text-3xl font-bold tracking-normal text-skin-dark 2xl:pb-6 2xl:text-4xl"
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

                    <p class="font-poppins-regular text-center text-base font-normal text-slate-800">
                        <span
                            v-if="countdown > 0 && countdown < 30"
                            class="ml-1.5"
                        >
                            Code In {{ countdown }}s
                        </span>
                        <strong
                            v-else
                            class="cursor-pointer font-semibold underline hover:text-blue-500"
                            @click="resendOtp()"
                        >
                            Re-Send
                        </strong>
                    </p>
                </div>
            </div>
        </main>
    </div>
</template>
