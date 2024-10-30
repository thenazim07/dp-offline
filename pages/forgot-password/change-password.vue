<script lang="ts" setup>
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';

import { useForgotPasswordStore } from '~/stores/useForgotPasswordStore';

definePageMeta({
    middleware: ['guest'],
    layout: 'empty',
});

const { changePassword } = useForgotPasswordStore();

const validationSchema = ref({});

validationSchema.value = toTypedSchema(
    zod
        .object({
            password: zod
                .string({
                    required_error: 'Password is required',
                })
                .min(6, 'Password must be 6 digits')
                .max(20),
            cpassword: zod
                .string({
                    required_error: 'Confirm New Password is required',
                })
                .min(6, 'Password must be 6 digits')
                .max(20),
        })
        .refine((data) => data.password === data.cpassword, {
            message: 'Passwords do not match',
            path: ['cpassword'],
        }),
);

const showPassword = ref('password');
const showPasswordAndHidePassword = (): void => {
    showPassword.value = showPassword.value === 'password' ? 'text' : 'password';
};

const route = useRoute();
const token = computed(() => route.query.token);

const onSubmit = (data: any) => {
    changePassword({
        token: token.value,
        ...data,
    });
};
</script>

<template>
    <main class="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div class="text-center">
            <h1 class="font-poppins-regular mt-4 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                Change Password?
            </h1>
            <p class="font-poppins-regular mt-2 text-base leading-7 text-gray-600">
                Change current password to new password
            </p>

            <VForm
                :validation-schema="validationSchema"
                @submit="onSubmit"
            >
                <div class="mx-auto mt-10 w-full max-w-xl">
                    <div class="w-full">
                        <div class="mb-5">
                            <div class="relative text-left">
                                <FormInput
                                    :is-required="true"
                                    :type="showPassword"
                                    label="Password"
                                    class="block h-12 w-full font-normal tracking-wide"
                                    name="password"
                                />
                                <div class="absolute right-4 top-3.5">
                                    <EyeIcon
                                        v-if="showPassword === 'password'"
                                        class="h-5 w-auto cursor-pointer text-slate-500 hover:text-slate-700"
                                        @click="showPasswordAndHidePassword()"
                                    ></EyeIcon>

                                    <EyeSlashIcon
                                        v-else
                                        class="h-5 w-auto cursor-pointer text-slate-500 hover:text-slate-700"
                                        @click="showPasswordAndHidePassword()"
                                    ></EyeSlashIcon>
                                </div>
                            </div>
                        </div>

                        <div class="mb-5">
                            <div class="relative text-left">
                                <FormInput
                                    :is-required="true"
                                    :type="showPassword"
                                    label="Confirm New Password"
                                    class="block h-12 w-full font-normal tracking-wide"
                                    name="cpassword"
                                />
                                <div class="absolute right-4 top-3.5">
                                    <EyeIcon
                                        v-if="showPassword === 'password'"
                                        class="h-5 w-auto cursor-pointer text-slate-500 hover:text-slate-700"
                                        @click="showPasswordAndHidePassword()"
                                    ></EyeIcon>

                                    <EyeSlashIcon
                                        v-else
                                        class="h-5 w-auto cursor-pointer text-slate-500 hover:text-slate-700"
                                        @click="showPasswordAndHidePassword()"
                                    ></EyeSlashIcon>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        :disabled="false"
                        class="font-poppins-semibold inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-500 px-5 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        tabindex="0"
                    >
                        Change Password
                    </button>
                </div>
            </VForm>
        </div>
    </main>
</template>
