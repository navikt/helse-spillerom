'use client'

import React, { ReactElement, useState } from 'react'
import { Accordion, BodyShort, Button, HStack, Table } from '@navikt/ds-react'
import { AccordionContent, AccordionHeader, AccordionItem } from '@navikt/ds-react/Accordion'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'
import {
    ChevronDownIcon,
    ChevronUpIcon,
    CheckmarkCircleFillIcon,
    CircleSlashFillIcon,
    ExclamationmarkTriangleFillIcon,
} from '@navikt/aksel-icons'

import { VilkårsvurderingForm } from '@/components/saksbilde/vilkårsvurdering/VilkårsvurderingForm'
import { VilkårsvurderingSkeleton } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingSkeleton'
import { useVilkaarsvurderinger } from '@hooks/queries/useVilkaarsvurderinger'
import { Hovedspørsmål } from '@schemas/saksbehandlergrensesnitt'
import { Vurdering } from '@schemas/vilkaarsvurdering'
import { useSaksbehandlerui } from '@hooks/queries/useSaksbehandlerui'

import { kategoriLabels } from './kategorier'

export function Vilkårsvurdering(): ReactElement {
    const { data: vilkårsvurderinger, isLoading, isError } = useVilkaarsvurderinger()
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
    const { data: kodeverk, isLoading: kodeverkLoading, isError: kodeverkError } = useSaksbehandlerui()

    if (isLoading || kodeverkLoading || !kodeverk) return <VilkårsvurderingSkeleton />
    if (isError || kodeverkError) return <></>

    const gruppert = kodeverk.reduce(
        (acc, item) => {
            const key = item.kategori ?? 'ukjent'
            ;(acc[key] ||= []).push(item)
            return acc
        },
        {} as Record<string, Hovedspørsmål[]>,
    )

    const toggleRowExpansion = (uniqueKey: string) => {
        const newExpanded = new Set(expandedRows)
        if (newExpanded.has(uniqueKey)) {
            newExpanded.delete(uniqueKey)
        } else {
            newExpanded.add(uniqueKey)
        }
        setExpandedRows(newExpanded)
    }

    return (
        <div>
            <Accordion size="small" headingSize="xsmall" indent={false}>
                {Object.entries(gruppert).map(([kategori, vilkårListe]) => {
                    const vurdertAntall = vilkårListe.filter((v) =>
                        vilkårsvurderinger?.some((vv) => vv.kode === v.kode),
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
                                            <TableHeaderCell className="w-full">Vilkår</TableHeaderCell>
                                            <TableHeaderCell className="min-w-[12rem] whitespace-nowrap">
                                                Status
                                            </TableHeaderCell>
                                            <TableHeaderCell className="w-12"></TableHeaderCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {vilkårListe.map((vilkår) => {
                                            const vilkårsvurdering = vilkårsvurderinger?.find(
                                                (v) => v.kode === vilkår.kode,
                                            )
                                            const isExpanded = expandedRows.has(vilkår.kode)

                                            return (
                                                <React.Fragment key={vilkår.kode}>
                                                    <TableRow
                                                        className="hover:bg-surface-subtle cursor-pointer"
                                                        onClick={() => toggleRowExpansion(vilkår.kode)}
                                                    >
                                                        <TableDataCell align="center" className="pl-[13px]">
                                                            <HStack wrap={false} gap="4" align="center">
                                                                <span className="h-6 w-6">
                                                                    {getVurderingIcon(vilkårsvurdering?.vurdering)}
                                                                </span>

                                                                <BodyShort align="start">
                                                                    {vilkår.beskrivelse}
                                                                </BodyShort>
                                                            </HStack>
                                                        </TableDataCell>
                                                        <TableDataCell className="whitespace-nowrap">
                                                            {getVurderingText(vilkårsvurdering?.vurdering)}
                                                        </TableDataCell>
                                                        <TableDataCell>
                                                            <Button
                                                                variant="tertiary"
                                                                size="xsmall"
                                                                icon={
                                                                    isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />
                                                                }
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    toggleRowExpansion(vilkår.kode)
                                                                }}
                                                            />
                                                        </TableDataCell>
                                                    </TableRow>
                                                    {isExpanded && (
                                                        <TableRow>
                                                            <TableDataCell colSpan={3} className="bg-surface-subtle">
                                                                <div className="p-4">
                                                                    <VilkårsvurderingForm
                                                                        vilkår={vilkår}
                                                                        vurdering={vilkårsvurdering}
                                                                        onSuccess={() => {
                                                                            // Optionally close the expanded row after successful submission
                                                                            // setExpandedRows(prev => {
                                                                            //   const newSet = new Set(prev)
                                                                            //   newSet.delete(vilkår.vilkårskode)
                                                                            //   return newSet
                                                                            // })
                                                                        }}
                                                                    />
                                                                </div>
                                                            </TableDataCell>
                                                        </TableRow>
                                                    )}
                                                </React.Fragment>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    )
}

function getVurderingIcon(vurdering?: Vurdering): ReactElement {
    switch (vurdering) {
        case 'OPPFYLT': {
            return <CheckmarkCircleFillIcon fontSize={24} className="text-icon-success" />
        }
        case 'IKKE_OPPFYLT': {
            return <CircleSlashFillIcon fontSize={24} className="text-icon-danger" />
        }
        case 'IKKE_RELEVANT': {
            return <ExclamationmarkTriangleFillIcon fontSize={24} className="text-gray-400" />
        }
        default: {
            return <ExclamationmarkTriangleFillIcon fontSize={24} className="text-icon-warning" />
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
