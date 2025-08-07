import { z } from 'zod/v4'

export const arbeidsforholdTypeSchema = z.object({
    kode: z.string(),
    beskrivelse: z.string(),
})

export const identSchema = z.object({
    type: z.string(),
    ident: z.string(),
    gjeldende: z.boolean().optional(),
})

export const arbeidsstedSchema = z.object({
    type: z.string(),
    identer: z.array(identSchema),
})

export const ansettelsesdetaljerSchema = z.object({
    type: z.string(),
    arbeidstidsordning: z
        .object({
            kode: z.string(),
            beskrivelse: z.string(),
        })
        .optional(),
    ansettelsesform: z
        .object({
            kode: z.string(),
            beskrivelse: z.string(),
        })
        .optional(),
    yrke: z
        .object({
            kode: z.string(),
            beskrivelse: z.string(),
        })
        .optional(),
    antallTimerPrUke: z.number().optional(),
    avtaltStillingsprosent: z.number().optional(),
    rapporteringsmaaneder: z
        .object({
            fra: z.string(),
            til: z.string().nullable(),
        })
        .optional(),
    fartsomraade: z
        .object({
            kode: z.string(),
            beskrivelse: z.string(),
        })
        .optional(),
    skipsregister: z
        .object({
            kode: z.string(),
            beskrivelse: z.string(),
        })
        .optional(),
    fartoeystype: z
        .object({
            kode: z.string(),
            beskrivelse: z.string(),
        })
        .optional(),
})

export const rapporteringsordningSchema = z.object({
    kode: z.string(),
    beskrivelse: z.string(),
})

export const bruksperiodeSchema = z.object({
    fom: z.string(),
    tom: z.string().nullable(),
})

export const arbeidsforholdSchema = z.object({
    id: z.string(),
    type: z.object({
        kode: z.string(),
        beskrivelse: z.string(),
    }),
    arbeidstaker: z.object({
        identer: z.array(identSchema),
    }),
    arbeidssted: arbeidsstedSchema,
    opplysningspliktig: arbeidsstedSchema,
    ansettelsesperiode: z.object({
        startdato: z.string(),
        sluttdato: z.string().nullable().optional(),
    }),
    ansettelsesdetaljer: z.array(ansettelsesdetaljerSchema),
    rapporteringsordning: rapporteringsordningSchema,
    navArbeidsforholdId: z.number(),
    navVersjon: z.number(),
    navUuid: z.string(),
    opprettet: z.string(),
    sistBekreftet: z.string(),
    bruksperiode: bruksperiodeSchema,
})

export type Arbeidsforhold = z.infer<typeof arbeidsforholdSchema>
