'use client'

import React, { ReactElement, useEffect, useState } from 'react'
import {
    BodyShort,
    Radio,
    RadioGroup,
    Table,
    Button,
    Textarea,
    Detail,
    CheckboxGroup,
    Checkbox,
} from '@navikt/ds-react'
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon, CircleBrokenIcon } from '@navikt/aksel-icons'

import { sakstyper, regler, Regel } from '@components/vilkarsvurdering/vilkar'
import { useVilkar } from '@hooks/queries/useVilkar'
import { useNyeVilkaar } from '@hooks/mutations/useNyeVilkaar'
import { Vilkarsvurdering } from '@typer/manuellbehandlingtypes'
import { useDeleteVilkar } from '@hooks/mutations/useDeleteVilkar'
import { useNyttVilkaar } from '@hooks/mutations/useNyttVilkaar'
import { useUpdateVilkaar } from '@hooks/mutations/useUpdateVilkar'
import { useBehandling } from '@hooks/queries/useBehandling'
import { useUpdateBehandling } from '@hooks/mutations/useUpdateBehandling'
import { NesteSteg } from '@components/nestesteg/NesteSteg'

export default function Page(): ReactElement {
    const { data: behandling } = useBehandling()

    const { data: vilkar } = useVilkar()
    const { mutate: leggTilNyeVilkaar } = useNyeVilkaar()
    const { mutate: oppdaterBehandling } = useUpdateBehandling()

    useEffect(() => {
        if (behandling?.sakstype === 'Annet') return
        oppdaterBehandling({ request: { sakstype: 'Annet' } })
        const reglerFraCase = sakstyper['Annet']
        leggTilNyeVilkaar({ request: { vilkar: reglerFraCase } })
    }, [behandling?.sakstype, leggTilNyeVilkaar, oppdaterBehandling])

    const { mutate: updateVilkar } = useUpdateVilkaar()

    const alleVilkarUndefined = vilkar?.every((v) => v.vurdering === undefined)
    return (
        <>
            <div className="mt-4">
                {behandling?.sakstype && (
                    <>
                        <Table size="small" className="mb-8">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>
                                        {alleVilkarUndefined && (vilkar?.length || 0) > 0 && (
                                            <Button
                                                size="small"
                                                variant="tertiary"
                                                icon={
                                                    <CheckmarkCircleFillIcon
                                                        color="var(--a-icon-success)"
                                                        title="check alle"
                                                    />
                                                }
                                                onClick={() => {
                                                    vilkar?.forEach((v) => {
                                                        const oppdatering = { ...v, vurdering: 'ja' }
                                                        updateVilkar({ request: oppdatering })
                                                    })
                                                }}
                                            />
                                        )}
                                    </Table.HeaderCell>
                                    <Table.HeaderCell scope="col">
                                        <BodyShort className="font-bold">Regel</BodyShort>
                                    </Table.HeaderCell>
                                    <Table.HeaderCell scope="col">
                                        <BodyShort className="font-bold">Vurdering</BodyShort>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {(vilkar || []).map((v) => {
                                    //TODO enb sortering
                                    return <EnkeltVilkarRad key={v.id} vilkarsvurdering={v} />
                                })}
                            </Table.Body>
                        </Table>

                        <LeggTilVilkar />
                    </>
                )}
            </div>
            <NesteSteg nesteFane="dagoversikt" />
        </>
    )
}

