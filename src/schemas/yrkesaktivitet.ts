import { z } from 'zod/v4'

import { dagoversiktSchema } from './dagoversikt'
import { inntektRequestSchema, refusjonInfoSchema } from './inntektRequest'
import { inntektDataSchema } from './inntektData'
import { yrkesaktivitetKategoriseringSchema } from './yrkesaktivitetKategorisering'

export const periodetypeSchema = z.enum(['ARBEIDSGIVERPERIODE', 'VENTETID', 'VENTETID_INAKTIV'])

export const periodeSchema = z.object({
    fom: z.string(),
    tom: z.string(),
})

export const perioderSchema = z.object({
    type: periodetypeSchema,
    perioder: z.array(periodeSchema),
})

export const yrkesaktivitetSchema = z.object({
    id: z.string(),
    kategorisering: yrkesaktivitetKategoriseringSchema,
    orgnavn: z.string().nullable(),
    dagoversikt: dagoversiktSchema.nullable(),
    generertFraDokumenter: z.array(z.string()),
    perioder: perioderSchema.nullable(),
    inntektRequest: inntektRequestSchema.nullable().optional(),
    inntektData: inntektDataSchema.nullable().optional(),
    refusjon: z.array(refusjonInfoSchema).nullable().optional(),
})

export type Yrkesaktivitet = z.infer<typeof yrkesaktivitetSchema>
export type Perioder = z.infer<typeof perioderSchema>
export type Periode = z.infer<typeof periodeSchema>
export type Periodetype = z.infer<typeof periodetypeSchema>
