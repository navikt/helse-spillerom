'use client'

import { ReactElement, useState } from 'react'
import { Accordion, BodyShort, Button, Heading, Radio, RadioGroup, Textarea } from '@navikt/ds-react'
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon, ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'

const vilkårData = [
    {
        id: 'opptjeningstid',
        label: '§ 8-2 Opptjeningstid',
    },
    {
        id: 'sykepengegrunnlag',
        label: '§ 8-3 Krav til minste sykepengegrunnlag',
    },
    {
        id: 'lovvalg',
        label: 'Lovvalg og medlemskap',
    },
] as const

type Vurdering = 'oppfylt' | 'ikke_oppfylt' | 'uavklart' | undefined

interface VilkårState {
    vurdering: Vurdering
    notat: string
    open: boolean
}

const initialState: Record<string, VilkårState> = {
    opptjeningstid: { vurdering: undefined, notat: '', open: false },
    sykepengegrunnlag: { vurdering: undefined, notat: '', open: false },
    lovvalg: { vurdering: undefined, notat: '', open: false },
}

function statusIcon(vurdering: Vurdering) {
    if (vurdering === 'oppfylt') return <CheckmarkCircleFillIcon aria-label="Oppfylt" className="text-icon-success" />
    if (vurdering === 'ikke_oppfylt')
        return <XMarkOctagonFillIcon aria-label="Ikke oppfylt" className="text-icon-danger" />
    if (vurdering === 'uavklart')
        return <ExclamationmarkTriangleFillIcon aria-label="Uavklart" className="text-icon-warning" />
    return <span className="inline-block h-5 w-5 rounded-full border-2 border-border-subtle" />
}

export function Inngangsvilkår({ value }: { value: string }): ReactElement {
    const [vilkår, setVilkår] = useState(initialState)

    const vurdertCount = Object.values(vilkår).filter((v) => v.vurdering !== undefined).length

    const handleOpen = (id: string, open: boolean) => {
        setVilkår((prev) => ({
            ...prev,
            [id]: { ...prev[id], open },
        }))
    }

    const handleVurdering = (id: string, vurdering: Vurdering) => {
        setVilkår((prev) => ({
            ...prev,
            [id]: { ...prev[id], vurdering },
        }))
    }

    const handleNotat = (id: string, notat: string) => {
        setVilkår((prev) => ({
            ...prev,
            [id]: { ...prev[id], notat },
        }))
    }

    const handleLagre = (id: string) => {
        setVilkår((prev) => ({
            ...prev,
            [id]: { ...prev[id], open: false },
        }))
    }

    const handleAvbryt = (id: string) => {
        setVilkår((prev) => ({
            ...prev,
            [id]: { ...prev[id], open: false },
        }))
    }

    return (
        <SaksbildePanel value={value}>
            <Heading level="2" size="medium" className="mb-8">
                Inngangsvilkår ({vurdertCount} av 3 vurdert)
            </Heading>
            <Accordion className="max-w-2xl" indent={false}>
                {vilkårData.map((v) => (
                    <Accordion.Item
                        key={v.id}
                        open={vilkår[v.id].open}
                        onOpenChange={(open) => handleOpen(v.id, open)}
                        className={
                            vilkår[v.id].vurdering === 'oppfylt'
                                ? 'border-success bg-surface-success-subtle'
                                : vilkår[v.id].vurdering === 'ikke_oppfylt'
                                  ? 'border-danger bg-surface-danger-subtle'
                                  : vilkår[v.id].vurdering === 'uavklart'
                                    ? 'border-warning bg-surface-warning-subtle'
                                    : ''
                        }
                    >
                        <Accordion.Header>
                            <span className="flex items-center gap-4 text-lg font-semibold">
                                {statusIcon(vilkår[v.id].vurdering)}
                                {v.label}
                            </span>
                        </Accordion.Header>
                        <Accordion.Content>
                            <div className="p-4">
                                <RadioGroup
                                    legend="Er vilkåret oppfylt?"
                                    value={vilkår[v.id].vurdering ?? ''}
                                    onChange={(val) => handleVurdering(v.id, val as Vurdering)}
                                >
                                    <Radio value="oppfylt">Ja</Radio>
                                    <Radio value="ikke_oppfylt">Nei</Radio>
                                    <Radio value="uavklart">Uavklart</Radio>
                                </RadioGroup>
                                <div className="mt-6">
                                    <BodyShort as="label" htmlFor={`notat-${v.id}`} className="mb-2 block">
                                        Notat til beslutter
                                    </BodyShort>
                                    <BodyShort className="mb-2 text-text-subtle">
                                        Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn.
                                    </BodyShort>
                                    <Textarea
                                        label="Notat"
                                        id={`notat-${v.id}`}
                                        value={vilkår[v.id].notat}
                                        onChange={(e) => handleNotat(v.id, e.target.value)}
                                        minRows={3}
                                        className="mb-4"
                                    />
                                </div>
                                <div className="mt-4 flex gap-4">
                                    <Button variant="primary" onClick={() => handleLagre(v.id)}>
                                        Lagre
                                    </Button>
                                    <Button variant="tertiary" onClick={() => handleAvbryt(v.id)}>
                                        Avbryt
                                    </Button>
                                </div>
                            </div>
                        </Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion>
        </SaksbildePanel>
    )
}
