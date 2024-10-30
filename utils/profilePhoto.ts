export default function profilePhoto(user: any) {
    if (isProxy(user)) {
        return user.profile_photo || (user.gender === 'Male' ? '/images/male.svg' : '/images/female.svg');
    }
    return null;
}
