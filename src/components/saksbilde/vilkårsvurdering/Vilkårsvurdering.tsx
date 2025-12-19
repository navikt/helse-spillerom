'use client'

import React, { ReactElement, useState } from 'react'
import { Accordion, BodyShort, Table, Tag, TagProps } from '@navikt/ds-react'
import { AccordionContent, AccordionHeader, AccordionItem } from '@navikt/ds-react/Accordion'
import {
    TableBody,
    TableDataCell,
    TableExpandableRow,
    TableHeader,
    TableHeaderCell,
    TableRow,
} from '@navikt/ds-react/Table'

import { VilkårsvurderingForm } from '@/components/saksbilde/vilkårsvurdering/VilkårsvurderingForm'
import { VilkårsvurderingSkeleton } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingSkeleton'
import { useVilkaarsvurderinger } from '@hooks/queries/useVilkaarsvurderinger'
import { Hovedspørsmål } from '@schemas/saksbehandlergrensesnitt'
import { Vilkaarsvurdering, Vurdering } from '@schemas/vilkaarsvurdering'
import { useSaksbehandlerui } from '@hooks/queries/useSaksbehandlerui'
import { FetchError } from '@components/saksbilde/FetchError'

import { kategoriLabels } from './kategorier'

export function Vilkårsvurdering(): ReactElement {
    const [expandedRow, setExpandedRow] = useState<string | undefined>(undefined)
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
        <Accordion size="small" indent={false}>
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
                                        <TableHeaderCell aria-hidden="true" className="w-26"></TableHeaderCell>
                                        <TableHeaderCell>Vilkår</TableHeaderCell>
                                        <TableHeaderCell className="w-32">Status</TableHeaderCell>
                                        <TableHeaderCell aria-hidden="true" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vilkårListe.map((vilkår, index) => {
                                        const isLast = index === vilkårListe.length - 1
                                        const rowKey = `${kategori}-${index}`
                                        const vilkårsvurdering = vilkårsvurderinger?.find(
                                            (v) => v.hovedspørsmål === vilkår.kode,
                                        )

                                        return (
                                            <TableExpandableRow
                                                key={vilkår.kode}
                                                togglePlacement="right"
                                                expandOnRowClick
                                                open={expandedRow === rowKey}
                                                onOpenChange={() =>
                                                    setExpandedRow((prev) => (prev === rowKey ? undefined : rowKey))
                                                }
                                                content={
                                                    <VilkårsvurderingForm
                                                        vilkår={vilkår}
                                                        vurdering={vilkårsvurdering}
                                                        onSuccess={() =>
                                                            setExpandedRow(
                                                                isLast ? undefined : `${kategori}-${index + 1}`,
                                                            )
                                                        }
                                                    />
                                                }
                                            >
                                                <TableDataCell align="left">
                                                    {getVurderingTag(vilkår, vilkårsvurdering)}
                                                </TableDataCell>
                                                <TableDataCell align="center" className="pl-[13px]">
                                                    <BodyShort align="start">{vilkår.beskrivelse}</BodyShort>
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

function getVurderingTag(vilkår: Hovedspørsmål, vurdering?: Vilkaarsvurdering): ReactElement {
    function tagFarge(vurdering?: Vurdering): TagProps['variant'] {
        switch (vurdering) {
            case 'OPPFYLT': {
                return 'success'
            }
            case 'IKKE_OPPFYLT': {
                return 'error'
            }
            case 'IKKE_RELEVANT': {
                return 'info'
            }
            default: {
                return 'warning'
            }
        }
    }

    return (
        <Tag size="small" className="w-20 justify-start" variant={tagFarge(vurdering?.vurdering)}>
            {vilkår.paragrafTag}
        </Tag>
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
