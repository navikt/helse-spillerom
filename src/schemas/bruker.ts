import { z } from 'zod'

export const rolleSchema = z.enum(['LES', 'SAKSBEHANDLER', 'BESLUTTER'])
export type Rolle = z.infer<typeof rolleSchema>

export type Bruker = z.infer<typeof brukerSchema>
export const brukerSchema = z.object({
    navn: z.string(),
    navIdent: z.string(),
    preferredUsername: z.string(),
    roller: z.array(rolleSchema),
})
