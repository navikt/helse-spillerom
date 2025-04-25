import { logger } from '@navikt/next-logger'
import { getToken, validateAzureToken } from '@navikt/oasis'
import { AzurePayload } from '@navikt/oasis/dist/validate'
import { NextResponse } from 'next/server'

import { erLokalEllerDemo } from '@/env'

export interface ErrorResponse {
    message: string
}

export async function beskyttetApi<T>(
    req: Request,
    handler: (payload: Partial<AzurePayload>) => NextResponse<T>,
): Promise<NextResponse<ErrorResponse | T>> {
    if (erLokalEllerDemo) {
        return handler({ NAVident: 'D123456' })
    }

    const bearerToken = getToken(req)
    if (!bearerToken) {
        return send401()
    }
    const result = await validateAzureToken(bearerToken)
    if (!result.ok) {
        logger.warn('kunne ikke validere azuretoken i beskyttetApi')
        return send401()
    }

    return handler(result.payload)

    function send401(): NextResponse<ErrorResponse> {
        return NextResponse.json({ message: 'Access denied' }, { status: 401 })
    }
}
