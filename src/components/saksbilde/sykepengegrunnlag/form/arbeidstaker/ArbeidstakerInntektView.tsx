import React, { ReactElement } from 'react'
import { Bleed, BodyShort, BoxNew, HStack, Table, VStack } from '@navikt/ds-react'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'

import { formaterBeløpKroner } from '@schemas/sykepengegrunnlag'
import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'
import { arbeidstakerSkjønnsfastsettelseÅrsakLabels } from '@components/saksbilde/sykepengegrunnlag/form/arbeidstaker/ArbeidstakerInntektFormFields'
import { ArbeidstakerInntektType, ArbeidstakerSkjønnsfastsettelseÅrsak, InntektRequest } from '@schemas/inntektRequest'
import { InntektData } from '@schemas/inntektData'
import { Maybe, notNull } from '@utils/tsUtils'
import { getFormattedDateString } from '@utils/date-format'
import { TagFor } from '@components/saksbilde/sykepengegrunnlag/form/TagFor'
import { AinntektInntektDataView } from '@components/saksbilde/sykepengegrunnlag/form/ainntekt/AinntektInntektDataView'

type ArbeidstakerInntektViewProps = {
    inntektRequest?: InntektRequestFor<'ARBEIDSTAKER'>
    inntektData?: Maybe<InntektData>
}

export function ArbeidstakerInntektView({ inntektRequest, inntektData }: ArbeidstakerInntektViewProps): ReactElement {
    const inntektRequestData = inntektRequest?.data

    if (!inntektRequestData) {
        return (
            <VStack gap="2" className="w-fit">
                <BodyShort weight="semibold">Årsinntekt</BodyShort>
                <BodyShort className="text-right">-</BodyShort>
            </VStack>
        )
    }

    if (inntektData?.inntektstype === 'ARBEIDSTAKER_AINNTEKT') {
        return <AinntektInntektDataView inntektData={inntektData} />
    }

    if (inntektRequestData.type === 'INNTEKTSMELDING') {
        return (
            <>
                <BodyShort>Data fra inntektdata og inntektrequest</BodyShort>
                <pre className="text-sm">{JSON.stringify(inntektRequestData, null, 2)}</pre>
                {inntektData && <pre className="text-sm">{JSON.stringify(inntektData, null, 2)}</pre>}
            </>
        )
    }

    const { type, årsinntekt, årsak, refusjon, begrunnelse } = normalize(inntektRequestData)

    return (
        <>
            {notNull(årsinntekt) && (
                <VStack gap="1">
                    <BodyShort weight="semibold">Årsinntekt</BodyShort>
                    <HStack gap="2">
                        <BodyShort className="w-[103px] text-right">{formaterBeløpKroner(årsinntekt)}</BodyShort>
                        {TagFor[type]}
                    </HStack>
                </VStack>
            )}

            {refusjon && refusjon.length > 0 && (
                <Bleed marginInline="2" asChild>
                    <BoxNew>
                        <Table zebraStripes title="Refusjon" size="small">
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>Fra og med dato</TableHeaderCell>
                                    <TableHeaderCell>Til og med dato</TableHeaderCell>
                                    <TableHeaderCell>Refusjonsbeløp</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {refusjon.map((refusjon) => (
                                    <TableRow key={refusjon.fom}>
                                        <TableDataCell>{getFormattedDateString(refusjon.fom)}</TableDataCell>
                                        <TableDataCell>{getFormattedDateString(refusjon.tom) || '-'}</TableDataCell>
                                        <TableDataCell>{formaterBeløpKroner(refusjon.beløp)}</TableDataCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </BoxNew>
                </Bleed>
            )}

            {årsak && (
                <VStack gap="1">
                    <BodyShort weight="semibold">Årsak</BodyShort>
                    <BodyShort>{arbeidstakerSkjønnsfastsettelseÅrsakLabels[årsak]}</BodyShort>
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

function normalize(data: InntektRequest['data']) {
    return {
        type: data.type as ArbeidstakerInntektType,
        inntektsmeldingId: 'inntektsmeldingId' in data ? data.inntektsmeldingId : undefined,
        årsinntekt: 'årsinntekt' in data ? data.årsinntekt : undefined,
        årsak: 'årsak' in data ? (data.årsak as ArbeidstakerSkjønnsfastsettelseÅrsak) : undefined,
        refusjon: 'refusjon' in data ? data.refusjon : undefined,
        begrunnelse: 'begrunnelse' in data ? data.begrunnelse : undefined,
    }
}
