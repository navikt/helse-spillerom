'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { ReactElement } from 'react'
import { Button } from '@navikt/ds-react'
import { PlusIcon, XMarkIcon } from '@navikt/aksel-icons'

import { usePersonRouteParams } from '@hooks/useRouteParams'
import { useAktivBehandling } from '@hooks/queries/useAktivBehandling'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'

export function TilkommenInntektKnapp(): ReactElement {
    const kanSaksbehandles = useKanSaksbehandles()
    const aktivSaksbehandlingsperiode = useAktivBehandling()
    const router = useRouter()
    const { pseudoId } = usePersonRouteParams()
    const params = useParams() // Brukes kun for behandlingId som kan være undefined
    const pathname = usePathname()

    const isOnOpprettPage = pathname.includes('/tilkommen-inntekt/opprett')

    if (!kanSaksbehandles || !aktivSaksbehandlingsperiode) {
        return <></>
    }

    const handleClick = () => {
        if (isOnOpprettPage) {
            router.back()
            return
        }
        if (pseudoId && params.behandlingId) {
            router.push(`/person/${pseudoId}/${params.behandlingId}/tilkommen-inntekt/opprett`)
        }
    }

    return (
        <Button
            variant="tertiary"
            size="small"
            onClick={handleClick}
            className="absolute bottom-4 left-4.5"
            icon={isOnOpprettPage ? <XMarkIcon aria-hidden /> : <PlusIcon aria-hidden />}
        >
            {isOnOpprettPage ? 'Avbryt oppretting av tilkommen inntekt' : 'Legg til tilkommen inntekt'}
        </Button>
    )
}
