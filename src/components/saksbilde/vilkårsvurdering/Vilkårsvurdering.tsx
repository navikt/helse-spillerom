'use client'

import { ReactElement, useEffect, useState } from 'react'
import { Accordion, BodyShort, HStack, Table } from '@navikt/ds-react'
import { AccordionContent, AccordionHeader, AccordionItem } from '@navikt/ds-react/Accordion'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'
import {
    CheckmarkCircleFillIcon,
    CircleSlashFillIcon,
    ExclamationmarkTriangleFillIcon,
    QuestionmarkCircleFillIcon,
} from '@navikt/aksel-icons'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { Vilkår } from '@components/saksbilde/vilkårsvurdering/kodeverk'
import { VilkårsvurderingFormPanel } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingFormPanel'
import { VilkårsvurderingSkeleton } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingSkeleton'
import { useVilkaarsvurderinger } from '@hooks/queries/useVilkaarsvurderinger'
import { Vilkaarsvurdering, Vurdering } from '@schemas/vilkaarsvurdering'
import { cn } from '@utils/tw'
import { useKodeverk } from '@hooks/queries/useKodeverk'

export function Vilkårsvurdering({ value }: { value: string }): ReactElement {
    const { data: vilkårsvurderinger, isLoading, isError } = useVilkaarsvurderinger()
    const { data: kodeverk, isLoading: kodeverkLoading, isError: kodeverkError } = useKodeverk()

    if (isLoading || kodeverkLoading) return <VilkårsvurderingSkeleton />
    if (kodeverkError || isError || !kodeverk) return <></> // vis noe fornuftig

    const gruppert = kodeverk.reduce(
        (acc, item) => {
            ;(acc[item.kategori] ||= []).push(item)
            return acc
        },
        {} as Record<string, Vilkår[]>,
    )

    return (
        <SaksbildePanel value={value}>
            <Accordion size="small" headingSize="xsmall" indent={false}>
                {Object.entries(gruppert).map(([kategori, vilkårListe]) => {
                    const vurdertAntall = vilkårListe.filter((v) =>
                        vilkårsvurderinger?.some((vv) => vv.kode === v.vilkårskode),
                    ).length

                    return (
                        <AccordionItem key={kategori} defaultOpen={kategori === 'generelle_bestemmelser'}>
                            <AccordionHeader>
                                {kategoriTekst[kategori] ?? 'Denne kategorien mangler mapping i koden'} {vurdertAntall}/
                                {vilkårListe.length}
                            </AccordionHeader>
                            <AccordionContent className="p-0">
                                <VilkårsvurderingAccordionContent
                                    vilkårListe={vilkårListe}
                                    vilkårsvurderinger={vilkårsvurderinger}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </SaksbildePanel>
    )
}

interface KategoriAccordionContentProps {
    vilkårListe: Vilkår[]
    vilkårsvurderinger?: Vilkaarsvurdering[]
}

export function VilkårsvurderingAccordionContent({
    vilkårListe,
    vilkårsvurderinger,
}: KategoriAccordionContentProps): ReactElement {
    const [aktivtVilkår, setAktivtVilkår] = useState<Vilkår>()

    useEffect(() => {
        if (vilkårListe && vilkårListe.length > 0) {
            setAktivtVilkår(vilkårListe[0])
        }
    }, [vilkårListe])

    if (!aktivtVilkår) return <></>

    return (
        <HStack wrap={false}>
            <Table size="medium" className="h-fit w-3/5 min-w-3/5">
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell className="w-full">Vilkår</TableHeaderCell>
                        <TableHeaderCell className="min-w-[12rem] whitespace-nowrap">Status</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vilkårListe.map((vilkår) => {
                        const vilkårsvurdering = vilkårsvurderinger?.find((v) => v.kode === vilkår.vilkårskode)
                        const selected = vilkår.vilkårskode === aktivtVilkår.vilkårskode

                        return (
                            <TableRow
                                key={vilkår.vilkårskode}
                                selected={selected}
                                className={cn('cursor-pointer', { 'relative z-10': selected })}
                                role="button"
                                onClick={() => setAktivtVilkår(vilkår)}
                            >
                                <TableDataCell align="center" className="pl-[13px]">
                                    <HStack wrap={false} gap="4" align="center">
                                        <span className="h-6 w-6">{getVurderingIcon(vilkårsvurdering?.vurdering)}</span>
                                        <BodyShort align="start" weight="semibold" className="min-w-[70px]">
                                            § {vilkår.vilkårshjemmel.paragraf} {vilkår.vilkårshjemmel.ledd}{' '}
                                            {vilkår.vilkårshjemmel.bokstav} {vilkår.vilkårshjemmel.setning}
                                        </BodyShort>
                                        <BodyShort align="start">{vilkår.beskrivelse}</BodyShort>
                                    </HStack>
                                </TableDataCell>
                                <TableDataCell className="whitespace-nowrap">
                                    {getVurderingText(vilkårsvurdering?.vurdering)}
                                </TableDataCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            <VilkårsvurderingFormPanel
                key={aktivtVilkår.vilkårskode}
                vilkår={aktivtVilkår}
                vurdering={vilkårsvurderinger?.find((v) => v.kode === aktivtVilkår.vilkårskode)}
                nesteAction={() => {
                    const i = vilkårListe.findIndex((v) => v.vilkårskode === aktivtVilkår.vilkårskode)
                    setAktivtVilkår(vilkårListe[(i + 1) % vilkårListe.length])
                }}
            />
        </HStack>
    )
}

export function getVurderingIcon(vurdering?: Vurdering): ReactElement {
    switch (vurdering) {
        case 'OPPFYLT': {
            return <CheckmarkCircleFillIcon fontSize={24} className="text-icon-success" />
        }
        case 'IKKE_OPPFYLT': {
            return <CircleSlashFillIcon fontSize={24} className="text-icon-danger" />
        }
        case 'IKKE_RELEVANT': {
            return <QuestionmarkCircleFillIcon fontSize={24} className="text-icon-default" /> // må byttes til et annet ikon
        }
        case 'SKAL_IKKE_VURDERES': {
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

const kategoriTekst: Record<string, string> = {
    generelle_bestemmelser: 'Generelle bestemmelser',
    arbeidstakere: 'Arbeidstakere',
    selvstendig_næringsdrivende: 'Selvstendige næringsdrivende',
    frilansere: 'Frilansere',
    medlemmer_med_kombinerte_inntekter: 'Medlemmer med kombinerte inntekter',
    særskilte_grupper: 'Særskilte grupper',
    medlemmer_med_rett_til_andre_ytelser: 'Medlemmer som har rett til andre ytelser fra folketrygden',
    opphold_i_institusjon: 'Opphold i institusjon',
    yrkesskade: 'Yrkesskade',
}
