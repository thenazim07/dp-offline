export function doctorInfo() {
    const { user } = manageAuth();

    function fullName() {
        return user.value.name ?? '';
    }

    function phoneNumber() {
        const fullNumber = `${user?.value?.country_calling_code || ''}${user?.value?.contact_no || ''}`;
        return fullNumber;
    }

    return { fullName, phoneNumber };
}
