import { z } from 'zod'

export const kildesporSchema = z
    .object({
        // Add specific Kildespor fields here based on your backend implementation
        // For now, using a flexible object structure
        kilde: z.string().optional(),
        tidsstempel: z.string().optional(),
        // Add more fields as needed
    })
    .passthrough() // Allow additional properties

export type Dokument = z.infer<typeof dokumentSchema>
export type Dokumenttype = z.infer<typeof dokumenttypeSchema>
export const dokumenttypeSchema = z.enum(['SØKNAD', 'INNTEKTSMELDING', 'SYKMELDING', 'AAREG', 'ainntekt828'])

export const dokumentSchema = z.object({
    id: z.string().uuid(),
    dokumentType: dokumenttypeSchema,
    eksternId: z.string().nullable(),
    innhold: z.unknown(), // JsonNode can be any JSON structure
    opprettet: z.string(), // ISO string representation of Instant
    request: kildesporSchema,
})
