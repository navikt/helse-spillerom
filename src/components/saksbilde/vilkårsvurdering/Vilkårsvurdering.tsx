'use client'

import { ReactElement, useState } from 'react'
import { Accordion, HStack, Table } from '@navikt/ds-react'
import { AccordionContent, AccordionHeader, AccordionItem } from '@navikt/ds-react/Accordion'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'
import {
    CheckmarkCircleFillIcon,
    CircleSlashFillIcon,
    ExclamationmarkTriangleFillIcon,
    QuestionmarkCircleFillIcon,
} from '@navikt/aksel-icons'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { kodeverk, Vilkår } from '@components/saksbilde/vilkårsvurdering/kodeverk'
import { VilkårsvurderingFormPanel } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingFormPanel'
import { useVilkaarsvurderinger } from '@hooks/queries/useVilkaarsvurderinger'
import { Vurdering } from '@schemas/vilkaarsvurdering'

interface VilkårsgrunnlagProps {
    value: string
}

export function Vilkårsvurdering({ value }: VilkårsgrunnlagProps): ReactElement {
    const [aktivtVilkår, setAktivtVilkår] = useState<Vilkår>(kodeverk[0])
    const { data: vilkårsvurderinger, isLoading, isError } = useVilkaarsvurderinger()

    if (isLoading) return <></> // skeleton?
    if (isError) return <></> // gjør noe fornuftig

    return (
        <SaksbildePanel value={value}>
            <Accordion size="small" headingSize="xsmall" indent={false}>
                <AccordionItem defaultOpen>
                    <AccordionHeader>Generelle bestemmelser 0/6</AccordionHeader>
                    <AccordionContent className="p-0">
                        <HStack wrap={false}>
                            <Table size="medium" className="h-fit w-3/5 min-w-3/5">
                                <TableHeader>
                                    <TableRow>
                                        <TableHeaderCell className="w-full">Vilkår</TableHeaderCell>
                                        <TableHeaderCell className="min-w-[12rem] whitespace-nowrap">
                                            Status
                                        </TableHeaderCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {kodeverk.map((vilkår) => {
                                        const vilkårsvurdering = vilkårsvurderinger?.find(
                                            (vurdertVilkår) => vurdertVilkår.kode === vilkår.vilkårskode,
                                        )
                                        return (
                                            <TableRow
                                                key={vilkår.vilkårskode}
                                                selected={vilkår.vilkårskode === aktivtVilkår.vilkårskode}
                                                className="cursor-pointer"
                                                role="button"
                                                onClick={() => setAktivtVilkår(vilkår)}
                                            >
                                                <TableDataCell align="center" className="pl-[13px]">
                                                    <HStack wrap={false} gap="4" align="center">
                                                        <span className="h-6 w-6">
                                                            {getVurderingIcon(vilkårsvurdering?.vurdering)}
                                                        </span>
                                                        <span className="inline-block min-w-[70px] text-start font-bold">
                                                            § {vilkår.vilkårshjemmel.paragraf}{' '}
                                                            {vilkår.vilkårshjemmel.ledd} {vilkår.vilkårshjemmel.bokstav}{' '}
                                                            {vilkår.vilkårshjemmel.setning}
                                                        </span>
                                                        {vilkår.beskrivelse}
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
                                vurdering={vilkårsvurderinger?.find(
                                    (vurdertVilkår) => vurdertVilkår.kode === aktivtVilkår.vilkårskode,
                                )}
                            />
                        </HStack>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader>Arbeidstakere 0/19</AccordionHeader>
                    <AccordionContent>Hei</AccordionContent>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader>Selvstendig næringsdrivende 0/4</AccordionHeader>
                    <AccordionContent>Hei</AccordionContent>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader>Frilansere 0/2</AccordionHeader>
                    <AccordionContent>Hei</AccordionContent>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader>Medlemmer med kombinerte inntekter 0/4</AccordionHeader>
                    <AccordionContent>Hei</AccordionContent>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader>Særskilte grupper 0/4</AccordionHeader>
                    <AccordionContent>Hei</AccordionContent>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader>Medlemmer som har rett til andre ytelser fra folketryden m.m 0/5</AccordionHeader>
                    <AccordionContent>Hei</AccordionContent>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader>Opphold institusjon 0/2</AccordionHeader>
                    <AccordionContent>Hei</AccordionContent>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader>Yrkesskade 0/1</AccordionHeader>
                    <AccordionContent>Hei</AccordionContent>
                </AccordionItem>
            </Accordion>
        </SaksbildePanel>
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
