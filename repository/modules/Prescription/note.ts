import HttpFactory from '../../factory';

class PrescriptionNoteModule extends HttpFactory {
    private GET = '/eprescription/notes';
    private POST = '/eprescription/prescriptions/note';
    private DELETE = '/eprescription/prescriptions/note';

    async get(query) {
        return await this.call('GET', `${this.GET}${query}`);
    }

    async create(data: object) {
        return await this.call('POST', `${this.POST}`, data);
    }

    async createForMulti(data: object) {
        return await this.call('POST', `${this.POST}s`, data);
    }

    async edit(data: object) {
        return await this.call(
            'PUT',
            `/eprescription/prescriptions/${data.prescription_ref}}/note/${data.prescription_note_ref}`,
            data,
        );
    }

    async delete(data: any) {
        return await this.call('DELETE', `${this.DELETE}`, data);
    }
}

export default PrescriptionNoteModule;
