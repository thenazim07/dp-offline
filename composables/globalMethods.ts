export function globalMethods() {
    function profilePhoto(user: Object) {
        if (isProxy(user)) {
            const userData = new Proxy(user, {
                get: (o, property) => {
                    return property in o ? o[property] : null;
                },
            });

            if (userData.gender === 'Male' && userData.profile_photo === null) {
                return '/images/male.svg';
            }

            if (userData.gender === 'Female' && userData.profile_photo === null) {
                return '/images/female.svg';
            }

            return userData.profile_photo;
        }
    }

    return { profilePhoto };
}
