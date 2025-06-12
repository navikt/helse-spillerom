import { z } from 'zod'

export const dagtypeSchema = z.enum(['SYKEDAG', 'FERIEDAG', 'ARBEIDSDAG', 'HELGEDAG', 'PERMISJONSDAG'])

export const dagSchema = z.object({
    id: z.string(),
    type: z.enum(['SYKEDAG', 'FERIEDAG', 'ARBEIDSDAG', 'HELGEDAG', 'PERMISJONSDAG']),
    dato: z.string(), // ISO date string
})

export const dagoversiktSchema = z.array(dagSchema)

export type Dag = z.infer<typeof dagSchema>
export type Dagtype = z.infer<typeof dagtypeSchema>
export type Dagoversikt = z.infer<typeof dagoversiktSchema>
