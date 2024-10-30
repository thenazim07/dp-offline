<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import type { ILifeStyle } from '~/repository/modules/EHR/LifestyleHistory/types';
import { useEhrLifeStyleStoreRoot } from '~/stores/ehr/useLifeStyleStoreRoot';

const ehrLifeStyleStoreRoot = useEhrLifeStyleStoreRoot();
const { lifeStyleList } = storeToRefs(ehrLifeStyleStoreRoot);
const { loading, search, result } = await useEhrLifeStyleSearch();
const lifeStyleInputRef = ref<HTMLDivElement | null>(null);
const { focusToParentElementsLastChildsFirstInput, inputClassToFocus } = useFocusOnParentElementsLastInputElement();
const { duration_types_for_past_history_lifestyle } = storeToRefs(useConfigsStore());
const toast = useToast();

const props = withDefaults(
    defineProps<{
        lifeStyle?: ILifeStyle;
        index?: number;
        autofocus?: boolean;
        isRemovable?: boolean;
    }>(),
    {
        lifeStyle: () => ({}) as ILifeStyle,
        index: undefined,
        autofocus: false,
        isRemovable: true,
    },
);

const value = computed({
    get: () => props.lifeStyle.value,
    set: (value) => ehrLifeStyleStoreRoot.updateIndication(props.index!, 'value', value),
});

const note = computed({
    get: () => props.lifeStyle.note,
    set: (value) => ehrLifeStyleStoreRoot.updateIndication(props.index!, 'note', value),
});

const type = computed({
    get: () => props.lifeStyle.type,
    set: (value) => {
        if (!checkDuplicateLifeStyle(value.title)) {
            toast.add({ title: 'life style already exist', color: 'red' });
            return;
        }

        ehrLifeStyleStoreRoot.updateIndication(props.index!, 'type', value.title);
        ehrLifeStyleStoreRoot.updateIndication(props.index!, 'life_style_type_id', value.id);

        focusOnParentElementsLastInputElement();
    },
});

function checkDuplicateLifeStyle(value: string) {
    if (!value.trim()) return false;

    if (lifeStyleList.value.filter((singleLifeStyle) => singleLifeStyle.type?.trim() === value.trim()).length !== 1) {
        return true;
    } else {
        return false;
    }
}

const duration = computed({
    get: () => props.lifeStyle?.duration?.toString() || '',
    set: (value) => ehrLifeStyleStoreRoot.updateIndication(props.index!, 'duration', Number(value) !== 0 ? Number(value) : null),
});

const durationType = computed({
    get: () => props.lifeStyle?.duration_type,
    set: (value) => ehrLifeStyleStoreRoot.updateIndication(props.index!, 'duration_type', value),
});

const durationLocale = computed({
    get: () => props.lifeStyle?.duration_locale || 'en',
    set: (value) => ehrLifeStyleStoreRoot.updateIndication(props.index!, 'duration_locale', value),
});

function deleteItem() {
    ehrLifeStyleStoreRoot.deleteLifeStyle(props.index!);
}

const configFormStyle = {
    base: inputClassToFocus + ' h-[48px] w-full focus:outline-none focus:border-none font-normal border-none',
    rounded: 'rounded',
    ring: 'ring-0',
    color: {
        white: {
            outline: 'ring-0 !focus:ring-0 focus:border-none focus:outline-none  shadow-none',
        },
    },
};

const focusOnParentElementsLastInputElement = () => {
    focusToParentElementsLastChildsFirstInput(lifeStyleInputRef, `.${inputClassToFocus}`);
};

async function handleSearchableSelect(selected: any) {
    await nextTick();

    focusOnParentElementsLastInputElement();
}
</script>

<template>
    <div
        ref="lifeStyleInputRef"
        class="flex w-full items-center justify-between gap-2"
    >
        <LibIconHamBurger />
        <div class="relative w-[80%]">
            <!-- <USelectMenu
                clear-search-on-close
                v-model="type"
                :searchable="search"
                :options="result"
                :loading="loading"
                placeholder="Search/Add LifeStyle"
                option-attribute="title"
                trailing
                :ui="configFormStyle"
                :ui-menu="{
                    width: 'w-[45%]',
                }"
                :popper="{
                    strategy: 'fixed',
                    placement: 'bottom-start',
                }"
            >
                <template #label>
                    <span :class="type === '' ? 'text-gray-400' : 'text-gray-900'">
                        {{ type || 'Search/Add LifeStyle' }}
                    </span>
                </template>
            </USelectMenu> -->

            <VueSelect
                v-model="type"
                :class="`${inputClassToFocus} ${checkDuplicateLifeStyle(type) ? 'border border-red-500' : ''}`"
                :options="result"
                :search="search"
                placeholder="Search/Add LifeStyle"
                label="title"
                @selected="handleSearchableSelect"
            />
        </div>
        <!-- <div>
            <input
                v-model="value"
                placeholder="duration"
                rows="1"
                class="h-[48px] w-full resize-none rounded border-none p-3 text-sm font-normal text-slate-900 placeholder:text-slate-400"
            />
        </div> -->
        <div>
            <PrescriptionBaseComponentsDurationWithType
                v-model:duration="duration"
                v-model:duration-type="durationType"
                v-model:duration-locale="durationLocale"
                :shown-duration-types="duration_types_for_past_history_lifestyle"
                duration-locale-persist-store-type="past_history_life_style"
                class="flex-1"
                @onInputKeyUpEnterHandler="focusOnParentElementsLastInputElement"
            />
        </div>
        <div class="flex w-[40%]">
            <textarea
                v-model="note"
                placeholder="Note"
                rows="1"
                class="h-[48px] w-full resize-none rounded border-none p-3 text-sm"
                @keydown.enter.exact.prevent="focusOnParentElementsLastInputElement"
            ></textarea>
        </div>

        <div
            v-if="props.isRemovable"
            class="w-[3%]"
        >
            <button
                type="button"
                @click.prevent="deleteItem"
            >
                <TrashIcon class="h-6 w-6 font-semibold text-red-600" />
            </button>
        </div>
        <div
            v-else
            class="w-[4.5%]"
        ></div>
    </div>
</template>
