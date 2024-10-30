import type { DiseaseResponse } from './types';
import HttpFactory from '~/repository/factory';

class DoctorDiseasesModule extends HttpFactory {
    async fetchDiseases() {
        return await this.call<DiseaseResponse>('GET', `/doctors/diseases`, undefined);
    }
}

export default DoctorDiseasesModule;
