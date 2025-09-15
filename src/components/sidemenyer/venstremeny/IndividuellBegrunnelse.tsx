'use client'

import { ReactElement, useState, useEffect } from 'react'
import { Button, VStack, ReadMore, Textarea } from '@navikt/ds-react'

import { useAktivSaksbehandlingsperiode } from '@hooks/queries/useAktivSaksbehandlingsperiode'
import { useOppdaterBegrunnelse } from '@hooks/mutations/useOppdaterBegrunnelse'
import { useToast } from '@components/ToastProvider'

export function IndividuellBegrunnelse(): ReactElement {
    const { visToast } = useToast()
    const aktivSaksbehandlingsperiode = useAktivSaksbehandlingsperiode()
    const [begrunnelse, setBegrunnelse] = useState(aktivSaksbehandlingsperiode?.individuellBegrunnelse || '')

    // Oppdater begrunnelse state når aktivSaksbehandlingsperiode endres
    useEffect(() => {
        setBegrunnelse(aktivSaksbehandlingsperiode?.individuellBegrunnelse || '')
    }, [aktivSaksbehandlingsperiode?.individuellBegrunnelse])

    const oppdaterBegrunnelse = useOppdaterBegrunnelse({
        onSuccess: () => {
            visToast('Begrunnelse er oppdatert', 'success')
        },
    })

    const håndterLagreBegrunnelse = () => {
        if (aktivSaksbehandlingsperiode) {
            const begrunnelseVerdi = begrunnelse.trim() === '' ? undefined : begrunnelse.trim()
            oppdaterBegrunnelse.mutate({
                saksbehandlingsperiodeId: aktivSaksbehandlingsperiode.id,
                individuellBegrunnelse: begrunnelseVerdi,
            })
        }
    }

    return (
        <ReadMore header="Individuell begrunnelse" size="small">
            <VStack gap="3">
                <Textarea
                    label="Begrunnelse"
                    value={begrunnelse}
                    onChange={(e) => setBegrunnelse(e.target.value)}
                    rows={4}
                    maxLength={1000}
                    description={`${begrunnelse.length}/1000 tegn`}
                />
                <Button
                    variant="primary"
                    size="small"
                    onClick={håndterLagreBegrunnelse}
                    loading={oppdaterBegrunnelse.isPending}
                    className="w-fit"
                >
                    Lagre begrunnelse
                </Button>
            </VStack>
        </ReadMore>
    )
}
