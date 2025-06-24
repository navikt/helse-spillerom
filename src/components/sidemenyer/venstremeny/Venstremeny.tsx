'use client'

import { ReactElement } from 'react'
import { useParams } from 'next/navigation'
import { Button, VStack, BodyShort, HStack } from '@navikt/ds-react'
import { CalendarIcon, PencilIcon } from '@navikt/aksel-icons'

import { Sidemeny } from '@components/sidemenyer/Sidemeny'
import { useSaksbehandlingsperioder } from '@hooks/queries/useSaksbehandlingsperioder'
import { getFormattedDateString } from '@utils/date-format'

import { KategoriTag } from './KategoriTag'

export function Venstremeny(): ReactElement {
    const params = useParams()
    const { data: saksbehandlingsperioder } = useSaksbehandlingsperioder()

    // Finn aktiv saksbehandlingsperiode hvis vi er inne i en
    const aktivSaksbehandlingsperiode = saksbehandlingsperioder?.find(
        (periode) => periode.id === params.saksbehandlingsperiodeId,
    )

    return (
        <Sidemeny side="left">
            <VStack gap="4">
                <KategoriTag />

                {aktivSaksbehandlingsperiode && (
                    <>
                        <HStack gap="2" align="center">
                            <CalendarIcon aria-hidden fontSize="1.25rem" />
                            <BodyShort size="small">
                                {getFormattedDateString(aktivSaksbehandlingsperiode.fom)} -{' '}
                                {getFormattedDateString(aktivSaksbehandlingsperiode.tom)}
                            </BodyShort>
                        </HStack>

                        <Button
                            variant="tertiary"
                            size="small"
                            icon={<PencilIcon aria-hidden fontSize="1.25rem" />}
                            className="w-fit"
                            onClick={() => {
                                // TODO: Implementer individuell begrunnelse funksjonalitet
                            }}
                        >
                            Skriv individuell begrunnelse
                        </Button>

                        <Button
                            variant="primary"
                            size="small"
                            className="w-fit"
                            onClick={() => {
                                // TODO: Implementer send til godkjenning funksjonalitet
                            }}
                        >
                            Send til godkjenning
                        </Button>
                    </>
                )}
            </VStack>
        </Sidemeny>
    )
}
