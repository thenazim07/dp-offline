<script setup lang="ts">
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';
import { useAuthStore } from '~/stores/useAuthStore';
const auth = useAuthStore();
const { login } = auth;

definePageMeta({
    middleware: ['guest'],
    layout: 'empty',
});

const showPassword = ref('password');

const showPasswordAndHidePassword = () => {
    showPassword.value = showPassword.value === 'password' ? 'text' : 'password';
};

const validationSchema = ref({});

validationSchema.value = toTypedSchema(
    zod.object({
        contact: zod.string({
            required_error: 'Email or Phone number is required',
        }),

        password: zod.string({
            required_error: 'Password is required',
        }),
    }),
);

const formData = ref({});

const { pending, execute, error } = await useLazyAsyncData('login', () => login(formData.value), {
    immediate: false,
});

pending.value = false;

const onSubmit = async (value: any, actions: any) => {
    formData.value = { ...value };
    await execute();
    if (error.value?.data) {
        actions.setFieldError('contact', error.value?.data?.message);
    }
};
</script>

<template>
    <div class="flex min-h-screen flex-col items-center bg-skin-for-page pt-6 sm:justify-between sm:pt-0">
        <div></div>
        <div class="w-full">
            <div class="flex w-full justify-center pb-8">
                <UtilityApplicationNewLogo class="w-[350px]" />
            </div>
            <div class="mx-auto w-full overflow-hidden bg-white p-8 shadow sm:rounded-lg xl:max-w-xl 2xl:max-w-2xl">
                <!--title section-->
                <article class="mb-5 2xl:mb-6">
                    <h1
                        class="font-poppins-bold pb-1 text-xl font-bold tracking-normal text-gray-950 2xl:pb-2 2xl:text-3xl"
                    >
                        Login
                    </h1>
                    <p class="font-poppins-regular text-sm font-normal tracking-normal text-gray-950 2xl:text-base">
                        Prescribe with Precision, Anytime, Anywhere
                    </p>
                </article>

                <ClientOnly>
                    <div>
                        <VForm
                            class="mb-6 space-y-2"
                            :validation-schema="validationSchema"
                            @submit="onSubmit"
                        >
                            <div class="text-right">
                                <FormInput
                                    :is-required="true"
                                    type="text"
                                    label="Phone number or Email"
                                    class="block h-12 w-full font-semibold tracking-wide"
                                    name="contact"
                                />
                            </div>

                            <div class="relative text-right">
                                <FormInput
                                    :is-required="true"
                                    :type="showPassword"
                                    label="Password"
                                    class="block h-12 w-full font-semibold tracking-wide"
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

                            <div class="flex items-center justify-end pb-2">
                                <!--forgot password-->
                                <div>
                                    <NuxtLink
                                        to="/forgot-password"
                                        class="font-poppins-regular text-center text-sm text-skin-base"
                                    >
                                        Forgot Password?
                                    </NuxtLink>
                                    <a href="http://localhost:8000"> Backend </a>
                                </div>
                            </div>

                            <UButton
                                color="blue"
                                class="w-full py-3"
                                block
                                :loading="pending"
                                type="submit"
                            >
                                Login
                            </UButton>
                        </VForm>

                        <p class="font-poppins-regular text-center text-skin-dark">
                            Don't have an account?
                            <NuxtLink
                                to="/register"
                                class="text-base text-skin-base"
                            >
                                Register
                            </NuxtLink>
                        </p>
                    </div>
                    <template #fallback>
                        <div class="space-y-6">
                            <USkeleton class="mb-6 h-12 w-full" />
                            <USkeleton class="mb-6 h-12 w-full" />
                            <div class="flex items-center justify-between">
                                <USkeleton class="h-6 w-56" />
                                <USkeleton class="h-6 w-56" />
                            </div>
                            <USkeleton class="mb-6 h-12 w-full" />
                            <USkeleton class="mx-auto h-5 w-72" />
                        </div>
                    </template>
                </ClientOnly>
            </div>
        </div>
        <AccountPageFooter></AccountPageFooter>
    </div>
</template>
