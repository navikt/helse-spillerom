import type { Config } from 'tailwindcss'

const config: Config = {
    presets: [require('@navikt/ds-tailwind')],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    plugins: [],
    theme: {
        data: {
            active: 'active~="true"',
        },
        extend: {
            colors: {
                'aksel-heading': 'var(--a-deepblue-800)',
                tidslinjebakgrunn: 'var(--ax-bg-neutral-softA)',
            },
            spacing: {
                0: '0',
                header: '4rem',
                sidebar: '20rem',
                text: '600px',
            },
            maxWidth: {
                aksel: '1280px',
                text: '600px',
                prose: '75ch',
            },
            minWidth: ({ theme }) => ({
                header: '3.5rem',
                button: '8rem',
                card: '20rem',
                modal: '30rem',
                ...theme('spacing'),
            }),
            minHeight: ({ theme }) => ({
                'screen-header': 'calc(100vh - 3.5rem)',
                ...theme('spacing'),
            }),
            boxShadow: {
                'focus-gap': '0 0 0 1px white, var(--a-shadow-focus)',
            },
            keyframes: {},
            animation: {
                fadeIn: 'fadeIn 0.15s cubic-bezier(0.65, 0, 0.35, 1)',
                toc: 'toc 0.15s cubic-bezier(0.65, 0, 0.35, 1)',
                popUpPage: 'popUp 0.4s cubic-bezier(0.19, 0.91, 0.38, 1)',
            },
        },
    },
}
export default config
