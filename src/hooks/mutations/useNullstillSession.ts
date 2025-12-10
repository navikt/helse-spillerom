import { useMutation } from '@tanstack/react-query'

import { postNoContent } from '@utils/fetch'

export function useNullstillSession() {
    return useMutation<void, Error, void>({
        mutationFn: async () => {
            return postNoContent('/api/bakrommet/v1/demo/session/nullstill')
        },
        onSuccess: () => {
            const pathname = window.location.pathname
            // Sjekk om vi er på en personside (f.eks. /person/[pseudoId] eller /person/[pseudoId]/...)
            const personMatch = pathname.match(/^\/person\/([^/]+)/)
            if (personMatch) {
                // Naviger tilbake til personens startsted (ut av behandlingen)
                const pseudoId = personMatch[1]
                window.location.href = `/person/${pseudoId}`
            } else {
                // Hvis vi ikke er på en personside, bare refresh
                window.location.reload()
            }
        },
    })
}
