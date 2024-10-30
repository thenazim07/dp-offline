<script lang="ts" setup>
const props = defineProps<{
    name?: string;
    field: object | any;
    idx?: number | null;
}>();

const emit = defineEmits(['change-value']);
</script>

<template>
    <div class="flex w-full flex-wrap items-center">
        <div class="mb-3 flex w-full items-center justify-between gap-3">
            <div class="relative flex-1">
                <label class="font-poppins-regular mb-1.5 inline-block"> Dose Frequency </label>
                <PrescriptionBaseComponentsFrequency
                    :name="props.name ?? undefined"
                    @change-value="emit('change-value')"
                />
            </div>

            <!-- <div class="w-40">
                <label class="font-poppins-regular mb-1.5 inline-block"> Instruction </label>
                <PrescriptionBaseComponentsInstruction
                    :name="props.name ?? undefined"
                    @change-value="emit('change-value')"
                />
            </div> -->

            <div class="flex w-56 flex-shrink-0 items-center gap-3">
                <div>
                    <label class="font-poppins-regular mb-1.5 inline-flex items-center"> Duration </label>

                    <div class="flex w-full flex-shrink-0 items-center space-x-3">
                        <div class="flex-1">
                            <PrescriptionBaseComponentsDurationWithType
                                :name="props.name ?? undefined"
                                @change-value="emit('change-value')"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
