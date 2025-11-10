'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Table, Link, Button } from '@navikt/ds-react'
import { TableBody, TableDataCell, TableRow } from '@navikt/ds-react/Table'

import { useTestpersoner } from '@hooks/queries/useTestpersoner'
import { useNullstillSession } from '@hooks/mutations/useNullstillSession'

interface TestpersonTabellProps {
    onClose?: () => void
}

export function TestpersonTabell({ onClose }: TestpersonTabellProps): React.ReactNode {
    const router = useRouter()
    const testpersoner = useTestpersoner()
    const nullstillSession = useNullstillSession()

    const handleTestscenarioerClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (onClose) {
            onClose()
        }
        // Bruk setTimeout for å sikre at modalen lukkes før navigasjon
        setTimeout(() => {
            router.push('/testscenarioer')
        }, 0)
    }

    if (testpersoner.isLoading) {
        return <div>Loading...</div>
    }

    if (testpersoner.isError) {
        return <div>Error: {testpersoner.error.message}</div>
    }

    if (testpersoner.isSuccess) {
        const testpersonerMedPersonId = testpersoner.data.filter((person) => person.spilleromId !== null)

        return (
            <>
                <div className="mb-4 flex gap-4">
                    <Link href="#" onClick={handleTestscenarioerClick}>
                        Se testscenarier
                    </Link>
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => nullstillSession.mutate()}
                        loading={nullstillSession.isPending}
                    >
                        Nullstill session
                    </Button>
                </div>
                <Table className="w-full">
                    <TableBody>
                        {testpersonerMedPersonId.map((person) => (
                            <TableRow
                                key={person.fnr}
                                className="hover:cursor-pointer"
                                onClick={() => {
                                    window.location.href = `/person/${person.spilleromId}`
                                }}
                            >
                                <TableDataCell>{person.navn}</TableDataCell>
                                <TableDataCell>{person.fnr}</TableDataCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </>
        )
    }

    return null
}
