<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRndStore } from '~/stores/prescription/rnd/useRndStore';

const store = useRndStore();

const { email, emailProps, name, nameProps, errors } = storeToRefs(store);
</script>

<template>
    <div>
        <div>Chief Complaints</div>
        <form
            novalidate
            @submit="store.onFormSubmitHandler"
        >
            <div>
                <div>
                    <input
                        v-model="name"
                        v-bind="nameProps"
                        type="text"
                        placeholder="Enter name"
                    />
                    <span>{{ errors.name }}</span>
                </div>
                <div>
                    <input
                        v-model="email"
                        v-bind="emailProps"
                        type="text"
                        placeholder="Enter email address"
                    />
                    <span>{{ errors.email }}</span>
                </div>
            </div>
            <div class="mt-2">
                <button
                    type="submit"
                    class="rounded-lg bg-vtd-primary-600 px-3 py-2 text-white"
                >
                    Save
                </button>
            </div>
        </form>
    </div>
</template>
