import { useMutation } from '@tanstack/react-query'

import { PersonId, personIdSchema } from '@/schemas/personsøk'
import { postAndParse } from '@utils/fetch'

interface MutationProps {
    request: {
        fødselsnummer: string
    }
    callback: (personId: PersonId) => void
}

export function usePersonsøk() {
    return useMutation<PersonId, Error, MutationProps>({
        mutationFn: async (r) => postAndParse('/api/bakrommet/v1/personsok', personIdSchema, r.request),
        onSuccess: (personId, r) => r.callback(personId),
    })
}
