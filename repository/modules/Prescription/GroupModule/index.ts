import HttpFactory from '~/repository/factory';

class PrescriptionGroupModule extends HttpFactory {
    private GET = '/eprescription/groups';
    private POST = '/eprescription/groups';
    private UPDATE = '/eprescription/groups';
    private DELETE = '/eprescription/groups';

    async get(query: string) {
        return await this.call('GET', `${this.GET}${query}`);
    }

    async featchGroupByIdenticalName(identicalName: string) {
        return await this.call('GET', `/eprescription/groups?item_identical_name=${identicalName}`, undefined);
    }

    async create(data: object) {
        return await this.call('POST', `${this.POST}`, data);
    }

    async edit(data: object) {
        return await this.call('PUT', `${this.UPDATE}/${data.id}/update`, data);
    }

    async deleteGroup(id: any) {
        return await this.call('DELETE', `${this.DELETE}/${id}/delete`);
    }

    async deleteItem(data: any) {
        return await this.call('DELETE', `${this.DELETE}/${data.group_id}/groupItem/${data.item_id}/delete`);
    }
}

export default PrescriptionGroupModule;
