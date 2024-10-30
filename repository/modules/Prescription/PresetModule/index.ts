import HttpFactory from '~/repository/factory';

class PrescriptionPresetModule extends HttpFactory {
    private GET = '/eprescription/presets';
    private POST = '/eprescription/presets';
    private UPDATE = '/eprescription/presets/';
    private DELETE = '/eprescription/presets/';

    async get(query: string) {
        return await this.call('GET', `${this.GET}${query}`);
    }

    async featchPresetByIdenticalName(identicalName: string) {
        return await this.call('GET', `/eprescription/presets?item_identical_name=${identicalName}`, undefined);
    }

    async featchPresetByIdenticalNameForEhr(identicalName: string) {
        return await this.call('GET', `/presets?item_identical_name=${identicalName}`, undefined);
    }

    async create(data: object) {
        return await this.call('POST', `${this.POST}`, data);
    }

    async update(data: object) {
        return await this.call('PUT', `${this.UPDATE}${data.id}/update`, data);
    }

    async delete(id: any) {
        return await this.call('DELETE', `${this.DELETE}${id}/delete`);
    }

    // Ehr

    async getForEhr(query: String) {
        return await this.call('GET', `/presets${query}`);
    }

    async createForEhr(data: Object) {
        return await this.call('POST', `/presets`, data);
    }

    async updateForEhr(data: Object) {
        return await this.call('PUT', `presets/${data.id}/update`, data);
    }

    async deleteForEhr(data: any) {
        return await this.call('DELETE', `presets/${data.id}/delete`, data);
    }
}

export default PrescriptionPresetModule;
