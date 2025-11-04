import { z } from 'zod/v4'

import { testpersonForFrontendSchema } from '@/schemas/testperson'

export type Testscenario = z.infer<typeof testscenarioSchema>
export const testscenarioSchema = z.object({
    testperson: testpersonForFrontendSchema,
    beskrivelse: z.string(),
    tittel: z.string(),
})
