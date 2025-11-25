import React, { ReactElement } from 'react'
import { BoxNew, Button, Skeleton, Table, TextField } from '@navikt/ds-react'

import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'
import { getInntektsforholdDisplayText } from '@components/saksbilde/yrkesaktivitet/yrkesaktivitetVisningTekst'
import { Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { useOppdaterFriInntekt } from '@hooks/mutations/useOppdaterFriInntekt'

function InntektRad({ ya }: { ya: Yrkesaktivitet }) {
    const [edit, setEdit] = React.useState(false)
    const [inntekt, setInntekt] = React.useState(ya.inntekt)
    const { mutate: oppdaterInntekt, isPending: oppdaterIsPending } = useOppdaterFriInntekt()

    return (
        <Table.Row>
            <Table.DataCell>{getInntektsforholdDisplayText(ya.kategorisering)}</Table.DataCell>
            <Table.DataCell>
                {ya.inntektData?.omregnetÅrsinntekt.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}
            </Table.DataCell>
            <Table.DataCell>
                {edit && (
                    <TextField
                        label=""
                        size="small"
                        disabled={!edit}
                        value={inntekt || ''}
                        onChange={(e) => {
                            const newInntekt = Number(e.target.value)
                            setInntekt(newInntekt)
                        }}
                    />
                )}
                {!edit &&
                    !oppdaterIsPending &&
                    ya.inntekt?.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK' })}
                {oppdaterIsPending && <Skeleton width={100} />}
            </Table.DataCell>
            <Table.DataCell>
                {!ya.inntektData?.omregnetÅrsinntekt && (
                    <>
                        {edit && (
                            <div className="flex gap-2">
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setEdit(false)
                                        oppdaterInntekt({ yrkesaktivitetId: ya.id, inntektRequest: { inntekt } })
                                    }}
                                >
                                    Lagre
                                </Button>
                                <Button
                                    variant="danger"
                                    size="small"
                                    onClick={() => {
                                        setEdit(false)
                                        setInntekt(ya.inntekt)
                                    }}
                                >
                                    Angre
                                </Button>
                            </div>
                        )}
                        {!edit && (
                            <Button size="small" variant="secondary" onClick={() => setEdit(true)}>
                                Rediger
                            </Button>
                        )}
                    </>
                )}
            </Table.DataCell>
        </Table.Row>
    )
}

export function InntekterTilFordeling(): ReactElement {
    const { data, isLoading } = useYrkesaktivitet()

    if (!data || isLoading) {
        return (
            <BoxNew padding="0">
                <Skeleton width="100%" height={200} />
            </BoxNew>
        )
    }
    return (
        <Table size="small">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Yrkesaktivitet</Table.HeaderCell>
                    <Table.HeaderCell>Inntekt</Table.HeaderCell>
                    <Table.HeaderCell>Manuell inntekt</Table.HeaderCell>
                    <Table.HeaderCell className="w-48">-</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((ya) => (
                    <InntektRad key={ya.id} ya={ya} />
                ))}
            </Table.Body>
        </Table>
    )
}
