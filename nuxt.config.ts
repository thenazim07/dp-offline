import { createRequire } from 'node:module';
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';
const require = createRequire(import.meta.url);

export default defineNuxtConfig({
    ssr: false,
    devtools: {
        enabled: true,
    },

    nitro: {
        preset: 'static', // Use the static preset to avoid server bundles
    },

    app: {
        baseURL: './',
        buildAssetsDir: '_nuxt/',
        head: {
            charset: 'utf-16',
            viewport: 'width=500, initial-scale=1',
            title: process.env.APP_NAME,
            meta: [
                {
                    name: 'description',
                    content:
                        'Welcome to DoctorPro! Your one-stop solution for managing prescriptions, appointments, and medical records. With DoctorPro, you can easily schedule appointments, receive reminders, and access your medical history anytime, anywhere. Our platform is designed to streamline your healthcare experience, ensuring seamless communication between you and your healthcare provider. Join DoctorPro today and take control of your health journey!',
                },
            ],
            link: [{ rel: 'icon', type: 'image/png', href: '/images/favicon.ico' }],
        },
    },

    routeRules: {
        '/': { redirect: '/login' },
    },

    googleFonts: {
        download: true,
        overwriting: true,
        families: {
            Poppins: {
                wght: [400, 600, 700],
            },
            'Noto Sans Bengali': {
                wght: [300, 400, 600, 700],
            },
        },
    },

    css: ['~/assets/css/tailwind.css', '~/assets/css/ck-content.css'],

    colorMode: {
        preference: 'light',
        fallback: 'light',
    },

    build: {
        transpile: [
            '@vee-validate/rules',
            '@vuepic/vue-datepicker',
            '@headlessui/vue',
            '@heroicons/vue/24/solid',
            '@heroicons/vue/24/outline',
        ],
    },

    runtimeConfig: {
        public: {
            PRESCRIPTION_VERSION: process.env.PRESCRIPTION_VERSION,
            baseURL: process.env.BASE_URL ?? 'https://rxdev.doctime.com.bd/api',
        },
    },

    modules: [
        [
            '@pinia/nuxt',
            {
                autoImports: ['defineStore', ['defineStore', 'definePiniaStore']],
            },
        ],
        '@nuxtjs/google-fonts',
        '@vueuse/nuxt',
        '@nuxt/ui',
        '@nuxt/image',
        '@pinia-plugin-persistedstate/nuxt',
        [
            '@vee-validate/nuxt',
            {
                autoImports: true,
                componentNames: {
                    Form: 'VForm',
                    Field: 'VField',
                    FieldArray: 'FieldArray',
                    ErrorMessage: 'VErrorMessage',
                },
            },
        ],
    ],

    vite: {
        plugins: [ckeditor5({ theme: require.resolve('@ckeditor/ckeditor5-theme-lark') })],
    },
});
