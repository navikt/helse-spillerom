import { z } from 'zod'

const aktoerSchema = z.object({
    identifikator: z.string(),
    aktoerType: z.enum(['NATURLIG_IDENT', 'ORGANISASJON']),
})

const inntektSchema = z.object({
    inntektType: z.string(),
    beloep: z.number(),
    fordel: z.string(),
    inntektskilde: z.string(),
    inntektsperiodetype: z.string(),
    inntektsstatus: z.string(),
    utbetaltIMaaned: z.string(),
    opplysningspliktig: aktoerSchema,
    virksomhet: aktoerSchema,
    inntektsmottaker: aktoerSchema,
    inngaarIGrunnlagForTrekk: z.boolean(),
    utloeserArbeidsgiveravgift: z.boolean(),
    informasjonsstatus: z.string(),
    beskrivelse: z.string(),
})

const arbeidsInntektInformasjonSchema = z.object({
    inntektListe: z.array(inntektSchema),
})

const arbeidsInntektMaanedSchema = z.object({
    aarMaaned: z.string(),
    arbeidsInntektInformasjon: arbeidsInntektInformasjonSchema,
})

export const ainntektSchema = z.object({
    arbeidsInntektMaaned: z.array(arbeidsInntektMaanedSchema),
    ident: aktoerSchema,
})

export type Ainntekt = z.infer<typeof ainntektSchema>
