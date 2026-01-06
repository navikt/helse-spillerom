import baseConfig from '@navikt/tsm-prettier'

const config = {
    ...baseConfig,
    plugins: [...(baseConfig.plugins || []), 'prettier-plugin-tailwindcss'],
    tailwindStylesheet: './src/styles/globals.css',
    tailwindFunctions: ['clsx', 'cn'],
}

export default config
