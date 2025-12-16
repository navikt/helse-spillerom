import React, { ReactElement } from 'react'
import { Bleed, BodyShort, BoxNew, HStack, Table, VStack } from '@navikt/ds-react'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'
import { capitalize } from 'remeda'

import { ArbeidstakerAinntekt, FrilanserAinntekt } from '@schemas/inntektData'
import { formaterBeløpKroner } from '@schemas/pengerUtils'
import { InntektTag } from '@components/ikoner/kilde/kildeTags'
import { getFormattedMonthYear } from '@utils/date-format'

export function AinntektInntektDataView({
    inntektData,
}: {
    inntektData: FrilanserAinntekt | ArbeidstakerAinntekt
}): ReactElement {
    return (
        <VStack>
            <HStack gap="2" align="center">
                <BodyShort weight="semibold">Rapportert siste 3 måneder</BodyShort>
                {InntektTag['AINNTEKT']}
            </HStack>
            <Bleed marginInline="2" asChild>
                <BoxNew>
                    <Table size="small">
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell className="w-80" />
                                <TableHeaderCell className="w-24 text-ax-medium">§ 8-28</TableHeaderCell>
                                <TableHeaderCell />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="odd:bg-ax-bg-default even:bg-ax-bg-accent-soft">
                                <TableDataCell className="text-ax-medium font-semibold">
                                    Gjennomsnitt siste 3 måneder
                                </TableDataCell>
                                <TableDataCell className="text-right text-ax-medium">
                                    {formaterBeløpKroner(gjennomsnitt(inntektData))}
                                </TableDataCell>
                                <TableDataCell />
                            </TableRow>
                            {Object.entries(inntektData.kildedata).map((e) => (
                                <TableRow key={e[0]} className="odd:bg-ax-bg-default even:bg-ax-bg-accent-soft">
                                    <TableDataCell className="text-ax-medium font-semibold">
                                        {capitalize(getFormattedMonthYear(e[0]))}
                                    </TableDataCell>
                                    <TableDataCell className="text-right text-ax-medium">
                                        {formaterBeløpKroner(e[1])}
                                    </TableDataCell>
                                    <TableDataCell />
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </BoxNew>
            </Bleed>
        </VStack>
    )
}

function gjennomsnitt(inntektData: FrilanserAinntekt | ArbeidstakerAinntekt) {
    const values = Object.values(inntektData.kildedata)
    if (values.length === 0) return 0
    const sum = values.reduce((acc, val) => acc + val, 0)
    return sum / values.length
}
