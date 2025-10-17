import React, { ReactElement, useState } from 'react'
import { Alert, Bleed, BodyLong, BodyShort, BoxNew, Button, Detail, HStack, Table, VStack } from '@navikt/ds-react'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'
import { PersonPencilIcon, XMarkIcon } from '@navikt/aksel-icons'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'
import { SykepengegrunnlagSkeleton } from '@components/saksbilde/sykepengegrunnlag/SykepengegrunnlagSkeleton'
import { FetchError } from '@components/saksbilde/FetchError'
import { getFormattedNorwegianLongDate } from '@utils/date-format'
import { cn } from '@utils/tw'
import { Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { NySykepengegrunnlagForm } from '@components/saksbilde/sykepengegrunnlag/form/ny/NySykepengegrunnlagForm'
import { useSykepengegrunnlagV2 } from '@hooks/queries/useSykepengegrunnlagV2'
import {formaterBeløpKroner} from "@/mock-api/utils/formaterBeløp";
import {NavnOgIkon} from "@components/saksbilde/sykepengegrunnlag/NavnOgIkon";

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
    } = useSykepengegrunnlagV2()

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
                                // Er næringsdrivende og er kombinert. Altså denne er næringsdelen og det finnes andre yrkesaktiviteter
                                const erNæringsdrivendeOgKombinert =
                                    yrkesaktivitet.kategorisering?.['INNTEKTSKATEGORI'] ===
                                        'SELVSTENDIG_NÆRINGSDRIVENDE' && yrkesaktiviteter.length > 1

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
                                            {(() => {
                                                // For selvstendig næringsdrivende, vis næringsdel hvis den finnes
                                                if (erNæringsdrivendeOgKombinert) {
                                                    return formaterBeløpKroner(
                                                        sykepengegrunnlag?.næringsdel?.næringsdel,
                                                    )
                                                }
                                                // Ellers vis omregnet årsinntekt som vanlig
                                                return formaterBeløpKroner(
                                                    yrkesaktivitet?.inntektData?.omregnetÅrsinntekt,
                                                )
                                            })()}
                                        </TableDataCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                        <tfoot>
                            <TableRow>
                                <TableDataCell className="border-0 pl-8 font-semibold">Totalt</TableDataCell>
                                <TableDataCell className="border-0 pr-16 text-right font-semibold">
                                    {formaterBeløpKroner(sykepengegrunnlag?.totaltInntektsgrunnlag)}
                                </TableDataCell>
                            </TableRow>
                        </tfoot>
                    </Table>
                    <VStack gap="6" className="mt-6 pr-16 pl-8">
                        <Bleed marginInline="4 12" asChild reflectivePadding>
                            <BoxNew background="neutral-soft" className="py-4" borderRadius="large" marginBlock="4 0">
                                <HStack justify="space-between">
                                    <BodyShort weight="semibold">Sykepengegrunnlag</BodyShort>
                                    <BodyShort>{formaterBeløpKroner(sykepengegrunnlag?.sykepengegrunnlag)}</BodyShort>
                                </HStack>
                            </BoxNew>
                        </Bleed>
                        {sykepengegrunnlag && (
                            <BodyLong size="small" className="text-ax-text-neutral-subtle">
                                {sykepengegrunnlag.begrensetTil6G && (
                                    <>
                                        Sykepengegrunnlaget er begrenset til 6G:{' '}
                                        {formaterBeløpKroner(sykepengegrunnlag.seksG, 0)} §8-10 <br />
                                    </>
                                )}
                                Grunnbeløp (G) ved skjæringstidspunkt:{' '}
                                {formaterBeløpKroner(sykepengegrunnlag.grunnbeløp, 0)} (
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
                            <VStack gap="2">
                                <BodyShort>Data fra inntektdata og inntektrequest</BodyShort>
                                {aktivYrkesaktivitet.inntektRequest && (
                                    <pre className="text-sm">
                                        {JSON.stringify(aktivYrkesaktivitet.inntektRequest, null, 2)}
                                    </pre>
                                )}
                                {aktivYrkesaktivitet.inntektData && (
                                    <pre className="text-sm">
                                        {JSON.stringify(aktivYrkesaktivitet.inntektData, null, 2)}
                                    </pre>
                                )}

                                {sykepengegrunnlag?.næringsdel && (
                                    <pre className="text-sm">
                                        {JSON.stringify(sykepengegrunnlag.næringsdel, null, 2)}
                                    </pre>
                                )}
                            </VStack>
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
