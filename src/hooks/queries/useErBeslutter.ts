import { useBrukerRoller } from '@hooks/queries/useBrukerRoller'

export function useErBeslutter() {
    const { data: brukerRoller } = useBrukerRoller()
    return brukerRoller.beslutter
}
