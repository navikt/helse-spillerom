'use client'

import React from 'react'
import { Table } from '@navikt/ds-react'
import { TableBody, TableDataCell, TableRow } from '@navikt/ds-react/Table'

import { useTestpersoner } from '@hooks/queries/useTestpersoner'

export function TestpersonTabell(): React.ReactNode {
    const testpersoner = useTestpersoner()

    if (testpersoner.isLoading) {
        return <div>Loading...</div>
    }

    if (testpersoner.isError) {
        return <div>Error: {testpersoner.error.message}</div>
    }

    if (testpersoner.isSuccess) {
        const testpersonerMedPersonId = testpersoner.data.filter((person) => person.spilleromId !== null)

        return (
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
        )
    }

    return null
}
