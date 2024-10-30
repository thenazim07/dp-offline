import { defineStore } from 'pinia';
import type { IPageSetUpData, IPrescriptionBodySection } from '~/repository/modules/PageLayoutModule/types';

export const useLayoutsStore = defineStore('useLayoutsStore', () => {
    const prescriptionLayoutsData: Ref<Object | null> = ref({});
    const prescriptionSignatureData: Ref<Object | null> = ref({});
    const initialized = ref<boolean>(false);
    const initializedForPrescriptionInfo = ref<boolean>(false);
    const initializedBodySectionByApiCall = ref<boolean>(false);

    const headerSection: Ref<object[] | []> = ref([
        {
            key: 1,
            checked: false,
            value: 40,
            label: '1 Column',
            width: 40,
            content: '',
            range: {
                min: 33,
                max: 100,
            },
        },
        {
            key: 2,
            value: 20,
            checked: false,
            label: '2 Column',
            width: 20,
            content: '',
            range: {
                min: 25,
                max: 50,
            },
        },
        {
            key: 3,
            value: 40,
            label: '3 Column',
            checked: false,
            width: 40,
            content: '',
            range: {
                min: 0,
                max: 33,
            },
        },
    ]);

    const footerSection: Ref<object[] | []> = ref([
        {
            key: 1,
            checked: false,
            value: 40,
            label: '1 Column',
            width: 20,
            content: '',
            range: {
                min: 33,
                max: 100,
            },
        },
        {
            key: 2,
            value: 20,
            checked: false,
            label: '2 Column',
            width: 20,
            content: '',
            range: {
                min: 25,
                max: 50,
            },
        },
        {
            key: 3,
            value: 40,
            label: '3 Column',
            checked: false,
            width: 40,
            content: '',
            range: {
                min: 0,
                max: 33,
            },
        },
    ]);

    const pageSetupFormData = ref<IPageSetUpData>({
        page_type: '',
        page_size: 'custom',
        height: 85,
        width: 50,
        unit: 'in',
        margins: {
            type: 'custom',
            left: 2,
            right: 2,
            top: 2,
            bottom: 2,
            unit: 'in',
        },
    });

    const bodySectionFormData = ref<IPrescriptionBodySection>({
        left_section_width: 30,
        right_section_width: 70,
        divider_line: true,
        bottom_line: true,
        body: emptyPrescriptionBodySection(),
    });

    const selectedBodySections = ref<string[]>([]);

    const bodysectionModalsEdit = ref({
        diagnosis: false,
        advise: false,
        follow_up: false,
        past_history: false,
        on_examination: false,
        investigation: false,
        drug: false,
        signature: false,
        indication: false,
    });

    // this portion is for body section add or remove related action added
    watch(
        () => selectedBodySections.value,
        (newItems, oldItems) => {
            // console.log(oldItems);
            // console.log(newItems);

            if (initializedBodySectionByApiCall.value === true) {
                initializedBodySectionByApiCall.value = false;
                return;
            }
            console.log('body initila', initializedBodySectionByApiCall.value);

            if (newItems.length > oldItems.length) {
                const addedItem = newItems.find((item) => !oldItems.includes(item));
                console.log('Item added:', addedItem);
                addSectionToBodySection(addedItem);
            } else if (newItems.length < oldItems.length) {
                const removedItem = oldItems.find((item) => !newItems.includes(item));
                console.log('Item removed:', removedItem);
                removeSectionFromBodySection(removedItem);
            }
        },
        { deep: true },
    );

    const configStore = useConfigsStore();
    const { prescription_body_sections } = storeToRefs(configStore);

    const addSectionToBodySection = (item: string) => {
        // console.log(`Performing task for added item: ${item}`);
        // Your custom logic here for adding an item
        const defaultBodySectionConfig = prescription_body_sections.value.find((x) => x.value === item);
        if (defaultBodySectionConfig) {
            if (defaultBodySectionConfig.default_position.column === 0)
                bodySectionFormData.value.body.columns.column0.items = addPropertyAtIndex(
                    bodySectionFormData.value.body.columns.column0.items,
                    item,
                    defaultBodySectionConfig.default_styles,
                    defaultBodySectionConfig.default_position.row,
                );

            if (defaultBodySectionConfig.default_position.column === 1)
                bodySectionFormData.value.body.columns.column1.items = addPropertyAtIndex(
                    bodySectionFormData.value.body.columns.column1.items,
                    item,
                    defaultBodySectionConfig.default_styles,
                    defaultBodySectionConfig.default_position.row,
                );
        }
    };

    function addPropertyAtIndex(obj: object, key: string, value: object, index: number) {
        const keys = Object.keys(obj); // Get the keys of the original object
        const newObj = {}; // Create a new object

        // Iterate through the existing keys
        keys.forEach((prop, i) => {
            // Add the new property at the specified index
            if (i === index) {
                newObj[key] = value;
            }
            // Copy the current property
            newObj[prop] = obj[prop];
        });

        // If the index is beyond the last property, append the new property at the end
        if (index >= keys.length) {
            newObj[key] = value;
        }

        return newObj; // Return the new object with the inserted property
    }

    const removeSectionFromBodySection = (item: string) => {
        // console.log(`Performing task for removed item: ${item}`);
        // Your custom logic here for removing an item
        if (Object.keys(bodySectionFormData.value.body.columns.column0.items).includes(item))
            delete bodySectionFormData.value.body.columns.column0.items[item];

        if (Object.keys(bodySectionFormData.value.body.columns.column1.items).includes(item))
            delete bodySectionFormData.value.body.columns.column1.items[item];
    };

    function emptyPrescriptionBodySection() {
        return {
            extras: { unit: '' },
            columns: {
                column0: {
                    items: {
                        indication: {
                            list: {
                                styles: {
                                    'padding-top': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-left': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-right': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-bottom': {
                                        unit: 'in',
                                        value: '',
                                    },
                                },
                            },
                            label: {
                                text: 'Chief Complaint',
                                printable: true,
                            },
                            styles: {
                                height: {
                                    unit: '',
                                    value: 'auto',
                                },
                                'padding-top': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-left': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-right': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-bottom': {
                                    unit: 'in',
                                    value: '',
                                },
                            },
                        },
                        past_history: {
                            list: {
                                styles: {
                                    'padding-top': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-left': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-right': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-bottom': {
                                        unit: 'in',
                                        value: '',
                                    },
                                },
                            },
                            label: {
                                text: 'Past History',
                                printable: true,
                            },
                            styles: {
                                height: {
                                    unit: '',
                                    value: 'auto',
                                },
                                'padding-top': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-left': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-right': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-bottom': {
                                    unit: 'in',
                                    value: '',
                                },
                            },
                        },
                        diagnosis: {
                            list: {
                                styles: {
                                    'padding-top': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-left': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-right': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-bottom': {
                                        unit: 'in',
                                        value: '',
                                    },
                                },
                            },
                            label: {
                                text: 'Diagnosis',
                                printable: true,
                            },
                            styles: {
                                height: {
                                    unit: '',
                                    value: 'auto',
                                },
                                'padding-top': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-left': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-right': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-bottom': {
                                    unit: 'in',
                                    value: '',
                                },
                            },
                        },
                        investigation: {
                            list: {
                                styles: {
                                    'padding-top': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-left': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-right': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-bottom': {
                                        unit: 'in',
                                        value: '',
                                    },
                                },
                            },
                            label: {
                                text: 'Investigation',
                                printable: true,
                            },
                            styles: {
                                height: {
                                    unit: '',
                                    value: 'auto',
                                },
                                'padding-top': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-left': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-right': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-bottom': {
                                    unit: 'in',
                                    value: '',
                                },
                            },
                        },
                        on_examination: {
                            list: {
                                styles: {
                                    'padding-top': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-left': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-right': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-bottom': {
                                        unit: 'in',
                                        value: '',
                                    },
                                },
                            },
                            label: {
                                text: 'On Examination',
                                printable: true,
                            },
                            styles: {
                                height: {
                                    unit: '',
                                    value: 'auto',
                                },
                                'padding-top': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-left': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-right': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-bottom': {
                                    unit: 'in',
                                    value: '',
                                },
                            },
                        },
                    },
                },
                column1: {
                    items: {
                        drug: {
                            list: {
                                styles: {
                                    'padding-top': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-left': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-right': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-bottom': {
                                        unit: 'in',
                                        value: '',
                                    },
                                },
                            },
                            label: {
                                text: '',
                                printable: true,
                            },
                            styles: {
                                height: {
                                    unit: '',
                                    value: 'auto',
                                },
                                'padding-top': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-left': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-right': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-bottom': {
                                    unit: 'in',
                                    value: '',
                                },
                            },
                        },
                        advise: {
                            list: {
                                styles: {
                                    'padding-top': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-left': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-right': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-bottom': {
                                        unit: 'in',
                                        value: '',
                                    },
                                },
                            },
                            label: {
                                text: 'Advise',
                                printable: true,
                            },
                            styles: {
                                height: {
                                    unit: '',
                                    value: 'auto',
                                },
                                'padding-top': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-left': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-right': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-bottom': {
                                    unit: 'in',
                                    value: '',
                                },
                            },
                        },
                        follow_up: {
                            list: {
                                styles: {
                                    'padding-top': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-left': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-right': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-bottom': {
                                        unit: 'in',
                                        value: '',
                                    },
                                },
                            },
                            label: {
                                text: 'Follow-up',
                                printable: true,
                            },
                            styles: {
                                height: {
                                    unit: '',
                                    value: 'auto',
                                },
                                'padding-top': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-left': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-right': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-bottom': {
                                    unit: 'in',
                                    value: '',
                                },
                            },
                        },
                        signature: {
                            list: {
                                styles: {
                                    'padding-top': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-left': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-right': {
                                        unit: 'in',
                                        value: '',
                                    },
                                    'padding-bottom': {
                                        unit: 'in',
                                        value: '',
                                    },
                                },
                            },
                            label: {
                                text: '',
                                printable: true,
                            },
                            styles: {
                                height: {
                                    unit: '',
                                    value: 'auto',
                                },
                                'padding-top': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-left': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-right': {
                                    unit: 'in',
                                    value: '',
                                },
                                'padding-bottom': {
                                    unit: 'in',
                                    value: '',
                                },
                            },
                        },
                    },
                },
            },
        };
    }

    const { $api } = useNuxtApp();
    const toast = useToast();

    async function initialize() {
        if (initialized.value) return;
        initialized.value = true;

        await fetchPrescriptionLayouts();
    }

    const fetchPrescriptionLayouts = async (query = '') => {
        const url = query ? `=${query}` : '';
        const layoutData = useFetchWithCache<Object>(`/doctors/page-layout${url}`);
        prescriptionLayoutsData.value = (await layoutData).value.data;
        // update header section data
        if (prescriptionLayoutsData.value && prescriptionLayoutsData?.value?.header_section) {
            prescriptionLayoutsData?.value?.header_section?.column?.forEach((item: any, key: any) => {
                headerSection.value[key].content = item.content;
                headerSection.value[key].checked = Boolean(item.content);
                headerSection.value[key].width = Number(item.width);
                headerSection.value[key].value = Number(item.width);
            });
        }

        // update header section data
        if (prescriptionLayoutsData.value && prescriptionLayoutsData?.value?.footer_section) {
            prescriptionLayoutsData?.value?.footer_section?.column?.forEach((item: any, key: any) => {
                footerSection.value[key].content = item.content;
                footerSection.value[key].checked = Boolean(item.content);
                footerSection.value[key].width = Number(item.width);
                footerSection.value[key].value = Number(item.width);
            });
        }

        if (prescriptionLayoutsData.value && prescriptionLayoutsData?.value?.page_setup) {
            pageSetupFormData.value = prescriptionLayoutsData?.value?.page_setup;
        }

        if (prescriptionLayoutsData.value && prescriptionLayoutsData?.value?.body_section) {
            bodySectionFormData.value = prescriptionLayoutsData?.value?.body_section;
            initializedBodySectionByApiCall.value = true;
            selectedBodySections.value = [
                ...Object.keys(bodySectionFormData.value.body.columns.column0.items),
                ...Object.keys(bodySectionFormData.value.body.columns.column1.items),
            ];
        }
    };

    const fetchPrescriptionSignatureInfo = async () => {
        if (initializedForPrescriptionInfo.value) return;
        initializedForPrescriptionInfo.value = true;
        const layoutData = useFetchWithCache<Object>(`/doctors/documents`);
        prescriptionSignatureData.value = (await layoutData).value.data[0];
    };

    const fetchPageSetup = async () => {
        try {
            const response = await $api.pageLayout.getLayout('page_setup');

            pageSetupFormData.value = response.data as IPageSetUpData;
        } catch (error) {
            console.error(error);
        }
    };

    const fetchBodySection = async () => {
        try {
            const response = await $api.pageLayout.getLayout('body_section');

            bodySectionFormData.value = response.data;
            if (!bodySectionFormData.value.body?.extras?.unit) {
                bodySectionFormData.value.body.extras = { unit: 'in' };
            }

            initializedBodySectionByApiCall.value = true;

            selectedBodySections.value = [
                ...Object.keys(bodySectionFormData.value.body.columns.column0.items),
                ...Object.keys(bodySectionFormData.value.body.columns.column1.items),
            ];
        } catch (error) {
            console.error(error);
        }
    };

    const createPageSetup = async () => {
        try {
            const response = await $api.pageLayout.createPageLayout(pageSetupFormData.value, 'page_setup');
            console.log('page setup created', response);
            pageSetupFormData.value = response.data;
        } catch (error) {
            console.error(error);
        }
    };

    const createBodySection = async () => {
        try {
            const response = await $api.pageLayout.createPageLayout(bodySectionFormData.value, 'body_section');
            console.log('body section created', response);
            bodySectionFormData.value = response.data;

            initializedBodySectionByApiCall.value = true;

            selectedBodySections.value = [
                ...Object.keys(bodySectionFormData.value.body.columns.column0.items),
                ...Object.keys(bodySectionFormData.value.body.columns.column1.items),
            ];

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    async function create(data: Object) {
        try {
            const response = await $api.pageLayout.pageSetup(data);
            if (response) {
                removedSessionStorage('/doctors/page-layout');
                window.location.href = '/dashboard/prescription/create';
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    async function createHeaderSection() {
        try {
            const response = await $api.pageLayout.pageSetup(formatHeaderSectionData());
            if (response) {
                if (sessionStorage.getItem('/doctors/page-layout')) await removedSessionStorage('/doctors/page-layout');
                await fetchPrescriptionLayouts();
                toast.add({ title: response.message });
                // reloadNuxtApp();
                return response;
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    }

    function formatHeaderSectionData() {
        const checkedAndContentItems = headerSection.value
            .filter((item) => item.checked && item.content !== '')
            .map(({ value, content }) => ({ width: value, content }));

        return {
            column: checkedAndContentItems,
            name: 'header_section',
        };
    }

    async function createFooterSection() {
        try {
            const response = await $api.pageLayout.pageSetup(formatFooterSectionData());
            if (response) {
                await removedSessionStorage('/doctors/page-layout');
                await fetchPrescriptionLayouts();
                toast.add({ title: response.message });
                // reloadNuxtApp();
                return response;
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    }

    function formatFooterSectionData() {
        const checkedAndContentItems = footerSection.value
            .filter((item) => item.checked && item.content !== '')
            .map(({ value, content }) => ({ width: value, content }));

        return {
            column: checkedAndContentItems,
            name: 'footer_section',
        };
    }

    async function updatePrescriptionSignatureText(data: Object) {
        try {
            const response = await $api.pageLayout.pageSetup(data);
            if (response) {
                removedSessionStorage('/doctors/page-layout');
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    }

    return {
        prescriptionLayoutsData,
        prescriptionSignatureData,
        headerSection,
        footerSection,
        pageSetupFormData,
        bodySectionFormData,
        selectedBodySections,
        bodysectionModalsEdit,
        initialized,
        initialize,
        updatePrescriptionSignatureText,
        fetchPrescriptionSignatureInfo,
        fetchPageSetup,
        fetchBodySection,
        createPageSetup,
        createBodySection,
        createHeaderSection,
        createFooterSection,
        create,
    };
});
