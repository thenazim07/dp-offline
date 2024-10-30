<script lang="ts" setup>
const props = defineProps({
    visit: {
        type: Object,
        default: null,
    },
});
</script>

<template>
    <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-date">
            <span class="flex w-16 flex-wrap justify-center text-center">
                {{ useDateFormat(visit.visit_date, 'DD MMM YYYY', { locales: 'en-US' }).value }}
            </span>
        </div>

        <div class="space-y-5">
            <div class="min-h-[10rem] rounded border border-slate-200 px-6 py-5">
                <div class="flex">
                    <div class="w-9/12">
                        <div v-if="visit.indications && visit.indications.length > 0">
                            <h2 class="font-poppins-semibold mb-2 text-sm font-semibold text-slate-800 2xl:text-base">
                                Chief Complaints
                            </h2>

                            <ul class="flex list-outside flex-wrap">
                                <li
                                    v-for="(indication, index) in props.visit.indications"
                                    :key="index"
                                    class="font-poppins-regular mb-1.5 mr-2 flex text-sm text-slate-800 2xl:text-base"
                                >
                                    <span>
                                        <img
                                            class="h-2 w-2"
                                            src="~/assets/icon/dod.svg"
                                            alt=""
                                        />
                                    </span>

                                    <div class="-mt-1.5 pl-1">
                                        <span class="pr-1">{{ indication.name }}</span>
                                        <span
                                            v-if="indication.duration"
                                            class="capitalize"
                                        >
                                            (For {{ indication.duration }} {{ indication.duration_type }})
                                        </span>
                                        <span>
                                            <span v-if="indication.body_position">
                                                - {{ indication.body_position }}</span
                                            >
                                            <span v-if="indication.value"> - {{ indication.value }}</span>
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div
                            v-if="visit.diagnoses && visit.diagnoses.length > 0"
                            class="py-3"
                        >
                            <h2 class="font-poppins-semibold mb-2 text-sm font-semibold text-slate-800 2xl:text-base">
                                Diagnosis
                            </h2>

                            <ul class="flex list-outside flex-wrap">
                                <li
                                    v-for="dig in visit.diagnoses"
                                    :key="dig"
                                    class="mb-1.5 mr-2 flex text-slate-800 2xl:text-base"
                                >
                                    <span class="mr-1 h-2 w-2 flex-shrink-0">
                                        <img
                                            class="h-2 w-2 flex-shrink-0"
                                            src="~/assets/icon/dod.svg"
                                            alt=""
                                        />
                                    </span>

                                    <div class="-mt-1.5 flex">
                                        <div class="mr-1">
                                            <span class="pr-1">{{ dig.name }}</span>
                                            <small
                                                v-if="dig.duration"
                                                class="capitalize"
                                            >
                                                (For {{ dig.duration }} {{ dig.duration_type }})
                                            </small>
                                        </div>
                                        <div v-if="dig.note">
                                            <small>{{ dig.note }}</small>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div v-if="visit.investigations && visit.investigations.length > 0">
                            <h2 class="font-poppins-semibold mb-2 text-sm font-semibold text-slate-800 2xl:text-base">
                                Investigation
                            </h2>

                            <ul class="flex list-outside flex-wrap">
                                <li
                                    v-for="(inv, key) in visit.investigations"
                                    :key="key"
                                    class="font-poppins-regular mb-1 mr-2 flex items-center space-x-2 text-slate-800 2xl:text-base"
                                >
                                    <span>
                                        <img
                                            class="h-2 w-2"
                                            src="~/assets/icon/dod.svg"
                                            alt=""
                                        />
                                    </span>
                                    <div class="-mt-1.5 flex pl-1">
                                        <div>
                                            <span class="pr-1">{{ inv.name }}</span>
                                            <small
                                                v-if="inv.result"
                                                class="capitalize"
                                            >
                                                ({{ inv.result }} {{ inv.result_unit }})
                                            </small>
                                        </div>
                                        <div
                                            v-if="inv.body_position || inv.instruction"
                                            class="inline-block"
                                        >
                                            <small v-if="inv.body_position">
                                                {{ inv.body_position }}
                                            </small>
                                            <span v-if="inv.body_position && inv.instruction"> - </span>
                                            <small v-if="inv.instruction"> {{ inv.instruction }}</small>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="flex w-3/12 flex-col items-end justify-between">
                        <div class="mb-8">
                            <slot></slot>
                        </div>

                        <div class="float-right h-24 w-24">
                            <template v-if="visit.prescription_src">
                                <a
                                    :href="visit.prescription_src"
                                    target="_blank"
                                >
                                    <img
                                        class="h-24 w-24"
                                        src="~/assets/images/preview/demo_prescription_preview.svg"
                                        alt=""
                                    />
                                </a>
                            </template>
                            <template v-else>
                                <span
                                    class="flex h-24 w-24 items-center justify-center rounded-sm border bg-gray-200 text-center"
                                >
                                    N/A
                                </span>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.timeline-item {
    margin-bottom: 40px;
    width: 100%;
    position: relative;
}

.timeline-item:last-child {
    margin-bottom: 0;
}

.timeline-item {
    padding-left: calc(18% + 30px);
}

.timeline-dot {
    @apply absolute top-0 h-6 w-6 rounded-full border-4 border-white bg-slate-500;
    left: calc(18% - 12px);
}

.timeline-date {
    @apply absolute left-0 text-left text-sm font-normal text-slate-500 2xl:text-base;
    margin: 6px 0 15px;
}
</style>
