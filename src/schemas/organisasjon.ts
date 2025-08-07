import { z } from 'zod/v4'

export const organisasjonsnavnSchema = z.string()

export type Organisasjonsnavn = z.infer<typeof organisasjonsnavnSchema>
