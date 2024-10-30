import type { IDrag } from '~/repository/modules/Prescription/DrugsModule/types';
import { usePrescriptionDrugStore } from '~/stores/prescription/useDrugStore'

export default function generateDrugUniqName(drug: IDrag, ehr: boolean = false): string {
    const { dosageFormsList } = storeToRefs(usePrescriptionDrugStore());
    const { dosage_form, brand_name, name, strength } = drug || {};

    if(ehr) {
        const dosageFormShortName = dosage_form?.short_name || '';
        const displayName = name || drug.drug;

        return `${dosageFormShortName} ${displayName} ${strength || ''}`.trim();
    }

    const dosageFormShortName = dosage_form?.short_name || dosageFormsList.value.find(item => item.ref === drug.dosage_form_ref)?.short_name || '';

    const displayName = brand_name || name || '';

    return `${dosageFormShortName} ${displayName} ${strength || ''}`.trim();
}
