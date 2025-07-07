'use client'

import React from 'react'
import { Table } from '@navikt/ds-react'
import { TableBody, TableDataCell, TableRow } from '@navikt/ds-react/Table'

import { useTestdata } from '@hooks/queries/useTestdata'

export function TestpersonTabell(): React.ReactNode {
    const testdata = useTestdata()

    if (testdata.isLoading) {
        return <div>Loading...</div>
    }

    if (testdata.isError) {
        return <div>Error: {testdata.error.message}</div>
    }

    if (testdata.isSuccess) {
        return (
            <Table className="w-full">
                <TableBody>
                    {testdata.data.map((person) => (
                        <TableRow
                            key={person.fnr}
                            className="hover:cursor-pointer"
                            onClick={() => {
                                window.location.href = `/person/${person.personId}`
                            }}
                        >
                            <TableDataCell>{person.personinfo.navn}</TableDataCell>
                            <TableDataCell>{person.fnr}</TableDataCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    return null
}
