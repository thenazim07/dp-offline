<script lang="ts" setup>
import { ArrowUturnDownIcon, XMarkIcon } from '@heroicons/vue/24/outline';
const emit = defineEmits(['update:signature']);

const state = reactive({
    count: 0,
    option: {
        penColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(255,255,255)',
    },
    disabled: false,
});

const signature1 = ref(null);
const save = (t: any) => {
    const photoFile = dataURLtoFile(signature1.value.save(t), 'signature.png');
    const formData = new FormData();
    formData.append('document', photoFile);
    formData.append('document_type', 'signature');
    // uploadDocument(formData);
    emit('update:signature', formData);
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
    // @ts-ignore
    signature1.value.clear();
};

const undo = () => {
    // @ts-ignore
    signature1.value.undo();
};
</script>

<template>
    <div class="min-h-[4rem] w-full rounded-lg border border-slate-200 hover:border-blue-500">
        <div class="flex items-center justify-center p-4">
            <div v-if="false">
                <div>
                    <img
                        src=""
                        alt=""
                    />
                </div>
                <div class="w-full max-w-[19rem] text-center">
                    <h6 class="font-poppins-semibold pb-1.5 text-base font-semibold text-slate-900">
                        Draw your signature
                    </h6>
                    <p class="font-sm font-poppins-regular font-normal text-slate-500">
                        Go artistic. Use your mouse or trackpad to make a statement.
                    </p>
                </div>
            </div>
            <Vue3Signature
                ref="signature1"
                :sig-option="state.option"
                :w="'100%'"
                :h="'150px'"
                :disabled="state.disabled"
                class="example"
            ></Vue3Signature>
        </div>

        <div class="float-right mb-2 inline-flex px-4">
            <button
                class="font-poppins-regular mx-1 flex h-8 w-8 items-center justify-center rounded border px-2 text-xs hover:bg-slate-100"
                @click="clear"
            >
                <XMarkIcon class="h-5 w-5 text-gray-700" />
            </button>
            <button
                class="font-poppins-regular mx-1 flex h-8 w-8 items-center justify-center rounded border px-2 text-xs hover:bg-slate-100"
                @click="undo"
            >
                <ArrowUturnDownIcon class="h-5 w-5 rotate-45 text-gray-700" />
            </button>
            <button
                class="flex h-8 w-8 items-center justify-center rounded border hover:bg-slate-100"
                @click="save('image/jpeg')"
            >
                <span class="block h-5 w-5 text-gray-700">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1"
                        class="feather feather-save"
                        viewBox="0 0 24 24"
                    >
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <path d="M17 21v-8H7v8M7 3v5h8" />
                    </svg>
                </span>
            </button>
        </div>
    </div>
</template>
