<script lang="ts" setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import VuePictureCropper, { cropper } from 'vue-picture-cropper';
const uploadInput = ref<HTMLInputElement | null>(null);
const pic = ref<string>('');
const { phoneNumber } = doctorInfo();
const isOpenForProfilePhoto = ref(false);

const emit = defineEmits(['update:signature']);

const result = reactive({
    file: '',
    dataURL: '',
    blobURL: '',
});

const selectFile = (e: Event) => {
    pic.value = '';
    result.dataURL = '';
    result.blobURL = '';

    const { files } = e.target as HTMLInputElement;
    if (!files || !files.length) return;
    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        pic.value = String(reader.result);
        isOpenForProfilePhoto.value = true;
        if (!uploadInput.value) return;
        uploadInput.value.value = '';
    };
};

const getResult = async () => {
    if (!cropper) return;
    const base64 = cropper.getDataURL();
    const blob: Blob | null = await cropper.getBlob();
    if (!blob) return;
    await cropper!.getFile({
        fileName: phoneNumber,
    });
    result.dataURL = base64;
    result.blobURL = URL.createObjectURL(blob);
    const photoFile = dataURLtoFile(base64, 'signature.png');
    const formData = new FormData();
    formData.append('document', photoFile);
    formData.append('document_type', 'signature');
    // uploadDocument(formData);

    emit('update:signature', formData);

    isOpenForProfilePhoto.value = false;
};

const dataURLtoFile = (dataurl: any, filename: any) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

const clear = () => {
    if (!cropper) return;
    cropper.clear();
};
</script>

<template>
    <button
        class="flex min-h-[4rem] w-full cursor-pointer items-center justify-center rounded-lg border border-slate-200 p-6 hover:border-blue-500"
        @click="$refs.uploadInput.click()"
    >
        <div>
            <div>
                <img
                    src=""
                    alt=""
                />
            </div>
            <div class="w-full max-w-[19rem] text-center">
                <h6 class="font-poppins-semibold pb-1.5 text-base font-semibold text-slate-900">
                    Upload your signature
                </h6>
                <p class="font-sm font-poppins-regular font-normal text-slate-500">
                    Insert pictures from your computer or device that you're connected.
                </p>
            </div>
        </div>
        <input
            ref="uploadInput"
            type="file"
            class="hidden"
            accept="image/jpg, image/jpeg, image/png, image/gif"
            @change="selectFile"
        />
    </button>

    <!--profile photo edit modal-->
    <TransitionRoot
        appear
        :show="isOpenForProfilePhoto"
        as="template"
    >
        <Dialog
            :open="isOpenForProfilePhoto"
            @close="isOpenForProfilePhoto = false"
        >
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 z-50 bg-black bg-opacity-25" />
            </TransitionChild>
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
            >
                <div class="fixed inset-0 z-50 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center text-center">
                        <DialogPanel
                            class="w-full max-w-md transform overflow-hidden rounded bg-white text-left align-middle shadow-xl transition-all"
                        >
                            <DialogTitle class="font-poppins-regular border-b py-2.5 pl-3 font-semibold">
                                Upload your signature
                            </DialogTitle>

                            <div class="absolute right-2 top-2">
                                <XMarkIcon
                                    class="h-5 w-5 cursor-pointer text-slate-500"
                                    @click="isOpenForProfilePhoto = false"
                                ></XMarkIcon>
                            </div>

                            <VuePictureCropper
                                :box-style="{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#f8f8f8',
                                    margin: 'auto',
                                }"
                                :img="pic"
                                :options="{
                                    viewMode: 1,
                                    dragMode: 'crop',
                                    aspectRatio: 1 / 1,
                                }"
                                @ready="ready"
                            />

                            <div class="py-2.5 pl-3 pr-3 text-right">
                                <button
                                    class="mr-3 rounded-md bg-red-500 px-5 py-2 text-white"
                                    @click="clear"
                                >
                                    Cancel
                                </button>
                                <button
                                    class="rounded-md bg-blue-500 px-5 py-2 text-white"
                                    @click="getResult"
                                >
                                    Save Photo
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </TransitionChild>
        </Dialog>
    </TransitionRoot>
</template>
