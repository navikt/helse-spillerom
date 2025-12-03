import { useBrukerinfo } from '@hooks/queries/useBrukerinfo'

export function useBrukerRoller() {
    const { data: brukerinfo } = useBrukerinfo()

    return {
        data: {
            leserolle: brukerinfo?.roller?.includes('LES') ?? false,
            saksbehandler: brukerinfo?.roller?.includes('SAKSBEHANDLER') ?? false,
            beslutter: brukerinfo?.roller?.includes('BESLUTTER') ?? false,
        },
    }
}
