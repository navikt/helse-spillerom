import { z } from 'zod'

export const organisasjonsnavnSchema = z.string()

export type Organisasjonsnavn = z.infer<typeof organisasjonsnavnSchema>
