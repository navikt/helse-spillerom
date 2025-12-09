import React, { Fragment, ReactElement } from 'react'
import { Bleed, BodyShort, BoxNew, HGrid, HStack, Table, VStack } from '@navikt/ds-react'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'

import { formaterBeløpKroner } from '@schemas/øreUtils'
import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'
import {
    arbeidstakerSkjønnsfastsettelseÅrsakLabels,
    refusjonFra,
} from '@components/saksbilde/sykepengegrunnlag/form/arbeidstaker/ArbeidstakerInntektFormFields'
import {
    ArbeidstakerInntektType,
    ArbeidstakerSkjønnsfastsettelseÅrsak,
    InntektRequest,
    RefusjonInfo,
} from '@schemas/inntektRequest'
import { InntektData } from '@schemas/inntektData'
import { Maybe, notNull } from '@utils/tsUtils'
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date-format'
import { InntektsmeldingKildeTag, InntektTag, SaksbehandlerKildeTag } from '@components/ikoner/kilde/kildeTags'
import { AinntektInntektDataView } from '@components/saksbilde/sykepengegrunnlag/form/ainntekt/AinntektInntektDataView'
import { Inntektsmelding } from '@schemas/inntektsmelding'
import { OpenDocumentInSidebarButton } from '@components/sidemenyer/høyremeny/dokumenter/OpenDocumentInSidebarButton'

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

    const { type, årsinntekt, årsak, refusjon, begrunnelse, inntektsmelding } = normalize(
        inntektRequestData,
        inntektData,
    )

    return (
        <>
            {notNull(årsinntekt) && (
                <VStack gap="1">
                    <BodyShort weight="semibold">Årsinntekt</BodyShort>
                    <HStack gap="2" align="center">
                        <BodyShort size="small">{formaterBeløpKroner(årsinntekt)}</BodyShort>
                        {InntektTag[type]}
                    </HStack>
                </VStack>
            )}

            {inntektData?.inntektstype === 'ARBEIDSTAKER_AINNTEKT' && (
                <AinntektInntektDataView inntektData={inntektData} />
            )}

            {inntektsmelding && (
                <VStack gap="1">
                    <HStack gap="3" align="start" wrap={false}>
                        <BodyShort weight="semibold">Inntektsmelding</BodyShort>
                        <OpenDocumentInSidebarButton dokument={inntektsmelding} />
                    </HStack>
                    <InntektsmeldingVisning inntektsmelding={inntektsmelding} />
                </VStack>
            )}

            {årsak && (
                <VStack gap="1">
                    <BodyShort weight="semibold">Årsak</BodyShort>
                    <HStack gap="3" align="start">
                        <BodyShort className="leading-[18px]">&bull;</BodyShort>
                        <BodyShort size="small">{arbeidstakerSkjønnsfastsettelseÅrsakLabels[årsak]}</BodyShort>
                    </HStack>
                </VStack>
            )}

            {refusjon && refusjon.length > 0 && (
                <>
                    <VStack gap="1">
                        <BodyShort weight="semibold">Refusjon</BodyShort>
                        <HStack gap="3" align="start" wrap={false}>
                            <BodyShort className="leading-[18px]">&bull;</BodyShort>
                            <BodyShort size="small">Ja</BodyShort>
                        </HStack>
                    </VStack>
                    <Bleed marginInline="2" asChild>
                        <BoxNew>
                            <Table title="Refusjon" size="small">
                                <TableHeader>
                                    <TableRow>
                                        <TableHeaderCell className="text-ax-medium">Fra og med dato</TableHeaderCell>
                                        <TableHeaderCell className="text-ax-medium">Til og med dato</TableHeaderCell>
                                        <TableHeaderCell className="max-w-14 text-ax-medium">
                                            Refusjonsbeløp
                                        </TableHeaderCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {refusjon.map((refusjon, i) => (
                                        <TableRow
                                            key={refusjon.fom}
                                            className="odd:bg-ax-bg-default even:bg-ax-bg-accent-soft"
                                        >
                                            <TableDataCell className="text-ax-medium">
                                                {getFormattedDateString(refusjon.fom)}
                                            </TableDataCell>
                                            <TableDataCell className="text-ax-medium">
                                                {getFormattedDateString(refusjon.tom) || '-'}
                                            </TableDataCell>
                                            <TableDataCell className="flex flex-row items-center justify-end gap-2 text-right text-ax-medium">
                                                {formaterBeløpKroner(refusjon.beløp)}
                                                {resolveKildeTag(refusjon, i, inntektsmelding)}
                                            </TableDataCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </BoxNew>
                    </Bleed>
                </>
            )}

            {begrunnelse && (
                <VStack gap="1">
                    <BodyShort weight="semibold">Begrunnelse</BodyShort>
                    <BodyShort size="small">{begrunnelse}</BodyShort>
                </VStack>
            )}
        </>
    )
}

function normalize(data: InntektRequest['data'], inntektData?: Maybe<InntektData>) {
    return {
        type: data.type as ArbeidstakerInntektType,
        inntektsmelding: inntektData && 'inntektsmelding' in inntektData ? inntektData.inntektsmelding : undefined,
        årsinntekt:
            data.type === 'INNTEKTSMELDING' || data.type === 'AINNTEKT'
                ? inntektData && 'omregnetÅrsinntekt' in inntektData
                    ? inntektData.omregnetÅrsinntekt
                    : undefined
                : 'årsinntekt' in data
                  ? data.årsinntekt
                  : undefined,
        årsak: 'årsak' in data ? (data.årsak as ArbeidstakerSkjønnsfastsettelseÅrsak) : undefined,
        refusjon: 'refusjon' in data ? data.refusjon : undefined,
        begrunnelse: 'begrunnelse' in data ? data.begrunnelse : undefined,
    }
}

function resolveKildeTag(refusjon: RefusjonInfo, index: number, inntektsmelding?: Inntektsmelding): ReactElement {
    if (!inntektsmelding) return <SaksbehandlerKildeTag />

    const refusjonFraInntektsmelding = refusjonFra(inntektsmelding)

    const periodeFraIM = refusjonFraInntektsmelding[index]

    const same =
        periodeFraIM &&
        refusjon.beløp === periodeFraIM.beløp &&
        refusjon.fom === periodeFraIM.fom &&
        refusjon.tom === periodeFraIM.tom

    return same ? <InntektsmeldingKildeTag /> : <SaksbehandlerKildeTag />
}

function InntektsmeldingVisning({ inntektsmelding }: { inntektsmelding: Inntektsmelding }): ReactElement {
    return (
        <HGrid columns={2} className="w-[380px]">
            <BodyShort size="small">Mottatt:</BodyShort>
            <BodyShort size="small">{getFormattedDatetimeString(inntektsmelding.mottattDato)}</BodyShort>

            <BodyShort size="small">Beregnet inntekt:</BodyShort>
            <BodyShort size="small">{formaterBeløpKroner(Number(inntektsmelding.beregnetInntekt))}</BodyShort>

            <BodyShort size="small">Første fraværsdag:</BodyShort>
            <BodyShort size="small">
                {inntektsmelding.foersteFravaersdag ? getFormattedDateString(inntektsmelding.foersteFravaersdag) : '-'}
            </BodyShort>

            {inntektsmelding.arbeidsgiverperioder.map((arbeidsgiverperiode, i) => (
                <Fragment key={i + arbeidsgiverperiode.fom}>
                    <BodyShort size="small">Arbeidsgiverperiode:</BodyShort>
                    <BodyShort size="small">
                        {getFormattedDateString(arbeidsgiverperiode.fom) +
                            ' - ' +
                            getFormattedDateString(arbeidsgiverperiode.tom)}
                    </BodyShort>
                </Fragment>
            ))}

            <BodyShort size="small">Organisasjonsnummer:</BodyShort>
            <BodyShort size="small">{inntektsmelding.virksomhetsnummer}</BodyShort>
        </HGrid>
    )
}
