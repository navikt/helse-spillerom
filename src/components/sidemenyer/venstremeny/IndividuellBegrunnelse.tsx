'use client'

import { ReactElement, useEffect, useState } from 'react'
import { ReadMore, Textarea } from '@navikt/ds-react'

import { Maybe } from '@utils/tsUtils'
import { Saksbehandlingsperiode } from '@schemas/saksbehandlingsperiode'

interface IndividuellBegrunnelseProps {
    aktivSaksbehandlingsperiode: Saksbehandlingsperiode
}

export function IndividuellBegrunnelse({
    aktivSaksbehandlingsperiode,
}: IndividuellBegrunnelseProps): Maybe<ReactElement> {
    const [begrunnelse, setBegrunnelse] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const storageValue = sessionStorage.getItem(`${aktivSaksbehandlingsperiode.id}-individuell-begrunnelse`)
        const value =
            aktivSaksbehandlingsperiode.individuellBegrunnelse ?? (storageValue ? JSON.parse(storageValue) : '')
        setBegrunnelse(value)
        setIsOpen(value !== '')
    }, [aktivSaksbehandlingsperiode])

    function handleChange(value: string) {
        setBegrunnelse(value)
        sessionStorage.setItem(`${aktivSaksbehandlingsperiode.id}-individuell-begrunnelse`, JSON.stringify(value))
    }

    return (
        <ReadMore
            header="Individuell begrunnelse"
            size="small"
            className="[&>div]:m-0 [&>div]:border-none [&>div]:p-0"
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <Textarea
                size="small"
                label=""
                description="Teksten vises til den sykmeldte i «Svar på søknad om sykepenger»."
                value={begrunnelse}
                onChange={(e) => handleChange(e.target.value)}
                minRows={6}
            />
        </ReadMore>
    )
}
