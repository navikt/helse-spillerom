import { z } from 'zod'

export type Dokumenttype = z.infer<typeof dokumenttypeSchema>
export const dokumenttypeSchema = z.enum(['SØKNAD', 'INNTEKTSMELDING', 'SYKMELDING'])

export type Dokument = z.infer<typeof dokumentSchema>
export const dokumentSchema = z.object({
    id: z.string(),
    type: dokumenttypeSchema,
    sendtTilNAVTidsunkt: z.string(),
})
