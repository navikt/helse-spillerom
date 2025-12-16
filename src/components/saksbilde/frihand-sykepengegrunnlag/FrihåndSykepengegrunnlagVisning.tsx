import React, { ReactElement } from 'react'
import { Bleed, BodyLong, BodyShort, BoxNew, HStack, VStack } from '@navikt/ds-react'

import { FrihåndSykepengegrunnlag } from '@schemas/sykepengegrunnlag'
import { formaterBeløpKroner } from '@schemas/pengerUtils'
import { getFormattedNorwegianLongDate } from '@utils/date-format'
import { useBeregningsregler } from '@hooks/queries/useBeregningsregler'

interface FrihåndSykepengegrunnlagVisningProps {
    sykepengegrunnlag: FrihåndSykepengegrunnlag
}

export function FrihåndSykepengegrunnlagVisning({
    sykepengegrunnlag,
}: FrihåndSykepengegrunnlagVisningProps): ReactElement {
    const { data: beregningsregler } = useBeregningsregler()

    // Finn beskrivelser for beregningskodene
    const beregningskoderMedBeskrivelse = sykepengegrunnlag.beregningskoder.map((kode) => {
        const regel = beregningsregler?.find((r) => r.kode === kode)
        return {
            kode,
            beskrivelse: regel?.beskrivelse || kode,
        }
    })

    return (
        <VStack gap="6" className="p-8">
            <VStack gap="4">
                <Bleed marginInline="4 12" asChild reflectivePadding>
                    <BoxNew background="neutral-soft" className="py-4" borderRadius="large" marginBlock="4 0">
                        <HStack justify="space-between">
                            <BodyShort weight="semibold">Beregningsgrunnlag</BodyShort>
                            <BodyShort>{formaterBeløpKroner(sykepengegrunnlag.beregningsgrunnlag)}</BodyShort>
                        </HStack>
                    </BoxNew>
                </Bleed>
                <Bleed marginInline="4 12" asChild reflectivePadding>
                    <BoxNew background="neutral-soft" className="py-4" borderRadius="large" marginBlock="4 0">
                        <HStack justify="space-between">
                            <BodyShort weight="semibold">Sykepengegrunnlag</BodyShort>
                            <BodyShort>{formaterBeløpKroner(sykepengegrunnlag.sykepengegrunnlag)}</BodyShort>
                        </HStack>
                    </BoxNew>
                </Bleed>
            </VStack>

            <VStack gap="4">
                <VStack gap="2">
                    <BodyShort weight="semibold">Begrunnelse</BodyShort>
                    <BodyLong size="small" className="text-ax-text-neutral-subtle">
                        {sykepengegrunnlag.begrunnelse}
                    </BodyLong>
                </VStack>

                {beregningskoderMedBeskrivelse.length > 0 && (
                    <VStack gap="2">
                        <BodyShort weight="semibold">Beregningskoder</BodyShort>
                        <VStack gap="1">
                            {beregningskoderMedBeskrivelse.map(({ kode, beskrivelse }) => (
                                <BodyLong key={kode} size="small" className="text-ax-text-neutral-subtle">
                                    <span className="font-mono font-medium">{kode}</span> - {beskrivelse}
                                </BodyLong>
                            ))}
                        </VStack>
                    </VStack>
                )}
            </VStack>

            <BodyLong size="small" className="text-ax-text-neutral-subtle">
                {sykepengegrunnlag.begrensetTil6G && (
                    <>
                        Sykepengegrunnlaget er begrenset til 6G: {formaterBeløpKroner(sykepengegrunnlag.seksG, 0)} §8-10{' '}
                        <br />
                    </>
                )}
                Grunnbeløp (G) ved skjæringstidspunkt: {formaterBeløpKroner(sykepengegrunnlag.grunnbeløp, 0)} (
                {getFormattedNorwegianLongDate(sykepengegrunnlag.grunnbeløpVirkningstidspunkt)})
            </BodyLong>
        </VStack>
    )
}
