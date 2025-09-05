'use client'

import React, { ReactElement } from 'react'
import { Accordion, BodyShort, HStack, Table } from '@navikt/ds-react'
import { AccordionContent, AccordionHeader, AccordionItem } from '@navikt/ds-react/Accordion'
import {
    TableBody,
    TableDataCell,
    TableExpandableRow,
    TableHeader,
    TableHeaderCell,
    TableRow,
} from '@navikt/ds-react/Table'
import {
    CheckmarkCircleFillIcon,
    CircleSlashFillIcon,
    InformationSquareFillIcon,
    QuestionmarkCircleFillIcon,
} from '@navikt/aksel-icons'

import { VilkårsvurderingForm } from '@/components/saksbilde/vilkårsvurdering/VilkårsvurderingForm'
import { VilkårsvurderingSkeleton } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingSkeleton'
import { useVilkaarsvurderinger } from '@hooks/queries/useVilkaarsvurderinger'
import { Hovedspørsmål } from '@schemas/saksbehandlergrensesnitt'
import { Vurdering } from '@schemas/vilkaarsvurdering'
import { useSaksbehandlerui } from '@hooks/queries/useSaksbehandlerui'
import { FetchError } from '@components/saksbilde/FetchError'

import { kategoriLabels } from './kategorier'

export function Vilkårsvurdering(): ReactElement {
    const { data: vilkårsvurderinger, isLoading, isError, refetch } = useVilkaarsvurderinger()
    const {
        data: kodeverk,
        isLoading: kodeverkLoading,
        isError: kodeverkError,
        refetch: refetchKodeverk,
    } = useSaksbehandlerui()

    if (isLoading || kodeverkLoading || !kodeverk) return <VilkårsvurderingSkeleton />
    if (isError || kodeverkError) {
        return (
            <FetchError
                refetch={() => void Promise.all([refetch(), refetchKodeverk()])}
                message="Kunne ikke laste vilkårsvurdering."
            />
        )
    }

    const gruppert = kodeverk.reduce(
        (acc, item) => {
            const key = item.kategori ?? 'ukjent'
            ;(acc[key] ||= []).push(item)
            return acc
        },
        {} as Record<string, Hovedspørsmål[]>,
    )

    return (
        <Accordion size="small" headingSize="xsmall" indent={false}>
            {Object.entries(gruppert).map(([kategori, vilkårListe]) => {
                const vurdertAntall = vilkårListe.filter((v) =>
                    vilkårsvurderinger?.some((vv) => vv.hovedspørsmål === v.kode),
                ).length

                return (
                    <AccordionItem key={kategori} defaultOpen={kategori === 'generelle_bestemmelser'}>
                        <AccordionHeader>
                            {kategoriLabels[kategori as keyof typeof kategoriLabels] ?? 'Ukjent kategori'}{' '}
                            {vurdertAntall}/{vilkårListe.length}
                        </AccordionHeader>
                        <AccordionContent className="p-0">
                            <Table size="medium">
                                <TableHeader>
                                    <TableRow>
                                        <TableHeaderCell>Vilkår</TableHeaderCell>
                                        <TableHeaderCell className="min-w-[12rem] whitespace-nowrap">
                                            Status
                                        </TableHeaderCell>
                                        <TableHeaderCell />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vilkårListe.map((vilkår) => {
                                        const vilkårsvurdering = vilkårsvurderinger?.find(
                                            (v) => v.hovedspørsmål === vilkår.kode,
                                        )

                                        return (
                                            <TableExpandableRow
                                                key={vilkår.kode}
                                                togglePlacement="right"
                                                expandOnRowClick
                                                content={
                                                    <VilkårsvurderingForm
                                                        vilkår={vilkår}
                                                        vurdering={vilkårsvurdering}
                                                    />
                                                }
                                            >
                                                <TableDataCell align="center" className="pl-[13px]">
                                                    <HStack wrap={false} gap="4" align="center">
                                                        <span className="h-6 w-6">
                                                            {getVurderingIcon(vilkårsvurdering?.vurdering)}
                                                        </span>

                                                        <BodyShort align="start">{vilkår.beskrivelse}</BodyShort>
                                                    </HStack>
                                                </TableDataCell>
                                                <TableDataCell className="whitespace-nowrap">
                                                    {getVurderingText(vilkårsvurdering?.vurdering)}
                                                </TableDataCell>
                                            </TableExpandableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    )
}

function getVurderingIcon(vurdering?: Vurdering): ReactElement {
    switch (vurdering) {
        case 'OPPFYLT': {
            return <CheckmarkCircleFillIcon fontSize={24} className="text-ax-text-success-decoration" />
        }
        case 'IKKE_OPPFYLT': {
            return <CircleSlashFillIcon fontSize={24} className="text-ax-text-danger-decoration" />
        }
        case 'IKKE_RELEVANT': {
            return <InformationSquareFillIcon fontSize={24} className="text-ax-text-info-decoration" />
        }
        default: {
            return <QuestionmarkCircleFillIcon fontSize={24} className="text-ax-text-accent-decoration" />
        }
    }
}

function getVurderingText(vurdering?: Vurdering): string {
    switch (vurdering) {
        case 'OPPFYLT': {
            return 'Oppfylt'
        }
        case 'IKKE_OPPFYLT': {
            return 'Ikke oppfylt'
        }
        case 'IKKE_RELEVANT': {
            return 'Ikke relevant'
        }
        case 'SKAL_IKKE_VURDERES': {
            return 'Skal ikke vurderes'
        }
        default: {
            return 'Ikke vurdert'
        }
    }
}
