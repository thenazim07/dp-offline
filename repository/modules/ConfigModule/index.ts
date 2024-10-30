import type { FieldResponse } from './types';
import HttpFactory from '~/repository/factory';

class ConfigModule extends HttpFactory {
    async field(): Promise<FieldResponse> {
        return await this.call<FieldResponse>('GET', `/configs/fields`);
    }
}

export default ConfigModule;
