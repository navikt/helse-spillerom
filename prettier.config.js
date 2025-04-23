// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('@navikt/eslint-config-teamsykmelding/prettier')

module.exports = {
    ...baseConfig,
    plugins: [
        ...(baseConfig.plugins || []),
        'prettier-plugin-tailwindcss', // or any other plugin you want
    ],
    tailwindStylesheet: './src/styles/globals.css',
    tailwindFunctions: ['clsx', 'cn'],
}
