import React, { ReactElement, useState } from 'react'
import { Alert, Bleed, BodyLong, BodyShort, BoxNew, Button, Detail, HStack, Table, VStack } from '@navikt/ds-react'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'
import { PersonPencilIcon, XMarkIcon } from '@navikt/aksel-icons'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'
import { useSykepengegrunnlag } from '@hooks/queries/useSykepengegrunnlag'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'
import { SykepengegrunnlagSkeleton } from '@components/saksbilde/sykepengegrunnlag/SykepengegrunnlagSkeleton'
import { FetchError } from '@components/saksbilde/FetchError'
import { formaterBeløpKroner, formaterBeløpØre } from '@schemas/sykepengegrunnlag'
import { NavnOgIkon } from '@components/saksbilde/sykepengegrunnlag/Sykepengegrunnlag'
import { getFormattedDateString, getFormattedNorwegianLongDate } from '@utils/date-format'
import { cn } from '@utils/tw'
import { Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { NySykepengegrunnlagForm } from '@components/saksbilde/sykepengegrunnlag/form/ny/NySykepengegrunnlagForm'

export function NySykepengegrunnlag({ value }: { value: string }): ReactElement {
    const {
        data: yrkesaktiviteter,
        isLoading: yrkesaktivitetLoading,
        isError: yrkesaktivitetError,
        refetch: yrkesaktivitetRefetch,
    } = useYrkesaktivitet()
    const {
        data: sykepengegrunnlag,
        isLoading: sykepengegrunnlagLoading,
        isError: sykepengegrunnlagError,
        refetch,
    } = useSykepengegrunnlag()

    const [erIRedigeringsmodus, setErIRedigeringsmodus] = useState(false)
    const [selectedYrkesaktivitet, setSelectedYrkesaktivitet] = useState<Yrkesaktivitet | undefined>(undefined)

    const kanSaksbehandles = useKanSaksbehandles()

    if (sykepengegrunnlagLoading || yrkesaktivitetLoading || !yrkesaktiviteter) {
        return (
            <SaksbildePanel value={value}>
                <SykepengegrunnlagSkeleton />
            </SaksbildePanel>
        )
    }
    if (yrkesaktivitetError || sykepengegrunnlagError) {
        return (
            <SaksbildePanel value={value}>
                <FetchError
                    refetch={() => void Promise.all([refetch(), yrkesaktivitetRefetch()])}
                    message="Kunne ikke laste sykepengegrunnlag."
                />
            </SaksbildePanel>
        )
    }
    if (yrkesaktiviteter.length === 0) {
        return (
            <SaksbildePanel value={value}>
                <Alert variant="info">
                    <BodyShort>Du kan ikke sette sykepengegrunnlag før yrkesaktiviteter er satt.</BodyShort>
                </Alert>
            </SaksbildePanel>
        )
    }

    const aktivYrkesaktivitet =
        yrkesaktiviteter?.find((y) => y.id === selectedYrkesaktivitet?.id) ||
        selectedYrkesaktivitet ||
        yrkesaktiviteter?.[0]

    const aktivInntekt = sykepengegrunnlag?.inntekter.find(
        (inntekt) => inntekt.yrkesaktivitetId === selectedYrkesaktivitet?.id,
    )

    return (
        <SaksbildePanel value={value} className="mb-8 p-0">
            <HStack wrap={false}>
                {/*tabell*/}
                <VStack gap="4" className="w-[500px] pt-8">
                    <Table className="[&_td]:border-0 [&_th]:border-0">
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell />
                                <TableHeaderCell>
                                    <Detail textColor="subtle">Årsinntekt</Detail>
                                </TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="border-b-1 border-b-ax-bg-neutral-strong">
                            {yrkesaktiviteter.map((yrkesaktivitet) => {
                                return (
                                    <TableRow
                                        key={yrkesaktivitet.id}
                                        className={cn('relative cursor-pointer hover:bg-ax-bg-neutral-moderate-hover', {
                                            'bg-ax-bg-accent-soft after:absolute after:top-0 after:bottom-0 after:z-10 after:w-[3px] after:bg-ax-bg-accent-soft':
                                                aktivYrkesaktivitet?.id === yrkesaktivitet.id,
                                        })}
                                        onClick={() => {
                                            setSelectedYrkesaktivitet(yrkesaktivitet)
                                            setErIRedigeringsmodus(false)
                                        }}
                                    >
                                        <TableDataCell className="pl-8">
                                            <NavnOgIkon kategorisering={yrkesaktivitet.kategorisering} />
                                        </TableDataCell>
                                        <TableDataCell className="pr-16 text-right">
                                            {formaterBeløpKroner(yrkesaktivitet?.inntektData?.omregnetÅrsinntekt)}
                                        </TableDataCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                        <tfoot>
                            <TableRow>
                                <TableDataCell className="border-0 pl-8 font-semibold">Totalt</TableDataCell>
                                <TableDataCell className="border-0 pr-16 text-right font-semibold">
                                    {formaterBeløpØre(sykepengegrunnlag?.totalInntektØre)}
                                </TableDataCell>
                            </TableRow>
                        </tfoot>
                    </Table>
                    <VStack gap="6" className="mt-6 pr-16 pl-8">
                        <Bleed marginInline="4 12" asChild reflectivePadding>
                            <BoxNew background="neutral-soft" className="py-4" borderRadius="large" marginBlock="4 0">
                                <HStack justify="space-between">
                                    <BodyShort weight="semibold">Sykepengegrunnlag</BodyShort>
                                    <BodyShort>{formaterBeløpØre(sykepengegrunnlag?.sykepengegrunnlagØre)}</BodyShort>
                                </HStack>
                            </BoxNew>
                        </Bleed>
                        {sykepengegrunnlag && (
                            <BodyLong size="small" className="text-ax-text-neutral-subtle">
                                {sykepengegrunnlag.begrensetTil6G && (
                                    <>
                                        Sykepengegrunnlaget er begrenset til 6G:{' '}
                                        {formaterBeløpØre(sykepengegrunnlag.grunnbeløp6GØre, 0)} §8-10 <br />
                                    </>
                                )}
                                Grunnbeløp (G) ved skjæringstidspunkt:{' '}
                                {formaterBeløpØre(sykepengegrunnlag.grunnbeløpØre, 0)} (
                                {getFormattedNorwegianLongDate(sykepengegrunnlag.grunnbeløpVirkningstidspunkt)})
                            </BodyLong>
                        )}
                    </VStack>
                </VStack>

                {/*høyrepanel*/}
                {aktivYrkesaktivitet && (
                    <VStack
                        gap="4"
                        className="w-[710px] border-l-3 border-l-ax-bg-neutral-moderate bg-ax-bg-accent-soft px-8 py-4"
                    >
                        {kanSaksbehandles && (
                            <div className="-ml-[4px]">
                                <Button
                                    size="xsmall"
                                    type="button"
                                    variant="secondary"
                                    icon={
                                        erIRedigeringsmodus ? (
                                            <XMarkIcon aria-hidden />
                                        ) : (
                                            <PersonPencilIcon aria-hidden />
                                        )
                                    }
                                    onClick={() => setErIRedigeringsmodus(!erIRedigeringsmodus)}
                                >
                                    {erIRedigeringsmodus ? 'Avbryt' : 'Endre'}
                                </Button>
                            </div>
                        )}
                        <NavnOgIkon kategorisering={aktivYrkesaktivitet.kategorisering} medOrgnummer />
                        {!erIRedigeringsmodus && (
                            <>
                                <VStack gap="2">
                                    <BodyShort weight="semibold">Årsinntekt</BodyShort>
                                    <BodyShort>{formaterBeløpØre(aktivInntekt?.grunnlagMånedligØre)}</BodyShort>
                                </VStack>
                                <Table size="small" zebraStripes>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHeaderCell textSize="small">Fra og med dato</TableHeaderCell>
                                            <TableHeaderCell textSize="small">Til og med dato</TableHeaderCell>
                                            <TableHeaderCell textSize="small">Refusjonsbeløp</TableHeaderCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {aktivInntekt?.refusjon?.map((refusjon) => (
                                            <TableRow key={refusjon.fom}>
                                                <TableDataCell>{getFormattedDateString(refusjon.fom)}</TableDataCell>
                                                <TableDataCell>{getFormattedDateString(refusjon.tom)}</TableDataCell>
                                                <TableDataCell>{formaterBeløpØre(refusjon.beløpØre)}</TableDataCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <VStack gap="2">
                                    <BodyShort weight="semibold">Begrunnelse</BodyShort>
                                    <BodyLong>{sykepengegrunnlag?.begrunnelse}</BodyLong>
                                </VStack>
                            </>
                        )}
                        {erIRedigeringsmodus && (
                            <NySykepengegrunnlagForm
                                yrkesaktivitet={aktivYrkesaktivitet}
                                avbryt={() => setErIRedigeringsmodus(false)}
                            />
                        )}
                    </VStack>
                )}
            </HStack>
        </SaksbildePanel>
    )
}
