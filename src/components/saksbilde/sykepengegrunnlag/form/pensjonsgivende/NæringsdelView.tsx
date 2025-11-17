import React, { ReactElement } from 'react'
import { BodyShort, HStack, Label } from '@navikt/ds-react'

import { Næringsdel } from '@schemas/sykepengegrunnlag'
import { formaterBeløpKroner } from '@schemas/øreUtils'

type NæringsdelViewProps = {
    næringsdel?: Næringsdel | null
}

export function NæringsdelView({ næringsdel }: NæringsdelViewProps): ReactElement {
    if (!næringsdel) {
        return <></>
    }
    return (
        <>
            <BodyShort className="font-semibold">Beregning av kombinert næringsdel</BodyShort>
            <HStack gap="4">
                <Label className="text-sm">Pensjonsgivende inntekt 6G begrenset:</Label>
                <BodyShort className="text-sm">
                    {formaterBeløpKroner(næringsdel.pensjonsgivendeÅrsinntekt6GBegrenset)}
                </BodyShort>
            </HStack>
            <HStack gap="4">
                <Label className="text-sm">Sum av arbeids og frilans inntekter</Label>
                <BodyShort className="text-sm">-{formaterBeløpKroner(næringsdel.sumAvArbeidsinntekt)}</BodyShort>
            </HStack>
            <HStack gap="4">
                <Label className="text-sm">Næringsdel</Label>
                <BodyShort className="text-sm">={formaterBeløpKroner(næringsdel.næringsdel)}</BodyShort>
            </HStack>
        </>
    )
}
