import {
    useFloating,
    /* autoPlacement, */ offset,
    shift,
    autoUpdate /*, size, flip */,
    autoPlacement,
} from '@floating-ui/vue';

const floatingUI = (
    reference: Ref<null>,
    floating: Ref<null>,
    currentColumnIndex: Ref<number>,
    // config: Parameters<typeof useFloating>[2] = {
    //     placement: 'right-end',
    // },
) => {
    const { floatingStyles } = useFloatingElement(reference, floating, {
        placement: currentColumnIndex.value === 0 ? 'right-start' : 'bottom',
        middleware: [
            autoPlacement({
                allowedPlacements: currentColumnIndex.value === 0 ? ['right-start'] : ['bottom', 'top'],
            }),
        ],
    });

    return {
        floatingStyles,
    };
};

export default floatingUI;
