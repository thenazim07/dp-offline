import { onMounted, onUnmounted } from 'vue';

// by convention, composable function names start with "use"
export function useMutationObserver(targetElement: Ref<HTMLElement>) {
    const callback = function (mutationsList: any, observer: any) {
        for (const mutation of mutationsList) {
            const isNewNodeAdded = mutation.addedNodes.length > 0;
            if (mutation.type === 'childList' && isNewNodeAdded) {
                targetElement?.value?.scrollTo(0, targetElement?.value?.scrollHeight);
            }
        }
    };

    const observer = new MutationObserver(callback);

    onMounted(() => {
        if (targetElement?.value) observer.observe(targetElement?.value, { childList: true });
    });

    onUnmounted(() => {
        observer.disconnect();
    });

    // return { };
}

export default useMutationObserver;
