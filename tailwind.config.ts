import dsTailwind from '@navikt/ds-tailwind/darkside-tw3'
import type { Config } from 'tailwindcss'

export default {
    presets: [dsTailwind],
    content: ['./src/**'],
    theme: {
        extend: {
            backgroundImage: {
                stripes:
                    'repeating-linear-gradient(123deg, var(--ax-border-neutral-subtle), var(--ax-border-neutral-subtle) 1px, transparent 1px, transparent 9px)',
            },
        },
    },
} satisfies Config
