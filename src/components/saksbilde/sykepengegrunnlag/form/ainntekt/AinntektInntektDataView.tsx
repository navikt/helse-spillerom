import React, { ReactElement } from 'react'
import { BodyShort, Detail, HStack, Table, VStack } from '@navikt/ds-react'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'

import { ArbeidstakerAinntekt, FrilanserAinntekt } from '@schemas/inntektData'
import { formaterBeløpKroner } from '@schemas/sykepengegrunnlag'
import { TagFor } from '@components/saksbilde/sykepengegrunnlag/form/TagFor'

export function AinntektInntektDataView({
    inntektData,
}: {
    inntektData: FrilanserAinntekt | ArbeidstakerAinntekt
}): ReactElement {
    return (
        <VStack gap="4">
            <Detail>Inntektene er hentet fra a-inntekt 8-28 siste 3 måneder</Detail>

            <VStack gap="1">
                <BodyShort weight="semibold">Årsinntekt</BodyShort>
                <HStack gap="2">
                    <BodyShort className="w-[103px] text-right">
                        {formaterBeløpKroner(inntektData.omregnetÅrsinntekt)}
                    </BodyShort>
                    {TagFor['AINNTEKT']}
                </HStack>
            </VStack>
            <Table size="small">
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell className="text-sm">Måned</TableHeaderCell>
                        <TableHeaderCell className="text-sm">Rapportert inntekt</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(inntektData.kildedata).map((e) => (
                        <TableRow key={e[0]} className="odd:bg-ax-bg-default even:bg-ax-bg-accent-soft">
                            <TableDataCell className="text-sm">{e[0]}</TableDataCell>
                            <TableDataCell className="text-sm">{formaterBeløpKroner(e[1])}</TableDataCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </VStack>
    )
}
