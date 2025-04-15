import { BodyShort, Button, Modal, Radio, RadioGroup, Select, Table, TextField } from '@navikt/ds-react'
import React, { useRef, useState } from 'react'
import { PencilIcon } from '@navikt/aksel-icons'

import { useInntekter } from '@hooks/queries/useInntekter'
import { useNyInntekt } from '@hooks/mutations/useNyInntekt'

export const Inntektsforhold = () => {
    const { data: inntekter } = useInntekter()

    return (
        <div>
            <Table className="mt-8" size="small">
                <Table.Header>
                    <Table.Row>
                        <HeaderCellBold text="Inntektssituasjon" />
                        <HeaderCellBold text="Arbeidssted" />
                        <HeaderCellBold text="Sykmeldt" />
                        <HeaderCellBold text="" />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {inntekter?.map((inntekt) => (
                        <Table.Row key={inntekt.id}>
                            <Table.DataCell>{inntekt.inntektstype}</Table.DataCell>
                            <Table.DataCell>{inntekt.orgnavn || inntekt.orgnummer}</Table.DataCell>
                            <Table.DataCell>
                                <>{inntekt.sykmeldt ? 'Ja' : 'Nei'}</>
                            </Table.DataCell>
                            <Table.DataCell>
                                <Button
                                    size="small"
                                    variant="secondary-neutral"
                                    icon={<PencilIcon title="Rediger" />}
                                />
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <LeggTilInntektsforhold />
        </div>
    )
}

export const LeggTilInntektsforhold = () => {
    const ref = useRef<HTMLDialogElement>(null)

    const [inntektssituasjon, setInntektssituasjon] = useState<string>('ARBEIDSTAKER')

    const arbeidssituasjoner = [
        'ARBEIDSTAKER',
        'SELVSTENDIG NÆRINGSDRIVENDE',
        'SJØMANN',
        'JORDBRUKER',
        'ARBEIDSLEDIG',
        'INAKTIV',
        'MILITÆR (BEFAL)',
        'VERNEPLIKTIG',
        'ARBEIDSTAKER M/SJØMANN',
        'INAKTIVT M/SJØMANN',
        'SVALBARDARBEIDER',
        'AMBASSADEPERSONELL',
        'UTØVER AV REINDRIFT',
        'FISKE/ARBEIDSTAKER',
        'FRILANSER M/FORSIKRING FOR TILLEGGSSYKEPENGER',
        'FFU',
        'ARBEIDSTAKER / A-LØYSE',
        'FRILANSER UTEN FORSIKRING',
        'SELVSTENDIG DAGMAMMA/DAGPAPPA',
        'FISKER M/HYRE',
    ]
    const [sykmeldt, setSykmeldt] = useState<'ja' | 'nei' | null>(null)
    const [orgnummer, setOrgnummer] = useState<string>('')
    const nyInntektMut = useNyInntekt()
    return (
        <>
            <Button className="mt-8" size="small" variant="secondary" onClick={() => ref.current?.showModal()}>
                Legg til inntektsforhold
            </Button>
            <Modal ref={ref} header={{ heading: 'Legg til inntektsforhold' }}>
                <Modal.Body>
                    <Select
                        className="mb-8"
                        label="Velg inntektssituasjon"
                        value={inntektssituasjon}
                        onChange={(evt) => {
                            setInntektssituasjon(evt.target.value)
                        }}
                    >
                        {arbeidssituasjoner.map((arbeidssituasjon) => (
                            <option key={arbeidssituasjon} value={arbeidssituasjon}>
                                {arbeidssituasjon}
                            </option>
                        ))}
                    </Select>

                    <TextField
                        className="mb-8"
                        label="Arbeidssted"
                        description="Orgnummer"
                        value={orgnummer}
                        onChange={(e) => {
                            setOrgnummer(e.target.value)
                        }}
                    />

                    <RadioGroup
                        legend="Er personen sykmeldt fra inntektssituasjonen?"
                        value={sykmeldt}
                        onChange={(e) => {
                            setSykmeldt(e as 'ja' | 'nei')
                        }}
                    >
                        <Radio value="ja">Ja</Radio>
                        <Radio value="nei">Nei</Radio>
                    </RadioGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="button"
                        onClick={() => {
                            nyInntektMut.mutate({
                                request: {
                                    inntekt: {
                                        inntektstype: inntektssituasjon,
                                        orgnummer: orgnummer,
                                        sykmeldt: sykmeldt == 'ja',
                                    },
                                },
                                callback: () => {
                                    ref.current?.close()
                                },
                            })
                        }}
                    >
                        Legg til
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => ref.current?.close()}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

interface HeaderCellBoldProps {
    text?: string
}

const HeaderCellBold = ({ text = undefined }: HeaderCellBoldProps) =>
    text === undefined ? (
        <Table.HeaderCell />
    ) : (
        <Table.HeaderCell>
            <BodyShort weight="semibold">{text}</BodyShort>
        </Table.HeaderCell>
    )
