import { StorageSerializers } from '@vueuse/core';

export default async <T>(url: string) => {
    // Use sessionStorage to cache the lesson data
    const cached = await useSessionStorage<T>(url, null, {
        // By passing null as default it can't automatically
        // determine which serializer to use
        serializer: StorageSerializers.object,
    });

    cached.value = null as T;

    return true;
};
