import { z } from 'zod'

export type PersonId = z.infer<typeof personIdSchema>
export const personIdSchema = z.object({
    personId: z.string(),
})

export type PersonsøkSchema = z.infer<typeof personsøkSchema>
export const personsøkSchema = z.object({
    ident: z.string(),
})
