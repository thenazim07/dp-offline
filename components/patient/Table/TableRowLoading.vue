<script lang="ts" setup></script>

<template>
    <tbody class="animate-pulse divide-y-4 divide-slate-50 bg-white">
        <tr
            v-for="n in 8"
            :key="n"
            class="flex h-20 w-full items-center justify-between bg-white"
        >
            <td class="w-2/5 whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div class="flex items-center space-x-2">
                    <div class="h-10 w-10 flex-shrink-0 rounded-full bg-slate-200"></div>
                    <div class="space-y-1">
                        <p class="h-3 w-44 rounded bg-slate-200"></p>
                        <p class="h-3 w-32 rounded bg-slate-200"></p>
                    </div>
                </div>
            </td>
        </tr>
    </tbody>
</template>
