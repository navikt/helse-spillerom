import { useQuery } from '@tanstack/react-query'

import { Testscenario, testscenarioSchema } from '@/schemas/testscenario'
import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'

export function useScenarioer() {
    return useQuery<Testscenario[], ProblemDetailsError>({
        queryKey: ['scenarioer'],
        queryFn: () => fetchAndParse(`/api/bakrommet/v1/demo/scenarioer`, testscenarioSchema.array()),
    })
}
