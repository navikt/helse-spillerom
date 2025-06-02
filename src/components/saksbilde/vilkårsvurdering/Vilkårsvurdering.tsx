'use client'

import { ReactElement, useState } from 'react'
import { Accordion, HStack, Table } from '@navikt/ds-react'
import { AccordionContent, AccordionHeader, AccordionItem } from '@navikt/ds-react/Accordion'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { kodeverk, Vilkår } from '@components/saksbilde/vilkårsvurdering/kodeverk'
import { VilkårsvurderingFormPanel } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingFormPanel'

interface VilkårsgrunnlagProps {
    value: string
}

export function Vilkårsvurdering({ value }: VilkårsgrunnlagProps): ReactElement {
    const [aktivtVilkår, setAktivtVilkår] = useState<Vilkår>(kodeverk[0])

    return (
        <SaksbildePanel value={value}>
            <Accordion size="small" headingSize="xsmall" indent={false}>
                <AccordionItem defaultOpen>
                    <AccordionHeader>Generelle bestemmelser 0/6</AccordionHeader>
                    <AccordionContent className="p-0">
                        <HStack wrap={false}>
                            <Table size="medium" className="h-fit w-1/2 min-w-1/2">
                                <TableHeader>
                                    <TableRow>
                                        <TableHeaderCell className="w-full">Vilkår</TableHeaderCell>
                                        <TableHeaderCell className="min-w-32 whitespace-nowrap">
                                            Vurdering
                                        </TableHeaderCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {kodeverk.map((vilkår) => (
                                        <TableRow
                                            key={vilkår.vilkårskode}
                                            role="button"
                                            onClick={() => setAktivtVilkår(vilkår)}
                                            selected={vilkår.vilkårskode === aktivtVilkår.vilkårskode}
                                            className="cursor-pointer"
                                        >
                                            <TableDataCell align="center" className="pl-[13px]">
                                                <HStack wrap={false} gap="4" align="center">
                                                    <span className="h-6 w-6">
                                                        <ExclamationmarkTriangleFillIcon
                                                            fontSize={24}
                                                            className="text-icon-warning"
                                                        />
                                                    </span>
                                                    <span className="inline-block min-w-[70px] text-start font-bold">
                                                        § {vilkår.vilkårshjemmel.paragraf} {vilkår.vilkårshjemmel.ledd}{' '}
                                                        {vilkår.vilkårshjemmel.bokstav} {vilkår.vilkårshjemmel.setning}
                                                    </span>
                                                    {vilkår.beskrivelse}
                                                </HStack>
                                            </TableDataCell>
                                            <TableDataCell className="whitespace-nowrap">Ikke vurdert</TableDataCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <VilkårsvurderingFormPanel key={aktivtVilkår.vilkårskode} vilkår={aktivtVilkår} />
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
