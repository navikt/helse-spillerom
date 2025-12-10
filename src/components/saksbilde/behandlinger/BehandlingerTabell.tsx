'use client'

import { ReactElement } from 'react'
import { Table, BodyShort, Link } from '@navikt/ds-react'
import { useRouter } from 'next/navigation'

import { useBehandlinger } from '@hooks/queries/useBehandlinger'
import { getFormattedDateString } from '@utils/date-format'
import { StatusTag } from '@components/statustag/StatusTag'
import { usePersonRouteParams } from '@hooks/useRouteParams'

export function BehandlingerTabell(): ReactElement {
    const router = useRouter()
    const { data: perioder, isLoading, isError } = useBehandlinger()
    const { personId } = usePersonRouteParams()

    if (isLoading) return <BodyShort>Laster behandlinger...</BodyShort>
    if (isError || !perioder) return <BodyShort>Kunne ikke laste behandlinger</BodyShort>
    if (perioder.length === 0) return <BodyShort>Ingen behandlinger funnet</BodyShort>

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Periode</Table.HeaderCell>
                    <Table.HeaderCell>Opprettet</Table.HeaderCell>
                    <Table.HeaderCell>Opprettet av</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {perioder.map((periode) => (
                    <Table.Row key={periode.id}>
                        <Table.DataCell>
                            <StatusTag periode={periode} size="medium" />
                        </Table.DataCell>

                        <Table.DataCell>
                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    router.push(`/person/${personId}/${periode.id}`)
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
