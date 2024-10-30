<script lang="ts" setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import { number, object, string } from 'yup';
const { durationTypes } = managePrescription();
const surgicalTypes = computed(() => []);

const props = defineProps({
    item: {
        type: Object,
        default: null,
        required: true,
    },
});

const initialValues: Object = {
    id: props.item.id ? props.item.id : null,
    surgical_type: props.item.surgical_type ? props.item.surgical_type : null,
    duration_type: props.item.duration_type ? props.item.duration_type : null,
    duration: props.item.duration ? props.item.duration : null,
};

const schema = object({
    duration: number().required().max(4).label('Duration'),
    duration_type: string().required().max(80).label('Duration Type'),
});

const emit = defineEmits(['update']);
const onUpdate = (values: object) => {
    emit('update', values);
};
</script>

<template>
    <VForm
        v-slot="{ values }"
        :validation-schema="schema"
        :initial-values="initialValues"
        as="template"
        @submit="onUpdate"
    >
        <div class="relative mt-3 flex w-full items-center">
            <div class="mr-3 w-full">
                <Listbox
                    class=""
                    as="div"
                    @change="onUpdate(values)"
                >
                    <div class="relative">
                        <ListboxButton class="input-style peer relative flex justify-start">
                            <div class="flex w-full justify-between">
                                <span class="block truncate">{{ item.surgical_type }}</span>
                                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDownIcon
                                        class="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </div>
                        </ListboxButton>

                        <transition
                            leave-active-class="transition duration-300 ease-in"
                            leave-from-class="opacity-100"
                            leave-to-class="opacity-0"
                        >
                            <ListboxOptions
                                class="absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded bg-white p-4 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                            >
                                <ListboxOption
                                    v-for="surg in surgicalTypes"
                                    :key="surg.id"
                                    :value="surg.name"
                                    class="cursor-pointer py-1.5"
                                >
                                    {{ surg.name }}
                                </ListboxOption>
                            </ListboxOptions>
                        </transition>
                    </div>
                </Listbox>
            </div>

            <div class="mr-3 w-full">
                <div class="relative w-full rounded-md">
                    <div class="relative">
                        <VField
                            id="duration"
                            ref="duration"
                            name="duration"
                            type="text"
                            class="font-poppins-regular block w-full appearance-none rounded-md border bg-white px-3 py-3 text-xs font-medium text-gray-900 focus:outline-none focus:ring-0 2xl:h-12 2xl:text-sm"
                            placeholder=" "
                            @blur="onUpdate(values)"
                        />
                    </div>

                    <div class="relative">
                        <div class="absolute inset-y-0 right-0 flex items-center">
                            <label
                                for="duration_type"
                                class="sr-only"
                            >
                                Duration
                            </label>
                            <div class="relative">
                                <select
                                    id="duration_type"
                                    name="duration_type"
                                    class="h-full rounded border-0 bg-transparent py-0 pl-2 text-right text-xs text-gray-500 focus:ring-0 focus:ring-inset focus:ring-blue-600 2xl:text-sm"
                                    @change="onUpdate({ ...values, duration_type: $event.target.value })"
                                >
                                    <option
                                        v-for="(type, key) in durationTypes"
                                        :key="key"
                                        :value="key"
                                        :selected="item.duration_type === key ? true : type === 'days'"
                                    >
                                        {{ durationTypes[key] }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <slot></slot>
        </div>
    </VForm>
</template>
