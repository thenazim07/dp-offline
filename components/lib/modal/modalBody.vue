<script lang="ts" setup></script>

<template>
    <div class="flex h-full overflow-hidden">
        <div class="relative w-8/12 pr-6">
            <slot name="left-side-content"></slot>
        </div>

        <div class="relative flex h-full w-4/12 flex-shrink-0 flex-grow flex-col justify-between gap-4 rounded-lg">
            <slot name="right-side-content"></slot>
        </div>
    </div>
</template>
