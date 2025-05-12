'use client'

import { ReactElement } from 'react'
import { Table, BodyShort, Link } from '@navikt/ds-react'
import { useRouter } from 'next/navigation'

import { useSaksbehandlingsperioder } from '@hooks/queries/useSaksbehandlingsperioder'
import { getFormattedDateString } from '@utils/date-format'

export function SaksbehandlingsperioderTabell(): ReactElement {
    const router = useRouter()
    const { data: perioder, isLoading, isError } = useSaksbehandlingsperioder()

    if (isLoading) return <BodyShort>Laster behandlingsperioder...</BodyShort>
    if (isError || !perioder) return <BodyShort>Kunne ikke laste behandlingsperioder</BodyShort>
    if (perioder.length === 0) return <BodyShort>Ingen behandlingsperioder funnet</BodyShort>

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Periode</Table.HeaderCell>
                    <Table.HeaderCell>Opprettet</Table.HeaderCell>
                    <Table.HeaderCell>Opprettet av</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {perioder.map((periode) => (
                    <Table.Row key={periode.id}>
                        <Table.DataCell>
                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    router.push(`/person/${periode.spilleromPersonId}/${periode.id}`)
                                }}
                            >
                                {getFormattedDateString(periode.fom)} - {getFormattedDateString(periode.tom)}
                            </Link>
                        </Table.DataCell>
                        <Table.DataCell>{getFormattedDateString(periode.opprettet)}</Table.DataCell>
                        <Table.DataCell>{periode.opprettetAvNavn}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}
