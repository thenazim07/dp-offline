<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { storeToRefs } from 'pinia';
import { format } from 'date-fns';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';
import VueDatePicker from '@vuepic/vue-datepicker';
import { useAuthStore } from '~/stores/useAuthStore';
import { useConfigsStore } from '~/stores/useConfigsStore';
import '@vuepic/vue-datepicker/dist/main.css';
const auth = useAuthStore();
const { register } = auth;
const { fetchConfigLegalsData } = useConfigsStore();
const { genders, doctorTitles, privacyPolicy, termsAndConditions, doctorTypes } = storeToRefs(useConfigsStore());

definePageMeta({
    layout: 'empty',
    middleware: ['guest'],
});

fetchConfigLegalsData();
const isOpen = ref(false);
const legalsData = ref(null);
const accept = ref(true);
const minDate = ref(null);

const viewModalData = computed<any>(() => {
    return unref(legalsData.value);
});

const formSchema = toTypedSchema(
    z
        .object({
            title: z
                .string()
                .regex(/^[a-zA-Z\s.-]+$/, {
                    message: 'Title can only contain letters, spaces, dots, and hyphens',
                })
                .min(2, { message: 'Title must be at least 2 characters long' })
                .max(50, { message: 'Title cannot exceed 50 characters' }),

            type: z.string(),
            first_name: z
                .string()
                .min(2, 'Name at least 2 characters')
                .max(50, 'Cannot exceed 50 characters')
                .regex(/^(?!\s)[a-zA-Z\s]*$/),
            last_name: z
                .string()
                .min(2, 'Name at least 2 characters')
                .max(50, 'Cannot exceed 50 characters')
                .regex(/^(?!\s)[a-zA-Z\s]*$/),
            nid_no: z.string().min(6).max(17).regex(/^\d+$/),
            email: z.string().email(),
            contact_no: z.string().regex(/^01[3-9]\d{8}$/),
            password: z.string().min(6, 'Password at least 6 characters').max(20),
            confirmPassword: z.string().min(6, 'Password at least 6 characters').max(20),
            gender: z.string(),
            reg_no: z
                .string()
                .regex(/^[0-9A-Za-z]+$/, {
                    message: 'Only contain alpha numeric characters',
                })
                .min(3)
                .max(10),

            dob_value: z.date({
                required_error: 'A date of birth is required.',
            }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        }),
);

const { setValues, setFieldValue } = useForm({
    validationSchema: formSchema,
});

const showPassword = ref('password');

const showPasswordAndHidePassword = (): void => {
    showPassword.value = showPassword.value === 'password' ? 'text' : 'password';
};

const formData: Ref<any> = ref({
    title: null,
    gender: '',
    type: '',
    date: '',
});

const startDate = ref(new Date(new Date().getFullYear() - 15, 1));

const { pending, execute, error } = await useLazyAsyncData('register', () => register(formData.value), {
    immediate: false,
});

pending.value = false;

const registerForm = async (values: any, actions: any) => {
    const propertiesToKeep = ['title', 'type', 'gender'];

    formData.value = Object.fromEntries(
        Object.entries(formData.value).filter(([key]) => propertiesToKeep.includes(key)),
    );

    setValues(unref(formData));

    formData.value = { ...values };
    formData.value.dob = format(formData.value?.dob_value, 'yyyy-MM-dd');

    await execute();

    if (error.value) {
        actions.setFieldError('email', error?.value?.data?.errors.email);
        actions.setFieldError('contact_no', error?.value?.data?.errors.contact_no);
        setFieldValue('dob_value', values.dob_value);
        formData.value.dob_value = formData.value.date;
    }
};

const setIsOpen = (openOrClose: boolean, legalsFor: String) => {
    if (legalsFor === 'privacy_policy') {
        // @ts-ignore
        legalsData.value = privacyPolicy;
    }

    if (legalsFor === 'terms_and_conditions') {
        // @ts-ignore
        legalsData.value = termsAndConditions;
    }
    isOpen.value = openOrClose;
};

const titles = computed(() => doctorTitles?.value?.map((item: any) => item.name));
const genderList = computed(() => genders?.value?.map((item: any) => item.name));
const doctorTypeList = computed(() => doctorTypes?.value?.map((item: any) => item.value));

onMounted(() => {
    const today = new Date();
    const minDateValue = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
    minDate.value = minDateValue;
});

const selectMenu = {
    base: 'font-normal text-sm',
    color: {
        white: {
            outline: 'ring-slate-200 h-12 shadow-none',
        },
    },
    padding: {
        sm: 'px-4',
    },
};

const titleBox: Ref<any> = ref(null);

const setFocus = () => {
    nextTick(() => {
        const inputElement = document.getElementById(titleBox.value?.inputId);
        const buttonID = document.querySelector('.input-button');
        inputElement?.addEventListener('focus', () => {
            if (formData?.value?.title === null && buttonID) {
                buttonID.click();
            }
        });
    });
};

onMounted(setFocus);
onUnmounted(() => {
    formData.value.title = null;
});
</script>

<template>
    <div class="flex min-h-screen flex-col items-center bg-skin-for-page pt-6 sm:justify-between sm:pt-0">
        <div></div>
        <div class="w-full pb-12">
            <div class="flex w-full justify-center py-5">
                <UtilityApplicationNewLogo class="w-[350px]" />
            </div>
            <div class="mx-auto w-full max-w-2xl bg-white p-8 shadow sm:rounded-lg">
                <!--title section-->
                <article class="mb-5 2xl:mb-6">
                    <h1
                        class="font-poppins-bold pb-1 text-xl font-bold tracking-normal text-gray-950 2xl:pb-2 2xl:text-3xl"
                    >
                        Registration
                    </h1>
                    <p class="font-poppins-regular text-sm font-normal tracking-normal text-gray-950 2xl:text-base">
                        Prescribe with Precision, Anytime, Anywhere
                    </p>
                </article>

                <!--form section-->
                <ClientOnly>
                    <VForm
                        class="mb-6 space-y-2"
                        :validation-schema="formSchema"
                        @submit="registerForm"
                    >
                        <div>
                            <UFormGroup class="relative">
                                <template #label>
                                    <span
                                        class="absolute -top-2 left-2 z-10 origin-[0] bg-white px-2 text-xs font-normal text-gray-400"
                                    >
                                        Title
                                        <!-- <span class="text-red-500">*</span> -->
                                    </span>
                                </template>

                                <template #default>
                                    <VField
                                        v-slot="{ field }"
                                        name="title"
                                    >
                                        <UInputMenu
                                            id="input-he"
                                            ref="titleBox"
                                            v-bind="field"
                                            v-model:query="formData.title"
                                            :ui="{
                                                color: {
                                                    white: {
                                                        outline:
                                                            'ring-0 ring-slate-200 focus:outline-none focus:ring-0 h-12 shadow-none',
                                                    },
                                                },
                                                shadow: 'shadow-none',
                                                ring: 'ring-0',
                                                icon: {
                                                    trailing: {
                                                        wrapper: 'input-button',
                                                    },
                                                },
                                            }"
                                            placeholder="Ex: Dr."
                                            :trailing="true"
                                            class="h-12 w-full border-red-500 lg:w-full"
                                            option-attribute="name"
                                            :options="titles"
                                        />

                                        <div class="h-5">
                                            <VErrorMessage
                                                class="font-poppins-regular text-xs italic text-red-500"
                                                name="title"
                                            />
                                        </div>
                                    </VField>
                                </template>
                            </UFormGroup>
                        </div>

                        <div class="grid grid-cols-2 gap-x-6">
                            <div>
                                <FormInput
                                    :is-required="true"
                                    type="text"
                                    label="First name"
                                    class="block h-12 w-full font-normal tracking-wide"
                                    name="first_name"
                                />
                            </div>

                            <div>
                                <FormInput
                                    :is-required="true"
                                    type="text"
                                    label="Last name"
                                    class="block h-12 w-full font-normal tracking-wide"
                                    name="last_name"
                                />
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-x-6">
                            <VField
                                v-slot="{ field }"
                                name="dob_value"
                                as="div"
                                class="text-sm font-normal text-gray-400"
                            >
                                <VueDatePicker
                                    v-bind="field"
                                    v-model="formData.date"
                                    name="dob_value"
                                    :enable-time-picker="false"
                                    :max-date="minDate"
                                    :start-date="startDate"
                                    placeholder="Date of birth"
                                    required
                                >
                                </VueDatePicker>

                                <div class="mt-1 h-5">
                                    <VErrorMessage
                                        class="font-poppins-regular text-xs italic text-red-500"
                                        name="dob_value"
                                    />
                                </div>
                            </VField>

                            <UFormGroup class="relative">
                                <template #label>
                                    <span
                                        class="absolute -top-2 left-2 z-10 origin-[0] bg-white px-2 text-xs font-normal text-gray-400"
                                    >
                                        Gender <span class="text-red-500">*</span>
                                    </span>
                                </template>

                                <template #default>
                                    <VField
                                        v-slot="{ field }"
                                        name="gender"
                                        as="div"
                                    >
                                        <USelectMenu
                                            v-bind="field"
                                            v-model="formData.gender"
                                            :ui="selectMenu"
                                            option-attribute="name"
                                            class="h-12 w-full border-red-500 lg:w-full"
                                            placeholder="Select Gender"
                                            :options="genderList"
                                        >
                                        </USelectMenu>

                                        <div class="h-5">
                                            <VErrorMessage
                                                class="font-poppins-regular text-xs italic text-red-500"
                                                name="gender"
                                            />
                                        </div>
                                    </VField>
                                </template>
                            </UFormGroup>
                        </div>

                        <div>
                            <FormInput
                                :is-required="true"
                                type="text"
                                label="National ID / Passport number"
                                class="block h-12 w-full font-normal tracking-wide"
                                name="nid_no"
                            />
                        </div>

                        <div class="grid grid-cols-2 gap-x-6">
                            <div>
                                <FormInput
                                    :is-required="true"
                                    type="text"
                                    label="Registration number (BMDC)"
                                    class="block h-12 w-full font-normal tracking-wide"
                                    name="reg_no"
                                />
                            </div>

                            <UFormGroup class="relative">
                                <template #label>
                                    <span
                                        class="absolute -top-2 left-2 z-10 origin-[0] bg-white px-2 text-xs font-normal text-gray-400"
                                    >
                                        Doctor Type <span class="text-red-500">*</span>
                                    </span>
                                </template>

                                <template #default>
                                    <VField
                                        v-slot="{ field }"
                                        name="type"
                                        as="div"
                                    >
                                        <USelectMenu
                                            v-bind="field"
                                            v-model="formData.type"
                                            :ui="selectMenu"
                                            option-attribute="name"
                                            class="h-12 w-full border-red-500 lg:w-full"
                                            placeholder="Select Type"
                                            :options="doctorTypeList"
                                        >
                                            <template
                                                v-if="formData.type"
                                                #label
                                            >
                                                <span
                                                    class="truncate capitalize"
                                                    aria-hidden="true"
                                                >
                                                    {{ formData.type }}
                                                </span>
                                            </template>
                                            <template #option="{ option: person }">
                                                <span class="capitalize">{{ person }}</span>
                                            </template>
                                        </USelectMenu>

                                        <div class="h-5">
                                            <VErrorMessage
                                                class="font-poppins-regular text-xs italic text-red-500"
                                                name="type"
                                            />
                                        </div>
                                    </VField>
                                </template>
                            </UFormGroup>
                        </div>

                        <div>
                            <div class="flex items-start">
                                <div
                                    class="flex h-12 w-32 cursor-pointer items-center justify-center space-x-1 rounded-l-md border-b border-l border-t"
                                >
                                    <div class="flex flex-shrink-0">
                                        <img
                                            class="h-auto w-4 sm:w-6"
                                            src="https://doctime-core-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/images/country-flags/flag-800.png"
                                            alt=""
                                        />
                                    </div>
                                    <div>
                                        <p class="font-poppins-regular m-0 text-xs text-slate-700 sm:text-base">+ 88</p>
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <FormInput
                                        :is-required="true"
                                        type="text"
                                        label="Mobile Number"
                                        class="block h-12 w-full rounded-l-none font-normal tracking-wide"
                                        name="contact_no"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <FormInput
                                :is-required="true"
                                type="email"
                                label="Email"
                                class="block h-12 w-full font-normal tracking-wide"
                                name="email"
                            />
                        </div>

                        <div class="grid grid-cols-2 gap-x-6">
                            <div class="relative">
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

                            <div class="relative">
                                <FormInput
                                    :is-required="true"
                                    :type="showPassword"
                                    label="Confirm Password"
                                    class="block h-12 w-full font-normal tracking-wide"
                                    name="confirmPassword"
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

                        <div class="flex items-center pb-3">
                            <LibFormCheckbox
                                v-model="accept"
                                :checked="accept"
                                required
                            ></LibFormCheckbox>
                            <label
                                for="accept"
                                class="ml-2 text-xs font-medium text-slate-800"
                            >
                                By clicking on register, you agree to our
                                <span
                                    class="cursor-pointer text-skin-base hover:underline"
                                    @click="setIsOpen(true, 'terms_and_conditions')"
                                >
                                    Terms & conditions
                                </span>
                                and
                                <span
                                    class="cursor-pointer text-skin-base hover:underline"
                                    @click="setIsOpen(true, 'privacy_policy')"
                                >
                                    Privacy policy
                                </span>
                            </label>
                        </div>
                        <UButton
                            type="submit"
                            class="py-3"
                            :disabled="Boolean(!accept || pending)"
                            :loading="Boolean(pending)"
                            block
                            color="blue"
                        >
                            Register
                        </UButton>
                    </VForm>

                    <p class="font-poppins-regular text-center text-skin-dark">
                        Already have an account?
                        <NuxtLink
                            to="/login"
                            class="text-base text-skin-base"
                        >
                            Login
                        </NuxtLink>
                    </p>

                    <template #fallback>
                        <div class="space-y-6">
                            <USkeleton class="mb-6 h-12 w-full" />
                            <USkeleton class="mb-6 h-12 w-full" />
                            <div class="flex items-center justify-between">
                                <USkeleton class="h-12 w-56" />
                                <USkeleton class="h-12 w-56" />
                            </div>
                            <USkeleton
                                v-for="n in 5"
                                :key="n"
                                class="mb-6 h-12 w-full"
                            />
                            <USkeleton class="mx-auto h-5 w-72" />
                        </div>
                    </template>
                </ClientOnly>
            </div>
        </div>

        <AccountPageFooter></AccountPageFooter>

        <UModal
            v-model="isOpen"
            :ui="{ width: 'lg:max-w-2xl' }"
        >
            <div class="flex justify-end pr-1 pt-2">
                <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-x-mark-20-solid"
                    class="-my-1"
                    @click="isOpen = false"
                />
            </div>

            <div class="px-4">
                <div class="mt-2">
                    <h1 class="font-poppins-bold text-xl font-bold text-slate-800">
                        {{ viewModalData.title }}
                    </h1>

                    <div
                        class="prose prose-sm prose-slate mx-auto w-full pb-16 prose-a:font-normal prose-a:text-sky-500 hover:prose-a:text-sky-600"
                    >
                        <p v-html="viewModalData.content"></p>
                    </div>
                </div>
            </div>
        </UModal>
    </div>
</template>

<style>
input.dp__pointer.dp__input_readonly.dp__input.dp__input_icon_pad.dp__input_reg {
    @apply h-12 rounded-md text-sm hover:border-slate-200 focus:border-slate-200 focus:outline-none !important;
}
</style>
