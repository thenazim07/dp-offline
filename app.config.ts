export default defineAppConfig({
    ui: {
        primary: 'blue',

        tabs: {
            wrapper: 'space-y-0',
            list: {
                base: 'border-none mb-5',
                rounded: 'rounded-none',
                padding: 'p-0',
                marker: {
                    rounded: 'rounded-none',
                    shadow: 'shadow-none',
                },
                tab: {
                    base: 'border-b-2 rounded-none bg-transparent ui-focus-visible:ring-0 ui-focus-visible:ring-blue-500',
                    height: 'h-10',
                    inactive: 'border-b-transparent',
                    active: 'border-b-blue-600 rounded-none text-blue-600',
                    rounded: 'rounded-none',
                },
            },
        },

        dropdown: {
            base: 'scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-md scrollbar-w-1.5',
        },

        inputMenu: {
            base: 'scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-md scrollbar-w-1.5',
        },

        notifications: {
            position: 'top-0 bottom-auto',
        },
    },
});
