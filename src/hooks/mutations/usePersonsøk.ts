import { useMutation } from '@tanstack/react-query'

import { PersonId, personIdSchema } from '@/schemas/personsøk'
import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'

interface MutationProps {
    request: {
        ident: string
    }
    callback: (pseudoId: PersonId) => void
}

export function usePersonsøk() {
    return useMutation<PersonId, ProblemDetailsError, MutationProps>({
        mutationFn: async (r) => postAndParse('/api/bakrommet/v1/personsok', personIdSchema, r.request),
        onSuccess: (personId, r) => r.callback(personId),
    })
}
