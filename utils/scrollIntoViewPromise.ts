const scrollIntoViewPromise = async (node: HTMLElement, options?: ScrollIntoViewOptions) => {
    // node.scrollIntoView(options);

    return new Promise((resolve) => {
        const intersectionObserver = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                setTimeout(() => {
                    resolve(true);
                    intersectionObserver.unobserve(node);
                }, 100);
            }
        });
        intersectionObserver.observe(node);
    });
};

export default scrollIntoViewPromise;
