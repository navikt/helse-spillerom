import { BodyShort, Detail, Table, TextField } from '@navikt/ds-react'
import React from 'react'

import { useInntekter } from '@hooks/queries/useInntekter'
import { TableCell } from '@components/sykepengegrunnlag/TableCell'

import styles from './SykepengegrunnlagPanel.module.css'

export const Sykepengegrunnlag = () => {
    const { data: inntekter } = useInntekter()

    return (
        <div>
            <Table className={styles.Table}>
                <Table.Header>
                    <Table.Row>
                        <HeaderCellBold />
                        <HeaderCellBold text="Inntektsgrunnlag" />
                        <HeaderCellBold text="Sammenligningsgr." />
                        <HeaderCellBold text="Skjønnsfastsatt" />
                    </Table.Row>
                    <Table.Row>
                        <HeaderCellText text="Inntektskilde" />
                        <HeaderCellText text="Omregnet årsinntekt" />
                        <HeaderCellText text="Rapportert årsinntekt" />
                        <HeaderCellText text="Sykepengegrunnlag" />
                    </Table.Row>
                </Table.Header>
                <Table.Body className={styles.InntektsgrunnlagTableBody}>
                    {inntekter?.map((inntekt) => (
                        <Table.Row key={inntekt.id}>
                            <Table.DataCell>{inntekt.orgnavn || inntekt.inntektstype}</Table.DataCell>
                            <Table.DataCell>
                                <TextField size="small" label=""></TextField>
                            </Table.DataCell>
                            <Table.DataCell>
                                <TextField size="small" label=""></TextField>
                            </Table.DataCell>
                            <Table.DataCell>
                                <TextField size="small" label=""></TextField>
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
                <tfoot>
                    <Table.Row>
                        <Table.DataCell>
                            <BodyShort weight="semibold">Total</BodyShort>
                        </Table.DataCell>
                        <TableCell content={<BodyShort weight="semibold">-</BodyShort>} />
                        <TableCell content={<BodyShort weight="semibold">-</BodyShort>} />
                        <TableCell content={<BodyShort weight="semibold">-</BodyShort>} />
                    </Table.Row>
                </tfoot>
            </Table>
        </div>
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

interface HeaderCellTextProps {
    text: string
}

const HeaderCellText = ({ text }: HeaderCellTextProps) => (
    <Table.HeaderCell>
        <Detail textColor="subtle">{text}</Detail>
    </Table.HeaderCell>
)
