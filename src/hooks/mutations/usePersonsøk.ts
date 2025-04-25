import { useMutation } from '@tanstack/react-query'

import { PersonId, personIdSchema } from '@/schemas/personsøk'

interface MutationProps {
    request: {
        fødselsnummer: string
    }
    callback: (personId: PersonId) => void
}

export function usePersonsøk() {
    return useMutation<PersonId, Error, MutationProps>({
        mutationFn: async (r) => {
            const json = await (
                await fetch(`/api/bakrommet/v1/personsok`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(r.request),
                })
            ).json()

            return personIdSchema.parse(json)
        },
        onSuccess: async (personId, r) => r.callback(personId),
    })
}
