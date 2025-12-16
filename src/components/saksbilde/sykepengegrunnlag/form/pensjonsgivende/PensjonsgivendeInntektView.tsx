import React, { ReactElement } from 'react'
import { BodyShort, HelpText, HStack, Label, Table } from '@navikt/ds-react'

import { InaktivPensjonsgivende, SelvstendigNæringsdrivendePensjonsgivende } from '@schemas/inntektData'
import { formaterBeløpKroner } from '@schemas/pengerUtils'

type PensjonsgivendeInntektViewProps = {
    inntektData: InaktivPensjonsgivende | SelvstendigNæringsdrivendePensjonsgivende
}

export function PensjonsgivendeInntektView({ inntektData }: PensjonsgivendeInntektViewProps): ReactElement {
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
                                                Snitt G-verdi {inntekt.år}: {formaterBeløpKroner(inntekt.snittG)}
                                            </BodyShort>
                                            <BodyShort className="text-gray-600 text-xs">
                                                Snitt G-verdi i året, justert for endringer i mai
                                            </BodyShort>
                                        </div>
                                        <div>
                                            <BodyShort className="text-xs font-semibold">
                                                Antall G kompensert: {inntekt.antallGKompensert.toFixed(2)}
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
                                            <BodyShort className="text-gray-600 text-xs">
                                                (Eksempel: 8G rå inntekt → 6G + (2G × 1/3) = 6,67G kompensert)
                                            </BodyShort>
                                        </div>
                                        <div>
                                            <BodyShort className="text-xs font-semibold">
                                                Justert årsgrunnlag:
                                            </BodyShort>
                                            <BodyShort className="text-gray-600 text-xs">
                                                Regnes ut som antall G kompensert × G-verdi på skjæringstidspunktet
                                            </BodyShort>
                                            <BodyShort className="text-gray-600 text-xs">
                                                {inntekt.antallGKompensert.toFixed(2)} ×{' '}
                                                {formaterBeløpKroner(
                                                    inntektData.pensjonsgivendeInntekt.anvendtGrunnbeløp,
                                                )}{' '}
                                                = {formaterBeløpKroner(inntekt.justertÅrsgrunnlag)}
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
        </>
    )
}
