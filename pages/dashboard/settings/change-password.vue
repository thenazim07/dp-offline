<script lang="ts" setup>
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';
import { object, ref as refs, string } from 'yup';
const { changePassword } = manageAuth();
definePageMeta({
    middleware: ['auth'],
});

const showPassword = ref('password');

const schema = object({
    current_password: string().required().label('Current Password'),
    new_password: string().required().min(6).label('New Password'),
    new_password_confirmation: string()
        .required()
        // @ts-ignore
        .oneOf([refs('new_password')], 'Passwords do not match'),
});

const showPasswordAndHidePassword = () => {
    showPassword.value = showPassword.value === 'password' ? 'text' : 'password';
};

const changeProfilePassword = (values: object, { resetForm }) => {
    changePassword(values);
    resetForm();
};

const links = [
    {
        label: 'Home',
        icon: 'i-heroicons-home',
        to: '/dashboard',
    },
    {
        label: 'Profile',
        icon: 'i-heroicons-user',
        to: '/dashboard/settings/profile',
    },
    {
        label: 'Change Password',
        icon: 'i-heroicons-lock-open',
    },
];
</script>

<template>
    <div class="min-h-screen bg-skin-for-page sm:pt-0">
        <ClientOnly>
            <Teleport to="#navbar">
                <div class="mr-0 flex w-full max-w-[100rem] items-center justify-between sm:pr-8">
                    <UBreadcrumb :links="links" />
                </div>
            </Teleport>
        </ClientOnly>
        <div class="mx-auto mt-10 w-full max-w-xl overflow-hidden bg-white p-10 shadow sm:rounded-lg 2xl:max-w-[39rem]">
            <div class="pb-8">
                <h2 class="font-poppins-regular pb-2 text-center text-2xl font-normal text-slate-800">
                    Change Password
                </h2>
                <p class="font-poppins-regular text-center text-base font-normal text-slate-500">
                    Change current password to new password
                </p>
            </div>

            <VForm
                :validation-schema="schema"
                @submit="changeProfilePassword"
            >
                <div class="mb-5">
                    <LibFormBaseInputField
                        for="current_password"
                        label="Current Password"
                        :required="true"
                    >
                        <VField
                            id="current_password"
                            ref="input"
                            name="current_password"
                            :type="showPassword"
                            class="form-control peer"
                            placeholder=" "
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
                    </LibFormBaseInputField>
                    <VErrorMessage
                        name="current_password"
                        class="font-poppins-regular text-xs italic text-red-500"
                    ></VErrorMessage>
                </div>

                <div class="mb-5">
                    <LibFormBaseInputField
                        for="new_password"
                        label="New Password"
                        :required="true"
                    >
                        <VField
                            id="new_password"
                            ref="input"
                            name="new_password"
                            :type="showPassword"
                            class="form-control peer"
                            placeholder=" "
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
                    </LibFormBaseInputField>
                    <VErrorMessage
                        name="new_password"
                        class="font-poppins-regular text-xs italic text-red-500"
                    ></VErrorMessage>
                </div>

                <div class="mb-5">
                    <LibFormBaseInputField
                        :required="true"
                        for="new_password_confirmation"
                        label="Confirm New Password"
                    >
                        <VField
                            id="new_password_confirmation"
                            ref="input"
                            name="new_password_confirmation"
                            :type="showPassword"
                            class="form-control peer"
                            placeholder=" "
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
                    </LibFormBaseInputField>
                    <VErrorMessage
                        name="new_password_confirmation"
                        class="font-poppins-regular text-xs italic text-red-500"
                    ></VErrorMessage>
                </div>
                <div class="">
                    <LibButtonsPrimaryButton
                        type="submit"
                        class="py-3 text-base"
                    >
                        Change Password
                    </LibButtonsPrimaryButton>
                </div>
            </VForm>
        </div>
    </div>
</template>
