/* eslint-disable @typescript-eslint/no-var-requires */
import defaultTheme from 'tailwindcss/defaultTheme';
import { scrollbarGutter } from 'tailwind-scrollbar-utilities';

function withOpacity(variableName) {
    return ({ opacityValue }) => {
        if (opacityValue !== undefined) {
            return `rgba(var(${variableName}), ${opacityValue})`;
        }
        return `rgb(var(${variableName}))`;
    };
}

const typography = require('@tailwindcss/typography');
const animate = require('tailwindcss-animate');
const forms = require('@tailwindcss/forms');
const scrollbar = require('tailwind-scrollbar');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
    // darkMode: 'media',

    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
        './index.html',
        './app.vue',
        './src/**/*.{vue,js,ts,jsx,tsx}',
        './node_modules/vue-tailwind-datepicker/**/*.js',
        './src/**/*.{vue,js,ts,jsx,tsx,md}',
        './.vitepress/**/*.{vue,js,ts,jsx,tsx}',
        './node_modules/vue-tailwind-datepicker/**/*.js',
    ],

    theme: {
        extend: {
            screens: {
                // max-width breakpoint added for (1919-1600) and (1599-1630)
                'max-1919': { max: '1919px' },
                'max-1599': { max: '1599px' },
            },
            fontFamily: {
                sans: ['Poppins', 'Noto Sans Bengali', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'vtd-primary': colors.blue,
                'vtd-secondary': colors.gray,
                'primary-500': '#136AFB',
            },
            textColor: {
                skin: {
                    base: withOpacity('--color-text-base'),
                    muted: withOpacity('--color-text-muted'),
                    inverted: withOpacity('--color-text-inverted'),
                    dark: withOpacity('--color-text-dark'),
                },
            },

            backgroundColor: {
                skin: {
                    fill: withOpacity('--color-fill'),
                    'button-accent': withOpacity('--color-button-accent'),
                    'button-accent-hover': withOpacity('--color-button-accent-hover'),
                    'button-muted': withOpacity('--color-button-muted'),
                    'for-page': withOpacity('--color-background-for-page'),
                },
            },

            boxShadow: {
                'sidebar-close-or-open': '0 4px 6px rgba(0, 0, 0, 0.1)',
                dropdown: '0 0 3px 0 rgba(0, 0, 0, 0.08)',
                'follow-up': '0px 0px 20px #0000001A',
            },

            gradientColorStops: {
                skin: {
                    hue: withOpacity('--color-fill'),
                },
            },

            backgroundImage: {
                'patient-create-card': "url('/assets/images/background/create_patient_card.svg')",
            },

            content: {
                dod: 'url("/assets/icon/dod.svg")',
            },
        },
    },

    plugins: [animate, typography, forms, scrollbar({ nocompatible: true }), scrollbarGutter()],
};
