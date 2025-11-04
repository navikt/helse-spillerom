import { useQuery } from '@tanstack/react-query'

import { TestpersonForFrontend, testpersonForFrontendSchema } from '@/schemas/testperson'
import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'

export function useTestpersoner() {
    return useQuery<TestpersonForFrontend[], ProblemDetailsError>({
        queryKey: ['testpersoner'],
        queryFn: () => fetchAndParse(`/api/bakrommet/v1/demo/testpersoner`, testpersonForFrontendSchema.array()),
    })
}
