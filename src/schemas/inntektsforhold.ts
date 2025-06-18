import { z } from 'zod'

export const inntektsforholdSchema = z.object({
    id: z.string(),
    svar: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
})

export type Inntektsforhold = z.infer<typeof inntektsforholdSchema>
