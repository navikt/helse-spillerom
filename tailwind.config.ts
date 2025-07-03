import type { Config } from 'tailwindcss'

const config: Config = {
    presets: [require('@navikt/ds-tailwind')],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    plugins: [],
}
export default config
