import { z } from 'zod'

import {
    arbeidsforholdTypeSchema,
    identSchema,
    arbeidsstedSchema,
    ansettelsesdetaljerSchema,
    rapporteringsordningSchema,
    bruksperiodeSchema,
    arbeidsforholdSchema,
} from '@schemas/aareg'

export type ArbeidsforholdType = z.infer<typeof arbeidsforholdTypeSchema>
export type Ident = z.infer<typeof identSchema>
export type Arbeidssted = z.infer<typeof arbeidsstedSchema>
export type Ansettelsesdetaljer = z.infer<typeof ansettelsesdetaljerSchema>
export type Rapporteringsordning = z.infer<typeof rapporteringsordningSchema>
export type Bruksperiode = z.infer<typeof bruksperiodeSchema>
export type Arbeidsforhold = z.infer<typeof arbeidsforholdSchema>
