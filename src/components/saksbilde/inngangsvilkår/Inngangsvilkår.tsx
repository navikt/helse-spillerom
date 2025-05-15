'use client'

import { ReactElement, useState } from 'react'
import { Accordion, Button, Heading, Radio, RadioGroup, Textarea } from '@navikt/ds-react'
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon, ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'

type SubVilkår = {
    id: string
    label: string
    subVilkår?: readonly SubVilkår[]
}

type Vilkår = {
    id: string
    label: string
    subVilkår?: readonly SubVilkår[]
}

const vilkårData: readonly Vilkår[] = [
    {
        id: 'opptjeningstid',
        label: '§ 8-2 Opptjeningstid',
        subVilkår: [
            {
                id: 'ja',
                label: 'JA',
                subVilkår: [
                    {
                        id: 'hovedregel',
                        label: 'Hovedregel',
                    },
                    {
                        id: 'aap',
                        label: 'AAP osv',
                    },
                ],
            },
            {
                id: 'nei',
                label: 'NEI',
                subVilkår: [
                    {
                        id: 'hovedregel',
                        label: 'Hovedregel',
                    },
                    {
                        id: 'aap_fp',
                        label: 'Hvis AAP før FP og retten var brukt opp uten ny opptjening gjelder ikke 8-2.2.1',
                    },
                ],
            },
            {
                id: 'unntak',
                label: 'UNNTAK',
                subVilkår: [
                    {
                        id: 'skip',
                        label: 'Skip utenlandsfart',
                    },
                    {
                        id: 'fisker',
                        label: 'Fisker',
                    },
                ],
            },
            {
                id: 'uavklart',
                label: 'UAVKLART',
            },
        ],
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
    subVilkår?: Record<string, VilkårState>
}

const createInitialState = (): Record<string, VilkårState> => {
    const state: Record<string, VilkårState> = {}

    vilkårData.forEach((vilkår) => {
        if (vilkår.subVilkår) {
            state[vilkår.id] = {
                vurdering: undefined,
                notat: '',
                open: false,
                subVilkår: vilkår.subVilkår.reduce(
                    (acc, subVilkår) => {
                        acc[subVilkår.id] = {
                            vurdering: undefined,
                            notat: '',
                            open: false,
                            subVilkår:
                                subVilkår.subVilkår?.reduce(
                                    (subAcc, subSubVilkår) => {
                                        subAcc[subSubVilkår.id] = {
                                            vurdering: undefined,
                                            notat: '',
                                            open: false,
                                        }
                                        return subAcc
                                    },
                                    {} as Record<string, VilkårState>,
                                ) || undefined,
                        }
                        return acc
                    },
                    {} as Record<string, VilkårState>,
                ),
            }
        } else {
            state[vilkår.id] = { vurdering: undefined, notat: '', open: false }
        }
    })

    return state
}

const initialState = createInitialState()

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
    const [opptjeningstidValg, setOpptjeningstidValg] = useState<string | undefined>(undefined)
    const [opptjeningstidSubvalg, setOpptjeningstidSubvalg] = useState<string | undefined>(undefined)

    const vurdertCount = Object.values(vilkår).reduce((count, v) => {
        if (v.vurdering !== undefined) count++
        if (v.subVilkår) {
            count += Object.values(v.subVilkår).filter((sv) => sv.vurdering !== undefined).length
        }
        return count
    }, 0)

    const totalVilkårCount = vilkårData.length

    const getOpptjeningstidStatus = (): Vurdering => {
        if (!opptjeningstidValg) return undefined
        if (opptjeningstidValg === 'uavklart') return 'uavklart'
        if (!opptjeningstidSubvalg) return undefined
        if (opptjeningstidValg === 'ja') return 'oppfylt'
        if (opptjeningstidValg === 'nei') return 'ikke_oppfylt'
        if (opptjeningstidValg === 'unntak') return 'oppfylt'
        return undefined
    }

    return (
        <SaksbildePanel value={value}>
            <Heading level="2" size="medium" className="mb-8">
                Inngangsvilkår ({vurdertCount} av {totalVilkårCount} vurdert)
            </Heading>
            <Accordion className="max-w-2xl" indent={false}>
                <Accordion.Item
                    key="opptjeningstid"
                    open={vilkår['opptjeningstid'].open}
                    onOpenChange={(open) =>
                        setVilkår((prev) => ({ ...prev, opptjeningstid: { ...prev['opptjeningstid'], open } }))
                    }
                >
                    <Accordion.Header>
                        <span className="flex items-center gap-4 text-lg font-semibold">
                            {statusIcon(getOpptjeningstidStatus())}§ 8-2 Opptjeningstid
                        </span>
                    </Accordion.Header>
                    <Accordion.Content>
                        <div className="p-4">
                            <RadioGroup
                                legend="Er vilkåret oppfylt?"
                                value={opptjeningstidValg ?? ''}
                                onChange={(val) => {
                                    setOpptjeningstidValg(val)
                                    setOpptjeningstidSubvalg(undefined)
                                }}
                            >
                                <Radio value="ja">Ja</Radio>
                                {opptjeningstidValg === 'ja' && (
                                    <div className="my-4 ml-10">
                                        <RadioGroup
                                            legend="Velg regel for ja"
                                            value={opptjeningstidSubvalg ?? ''}
                                            onChange={setOpptjeningstidSubvalg}
                                        >
                                            <Radio value="hovedregel">
                                                Hovedregel: Må ha arbeidet i 28 dager før arbeidsuførhet inntreffer
                                            </Radio>
                                            <Radio value="aap">
                                                Unntak fra 8-2.1 ved mottatt dagpenger, omsorgspenger, pleiepenger,
                                                opplæringspenger, svangerskapspenger eller foreldrepenger
                                            </Radio>
                                        </RadioGroup>
                                    </div>
                                )}
                                <Radio value="nei">Nei</Radio>
                                {opptjeningstidValg === 'nei' && (
                                    <div className="my-4 ml-10">
                                        <RadioGroup
                                            legend="Velg regel for nei"
                                            value={opptjeningstidSubvalg ?? ''}
                                            onChange={setOpptjeningstidSubvalg}
                                        >
                                            <Radio value="hovedregel">
                                                Hovedregel: Må ha arbeidet i 28 dager før arbeidsuførhet inntreffer
                                            </Radio>
                                            <Radio value="aap_fp">
                                                Hvis AAP før FP og retten var brukt opp uten ny opptjening gjelder ikke
                                                8-2.2.1
                                            </Radio>
                                        </RadioGroup>
                                    </div>
                                )}
                                <Radio value="unntak">Unntak</Radio>
                                {opptjeningstidValg === 'unntak' && (
                                    <div className="my-4 ml-10">
                                        <RadioGroup
                                            legend="Velg unntak"
                                            value={opptjeningstidSubvalg ?? ''}
                                            onChange={setOpptjeningstidSubvalg}
                                        >
                                            <Radio value="skip">
                                                Når man er ansatt på et norsk skip i utenriksfart, ytes det sykepenger
                                                etter bestemmelsene om sykepenger til arbeidstakere i §§ 8-15 til 8-33,
                                                og etter følgende særbestemmelser: Bestemmelsen om opptjeningstid for
                                                rett til sykepenger i § 8-2 gjelder ikke
                                            </Radio>
                                            <Radio value="fisker">
                                                En fisker som er tatt opp på blad B i fiskermanntallet, har rett til
                                                sykepenger uten hensyn til bestemmelsene i § 8-2 om opptjeningstid
                                            </Radio>
                                            <Radio value="verneplikt">
                                                Et medlem som har utført militærtjeneste, har rett til sykepenger ved
                                                arbeidsuførhet uten hensyn til vilkårene i §§ 8-2 og 8-3 dersom
                                                arbeidsuførheten oppstår under tjenesten
                                            </Radio>
                                        </RadioGroup>
                                    </div>
                                )}
                                <Radio value="uavklart">Uavklart</Radio>
                            </RadioGroup>
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
                {vilkårData
                    .filter((v) => v.id !== 'opptjeningstid')
                    .map((v) => (
                        <Accordion.Item
                            key={v.id}
                            open={vilkår[v.id].open}
                            onOpenChange={(open) => setVilkår((prev) => ({ ...prev, [v.id]: { ...prev[v.id], open } }))}
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
                                        onChange={(val) =>
                                            setVilkår((prev) => ({
                                                ...prev,
                                                [v.id]: { ...prev[v.id], vurdering: val as Vurdering },
                                            }))
                                        }
                                    >
                                        <Radio value="oppfylt">Ja</Radio>
                                        <Radio value="ikke_oppfylt">Nei</Radio>
                                        <Radio value="uavklart">Uavklart</Radio>
                                    </RadioGroup>
                                    <div className="mt-6">
                                        <Textarea
                                            label="Notat til beslutter"
                                            description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                                            id={`notat-${v.id}`}
                                            value={vilkår[v.id].notat}
                                            onChange={(e) =>
                                                setVilkår((prev) => ({
                                                    ...prev,
                                                    [v.id]: { ...prev[v.id], notat: e.target.value },
                                                }))
                                            }
                                            minRows={3}
                                            className="mb-4"
                                        />
                                    </div>
                                    <div className="mt-4 flex gap-4">
                                        <Button
                                            variant="primary"
                                            onClick={() =>
                                                setVilkår((prev) => ({
                                                    ...prev,
                                                    [v.id]: { ...prev[v.id], open: false },
                                                }))
                                            }
                                        >
                                            Lagre
                                        </Button>
                                        <Button
                                            variant="tertiary"
                                            onClick={() =>
                                                setVilkår((prev) => ({
                                                    ...prev,
                                                    [v.id]: { ...prev[v.id], open: false },
                                                }))
                                            }
                                        >
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
