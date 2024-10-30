import { isConstructorDeclaration } from 'typescript';

const useFocusOnParentElementsLastInputElement = () => {
    const inputClassToFocus = 'input-to-focus';
    const focusToParentElementsLastChildsFirstInput = (elemenRef: Ref<HTMLElement>, inputElementClass: string) => {
        // console.log('scroll to last');
        setTimeout(async () => {
            const element = elemenRef?.value?.parentElement?.lastElementChild?.querySelector(inputElementClass);

            elemenRef?.value?.parentElement?.scrollTo({
                top: elemenRef?.value.parentElement.scrollHeight,
                behavior: 'smooth',
            });

            await scrollIntoViewPromise(element);

            setTimeout(() => {
                if (elemenRef.value) element?.focus();
                if (element?.tagName === 'BUTTON') element?.click();
                if (element?.tagName === 'DIV') {
                    element?.querySelector('.vs__search')?.focus();
                }
            }, 300);
        }, 100);
    };

    const focusOnSpecificNodelListIndexInput = async (
        scrollableElement: HTMLElement,
        classForNodeListOfInputToFocus: string,
        index: number,
    ) => {
        // console.log('scroll be index');
        setTimeout(async () => {
            const targetElementToScroll = scrollableElement.children[index];
            const element = targetElementToScroll.querySelectorAll(`.${classForNodeListOfInputToFocus}`)[0];

            const targetRect = targetElementToScroll.getBoundingClientRect();
            const containerRect = scrollableElement.getBoundingClientRect();

            const scrollValue = scrollableElement.scrollTop + (targetRect.top - containerRect.top) - 4;

            scrollableElement.scrollTo({
                top: scrollValue,
                behavior: 'smooth',
            });

            await scrollIntoViewPromise(element);
            // Create an IntersectionObserver to detect when the element is fully in view
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            // Focus on the input inside the element once the element is in view
                            element?.focus();
                            if (element?.tagName === 'BUTTON') element.click();
                            if (element?.tagName === 'DIV') {
                                element?.querySelector('.vs__search')?.focus();
                            }
                            // Disconnect the observer after focusing to avoid multiple triggers
                            observer.disconnect();
                        }
                    });
                },
                {
                    root: scrollableElement, // The scrollable container
                    threshold: 1.0, // Fully visible
                },
            );

            // Start observing the element
            observer.observe(targetElementToScroll);
        }, 100);
    };

    return {
        inputClassToFocus,

        focusToParentElementsLastChildsFirstInput,
        focusOnSpecificNodelListIndexInput,
    };
};

export default useFocusOnParentElementsLastInputElement;
