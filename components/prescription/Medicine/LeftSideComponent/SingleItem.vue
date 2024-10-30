<script lang="ts" setup>
const props = defineProps<{
    name?: string;
    field: object | any;
    idx?: number | null;
}>();

const emit = defineEmits(['change-value']);
const name = computed(() => (props.name ? `${props.name}.durations` : 'durations'));
</script>

<template>
    <div>
        <div class="flex w-full flex-wrap items-center">
            <FieldArray
                v-slot="{ fields, push, remove }"
                :name="name"
            >
                <div
                    v-for="(duration, index) in fields"
                    :key="duration.key"
                    class="mb-3 flex w-full items-center justify-between gap-3"
                >
                    <div class="relative flex flex-1 space-x-4">
                        <div class="w-1/2">
                            <label
                                v-if="index === 0"
                                class="font-poppins-regular mb-1.5 inline-block"
                            >
                                Dose Frequency
                            </label>
                            <PrescriptionBaseComponentsFrequency
                                :name="props.name ? `${props.name}.durations[${index}]` : `durations[${index}]`"
                                @change-value="emit('change-value')"
                            />
                        </div>
                        <div class="w-1/2">
                            <label
                                v-if="index === 0"
                                class="mb-1.5 inline-block"
                            >
                                Instruction
                            </label>

                            <PrescriptionBaseComponentsInstruction
                                :name="props.name ? `${props.name}.durations[${index}]` : `durations[${index}]`"
                                @change-value="emit('change-value')"
                            />
                        </div>
                    </div>

                    <div class="flex w-[312px] flex-shrink-0 items-center gap-3">
                        <div>
                            <label
                                v-if="index === 0"
                                class="mb-1.5 inline-flex items-center"
                            >
                                Duration
                            </label>

                            <div class="flex w-full flex-shrink-0 items-center space-x-3">
                                <div class="flex-1">
                                    <PrescriptionBaseComponentsDurationWithType
                                        :name="props.name ? `${props.name}.durations[${index}]` : `durations[${index}]`"
                                        @change-value="emit('change-value')"
                                    />
                                </div>

                                <UButtonGroup
                                    v-if="fields.length === index + 1"
                                    size="sm"
                                    :ui="{
                                        wrapper: 'h-10',
                                        shadow: 'shadow-none',
                                    }"
                                    orientation="horizontal"
                                >
                                    <UButton
                                        icon="i-heroicons-x-mark-20-solid"
                                        color="white"
                                        :disabled="index === 0"
                                        @click="
                                            () => {
                                                remove(index), emit('change-value');
                                            }
                                        "
                                    />
                                    <UButton
                                        icon="i-heroicons-plus-20-solid"
                                        color="white"
                                        @click="
                                            push({
                                                duration: '',
                                                type: 'days',
                                                frequency: '',
                                            })
                                        "
                                    />
                                </UButtonGroup>
                                <UButton
                                    v-else
                                    icon="i-heroicons-x-mark-20-solid"
                                    color="white"
                                    variant="ghost"
                                    @click="
                                        () => {
                                            remove(index), emit('change-value');
                                        }
                                    "
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </FieldArray>
        </div>

        <div>
            <VField
                v-slot="{ field: ins }"
                :name="props.name ? `${props.name}.instructions` : 'instructions'"
            >
                <UTextarea
                    :ui="{
                        base: 'h-10 text-lg w-full block min-h-[2rem] font-meduim',
                        color: {
                            white: {
                                outline: 'ring-slate-200 focus:ring-1 focus:ring-blue-600',
                            },
                        },
                    }"
                    size="lg"
                    resize
                    v-bind="ins"
                    :maxlength="255"
                    placeholder="Special Instruction"
                    @change="emit('change-value')"
                />
            </VField>
        </div>
        <!--
        <PrescriptionBaseComponentsSpecialInstructions
            :name="props.name ?? undefined"
            @change-value="emit('change-value')"
        /> -->
    </div>
</template>
