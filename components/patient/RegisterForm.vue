<script lang="ts" setup>
import { configure } from 'vee-validate';

import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';
import { useConfigsStore } from '~/stores/useConfigsStore';
import { usePatientStore } from '~~/stores/usePatientStore';
import { useDoctorPatientStore } from '~/stores/doctor/patient/index';
import { usePrescriptionFinishedStore } from '~/stores/prescription/finishedPrescription';
const { genders, patientTitles } = storeToRefs(useConfigsStore());
const { patientCreateOrUpdate } = usePatientStore();
const { create } = useDoctorPatientStore();
const { featchPrescriptionInformation } = usePrescriptionFinishedStore();

configure({
    validateOnChange: false,
    validateOnInput: false,
    validateOnBlur: false,
    validateOnModelUpdate: false,
});

//  dob mange data
const isDob: Ref<boolean | false> = ref(false);
const formData: Ref<any> = ref({});

interface IProps {
    patientInfo?: object | any;
    init?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
    patientInfo: undefined,
    init: true,
});

const initialValuesForRegisterPatient: Object = {
    id: props.patientInfo?.id ?? undefined,
    title: props.patientInfo?.title ?? '',
    name: props.patientInfo?.name ?? '',
    dob: props.patientInfo?.dob ?? '',
    dob_day: props.patientInfo?.dob ? Number(props?.patientInfo?.dob.split('-')[2]) : undefined,
    dob_month: props.patientInfo?.dob ? String(props?.patientInfo?.dob.split('-')[1]) : undefined,
    dob_year: props.patientInfo?.dob ? Number(props?.patientInfo?.dob.split('-')[0]) : undefined,
    weight: props?.patientInfo?.weight?.toString() ?? undefined,
    gender: props.patientInfo?.gender ?? undefined,
    nid_no: props.patientInfo?.nid_no ?? undefined,
    blood_group: props.patientInfo?.blood_group ?? '',
    reg_no: props.patientInfo?.reg_no ?? undefined,
    contact_no: props.patientInfo?.contact_no ?? undefined,
    email: props.patientInfo?.email ?? undefined,
    age: props.patientInfo?.age ?? null,
    age_month: props.patientInfo?.age_month ?? undefined,
    age_day: props.patientInfo?.age_day ?? undefined,
    address: props.patientInfo?.address ?? undefined,
    referred_by: props.patientInfo?.referred_by ?? undefined,
    disease: props.patientInfo?.disease ?? undefined,
    height_in_feet: props.patientInfo?.height_in_feet ?? undefined,
    height_in_inch: props.patientInfo?.height_in_inch ?? undefined,
};

const validationSchema = ref({});
const toggleAccordionLabel = ref(false);

validationSchema.value = toTypedSchema(
    zod
        .object({
            title: zod.string({
                required_error: 'Name Prefix is required',
            }),

            name: zod
                .string({
                    required_error: 'Full name is required',
                })
                .min(2, 'Full name should be at least 2 characters.')
                .max(50, 'Full name should not exceed 50 characters.'),
            // .regex(/^[a-zA-Z\s]+$/),

            weight: zod.coerce
                .string()
                .regex(/^(?!0+(\.0*)?$)([1-9]\d*|0)(\.\d+)?$/, 'Weight must be greater than 0')
                .optional(),

            gender: zod.string({
                required_error: 'Gender is required',
            }),

            contact_no: zod
                .string({
                    required_error: 'Mobile number is required',
                })
                .regex(/^01[3-9]\d{8}$/),

            blood_group: zod.string().optional(),

            is_dob: zod.boolean().optional().default(true),

            age: zod.preprocess(
                (x) => x || undefined,
                zod.coerce.number().int().min(1, 'Min 1').max(160, 'Max 160').optional(),
            ),

            age_month: zod.preprocess(
                (x) => x || undefined,
                zod.coerce.number().int().min(1, 'Min 1').max(11, 'Max 11').optional(),
            ),

            age_day: zod.preprocess(
                (x) => x || undefined,
                zod.coerce.number().int().min(1, 'Min 1').max(31, 'Max 31').optional(),
            ),

            dob_year: zod
                .number()
                .optional()
                .superRefine((value: any, ctx: any) => {
                    if (value === undefined && isDob.value === true) {
                        ctx.addIssue({
                            code: zod.ZodIssueCode.custom,
                            path: ['dob_year'],
                            message: 'Year field is required',
                        });
                    }
                }),
            dob_month: zod
                .number()
                .max(12)
                .or(zod.string())
                .optional()
                .superRefine((value: any, ctx: any) => {
                    if (value === undefined && isDob.value === true) {
                        ctx.addIssue({
                            code: zod.ZodIssueCode.custom,
                            path: ['dob_month'],
                            message: 'Month field is required',
                        });
                    }
                }),
            dob_day: zod
                .number()
                .optional()
                .superRefine((value: any, ctx: any) => {
                    if (value === undefined && isDob.value === true) {
                        ctx.addIssue({
                            code: zod.ZodIssueCode.custom,
                            path: ['dob_day'],
                            message: 'Day field is required',
                        });
                    }
                }),

            nid_no: zod
                .string({
                    required_error: 'National ID is required',
                })
                .min(8, 'Enter at least 8 characters')
                .max(17, 'Enter a maximum of 17 characters')
                .optional(),
            email: zod.string().email().optional(),
            reg_no: zod.string().optional(),
            address: zod.string().optional(),
            referred_by: zod.string().optional(),
            disease: zod.string().optional(),
            height_in_feet: zod.preprocess(
                (x) => x || undefined,
                zod.coerce.number().int().min(1, 'Min 1').max(20, 'Max 20').optional(),
            ),
            height_in_inch: zod.preprocess(
                (x) => x || undefined,
                zod.coerce.number().int().min(1, 'Min 1').max(20, 'Max 11').optional(),
            ),
        })
        .superRefine((value: any, ctx: any) => {
            if (isDob.value === true) return;
            if (value.age === undefined && value.age_month === undefined && value.age_day === undefined) {
                ctx.addIssue({
                    code: zod.ZodIssueCode.custom,
                    path: ['dob'],
                    message: `At least one of 'age', 'age_month', or 'age_day' is required`,
                });
            }
        }),
);

