<script setup lang="ts">
const testLoading = ref(false);

async function search(q: string) {
    testLoading.value = true;

    const users = await $fetch<any[]>('https://jsonplaceholder.typicode.com/users', { params: { q } });

    testLoading.value = false;

    return users;
}
const testQuery = ref('Wade');
</script>

<template>
    <UInputMenu
        v-model="testQuery"
        v-model:query="testQuery"
        :search="search"
        :loading="testLoading"
        placeholder="Search for a user..."
        option-attribute="name"
        trailing
        :popper="{
            placement: 'auto',
        }"
        value-attribute="name"
    />
    <div>
        <p>Selected: {{ testQuery }}</p>
    </div>
</template>
