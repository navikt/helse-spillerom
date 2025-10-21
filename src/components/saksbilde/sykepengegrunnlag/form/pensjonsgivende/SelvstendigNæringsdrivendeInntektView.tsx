import React, { ReactElement } from 'react'
import { BodyShort, HelpText, HStack, Label, Table, Tag, VStack } from '@navikt/ds-react'

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
                            <Table.HeaderCell className="text-sm">Justert årsgrunnlag</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {inntektData.pensjonsgivendeInntekt.pensjonsgivendeInntekt.map((inntekt) => (
                            <Table.Row key={inntekt.år}>
                                <Table.DataCell className="text-sm">{inntekt.år}</Table.DataCell>
                                <Table.DataCell className="text-sm">
                                    {formaterBeløpKroner(inntekt.rapportertinntekt)}
                                </Table.DataCell>
                                <Table.DataCell className="flex flex-row items-center gap-2 text-sm">
                                    {formaterBeløpKroner(inntekt.justertÅrsgrunnlag)}
                                    <HelpText placement="bottom">
                                        <div className="space-y-2">
                                            <div>
                                                <BodyShort className="text-xs font-semibold">
                                                    Kompensert antall G: {inntekt.antallG.toFixed(2)}
                                                </BodyShort>
                                                <BodyShort className="text-gray-600 text-xs">
                                                    Rå inntekt: {formaterBeløpKroner(inntekt.rapportertinntekt)} ÷{' '}
                                                    {formaterBeløpKroner(inntekt.snittG)} = {inntekt.antallG.toFixed(2)}{' '}
                                                    G
                                                </BodyShort>
                                                <BodyShort className="text-gray-600 text-xs">
                                                    (Eksempel: 8G rå inntekt → 6G + (2G × 1/3) = 6,67G kompensert)
                                                </BodyShort>
                                            </div>
                                            <div>
                                                <BodyShort className="text-xs font-semibold">
                                                    G-verdi for {inntekt.år}: {formaterBeløpKroner(inntekt.snittG)}
                                                </BodyShort>
                                                <BodyShort className="text-gray-600 text-xs">
                                                    Snitt G-verdi over året (justert for endringer i mai)
                                                </BodyShort>
                                            </div>
                                            <div>
                                                <BodyShort className="text-xs font-semibold">
                                                    6G/12G begrensning:
                                                </BodyShort>
                                                <BodyShort className="text-gray-600 text-xs">
                                                    • Inntekter opp til 6G: 100% kompensert
                                                </BodyShort>
                                                <BodyShort className="text-gray-600 text-xs">
                                                    • Inntekter 6G-12G: 1/3 kompensert
                                                </BodyShort>
                                                <BodyShort className="text-gray-600 text-xs">
                                                    • Inntekter over 12G: ikke kompensert
                                                </BodyShort>
                                            </div>
                                        </div>
                                    </HelpText>
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
