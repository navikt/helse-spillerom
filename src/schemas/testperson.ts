import { z } from 'zod/v4'

export type TestpersonForFrontend = z.infer<typeof testpersonForFrontendSchema>
export const testpersonForFrontendSchema = z.object({
    navn: z.string(),
    alder: z.number(),
    spilleromId: z.string(),
    fnr: z.string(),
    erScenarie: z.boolean(),
})
