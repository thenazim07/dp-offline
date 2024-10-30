<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { Bars3Icon, PlusIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import draggable from 'vuedraggable';
import VueSlider from 'vue-slider-component';
import { useLayoutsStore } from '~/stores/useLayoutsStore';
import 'vue-slider-component/theme/antd.css';
const layout = useLayoutsStore();
const { createFooterSection } = layout;
const { footerSection } = storeToRefs(layout);

const isOpen = ref(false);
const updateSection = ref({
    content: '',
});

const isOpenForUpdateInfo = (value: any) => {
    isOpen.value = true;
    updateSection.value = value;
};

const updateInfo = () => {
    isOpen.value = false;

    const updateKey = updateSection.value?.key;
    const updateContent = updateSection.value?.content;

    if (updateKey && footerSection.value) {
        const indexToUpdate = footerSection.value.findIndex((item) => item.key === updateKey);

        if (indexToUpdate !== -1) {
            footerSection.value[indexToUpdate].content =
                updateContent && updateContent !== '<p><br></p>' ? updateContent : '';
        }
    }
};

const { pending, execute } = await useLazyAsyncData(
    'footer-section',
    () => {
        return createFooterSection();
    },
    {
        immediate: false,
    },
);

pending.value = false;

const totalWidth = computed(() =>
    footerSection?.value
        ?.filter((item: any) => item.checked)
        .reduce((sum: any, column: any) => sum + Number(column.value), 0),
);

const validateSubmit = computed<boolean>(
    () => !(totalWidth.value === 100 || totalWidth.value === 0) || pending.value === true,
);

const onUpdateInformation = () => {
    execute();
};

const config = {
    strategy: 'override',
    width: 'w-full xl:max-w-5xl 2xl:max-w-5xl',
    height: 'h-[38rem] 2xl:h-[38rem]',
    // base: 'overflow-visable', past drug history date picker problem overflow-hidden
    overlay: {
        base: 'fixed inset-0 ',
        background: 'bg-black/5',
    },
};
</script>

<template>
    <div>
        <div class="pb-4">
            <h2 class="pb-4 text-xl font-bold text-gray-900">Footer Section</h2>
            <hr />
        </div>

        <div class="mb-6 min-h-[10rem] bg-slate-100">
            <div class="p-4">
                <div class="flex w-[100%] flex-wrap divide-x">
                    <template
                        v-for="(item, index) in footerSection"
                        :key="index"
                    >
                        <div
                            v-if="item.checked && item.value > 5"
                            :style="`width: ${item.value}%`"
                            class="group relative mb-4 min-h-[150px] bg-white p-2"
                            :class="{ 'flex items-center justify-center': !item.content }"
                        >
                            <div
                                v-if="item.content"
                                v-html="item.content"
                            ></div>

                            <button
                                v-if="!item.content"
                                class="group flex items-center rounded-md border px-6 py-2 hover:border-blue-600 hover:text-blue-600"
                                @click="isOpenForUpdateInfo(item)"
                            >
                                <PlusIcon class="mr-1.5 h-6 w-6 text-slate-600 group-hover:text-blue-600" />
                                <span>Click to add info</span>
                            </button>

                            <span
                                v-if="item.content"
                                class="tran invisible absolute inset-0 flex items-center justify-center bg-gray-900/20 transition duration-500 ease-in-out group-hover:visible"
                            >
                                <button
                                    class="group flex items-center justify-center rounded-full bg-white/70 px-6 py-2 text-blue-600"
                                    @click="isOpenForUpdateInfo(item)"
                                >
                                    <PencilSquareIcon class="h-6 w-6 group-hover:text-blue-600" />
                                    <span>Click to edit info</span>
                                </button>
                            </span>
                        </div>
                    </template>
                </div>

                <p
                    v-if="totalWidth !== 100"
                    class="text-sm font-normal text-red-500"
                >
                    The total width of the columns should be 100%
                </p>
            </div>
        </div>

        <div class="mb-6">
            <div class="pb-12">
                <ClientOnly>
                    <draggable
                        v-model="footerSection"
                        tag="ul"
                        group="footerSection"
                        :animation="500"
                        class="space-y-6"
                        item-key="id"
                        handle=".handle"
                    >
                        <template #item="{ element: column, index }">
                            <li class="flex items-center">
                                <div class="handle mr-1 cursor-move">
                                    <Bars3Icon class="block h-4 w-6 text-gray-400" />
                                </div>

                                <div
                                    class="mr-6 block w-32 flex-shrink-0 rounded-md border px-3 py-2"
                                    :class="column.checked ? 'border-blue-600' : 'border-slate-200'"
                                >
                                    <UCheckbox
                                        v-model="column.checked"
                                        color="blue"
                                        :label="index + 1 + ' Column'"
                                        :name="column.label"
                                        :checked="column.checked"
                                        :ui="{ rounded: 'rounded-full' }"
                                    />
                                </div>

                                <div class="flex-1">
                                    <VueSlider
                                        v-model="column.value"
                                        :adsorb="false"
                                        :process-style="{ backgroundColor: '#136AFB' }"
                                        :tooltip-style="{ backgroundColor: 'black', borderColor: 'black' }"
                                        :marks="(val: any) => val % 10 === 0"
                                        :min="15"
                                    >
                                        <template #dot="{ focus }">
                                            <div :class="['custom-dot', { focus }]"></div>
                                        </template>
                                    </VueSlider>
                                </div>
                            </li>
                        </template>
                    </draggable>
                </ClientOnly>
            </div>
        </div>

        <div class="text-right">
            <UButton
                :loading="validateSubmit"
                label="Save"
                color="blue"
                size="xl"
                :ui="{
                    strategy: 'override',
                    color: {
                        blue: {
                            solid: 'bg-[#136afb] text-white',
                        },
                    },
                    padding: {
                        xl: 'px-12 py-2.5',
                    },
                }"
                @click="onUpdateInformation"
            >
                <template #leading>
                    <LibIconDisk />
                </template>
            </UButton>
        </div>

        <UModal
            v-model="isOpen"
            prevent-close
            :ui="config"
        >
            <div class="relative p-10">
                <div class="flex items-center justify-between">
                    <p>Edit Footer Info</p>
                    <button
                        type="button"
                        class="absolute right-2 top-2"
                        @click="isOpen = false"
                    >
                        <XMarkIcon class="h-5 w-5 cursor-pointer text-slate-500"></XMarkIcon>
                    </button>
                </div>

                <form @submit.prevent="updateInfo">
                    <div class="pb-4">
                        <LibFormEditor v-model="updateSection.content" />
                    </div>

                    <div class="w-56">
                        <LibButtonsPrimaryButton
                            type="submit"
                            :disabled="false"
                            class-name="py-3 text-xl"
                        >
                            Update
                        </LibButtonsPrimaryButton>
                    </div>
                </form>
            </div>
        </UModal>
    </div>
</template>
