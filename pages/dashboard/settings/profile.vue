<script lang="ts" setup>
import { PencilSquareIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { useLayoutsStore } from '~/stores/useLayoutsStore';
definePageMeta({
    middleware: ['auth'],
});

const { uploadDocument } = manageAuth();
const { fetchPrescriptionSignatureInfo } = useLayoutsStore();
const { prescriptionSignatureData } = storeToRefs(useLayoutsStore());
const { fullName, phoneNumber } = doctorInfo();
const { user } = manageAuth();
const isOpenForProfileEdit = ref(false);
const isOpenForDoctorInfo = ref(false);
const content = ref('');

fetchPrescriptionSignatureInfo();

const uploadFile = (values: any) => {
    uploadDocument(values);
};

const onSubmit = () => {
    const fromData = new FormData();
    fromData.append('document_type', 'signature');
    fromData.append('description', content.value);
    uploadDocument(fromData);
    isOpenForDoctorInfo.value = false;
};

const editForDoctorInfo = () => {
    isOpenForDoctorInfo.value = true;
    content.value = prescriptionSignatureData?.value?.description;
};
</script>

<template>
    <div>
        <ClientOnly>
            <Teleport to="#navbar">
                <div class="mr-0 flex w-full max-w-[100rem] items-center justify-between sm:pr-8">
                    <!--Breadcrumbs-->
                    <nav
                        class="flex"
                        aria-label="breadcrumb"
                    >
                        <ol
                            role="list"
                            class="flex items-center space-x-1"
                        >
                            <li>
                                <div class="flex items-center">
                                    <NuxtLink
                                        to="/dashboard"
                                        class="font-poppins-regular text-sm font-medium text-gray-500 hover:text-gray-700 2xl:text-base"
                                    >
                                        Settings
                                    </NuxtLink>
                                </div>
                            </li>

                            <li>
                                <div class="flex items-center">
                                    <svg
                                        class="h-5 w-5 flex-shrink-0 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    <a
                                        href="#"
                                        class="font-poppins-regular text-sm font-medium text-gray-500 hover:text-gray-700 2xl:text-base"
                                        aria-current="page"
                                    >
                                        Profile</a
                                    >
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <!--End--Breadcrumbs-->
                </div>
            </Teleport>
        </ClientOnly>

        <div class="mr-0 max-w-[100rem] pb-16">
            <div class="mb-8 overflow-hidden rounded-lg bg-white p-8 shadow">
                <div class="flex items-center justify-between pb-5">
                    <div>
                        <p class="font-poppins-regular text-base font-normal text-slate-500">Personal information</p>
                    </div>

                    <div v-if="false">
                        <button
                            class="font-poppins-regular inline-flex items-center rounded-full border border-slate-200 px-4 py-1 text-base font-normal text-slate-500 hover:border-blue-500 hover:bg-slate-50"
                            @click="isOpenForProfileEdit = true"
                        >
                            <PencilSquareIcon class="mr-1 h-5 w-5 text-slate-500"></PencilSquareIcon>
                            Edit Profile
                        </button>
                    </div>
                </div>

                <div class="flex">
                    <DoctorProfilePhoto />
                    <div class="w-full">
                        <div class="flex w-full justify-between border-b-2">
                            <div class="pb-5">
                                <h1 class="font-poppins-semibold pb-2 text-xl font-semibold text-slate-800">
                                    {{ fullName() }}
                                </h1>
                                <p class="font-poppins-regular text-base font-normal text-slate-500">
                                    {{ phoneNumber() }}
                                </p>
                            </div>

                            <div class="pb-5">
                                <NuxtLink
                                    class="font-poppins-regular text-base text-skin-base underline"
                                    to="/dashboard/settings/change-password"
                                >
                                    Change Password
                                </NuxtLink>
                            </div>
                        </div>
                        <dl>
                            <div class="grid grid-cols-5 pt-5">
                                <div>
                                    <dt class="font-poppins-regular text-sm font-medium text-slate-500">
                                        Date of Birth
                                    </dt>
                                    <dd class="font-poppins-regular mt-1 text-sm text-slate-900">
                                        {{ user.dob }}
                                    </dd>
                                </div>
                                <div>
                                    <dt class="font-poppins-regular text-sm font-medium text-slate-500">Gender</dt>
                                    <dd class="font-poppins-regular mt-1 text-sm text-slate-900">
                                        {{ user.gender }}
                                    </dd>
                                </div>
                                <div>
                                    <dt class="font-poppins-regular text-sm font-medium text-slate-500">National ID</dt>
                                    <dd class="font-poppins-regular mt-1 text-sm text-slate-900">
                                        {{ user.nid_no }}
                                    </dd>
                                </div>
                                <div>
                                    <dt class="font-poppins-regular text-sm font-medium text-slate-500">BMDC Number</dt>
                                    <dd class="font-poppins-regular mt-1 text-sm text-slate-900">
                                        {{ user.reg_no }}
                                    </dd>
                                </div>
                                <div>
                                    <dt class="font-poppins-regular text-sm font-medium text-slate-500">Email</dt>
                                    <dd class="font-poppins-regular mt-1 text-sm text-slate-900">
                                        {{ user.email }}
                                    </dd>
                                </div>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-8">
                <div class="rounded-lg bg-white p-8 shadow">
                    <div class="flex items-center justify-between pb-5">
                        <div>
                            <p class="font-poppins-regular text-base font-normal text-slate-500">
                                Personal information
                            </p>
                        </div>

                        <div>
                            <button
                                class="font-poppins-regular inline-flex items-center rounded-full border border-slate-200 px-4 py-1 text-base font-normal text-slate-500 hover:border-blue-500 hover:bg-slate-50"
                                @click="editForDoctorInfo()"
                            >
                                <PencilSquareIcon class="mr-1 h-5 w-5 text-slate-500"></PencilSquareIcon>
                                Edit
                            </button>
                        </div>
                    </div>
                    <div class="py-4">
                        <template v-if="prescriptionSignatureData && prescriptionSignatureData.src">
                            <img
                                class="h-20 w-auto"
                                :src="prescriptionSignatureData.src"
                            />
                        </template>
                    </div>

                    <div v-if="prescriptionSignatureData && prescriptionSignatureData.description">
                        <div
                            class="font-poppins-regular font-normal"
                            v-html="prescriptionSignatureData.description"
                        ></div>
                    </div>
                </div>
            </div>

            <!--profile  doctor headerInfo modal-->
            <UModal
                v-model="isOpenForDoctorInfo"
                :prevent-close="true"
            >
                <div class="fixed inset-0 z-50 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4 text-center">
                        <div
                            class="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
                        >
                            <p class="font-poppins-regular text-2xl font-bold text-slate-900">
                                Edit Prescription Signature
                            </p>

                            <div class="absolute right-4 top-4">
                                <XMarkIcon
                                    class="h-5 w-5 cursor-pointer text-slate-500"
                                    @click="isOpenForDoctorInfo = false"
                                ></XMarkIcon>
                            </div>

                            <div class="pb-3 pt-1">
                                <hr />
                            </div>

                            <div class="mb-6 grid grid-cols-2 gap-4">
                                <DoctorDigitalSignature @update:signature="uploadFile" />
                                <DoctorUploadSignature @update:signature="uploadFile" />
                            </div>

                            <div>
                                <ClientOnly>
                                    <form @submit.prevent="onSubmit">
                                        <div class="pb-4">
                                            <!-- <quill-editor
                                                v-model:content="content"
                                                content-type="html"
                                                toolbar="none"
                                            ></quill-editor> -->
                                            <LibFormEditor
                                                v-model="content"
                                                :is-image="false"
                                            />
                                        </div>

                                        <div class="w-56">
                                            <LibButtonsPrimaryButton
                                                type="submit"
                                                :disabled="false"
                                                class-name="py-3 text-xl "
                                            >
                                                Update
                                            </LibButtonsPrimaryButton>
                                        </div>
                                    </form>
                                </ClientOnly>
                            </div>
                        </div>
                    </div>
                </div>
            </UModal>
        </div>
    </div>
</template>
