import { z } from 'zod/v4'

export type PersonId = z.infer<typeof personIdSchema>
export const personIdSchema = z.object({
    personId: z.uuid(),
})

export type PersonsøkSchema = z.infer<typeof personsøkSchema>
export const personsøkSchema = z.object({
    ident: z
        .string()
        .refine((val) => val.length === 11 || val.length === 13, {
            message: 'Ident må være 11 eller 13 siffer',
        })
        .refine((val) => /^\d+$/.test(val), {
            message: 'Ident kan bare inneholde siffer',
        }),
})
