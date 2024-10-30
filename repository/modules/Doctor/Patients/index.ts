import type { PatientResponse } from './types';
import HttpFactory from '~/repository/factory';

class DoctorPatientModule extends HttpFactory {
    async create(data: object) {
        return await this.call<PatientResponse>('GET', `/doctors/patients/create`, data);
    }

    async featchOwnPatient(query: string) {
        return await this.call<PatientResponse>(
            'GET',
            `/doctors/patients?query=${query}&own_patient=1&with_operating_profiles=1`,
            undefined,
        );
    }

    async featchPatientInfo(id: number) {
        return await this.call<PatientResponse>('GET', `/doctors/patients/${id}`, undefined);
    }

    async featchPatientVisitDetails(patientID: number) {
        return await this.call<PatientResponse>('GET', `/doctors/patients/${patientID}?visit_details=1`, undefined);
    }

    async featchPatientList(query: string | undefined = '') {
        return await this.call<PatientResponse>('GET', `/doctors/patients?${query}`, undefined);
    }
}

export default DoctorPatientModule;
