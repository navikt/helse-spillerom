import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { queryKeys } from '@utils/queryKeys'

const outboxEntrySchema = z.object({
    id: z.number(),
    kafkaKey: z.string(),
    payload: z.unknown(), // JsonNode kan være hva som helst
    opprettet: z.string(),
    publisert: z.string().nullable(),
    topic: z.string(),
})

export type OutboxEntry = z.infer<typeof outboxEntrySchema>

export function useKafkaOutbox() {
    return useQuery<OutboxEntry[], ProblemDetailsError>({
        staleTime: 10 * 1000,
        queryKey: queryKeys.kafkaOutbox(),
        queryFn: () => fetchAndParse(`/api/bakrommet/v1/demo/kafkaoutbox`, outboxEntrySchema.array()),
    })
}
