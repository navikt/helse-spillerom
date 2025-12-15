import { z } from 'zod/v4'

export const valideringSchema = z.object({
    id: z.string(),
    tekst: z.string(),
})
export type Validering = z.infer<typeof valideringSchema>
