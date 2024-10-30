<script lang="ts" setup></script>

<template>
    <div
        class="mb-4 h-[8rem] overflow-y-auto rounded-lg border border-blue-200 bg-slate-50 py-2 scrollbar-thin 2xl:mb-8"
    >
        <div class="relative flex flex-wrap px-2">
            <slot></slot>
        </div>
    </div>
</template>
