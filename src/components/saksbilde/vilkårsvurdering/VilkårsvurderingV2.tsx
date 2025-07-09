'use client'

import React, { ReactElement, useState } from 'react'
import { Accordion, BodyShort, Button, HStack, Table } from '@navikt/ds-react'
import { AccordionContent, AccordionHeader, AccordionItem } from '@navikt/ds-react/Accordion'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'

import { getVurderingIcon } from '@components/saksbilde/vilkårsvurdering/Vilkårsvurdering'
import { VilkårsvurderingV2Form } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingV2Form'
import { VilkårsvurderingSkeleton } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingSkeleton'
import { kategoriLabels } from '@components/saksbilde/vilkårsvurdering/lokalUtviklingKodeverkV2'
import { useVilkaarsvurderingerV2 } from '@hooks/queries/useVilkaarsvurderingerV2'
import { Vilkår } from '@schemas/kodeverkV2'
import { Vurdering } from '@schemas/vilkaarsvurdering'
import { useKodeverkV2 } from '@hooks/queries/useKodeverkV2'

export function VilkårsvurderingV2(): ReactElement {
    const { data: vilkårsvurderinger, isLoading, isError } = useVilkaarsvurderingerV2()
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
    const { data: kodeverk, isLoading: kodeverkLoading, isError: kodeverkError } = useKodeverkV2()

    if (isLoading || kodeverkLoading || !kodeverk) return <VilkårsvurderingSkeleton />
    if (isError || kodeverkError) return <></>

    const gruppert = kodeverk.reduce(
        (acc, item) => {
            ;(acc[item.kategori] ||= []).push(item)
            return acc
        },
        {} as Record<string, Vilkår[]>,
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
                        vilkårsvurderinger?.some((vv) => vv.kode === v.vilkårskode),
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
                                                (v) => v.kode === vilkår.vilkårskode,
                                            )
                                            const isExpanded = expandedRows.has(vilkår.vilkårskode)

                                            return (
                                                <React.Fragment key={vilkår.vilkårskode}>
                                                    <TableRow
                                                        className="hover:bg-surface-subtle cursor-pointer"
                                                        onClick={() => toggleRowExpansion(vilkår.vilkårskode)}
                                                    >
                                                        <TableDataCell align="center" className="pl-[13px]">
                                                            <HStack wrap={false} gap="4" align="center">
                                                                <span className="h-6 w-6">
                                                                    {getVurderingIcon(vilkårsvurdering?.vurdering)}
                                                                </span>
                                                                <BodyShort
                                                                    align="start"
                                                                    weight="semibold"
                                                                    className="min-w-[70px]"
                                                                >
                                                                    § {vilkår.vilkårshjemmel.paragraf}{' '}
                                                                    {vilkår.vilkårshjemmel.ledd}{' '}
                                                                    {vilkår.vilkårshjemmel.bokstav}{' '}
                                                                    {vilkår.vilkårshjemmel.setning}
                                                                </BodyShort>
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
                                                                    toggleRowExpansion(vilkår.vilkårskode)
                                                                }}
                                                            />
                                                        </TableDataCell>
                                                    </TableRow>
                                                    {isExpanded && (
                                                        <TableRow>
                                                            <TableDataCell colSpan={3} className="bg-surface-subtle">
                                                                <div className="p-4">
                                                                    <VilkårsvurderingV2Form
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
