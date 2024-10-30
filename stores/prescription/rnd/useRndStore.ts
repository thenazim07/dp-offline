import { defineStore } from 'pinia';
import * as Yup from 'yup';

export const useRndStore = defineStore('rnd', () => {
    const { defineField, handleSubmit, errors } = useForm<{
        name: string;
        email: string;
    }>({
        validationSchema: Yup.object({
            name: Yup.string().required(),
            email: Yup.string().required().email(),
        }),
    });

    const [name, nameProps] = defineField('name');
    const [email, emailProps] = defineField('email');

    const onFormSubmitHandler = handleSubmit((values) => {
        console.log('form submitted in store', JSON.stringify(values, null, 2));
    });

    return {
        errors,
        name,
        nameProps,
        email,
        emailProps,

        // actions
        onFormSubmitHandler,
    };
});
