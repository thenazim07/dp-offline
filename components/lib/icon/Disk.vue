<script setup>
defineProps({
    color: {
        type: String,
        default: '#136afb',
    },
});
</script>

<template>
    <span class="block h-5 w-5 cursor-pointer rounded-full bg-skin-fill p-px">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 18"
        >
            <g fill="#ffffff">
                <path
                    d="m17.826 3.774-3.6-3.6A.6.6 0 0 0 13.8 0h-1.2v4.8A1.2 1.2 0 0 1 11.4 6H6.6a1.2 1.2 0 0 1-1.2-1.2V0H1.8A1.8 1.8 0 0 0 0 1.8v14.4A1.8 1.8 0 0 0 1.8 18H3v-5.4a1.8 1.8 0 0 1 1.8-1.8h8.4a1.8 1.8 0 0 1 1.8 1.8V18h1.2a1.8 1.8 0 0 0 1.8-1.8v-12a.6.6 0 0 0-.174-.426Z"
                    data-name="Path 26324"
                />
                <path
                    d="M6.6 0h4.8v4.8H6.6Z"
                    data-name="Path 26325"
                />
                <path
                    d="M13.2 12H4.8a.6.6 0 0 0-.6.6V18h9.6v-5.4a.6.6 0 0 0-.6-.6Z"
                    data-name="Path 26326"
                />
            </g>
        </svg>
    </span>
</template>
