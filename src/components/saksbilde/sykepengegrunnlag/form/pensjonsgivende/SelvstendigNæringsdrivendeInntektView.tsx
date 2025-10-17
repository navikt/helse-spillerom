import React, { ReactElement } from 'react'
import { BodyShort, HStack, Label, Table, Tag, VStack } from '@navikt/ds-react'

import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'
import { Maybe } from '@utils/tsUtils'
import { InntektData } from '@schemas/inntektData'
import { SykepengegrunnlagV2 } from '@schemas/sykepengegrunnlagV2'
import { formaterBeløpKroner } from '@schemas/sykepengegrunnlag'
import { pensjonsgivendeSkjønnsfastsettelseÅrsakLabels } from '@components/saksbilde/sykepengegrunnlag/form/pensjonsgivende/PensjonsgivendeInntektFormFields'

type SelvstendigNæringsdrivendeInntektViewProps = {
    inntektRequest?: InntektRequestFor<'SELVSTENDIG_NÆRINGSDRIVENDE'>
    inntektData?: Maybe<InntektData>
    sykepengegrunnlag?: Maybe<SykepengegrunnlagV2>
}

export function SelvstendigNæringsdrivendeInntektView({
    inntektRequest,
    inntektData,
    sykepengegrunnlag,
}: SelvstendigNæringsdrivendeInntektViewProps): ReactElement {
    const inntektRequestData = inntektRequest?.data

    if (!inntektRequestData) {
        return (
            <VStack gap="2" className="w-fit">
                <BodyShort weight="semibold">Årsinntekt</BodyShort>
                <BodyShort className="text-right">-</BodyShort>
            </VStack>
        )
    }

    if (inntektData?.inntektstype === 'SELVSTENDIG_NÆRINGSDRIVENDE_PENSJONSGIVENDE') {
        // kast inntektRequestData til pensjonsgivende inntekt for å få tilgang til årsinntekter
        // tittel med bold fra tailwind
        return (
            <>
                <BodyShort className="font-semibold">Data fra skatteetaten (sigrun)</BodyShort>

                <Table size="small" className="text-sm">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell className="text-sm">År</Table.HeaderCell>
                            <Table.HeaderCell className="text-sm">Rapportert inntekt</Table.HeaderCell>
                            <Table.HeaderCell className="text-sm">G justert inntekt</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {inntektData.pensjonsgivendeInntekt.inntektAar.map((inntekt) => (
                            <Table.Row key={inntekt.aar}>
                                <Table.DataCell className="text-sm">{inntekt.aar}</Table.DataCell>
                                <Table.DataCell className="text-sm">
                                    {formaterBeløpKroner(inntekt.rapportertinntekt)}
                                </Table.DataCell>
                                <Table.DataCell className="text-sm">
                                    {formaterBeløpKroner(inntekt.inntektGrunnbelopsbegrenset)}
                                </Table.DataCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

                <HStack gap="4">
                    <Label className="text-sm">Snitt av G justerte inntekter:</Label>
                    <BodyShort className="text-sm">{formaterBeløpKroner(inntektData.omregnetÅrsinntekt)}</BodyShort>
                </HStack>

                {sykepengegrunnlag?.næringsdel && (
                    <>
                        <BodyShort className="font-semibold">Beregning av kombinert næringsdel</BodyShort>
                        <HStack gap="4">
                            <Label className="text-sm">Pensjonsgivende inntekt 6G begrenset:</Label>
                            <BodyShort className="text-sm">
                                {formaterBeløpKroner(sykepengegrunnlag.næringsdel.pensjonsgivendeÅrsinntekt6GBegrenset)}
                            </BodyShort>
                        </HStack>
                        <HStack gap="4">
                            <Label className="text-sm">Sum av arbeids og frilans inntekter</Label>
                            <BodyShort className="text-sm">
                                -{formaterBeløpKroner(sykepengegrunnlag.næringsdel.sumAvArbeidsinntekt)}
                            </BodyShort>
                        </HStack>
                        <HStack gap="4">
                            <Label className="text-sm">Næringsdel</Label>
                            <BodyShort className="text-sm">
                                ={formaterBeløpKroner(sykepengegrunnlag.næringsdel.næringsdel)}
                            </BodyShort>
                        </HStack>
                    </>
                )}
            </>
        )
    }
    if (inntektRequestData.type === 'SKJONNSFASTSETTELSE') {
        const { årsinntekt, årsak, begrunnelse } = inntektRequestData

        return (
            <>
                {årsinntekt && (
                    <VStack gap="1">
                        <BodyShort weight="semibold">Årsinntekt</BodyShort>
                        <HStack gap="2">
                            <BodyShort className="w-[103px] text-right">{formaterBeløpKroner(årsinntekt)}</BodyShort>
                            <Tag variant="neutral" size="xsmall">
                                skjønnsfastsatt
                            </Tag>
                        </HStack>
                    </VStack>
                )}

                {årsak && (
                    <VStack gap="1">
                        <BodyShort weight="semibold">Årsak</BodyShort>
                        <BodyShort>{pensjonsgivendeSkjønnsfastsettelseÅrsakLabels[årsak]}</BodyShort>
                    </VStack>
                )}

                {begrunnelse && (
                    <VStack gap="1">
                        <BodyShort weight="semibold">Begrunnelse</BodyShort>
                        <BodyShort>{begrunnelse}</BodyShort>
                    </VStack>
                )}
            </>
        )
    }
    return <></>
}
