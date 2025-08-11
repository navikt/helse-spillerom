import { useMemo } from 'react'

import { useBrukerinfo } from '@hooks/queries/useBrukerinfo'

type BrukerRoller = {
    leserolle: boolean
    saksbehandler: boolean
    beslutter: boolean
}

export function useBrukerRoller() {
    const { data: brukerinfo } = useBrukerinfo()

    const data: BrukerRoller = useMemo(
        () => ({
            leserolle: brukerinfo?.roller?.includes('LES') ?? false,
            saksbehandler: brukerinfo?.roller?.includes('SAKSBEHANDLER') ?? false,
            beslutter: brukerinfo?.roller?.includes('BESLUTTER') ?? false,
        }),
        [brukerinfo?.roller],
    )

    return {
        data,
    }
}
