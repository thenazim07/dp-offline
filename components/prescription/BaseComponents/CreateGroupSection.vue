<script lang="ts" setup>
const props = defineProps({
    name: {
        type: String,
        default: '',
    },

    value: {
        type: String,
        default: '',
    },

    status: {
        type: Number,
        default: 0,
    },

    modelValue: {
        type: String,
        default: '',
    },

    placeholder: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:modelValue', 'saveGroup', 'updated:group', 'status']);

const createGroupStatus = computed(() => props.status || 0);

const createGroupAction = () => {
    emit('status', 1);
};

const medicineGroupName = ref(props.modelValue);
const isMedicineGroupNameValid = ref(true);

const validateMedicineGroupName = (value: string) => {
    const minLength = 2;
    const regex = /^[a-zA-Z0-9\s]+$/;
    const trimmedValue = value.trim();
    isMedicineGroupNameValid.value = trimmedValue.length >= minLength && regex.test(trimmedValue);
};

const clearGroupInput = (props: any) => {
    props.modelValue = '';
    emit('status', 0);
};

const createOrUpdateGroup = () => {
    if (!isMedicineGroupNameValid.value) return false;

    if (createGroupStatus.value === 1) {
        emit('saveGroup', true);
        emit('status', 0);
    }
    if (createGroupStatus.value === 2) {
        emit('updated:group', true);
        emit('status', 0);
    }
    medicineGroupName.value = '';
};

const changeInputValue = (value: string) => {
    validateMedicineGroupName(value);
    emit('update:modelValue', value);
};
</script>

<template>
    <div class="mb-4 flex items-center justify-between">
        <div>
            <p class="font-poppins-semibold text-sm font-semibold text-slate-800 2xl:text-base">
                {{ name }}
            </p>
        </div>

        <div class="flex items-center">
            <UButton
                v-if="createGroupStatus === 0"
                icon="i-heroicons-plus-circle"
                :ui="{ base: 'h-10 2xl:h-12', rounded: 'rounded-full', padding: { sm: 'px-2 2xl:px-4' } }"
                color="white"
                label="Create a Group"
                @click="createGroupAction"
                @keydown.enter="createGroupAction"
            >
            </UButton>

            <UButton
                v-if="createGroupStatus !== 0"
                :ui="{
                    base: 'h-10 2xl:h-12 bg-white',
                    icon: {
                        base: 'text-slate-600',
                    },
                    rounded: 'rounded-full',
                    padding: { sm: 'px-2 2xl:px-4' },
                    color: {
                        white: {
                            solid: 'hover:bg-white',
                        },
                    },
                }"
                color="white"
                label="Create a Group"
            >
                <div class="flex items-center duration-300">
                    <div class="mr-2">
                        <UInput
                            v-model="medicineGroupName"
                            :ui="{
                                base: 'ring-0',
                                rounded: 'rounded-none',
                                color: {
                                    white: {
                                        outline: 'shadow-none border-none ring-0 focus:ring-0 focus:outline-none',
                                    },
                                },
                            }"
                            xd
                            :autofocus="true"
                            @input="(e: Event) => changeInputValue(e.target.value)"
                            @keyup.enter="createOrUpdateGroup"
                        />
                    </div>

                    <div>
                        <UButton
                            v-if="medicineGroupName.length > 0"
                            :disabled="!isMedicineGroupNameValid"
                            :ui="{
                                base: 'h-8 w-8',
                                rounded: 'rounded-full',
                                padding: { sm: 'p-1.5' },
                            }"
                            color="blue"
                            @click="createOrUpdateGroup"
                        >
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
                        </UButton>

                        <UButton
                            v-if="medicineGroupName.length === 0"
                            icon="i-heroicons-x-mark"
                            :ui="{
                                base: '2xl:h-8 2xl:w-8',
                                icon: {
                                    base: 'text-slate-600',
                                },
                                rounded: 'rounded-full',
                                padding: { sm: '2xl:p-1.5' },
                            }"
                            color="white"
                            @click="clearGroupInput"
                        >
                        </UButton>
                    </div>
                </div>
            </UButton>

            <div class="flex-shrink-0">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
