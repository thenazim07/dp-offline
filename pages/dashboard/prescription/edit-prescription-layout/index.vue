<template>
    <div>
        <PrescriptionEditPrescriptionLayout />
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
});
</script>
