import { useBrukerinfo } from './useBrukerinfo'

type BrukerRoller = {
    leserolle: boolean
    saksbehandler: boolean
    beslutter: boolean
}

export function useBrukerRoller() {
    const { data: brukerinfo } = useBrukerinfo()

    const data: BrukerRoller = {
        leserolle: brukerinfo?.roller?.includes('LES') ?? false,
        saksbehandler: brukerinfo?.roller?.includes('SAKSBEHANDLER') ?? false,
        beslutter: brukerinfo?.roller?.includes('BESLUTTER') ?? false,
    }

    return {
        data,
    }
}