const {
    data: patient,
    pending,
    execute,
    error,
} = await useLazyAsyncData(
    'createPatient',
    () => (props.init ? patientCreateOrUpdate(formData.value) : create(formData.value)),
    {
        immediate: false,
    },
);

pending.value = false;

const emit = defineEmits(['success']);

const onSubmit = async (value: any, actions: any) => {
    const { dob_year, dob_month, dob_day, weight, ...rest } = value;

    formData.value = {
        ...rest,
        weight: weight?.toString(),
        id: props?.patientInfo?.id ?? undefined,
        dob: isDob.value ? `${dob_year}-${dob_month}-${dob_day}` : undefined,
    };

    await execute();

    await featchPrescriptionInformation();

    if (error.value?.data) {
        actions.setFieldError('contact_no', error.value?.data?.message);
    }

    if (patient) {
        emit('success', true);
    }
};

const bloodGroups = reactive([
    {
        name: 'A+',
        value: 'a+',
    },
    {
        name: 'A-',
        value: 'a-',
    },
    {
        name: 'B+',
        value: 'b+',
    },
    {
        name: 'B-',
        value: 'b-',
    },
    {
        name: 'O+',
        value: 'o+',
    },
    {
        name: 'O-',
        value: 'o-',
    },
    {
        name: 'AB+',
        value: 'ab+',
    },
    {
        name: 'AB-',
        value: 'ab-',
    },
]);

// computed
const patientTitleList = computed(() => patientTitles.value || []);
const patientGenderList = computed(() => genders.value || []);

function calculateBMI(weight: number, heightInches: number) {
    const heightMeters = heightInches * 0.0254;
    const bmi = weight / (heightMeters * heightMeters);
    return bmi.toFixed(2);
}

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

const isRequiredAgeInputs = ref({ age: true, age_month: true, age_day: true });

function onBlurAgeInputHandler(value: any) {
    if (value) {
        isRequiredAgeInputs.value.age_month = false;
        isRequiredAgeInputs.value.age_day = false;
    } else {
        isRequiredAgeInputs.value.age_month = true;
        isRequiredAgeInputs.value.age_day = true;
    }
}

function onBlurAgeMonthInputHandler(value: any) {
    if (value) {
        isRequiredAgeInputs.value.age = false;
        isRequiredAgeInputs.value.age_day = false;
    } else {
        isRequiredAgeInputs.value.age = true;
        isRequiredAgeInputs.value.age_day = true;
    }
}

function onBlurAgeDayInputHandler(value: any) {
    if (value) {
        isRequiredAgeInputs.value.age_month = false;
        isRequiredAgeInputs.value.age = false;
    } else {
        isRequiredAgeInputs.value.age_month = true;
        isRequiredAgeInputs.value.age = true;
    }
}
</script>

