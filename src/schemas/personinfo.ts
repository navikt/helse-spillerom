import { z } from 'zod'

export type Personinfo = z.infer<typeof personinfoSchema>
export const personinfoSchema = z.object({
    fødselsnummer: z.string(),
    aktørId: z.string(),
    navn: z.string(),
    alder: z.number(),
})
