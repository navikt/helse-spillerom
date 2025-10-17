import { ReactElement } from 'react'
import { HStack, BodyShort } from '@navikt/ds-react'
import { useSykepengegrunnlagV2 } from '@hooks/queries/useSykepengegrunnlagV2'

import {formaterBeløpKroner} from "@/mock-api/utils/formaterBeløp";

export function SykepengegrunnlagVisning(): ReactElement | null {
    const { data: sykepengegrunnlag } = useSykepengegrunnlagV2()

    // Vis ikke hvis det ikke er satt sykepengegrunnlag
    if (!sykepengegrunnlag) {
        return null
    }

    return (
        <HStack justify="space-between">
            <BodyShort size="small">Sykepengegrunnlag:</BodyShort>
            <BodyShort size="small">{formaterBeløpKroner(sykepengegrunnlag.sykepengegrunnlag)}</BodyShort>
        </HStack>
    )
}