<template>
    <VForm
        v-slot="{ values }"
        class="mb-6 space-y-2"
        :validation-schema="validationSchema"
        :initial-values="initialValuesForRegisterPatient"
        @submit="onSubmit"
    >
        <div class="grid grid-cols-12 gap-x-4">
            <div class="col-span-4">
                <UFormGroup class="relative">
                    <template #label>
                        <span
                            class="absolute -top-2 left-2 z-10 origin-[0] bg-white px-2 text-xs font-normal text-gray-400"
                        >
                            Name Prefix
                        </span>
                    </template>

                    <template #default>
                        <VField
                            v-slot="{ field }"
                            name="title"
                            as="div"
                            :validate-on-change="false"
                        >
                            <USelectMenu
                                v-bind="field"
                                :ui="selectMenu"
                                option-attribute="name"
                                value-attribute="value"
                                class="h-12 w-full border-red-500 text-sm font-normal lg:w-full"
                                placeholder="Select Title"
                                :options="patientTitleList"
                                :model-value="values.title"
                            >
                            </USelectMenu>

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

            <div class="col-span-8">
                <FormInput
                    :is-required="true"
                    type="text"
                    label="Full Name"
                    class="font-meduim block h-12 w-full tracking-wide"
                    name="name"
                />
            </div>
        </div>

        <div>
            <FormInput
                :is-required="true"
                type="text"
                label="Mobile Number"
                class="font-meduim block h-12 w-full tracking-wide [appearance:textfield]"
                name="contact_no"
            />
        </div>

        <div class="grid grid-cols-3 gap-x-4">
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
                            :ui="selectMenu"
                            option-attribute="name"
                            value-attribute="value"
                            class="h-12 w-full border-red-500 lg:w-full"
                            placeholder="Select Gender"
                            :options="patientGenderList"
                            :model-value="values.gender"
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

            <div>
                <FormInput
                    :is-required="false"
                    type="number"
                    label="Weight(Kg)"
                    class="font-meduim block h-12 w-full tracking-wide [appearance:textfield]"
                    name="weight"
                />
            </div>

            <UFormGroup class="relative">
                <template #label>
                    <span
                        class="absolute -top-2 left-2 z-10 origin-[0] bg-white px-2 text-xs font-normal text-gray-400"
                    >
                        Blood Group
                    </span>
                </template>

                <template #default>
                    <VField
                        v-slot="{ field }"
                        name="blood_group"
                        as="div"
                    >
                        <USelectMenu
                            v-bind="field"
                            :ui="selectMenu"
                            option-attribute="name"
                            value-attribute="name"
                            placeholder="Select Blood Group"
                            :options="bloodGroups"
                            :model-value="values.blood_group"
                        >
                        </USelectMenu>

                        <div class="h-5">
                            <VErrorMessage
                                class="font-poppins-regular text-xs italic text-red-500"
                                name="blood_group"
                            />
                        </div>
                    </VField>
                </template>
            </UFormGroup>
        </div>

        <div class="flex items-center justify-between pb-2">
            <p class="font-poppins-semibold text-base font-semibold text-slate-800">
                {{ isDob ? 'Date of Birth' : 'Age' }}
            </p>
            <UFormGroup name="is_dob">
                <UCheckbox
                    v-model="isDob"
                    name="is_dob"
                    label="Provide Date of Birth"
                />
            </UFormGroup>
        </div>

        <div
            v-show="!isDob"
            class="relative grid grid-cols-3 gap-x-4"
        >
            <div>
                <FormInput
                    name="age"
                    label="Age (Years)"
                    class="block h-12 w-full tracking-wide [appearance:textfield]"
                    type="number"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    :maxlength="3"
                    onwheel="return false;"
                    :is-required="isRequiredAgeInputs.age"
                    @on-blur-handle="onBlurAgeInputHandler"
                />
            </div>
            <div>
                <FormInput
                    name="age_month"
                    label="Age (Months)"
                    class="block h-12 w-full [appearance:textfield]"
                    type="number"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    :maxlength="2"
                    onwheel="return false;"
                    :is-required="isRequiredAgeInputs.age_month"
                    @on-blur-handle="onBlurAgeMonthInputHandler"
                />
            </div>
            <div>
                <FormInput
                    name="age_day"
                    label="Age (Days)"
                    class="block h-12 w-full font-normal tracking-wide [appearance:textfield]"
                    type="number"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    :maxlength="2"
                    onwheel="return false;"
                    :is-required="isRequiredAgeInputs.age_day"
                    @on-blur-handle="onBlurAgeDayInputHandler"
                />
            </div>

            <VErrorMessage
                class="font-poppins-regular - absolute bottom-0 left-2 text-xs italic text-red-500"
                name="dob"
            />
        </div>

        <PatientDobDateOfBirth v-show="isDob" />

        <UAccordion
            :items="[{ label: toggleAccordionLabel ? 'Show less' : 'Show more' }]"
            @click="toggleAccordionLabel = !toggleAccordionLabel"
        >
            <template #item>
                <div>
                    <div class="grid grid-cols-2 gap-x-4">
                        <div>
                            <FormInput
                                type="email"
                                label="Email"
                                class="block h-12 w-full tracking-wide"
                                name="email"
                            />
                        </div>
                        <div>
                            <FormInput
                                type="text"
                                label="National ID"
                                class="block h-12 w-full tracking-wide [appearance:textfield]"
                                name="nid_no"
                                maxlength="17"
                            />
                        </div>
                    </div>

                    <p class="font-poppins-semibold pb-2 font-semibold text-slate-800">Height</p>

                    <div class="grid grid-cols-4 gap-x-4">
                        <div>
                            <FormInput
                                type="number"
                                label="Feet"
                                class="block h-12 w-full tracking-wide [appearance:textfield]"
                                name="height_in_feet"
                                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                :maxlength="2"
                                onwheel="return false;"
                            />
                        </div>
                        <div>
                            <FormInput
                                type="number"
                                label="Inch"
                                class="block h-12 w-full tracking-wide [appearance:textfield]"
                                name="height_in_inch"
                                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                :maxlength="2"
                                onwheel="return false;"
                            />
                        </div>
                        <div class="flex h-12 items-center justify-center">
                            <span class="mr-1 font-semibold text-slate-900"> BMI: </span>
                            <template v-if="values.weight && values.height_in_feet && values.height_in_inch">
                                {{
                                    calculateBMI(
                                        Number(values.weight),
                                        Number(values.height_in_feet * 12 + values.height_in_inch),
                                    )
                                }}
                            </template>
                        </div>
                        <!-- <div class="flex h-12 items-center justify-center">BSI: 12</div> -->
                    </div>

                    <div class="grid grid-cols-2 gap-x-4">
                        <div>
                            <FormInput
                                type="text"
                                label="Address"
                                class="block h-12 w-full tracking-wide"
                                name="address"
                            />
                        </div>
                        <div>
                            <FormInput
                                type="text"
                                label="Referred by"
                                class="block h-12 w-full tracking-wide"
                                name="referred_by"
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-x-4">
                        <div>
                            <FormInput
                                type="text"
                                label="Registration No"
                                class="block h-12 w-full tracking-wide"
                                name="reg_no"
                            />
                        </div>
                        <div>
                            <FormInput
                                type="text"
                                label="Disease"
                                class="block h-12 w-full tracking-wide"
                                name="disease"
                            />
                        </div>
                    </div>
                </div>
            </template>
        </UAccordion>

        <UButton
            color="blue"
            class="w-56 py-3 text-base font-normal"
            block
            :loading="pending"
            type="submit"
        >
            <span class="mr-2 block h-5 w-5 cursor-pointer rounded-full bg-skin-fill p-px">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 18 18"
                >
                    <g fill="#ffffff">
                        <path
                            d="m17.826 3.774-3.6-3.6A.6.6 0 0 0 13.8 0h-1.2v4.8A1.2 1.2 0 0 1 11.4 6H6.6a1.2 1.2 0 0 1-1.2-1.2V0H1.8A1.8 1.8 0 0 0 0 1.8v14.4A1.8 1.8 0 0 0 1.8 18H3v-5.4a1.8 1.8 0 0 1 1.8-1.8h8.4a1.8 1.8 0 0 1 1.8 1.8V18h1.2a1.8 1.8 0 0 0 1.8-1.8v-12a.6.6 0 0 0-.174-.426Z"
                            data-name="Path 26324"
                        />
                        <path
                            d="M6.6 0h4.8v4.8H6.6Z"
                            data-name="Path 26325"
                        />
                        <path
                            d="M13.2 12H4.8a.6.6 0 0 0-.6.6V18h9.6v-5.4a.6.6 0 0 0-.6-.6Z"
                            data-name="Path 26326"
                        />
                    </g>
                </svg>
            </span>
            Save Patient
        </UButton>
    </VForm>
</template>
