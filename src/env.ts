import process from 'process'

import { z } from 'zod'

export type PublicEnv = z.infer<typeof browserEnvSchema>
export const browserEnvSchema = z.object({
    NEXT_PUBLIC_RUNTIME_ENV: z.union([z.literal('dev'), z.literal('lokal'), z.literal('demo'), z.literal('prod')]),
    NEXT_PUBLIC_ASSET_PREFIX: z.string().optional(),
})

/**
 * These envs are available in the browser. They are replaced during the bundling step by NextJS.
 *
 * They MUST be provided during the build step.
 */
export const browserEnv = browserEnvSchema.parse({
    NEXT_PUBLIC_RUNTIME_ENV: process.env.NEXT_PUBLIC_RUNTIME_ENV,
    NEXT_PUBLIC_ASSET_PREFIX: process.env.NEXT_PUBLIC_ASSET_PREFIX,
} satisfies Record<keyof PublicEnv, string | undefined>)

export const erLokal = process.env.NODE_ENV !== 'production'
export const erDev = browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'dev'
export const erDemo = browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'demo'
export const erLokalEllerDemo = erLokal || erDemo
export const erProd = browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'prod'
