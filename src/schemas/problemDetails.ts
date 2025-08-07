// src/schemas/problemDetails.ts
import { z } from 'zod/v4'

/** Minimal RFC 9457 – tillat ekstra felter med .passthrough()  */
export const problemDetailsSchema = z.looseObject({
    type: z.string(), // «about:blank» eller absolutt URI
    title: z.string().optional(),
    status: z.number(), // må være HTTP-kode
    detail: z.string().optional().nullable(),
    instance: z.string().optional().nullable(),
})

export type ProblemDetails = z.infer<typeof problemDetailsSchema>
