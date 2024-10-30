import { useEhrStore } from '~/stores/ehr';
import { useAdviceStoreRoot } from '~/stores/prescription/useAdviceStoreRoot';
import { useChiefComplaintsStoreRoot } from '~/stores/prescription/useChiefComplaintsStoreRoot';
import { useDiagnosisStoreRoot } from '~/stores/prescription/useDiagnosisStoreRoot';
import { usePrescriptionDrugStore } from '~/stores/prescription/useDrugStore';
import { useFollowUpStoreRoot } from '~/stores/prescription/useFollowUpStoreRoot';
import { useInvestigationStoreRoot } from '~/stores/prescription/useInvestigationStoreRoot';
import { useOnExaminationStoreRoot } from '~/stores/prescription/useOnExaminationStoreRoot';

export function useCheckAllFloatingWindowClosed(): boolean {
    const { isShowingChiefComplaintEditor } = storeToRefs(useChiefComplaintsStoreRoot());
    const { isShowingDiagnosisEditor } = storeToRefs(useDiagnosisStoreRoot());
    const { isShowingInvestigationEditor } = storeToRefs(useInvestigationStoreRoot());
    const { isShowingOnExaminationEditor } = storeToRefs(useOnExaminationStoreRoot());
    const { isShowingAdviceEditor } = storeToRefs(useAdviceStoreRoot());
    const { isShowingFollowUpEditor } = storeToRefs(useFollowUpStoreRoot());
    const { isShowingDrugEditor } = storeToRefs(usePrescriptionDrugStore());
    const { isShowingPastHistoryEditor } = storeToRefs(useEhrStore());

    if (
        !isShowingPastHistoryEditor.value &&
        !isShowingDrugEditor.value &&
        !isShowingFollowUpEditor.value &&
        !isShowingAdviceEditor.value &&
        !isShowingOnExaminationEditor.value &&
        !isShowingInvestigationEditor.value &&
        !isShowingDiagnosisEditor.value &&
        !isShowingChiefComplaintEditor.value
    ) {
        return true;
    }

    return false;
}
