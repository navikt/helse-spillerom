import type { Config } from 'tailwindcss'
import navikt from '@navikt/ds-tailwind'

const config: Config = {
    presets: [navikt],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    plugins: [],
}
export default config
