import { LoginResponse, RegisterResponse } from 'types/auth';

import HttpFactory from '../factory';

class PatientModule extends HttpFactory {
    private PATIENTS_LIST = '/doctors/patients';
    private PATIENTS_CREATE = '/doctors/patients/create';
    private VISIT_INIT = '/doctors/visits/initiate';

    async get(query = ''): Promise<LoginResponse> {
        return await this.call<ILoginResponse>('GET', `${this.PATIENTS_LIST}${query}`);
    }

    async getPatientDetails(patient_id: Number): Promise<LoginResponse> {
        return await this.call<ILoginResponse>('GET', `${this.PATIENTS_LIST}/${patient_id}?visit_details=1`);
    }

    async getPatientForPrescription(patient_id: Number): Promise<LoginResponse> {
        return await this.call<ILoginResponse>('GET', `${this.PATIENTS_LIST}/${patient_id}`);
    }

    async update(account: RegisterPatient): Promise<RegisterResponse> {
        return await this.call<ICreateAccountResponse>('PUT', `/doctors/patients/${account.id}/update`, account);
    }

    async create(account: RegisterPatient): Promise<RegisterResponse> {
        return await this.call<ICreateAccountResponse>('POST', `${this.PATIENTS_CREATE}`, account);
    }

    async visitInit(data: RegisterPatient): Promise<RegisterResponse> {
        return await this.call<ICreateAccountResponse>('POST', `${this.VISIT_INIT}`, data);
    }
}

export default PatientModule;
