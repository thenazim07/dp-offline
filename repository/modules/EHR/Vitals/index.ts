// import type { FinishedResponse } from './types';
import HttpFactory from '~/repository/factory';

class EhrVitalsModule extends HttpFactory {
    async ideal_and_weight() {
        return await this.call('GET', `/ehr/ideal/weight`);
    }

    async bmi() {
        return await this.call('GET', `/ehr/patient/body-measurement`);
    }

    async bsi() {
        return await this.call('GET', `/ehr/calculate/bsi`);
    }

    async create(data: object) {
        return await this.call('POST', `/doctors/visits/${data.visitID}/vitals`, data);
    }

    async delete(data: any) {
        return await this.call('DELETE', `/ehr/vitals/${data.ref}`, data);
    }
}

export default EhrVitalsModule;
