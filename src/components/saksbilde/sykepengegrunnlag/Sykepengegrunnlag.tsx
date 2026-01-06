import React, { ReactElement, useState } from 'react'
import {
    Alert,
    Bleed,
    BodyLong,
    BodyShort,
    BoxNew,
    Button,
    Heading,
    HStack,
    InlineMessage,
    Table,
    VStack,
} from '@navikt/ds-react'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'
import { BriefcaseIcon, PersonPencilIcon, XMarkIcon } from '@navikt/aksel-icons'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'
import { SykepengegrunnlagSkeleton } from '@components/saksbilde/sykepengegrunnlag/SykepengegrunnlagSkeleton'
import { FetchError } from '@components/saksbilde/FetchError'
import { formaterBeløpKroner } from '@schemas/pengerUtils'
import { getFormattedNorwegianLongDate } from '@utils/date-format'
import { cn } from '@utils/tw'
import { Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { SykepengegrunnlagForm } from '@components/saksbilde/sykepengegrunnlag/form/SykepengegrunnlagForm'
import { Inntektskategori } from '@schemas/inntektRequest'
import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'
import { useSykepengegrunnlag } from '@hooks/queries/useSykepengegrunnlag'
import { ArbeidstakerInntektView } from '@components/saksbilde/sykepengegrunnlag/form/arbeidstaker/ArbeidstakerInntektView'
import { SelvstendigNæringsdrivendeInntektView } from '@components/saksbilde/sykepengegrunnlag/form/pensjonsgivende/SelvstendigNæringsdrivendeInntektView'
import { InaktivInntektView } from '@components/saksbilde/sykepengegrunnlag/form/pensjonsgivende/InaktivInntektView'
import { FrilanserInntektView } from '@components/saksbilde/sykepengegrunnlag/form/frilanser/FrilanserInntektView'
import { ArbeidsledigInntektView } from '@components/saksbilde/sykepengegrunnlag/form/arbeidsledig/ArbeidsledigInntektView'
import { NavnOgIkon } from '@components/saksbilde/sykepengegrunnlag/NavnOgIkon'
import { notNull } from '@utils/tsUtils'
import { useYrkesaktivitetForSykepengegrunnlag } from '@hooks/queries/useYrkesaktivitetForSykepengegrunnlag'
import { useDokumentVisningContext } from '@/app/person/[pseudoId]/dokumentVisningContext'
import { useAktivBehandling } from '@hooks/queries/useAktivBehandling'
import { NæringsdelView } from '@components/saksbilde/sykepengegrunnlag/form/pensjonsgivende/NæringsdelView'

export function Sykepengegrunnlag({ value }: { value: string }): ReactElement {
    const {
        data: yrkesaktiviteter,
        isLoading: yrkesaktivitetLoading,
        isError: yrkesaktivitetError,
        isSuccess: yrkesaktivitetSuccess,
        refetch: yrkesaktivitetRefetch,
    } = useYrkesaktivitetForSykepengegrunnlag()
    const {
        data: sykepengegrunnlagResponse,
        isLoading: sykepengegrunnlagLoading,
        isError: sykepengegrunnlagError,
        refetch,
    } = useSykepengegrunnlag()
    const { hideSelectButtonForAll } = useDokumentVisningContext()
    const aktivSaksbehandlingsperiode = useAktivBehandling()

    const sykepengegrunnlag = sykepengegrunnlagResponse?.sykepengegrunnlag
    const sammenlikningsgrunnlag = sykepengegrunnlagResponse?.sammenlikningsgrunnlag
    const [manuellRedigeringsmodus, setManuellRedigeringsmodus] = useState(false)
    const [selectedYrkesaktivitet, setSelectedYrkesaktivitet] = useState<Yrkesaktivitet | undefined>(undefined)
    const [visNaringsdel, setVisNaringsdel] = useState(false)

    const kanSaksbehandles = useKanSaksbehandles()

    const aktivYrkesaktivitet =
        yrkesaktiviteter?.find((y) => y.id === selectedYrkesaktivitet?.id) ||
        selectedYrkesaktivitet ||
        yrkesaktiviteter?.[0]

    const inntektData = aktivYrkesaktivitet?.inntektData
    const harIkkeInntektData = !inntektData

    const skalAutomatiskÅpne = yrkesaktivitetSuccess && harIkkeInntektData && kanSaksbehandles
    const erIRedigeringsmodus = skalAutomatiskÅpne || manuellRedigeringsmodus
    const grunnlagetEiesAvPerioden =
        notNull(sykepengegrunnlagResponse) &&
        sykepengegrunnlagResponse.opprettetForBehandling == aktivSaksbehandlingsperiode?.id

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

    const kategori = aktivYrkesaktivitet?.kategorisering.inntektskategori as Inntektskategori
    const inntektRequest = aktivYrkesaktivitet?.inntektRequest as InntektRequestFor<typeof kategori>

    return (
        <SaksbildePanel value={value} className="mb-8 p-0">
            <HStack wrap={false}>
                {/*tabell*/}
                <VStack gap="4" className="min-w-[500px] shrink-0 pt-8 pb-6">
                    <Table className="[&_td]:border-0 [&_th]:border-0">
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell>
                                    <span className="sr-only">Yrkesaktivitet</span>
                                </TableHeaderCell>
                                <TableHeaderCell className="pr-16 text-right text-ax-medium whitespace-nowrap">
                                    Omregnet årsinntekt
                                </TableHeaderCell>
                                <TableHeaderCell className="pr-16 text-right text-ax-medium whitespace-nowrap">
                                    Refusjon
                                </TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="border-b border-b-ax-bg-neutral-strong">
                            {yrkesaktiviteter.map((yrkesaktivitet) => {
                                return (
                                    <TableRow
                                        key={yrkesaktivitet.id}
                                        className={cn('relative cursor-pointer hover:bg-ax-bg-neutral-moderate-hover', {
                                            'bg-ax-bg-accent-soft after:absolute after:top-0 after:bottom-0 after:z-10 after:w-[3px] after:bg-ax-bg-accent-soft':
                                                aktivYrkesaktivitet?.id === yrkesaktivitet.id && !visNaringsdel,
                                        })}
                                        onClick={() => {
                                            setSelectedYrkesaktivitet(yrkesaktivitet)
                                            setManuellRedigeringsmodus(false)
                                            hideSelectButtonForAll()
                                            setVisNaringsdel(false)
                                        }}
                                    >
                                        <TableDataCell className="pl-8 whitespace-nowrap">
                                            <NavnOgIkon
                                                kategorisering={yrkesaktivitet.kategorisering}
                                                orgnavn={yrkesaktivitet.orgnavn}
                                            />
                                        </TableDataCell>
                                        <TableDataCell className="pr-16 text-right">
                                            {formaterBeløpKroner(yrkesaktivitet?.inntektData?.omregnetÅrsinntekt)}
                                        </TableDataCell>
                                        <TableDataCell>{resolveRefusjonSpørsmål(yrkesaktivitet)}</TableDataCell>
                                    </TableRow>
                                )
                            })}
                            {sykepengegrunnlag?.type == 'SYKEPENGEGRUNNLAG' && sykepengegrunnlag.næringsdel && (
                                <TableRow
                                    className={cn(
                                        'relative cursor-pointer border-t hover:bg-ax-bg-neutral-moderate-hover',
                                        {
                                            'bg-ax-bg-accent-soft after:absolute after:top-0 after:bottom-0 after:z-10 after:w-[3px] after:bg-ax-bg-accent-soft':
                                                visNaringsdel,
                                        },
                                    )}
                                    onClick={() => {
                                        setVisNaringsdel(true)
                                        setManuellRedigeringsmodus(false)
                                        hideSelectButtonForAll()
                                    }}
                                >
                                    <TableDataCell className="pl-8 whitespace-nowrap">
                                        <HStack gap="2" wrap={false}>
                                            <BriefcaseIcon aria-hidden fontSize="1.5rem" />
                                            <BodyShort>Næringsdel</BodyShort>
                                        </HStack>
                                    </TableDataCell>
                                    <TableDataCell className="pr-16 text-right">
                                        {formaterBeløpKroner(sykepengegrunnlag.næringsdel.næringsdel)}
                                    </TableDataCell>
                                    <TableDataCell></TableDataCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <tfoot>
                            <TableRow>
                                <TableDataCell className="border-0 pl-8 font-semibold">Totalt</TableDataCell>
                                <TableDataCell className="border-0 pr-16 text-right font-semibold">
                                    {formaterBeløpKroner(sykepengegrunnlag?.beregningsgrunnlag)}
                                </TableDataCell>
                            </TableRow>
                            {sammenlikningsgrunnlag && (
                                <TableRow>
                                    <TableDataCell className="border-0 pl-8 text-ax-text-neutral-subtle">
                                        <InlineMessage
                                            status={sammenlikningsgrunnlag.avvikProsent >= 25 ? 'error' : 'success'}
                                        >
                                            Sammenlikningsgrunnlag {sammenlikningsgrunnlag.avvikProsent.toFixed(1)}%
                                            avvik
                                        </InlineMessage>
                                    </TableDataCell>
                                    <TableDataCell className="border-0 pr-16 text-right text-ax-text-neutral-subtle">
                                        {formaterBeløpKroner(sammenlikningsgrunnlag.totaltSammenlikningsgrunnlag)}
                                    </TableDataCell>
                                </TableRow>
                            )}
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
                {aktivYrkesaktivitet && !visNaringsdel && (
                    <Høyrepanel>
                        {kanSaksbehandles && !harIkkeInntektData && grunnlagetEiesAvPerioden && (
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
                                    onClick={() => {
                                        if (erIRedigeringsmodus) hideSelectButtonForAll()
                                        setManuellRedigeringsmodus(!manuellRedigeringsmodus)
                                    }}
                                >
                                    {erIRedigeringsmodus ? 'Avbryt' : 'Endre'}
                                </Button>
                            </div>
                        )}
                        <NavnOgIkon
                            kategorisering={aktivYrkesaktivitet.kategorisering}
                            orgnavn={aktivYrkesaktivitet.orgnavn}
                            medOrgnummer
                        />
                        {!erIRedigeringsmodus && (
                            <>
                                {kategori === 'ARBEIDSTAKER' && (
                                    <ArbeidstakerInntektView
                                        inntektRequest={inntektRequest as InntektRequestFor<'ARBEIDSTAKER'>}
                                        inntektData={inntektData}
                                    />
                                )}
                                {kategori === 'SELVSTENDIG_NÆRINGSDRIVENDE' && (
                                    <SelvstendigNæringsdrivendeInntektView
                                        inntektRequest={
                                            inntektRequest as InntektRequestFor<'SELVSTENDIG_NÆRINGSDRIVENDE'>
                                        }
                                        inntektData={inntektData}
                                    />
                                )}
                                {kategori === 'INAKTIV' && (
                                    <InaktivInntektView
                                        inntektRequest={inntektRequest as InntektRequestFor<'INAKTIV'>}
                                        inntektData={inntektData}
                                    />
                                )}
                                {kategori === 'FRILANSER' && (
                                    <FrilanserInntektView
                                        inntektRequest={inntektRequest as InntektRequestFor<'FRILANSER'>}
                                        inntektData={inntektData}
                                        sykepengegrunnlag={sykepengegrunnlag}
                                    />
                                )}
                                {kategori === 'ARBEIDSLEDIG' && (
                                    <ArbeidsledigInntektView
                                        inntektRequest={inntektRequest as InntektRequestFor<'ARBEIDSLEDIG'>}
                                    />
                                )}
                            </>
                        )}
                        {erIRedigeringsmodus && (
                            <SykepengegrunnlagForm
                                key={`${aktivYrkesaktivitet.id}-${harIkkeInntektData}`}
                                kategori={kategori}
                                inntektRequest={inntektRequest}
                                yrkesaktivitetId={aktivYrkesaktivitet.id}
                                avbryt={() => {
                                    setManuellRedigeringsmodus(false)
                                    hideSelectButtonForAll()
                                }}
                                erFørstegangsRedigering={harIkkeInntektData}
                            />
                        )}
                    </Høyrepanel>
                )}
                {visNaringsdel && sykepengegrunnlag?.type == 'SYKEPENGEGRUNNLAG' && sykepengegrunnlag.næringsdel && (
                    <Høyrepanel>
                        <Heading level="3" size="xsmall">
                            Beregning av kombinert næringsdel
                        </Heading>
                        <NæringsdelView næringsdel={sykepengegrunnlag.næringsdel}></NæringsdelView>
                    </Høyrepanel>
                )}
            </HStack>
        </SaksbildePanel>
    )
}

function resolveRefusjonSpørsmål(yrkesaktivitet: Yrkesaktivitet): string {
    if (yrkesaktivitet.kategorisering?.inntektskategori !== 'ARBEIDSTAKER') return 'Ikke aktuelt'

    const inntektRequest = yrkesaktivitet.inntektRequest as InntektRequestFor<'ARBEIDSTAKER'>
    if (!inntektRequest) return '-'
    if (notNull(inntektRequest.data.refusjon) && inntektRequest.data.refusjon.length > 0) return 'Ja'
    return 'Nei'
}

function Høyrepanel({ children }: { children: React.ReactNode }): ReactElement {
    return (
        <VStack
            gap="6"
            className="w-[686px] min-w-[507px] border-l-3 border-l-ax-bg-neutral-moderate bg-ax-bg-accent-soft px-8 pt-4 pb-8"
        >
            {children}
        </VStack>
    )
}
