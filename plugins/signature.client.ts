import Vue3Signature from 'vue3-signature';

export default defineNuxtPlugin((app) => {
    app.vueApp.component('Vue3Signature', Vue3Signature);
});
