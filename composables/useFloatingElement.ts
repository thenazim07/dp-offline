import { useFloating, /* autoPlacement, */ offset, shift, autoUpdate /*, size, flip */ } from '@floating-ui/vue';

const floatingUI = (
    reference: Ref<null>,
    floating: Ref<null>,
    config: Parameters<typeof useFloating>[2] = {
        placement: 'right-end',
    },
) => {
    const header = document?.querySelector('#navbar')?.closest('header');

    const { floatingStyles } = useFloating(reference, floating, {
        middleware: [
            // autoPlacement(),
            offset({
                crossAxis: -50,
            }),
            // flip(),
            // size({
            //     padding: 10,
            //     apply({ availableWidth, availableHeight, elements }) {
            //         // Change styles, e.g.
            //         Object.assign(elements.floating.style, {
            //             maxWidth: `${availableWidth}px`,
            //             maxHeight: `${availableHeight}px`,
            //         });
            //     },
            // }),
            shift({
                crossAxis: true,
                padding: {
                    top: header?.clientHeight || 0,
                },
            }),
        ],
        whileElementsMounted(...args) {
            const cleanup = autoUpdate(...args, { elementResize: false });
            return cleanup;
        },
        ...config,
    });

    return {
        floatingStyles,
    };
};

export default floatingUI;
