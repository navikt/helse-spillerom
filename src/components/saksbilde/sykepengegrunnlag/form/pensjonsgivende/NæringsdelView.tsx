import React, { ReactElement } from 'react'
import { Table } from '@navikt/ds-react'

import { Næringsdel } from '@schemas/sykepengegrunnlag'
import { formaterBeløpKroner } from '@schemas/øreUtils'

type NæringsdelViewProps = {
    næringsdel?: Næringsdel | null
}

export function NæringsdelView({ næringsdel }: NæringsdelViewProps): ReactElement {
    if (!næringsdel) {
        return <></>
    }
    return (
        <>
            <Table size="small">
                <Table.Body>
                    <Table.Row>
                        <Table.DataCell className="text-sm">Pensjonsgivende inntekt 6G begrenset</Table.DataCell>
                        <Table.DataCell className="text-sm"></Table.DataCell>
                        <Table.DataCell className="text-sm">
                            {' '}
                            {formaterBeløpKroner(næringsdel.pensjonsgivendeÅrsinntekt6GBegrenset)}
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell className="text-sm">Sum av arbeids og frilans inntekter</Table.DataCell>
                        <Table.DataCell className="text-sm">-</Table.DataCell>
                        <Table.DataCell className="text-sm">
                            {formaterBeløpKroner(næringsdel.sumAvArbeidsinntekt)}
                        </Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell className="text-sm font-semibold">Næringsdel</Table.DataCell>
                        <Table.DataCell className="text-sm font-semibold">=</Table.DataCell>
                        <Table.DataCell className="text-sm font-semibold">
                            {formaterBeløpKroner(næringsdel.næringsdel)}
                        </Table.DataCell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </>
    )
}
