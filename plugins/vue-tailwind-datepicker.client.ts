import VueTailwindDatepicker from 'vue-tailwind-datepicker';

export default defineNuxtPlugin((app) => {
    app.vueApp.component('Datepicker', VueTailwindDatepicker);
});
