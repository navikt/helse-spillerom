import React, { ReactElement, useEffect } from 'react'
import { Alert, Bleed, BodyShort, BoxNew, HStack, Skeleton, Table, VStack } from '@navikt/ds-react'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'

import { useAinntektYrkesaktivitet } from '@hooks/queries/useAinntektYrkesaktivitet'
import { AinntektInntektDataView } from '@components/saksbilde/sykepengegrunnlag/form/ainntekt/AinntektInntektDataView'
import { FetchError } from '@components/saksbilde/FetchError'
import { InntektTag } from '@components/ikoner/kilde/kildeTags'

interface VisAinntektProps {
    yrkesaktivitetId: string
    setValue: (name: 'data.årsinntekt', value: number) => void
}

export function VisAinntekt({ yrkesaktivitetId, setValue }: VisAinntektProps): ReactElement {
    const { data, isLoading, isError, refetch } = useAinntektYrkesaktivitet(yrkesaktivitetId)

    useEffect(() => {
        if (data?.success) {
            setValue('data.årsinntekt', data.data.omregnetÅrsinntekt ?? 0)
        }
    }, [data, setValue])

    if (isLoading) return <VisAinntektSkeleton />

    if (isError || !data) return <FetchError refetch={refetch} message="Kunne ikke hente a-inntekt." />

    if (!data.success) {
        return (
            <Alert variant="warning" size="small">
                {data.feilmelding}
            </Alert>
        )
    }

    return <AinntektInntektDataView inntektData={data.data} />
}

function VisAinntektSkeleton(): ReactElement {
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
                                    <Skeleton width={180} height={24} />
                                </TableDataCell>
                                <TableDataCell />
                            </TableRow>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <TableRow key={index} className="odd:bg-ax-bg-default even:bg-ax-bg-accent-soft">
                                    <TableDataCell className="text-ax-medium font-semibold">
                                        <Skeleton width={180} height={24} />
                                    </TableDataCell>
                                    <TableDataCell className="text-right text-ax-medium">
                                        <Skeleton width={180} height={24} />
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