function LeggTilVilkar() {
    const { data: vilkar } = useVilkar()
    const [adding, setAdding] = useState(false)
    const { mutate: leggTilNyttVilkaar } = useNyttVilkaar()

    const [selectedCustomVilkarIds, setSelectedCustomVilkarIds] = useState<string[]>([])

    const availableVilkarOptions = regler.filter((r) => !(vilkar?.map((v) => v.regelId) || []).includes(r.id))
    if (availableVilkarOptions.length == 0) {
        return null
    }

    if (!adding) {
        return (
            <Button
                className="mt-2"
                variant="secondary"
                size="small"
                onClick={() => {
                    setAdding(true)
                }}
            >
                Legg til regel
            </Button>
        )
    }

    return (
        <div className="bg-surface-subtle p-4 rounded">
            <CheckboxGroup size="small" legend="Velg regler">
                {availableVilkarOptions.map((regel) => (
                    <Checkbox
                        key={regel.id}
                        type="checkbox"
                        id={`vilkar-${regel.id}`}
                        value={regel.id}
                        onChange={(e) => {
                            const id = e.target.value
                            setSelectedCustomVilkarIds((prev) =>
                                prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
                            )
                        }}
                    >
                        {regel.navn}
                    </Checkbox>
                ))}
            </CheckboxGroup>

            <Button
                className="mt-2"
                variant="primary"
                size="small"
                onClick={() => {
                    selectedCustomVilkarIds.forEach((regelId) => leggTilNyttVilkaar({ request: { regelId } }))
                    setSelectedCustomVilkarIds([]) // Nullstill valgene etterpå
                    setAdding(false)
                }}
                disabled={selectedCustomVilkarIds.length === 0} // Deaktiver knappen hvis ingen er valgt
            >
                Legg til valgte
            </Button>
            <Button
                className="mt-2 ml-4"
                variant="secondary-neutral"
                size="small"
                onClick={() => {
                    setAdding(false)
                }}
            >
                Avbryt
            </Button>
        </div>
    )
}

function EnkeltVilkarRad({ vilkarsvurdering }: { vilkarsvurdering: Vilkarsvurdering }) {
    const { mutate: updateVilkar } = useUpdateVilkaar()
    const [expanded, setExpanded] = useState(false)
    const { mutate: slettVilkar } = useDeleteVilkar()
    const regel = regler.find((r) => r.id === vilkarsvurdering.regelId) as Regel
    const vurdering = vilkarsvurdering.vurdering

    function oppfyltTekst(vurdering: string | undefined) {
        switch (vurdering) {
            case 'ja':
                return 'Oppfylt'
            case 'nei':
                return 'Ikke oppfylt'
            case 'unntak':
                return 'Unntak'
            default:
                return ''
        }
    }

    return (
        <Table.ExpandableRow
            togglePlacement="right"
            expandOnRowClick={true}
            open={expanded}
            onOpenChange={(open) => setExpanded(open)}
            content={
                <>
                    {regel.lovverk.map((lovverk) => {
                        const tekst = []
                        tekst.push(lovverk.lovverk)
                        tekst.push('§ ' + lovverk.paragraf)
                        if (lovverk.ledd) tekst.push(lovverk.ledd)
                        if (lovverk.bokstav) tekst.push(lovverk.bokstav)
                        const lovverkTekst = tekst.join(' ')
                        return <Detail key={lovverkTekst}>{lovverkTekst}</Detail>
                    })}
                    <div className="bg-blue-50 p-4 rounded">
                        <RadioGroup
                            className="mb-4"
                            size="small"
                            legend="Er vilkåret oppfylt?"
                            value={vurdering || null}
                            onChange={(e) => {
                                const oppdatering = { ...vilkarsvurdering, vurdering: e }
                                updateVilkar({ request: oppdatering })
                            }}
                        >
                            <Radio value="ja">Ja</Radio>
                            <Radio value="nei">Nei</Radio>
                        </RadioGroup>
                        <Textarea className="mb-4" size="small" label="Notat til beslutter" />
                        <div className="flex justify-between">
                            <Button
                                variant="primary"
                                size="small"
                                onClick={() => {
                                    setExpanded(false)
                                }}
                            >
                                Lagre
                            </Button>
                            <Button
                                variant="secondary-neutral"
                                size="small"
                                onClick={() => {
                                    // Fjern fra vilkårliste
                                    slettVilkar({ vilkarId: vilkarsvurdering.id })
                                }}
                            >
                                Ikke aktuelt
                            </Button>
                        </div>
                    </div>
                </>
            }
        >
            <Table.DataCell scope="row">
                <Ikon vurdering={vurdering} />
            </Table.DataCell>
            <Table.DataCell scope="row">{regel.navn}</Table.DataCell>
            <Table.DataCell scope="row">{oppfyltTekst(vurdering)}</Table.DataCell>
        </Table.ExpandableRow>
    )
}

function Ikon({ vurdering }: { vurdering: string | undefined }) {
    switch (vurdering) {
        case 'ja':
            return <CheckmarkCircleFillIcon color="var(--a-icon-success)" />
        case 'nei':
            return <XMarkOctagonFillIcon color="var(--a-icon-danger)" />
        case 'unntak':
            return <CircleBrokenIcon color="var(--a-icon-info)" />
        default:
            return null
    }
}
