import { useLayoutsStore } from '#imports';
import { defineStore } from 'pinia';
import type {
    IPatientSection,
    IPatientSectionColumn,
    IPatientSectionRow,
} from '~/repository/modules/PageLayoutModule/types';
import type { Patient } from '~/types/patient';

export const useLayoutsPatientSectionStore = defineStore('useLayoutsPatientSectionStore', () => {
    const { $api } = useNuxtApp();
    const toast = useToast();

    const layoutStore = useLayoutsStore();
    const { pageSetupFormData } = storeToRefs(layoutStore);

    const selectedPatientForPatientSection: Ref<Patient | any> = ref({});

    const fetchPatientForPatientSectionPreview = async (user: any) => {
        const patientInfo = await $api.doctorPatient.featchPatientInfo(user.id);
        selectedPatientForPatientSection.value = patientInfo.data;
    };

    const defaultPatientSectionRow: IPatientSectionRow = {
        styles: {
            'margin-left': {
                value: '',
                unit: 'in',
            },
            'margin-right': {
                value: '',
                unit: 'in',
            },
            'margin-top': {
                value: '',
                unit: 'in',
            },
            'margin-bottom': {
                value: '',
                unit: 'in',
            },

            'border-left-width': {
                value: '',
                unit: 'px',
            },
            'border-right-width': {
                value: '',
                unit: 'px',
            },
            'border-top-width': {
                value: '',
                unit: 'px',
            },
            'border-bottom-width': {
                value: '',
                unit: 'px',
            },

            'padding-left': {
                value: '',
                unit: 'in',
            },
            'padding-right': {
                value: '',
                unit: 'in',
            },
            'padding-top': {
                value: '',
                unit: 'in',
            },
            'padding-bottom': {
                value: '',
                unit: 'in',
            },
        },
        columns: [],
    };

    const defaultColumn: IPatientSectionColumn = {
        item: '',
        styles: {
            width: {
                value: '3',
                unit: 'in',
            },
            'padding-left': {
                value: '',
                unit: 'in',
            },
            'padding-right': {
                value: '',
                unit: 'in',
            },
            'padding-top': {
                value: '',
                unit: 'in',
            },
            'padding-bottom': {
                value: '',
                unit: 'in',
            },
            'border-left-width': {
                value: '',
                unit: 'px',
            },
            'border-right-width': {
                value: '',
                unit: 'px',
            },
            'border-top-width': {
                value: '',
                unit: 'px',
            },
            'border-bottom-width': {
                value: '',
                unit: 'px',
            },
            'margin-left': {
                value: '',
                unit: 'in',
            },
            'margin-right': {
                value: '',
                unit: 'in',
            },
            'margin-top': {
                value: '',
                unit: 'in',
            },
            'margin-bottom': {
                value: '',
                unit: 'in',
            },
            // as many styles required
        },
        label: {
            text: '',
            printable: true,
            styles: {
                'font-size': {
                    value: '',
                    unit: 'px',
                },
                'font-weight': {
                    value: '',
                    unit: '',
                },
                'padding-left': {
                    value: '',
                    unit: 'in',
                },
                'padding-right': {
                    value: '',
                    unit: 'in',
                },
                'padding-top': {
                    value: '',
                    unit: 'in',
                },
                'padding-bottom': {
                    value: '',
                    unit: 'in',
                },
                'border-left-width': {
                    value: '',
                    unit: 'px',
                },
                'border-right-width': {
                    value: '',
                    unit: 'px',
                },
                'border-top-width': {
                    value: '',
                    unit: 'px',
                },
                'border-bottom-width': {
                    value: '',
                    unit: 'px',
                },
                'margin-left': {
                    value: '',
                    unit: 'in',
                },
                'margin-right': {
                    value: '',
                    unit: 'in',
                },
                'margin-top': {
                    value: '',
                    unit: 'in',
                },
                'margin-bottom': {
                    value: '',
                    unit: 'in',
                },
                // as many styles required
            },
        },
        value: {
            styles: {
                'font-size': {
                    value: '',
                    unit: 'px',
                },
                'font-weight': {
                    value: '',
                    unit: '',
                },
                'padding-left': {
                    value: '',
                    unit: 'in',
                },
                'padding-right': {
                    value: '',
                    unit: 'in',
                },
                'padding-top': {
                    value: '',
                    unit: 'in',
                },
                'padding-bottom': {
                    value: '',
                    unit: 'in',
                },
                'border-left-width': {
                    value: '',
                    unit: 'px',
                },
                'border-right-width': {
                    value: '',
                    unit: 'px',
                },
                'border-top-width': {
                    value: '',
                    unit: 'px',
                },
                'border-bottom-width': {
                    value: '',
                    unit: 'px',
                },
                'margin-left': {
                    value: '',
                    unit: 'in',
                },
                'margin-right': {
                    value: '',
                    unit: 'in',
                },
                'margin-top': {
                    value: '',
                    unit: 'in',
                },
                'margin-bottom': {
                    value: '',
                    unit: 'in',
                },
                // as many styles required
            },
        },
    };

    const defaultPatientSection: IPatientSection = {
        rootStylesExtras: { unit: 'in' },
        rootStyles: {
            width: {
                value: (
                    Number(pageSetupFormData?.value?.width) -
                    Number(pageSetupFormData?.value?.margins?.left) -
                    Number(pageSetupFormData.value.margins.right)
                ).toString(),
                unit: 'in',
            },
            'padding-left': {
                value: '',
                unit: 'in',
            },
            'padding-right': {
                value: '',
                unit: 'in',
            },
            'padding-top': {
                value: '',
                unit: 'in',
            },
            'padding-bottom': {
                value: '',
                unit: 'in',
            },
            'border-left-width': {
                value: '',
                unit: 'px',
            },
            'border-right-width': {
                value: '',
                unit: 'px',
            },
            'border-top-width': {
                value: '',
                unit: 'px',
            },
            'border-bottom-width': {
                value: '',
                unit: 'px',
            },
            'margin-left': {
                value: '',
                unit: 'in',
            },
            'margin-right': {
                value: '',
                unit: 'in',
            },
            'margin-top': {
                value: '',
                unit: 'in',
            },
            'margin-bottom': {
                value: '',
                unit: 'in',
            },
        },
        rows: [],
    };

    const currentPatientSectionRow = ref<IPatientSectionRow[]>([]);

    const currentPatientSectionColumnItem = ref<string>('');

    const currentPatientSection = ref<IPatientSection>(defaultPatientSection);

    function addRow() {
        currentPatientSectionRow.value.push(JSON.parse(JSON.stringify(defaultPatientSectionRow)));
    }

    const fetchPatientSection = async () => {
        try {
            const response = await $api.pageLayout.getLayout('patient_section');

            if (response.data.rows) {
                currentPatientSection.value.rows = response.data.rows;
                currentPatientSectionRow.value = response.data.rows;
            }

            if (response.data.rootStyles) {
                currentPatientSection.value.rootStyles = response.data.rootStyles;
            }

            if (response.data.rootStylesExtras) {
                currentPatientSection.value.rootStylesExtras = response.data.rootStylesExtras;
            }

            // if (Object.keys(currentPatientSection.value.rootStyles).length !== 0) {
            //     currentPatientSection.value = response.data || {};
            //     currentPatientSectionRow.value = currentPatientSection.value.rows || [];
            // } else {
            //     currentPatientSection.value = defaultPatientSection;
            //     currentPatientSectionRow.value = [];
            // }
        } catch (error) {
            console.error(error);
        }
    };

    const createPatientSection = async () => {
        try {
            currentPatientSection.value.rows = currentPatientSectionRow.value;
            const response = await $api.pageLayout.createPageLayout(currentPatientSection.value, 'patient_section');
            console.log('patient section created', response);
            currentPatientSection.value = response.data;
            currentPatientSectionRow.value = currentPatientSection.value.rows;
            toast.add({ title: 'Patient Section Created Successfully', color: 'green' });
        } catch (error) {
            console.error(error);
        }
    };

    return {
        defaultPatientSectionRow,
        defaultColumn,
        currentPatientSectionRow,
        currentPatientSectionColumnItem,
        currentPatientSection,
        selectedPatientForPatientSection,

        addRow,
        fetchPatientSection,
        createPatientSection,
        fetchPatientForPatientSectionPreview,
    };
});
