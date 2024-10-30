import { Base64 } from 'js-base64';

export default function getUuid(name: string = 'name'): string {
    return Base64.encode(name);
}
