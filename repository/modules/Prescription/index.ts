import HttpFactory from '../../factory';

class PrescriptionModule extends HttpFactory {
    async get(url: string) {
        return await this.call('GET', url);
    }
}

export default PrescriptionModule;
