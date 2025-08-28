import { ReactElement } from 'react'
import { HStack, BodyShort } from '@navikt/ds-react'

import { useSykepengegrunnlag } from '@hooks/queries/useSykepengegrunnlag'
import { formaterBeløpØre } from '@/schemas/sykepengegrunnlag'

export function SykepengegrunnlagVisning(): ReactElement | null {
    const { data: sykepengegrunnlag } = useSykepengegrunnlag()

    // Vis ikke hvis det ikke er satt sykepengegrunnlag
    if (!sykepengegrunnlag) {
        return null
    }

    return (
        <HStack justify="space-between">
            <BodyShort size="small">Sykepengegrunnlag:</BodyShort>
            <BodyShort size="small">{formaterBeløpØre(sykepengegrunnlag.sykepengegrunnlagØre)}</BodyShort>
        </HStack>
    )
}
