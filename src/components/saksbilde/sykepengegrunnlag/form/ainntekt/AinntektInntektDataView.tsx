import React, { ReactElement } from 'react'
import { BodyShort, Detail, HStack, Table, VStack } from '@navikt/ds-react'

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
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell className="text-sm">Måned</Table.HeaderCell>
                        <Table.HeaderCell className="text-sm">Rapportert inntekt</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {Object.entries(inntektData.kildedata).map((e) => (
                        <Table.Row key={e[0]}>
                            <Table.DataCell className="text-sm">{e[0]}</Table.DataCell>
                            <Table.DataCell className="text-sm">{formaterBeløpKroner(e[1])}</Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </VStack>
    )
}
