import { ReactElement } from 'react'
import { BodyShort, HStack } from '@navikt/ds-react'
import { BriefcaseIcon } from '@navikt/aksel-icons'

import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'

function getKategoriseringTekst(
    kategorisering: Record<string, string | string[]>,
    medOrgnummer: boolean,
): ReactElement {
    const kategori = kategorisering['INNTEKTSKATEGORI']
    const orgnummer = kategorisering['ORGNUMMER'] as string

    switch (kategori) {
        case 'ARBEIDSTAKER':
            return <Organisasjonsnavn orgnummer={orgnummer} medOrgnummer={medOrgnummer} />
        case 'FRILANSER':
            return (
                <>
                    Frilanser hos <Organisasjonsnavn orgnummer={orgnummer} />
                </>
            )
        case 'SELVSTENDIG_NÆRINGSDRIVENDE':
            return <>Selvstendig næringsdrivende</>
        case 'ARBEIDSLEDIG':
            return <>Arbeidsledig</>
        case 'INAKTIV':
            return <>Inaktiv</>
        default:
            return <>Ukjent</>
    }
}

export function NavnOgIkon({
    kategorisering,
    className,
    medOrgnummer = false,
}: {
    kategorisering: Record<string, string | string[]>
    className?: string
    medOrgnummer?: boolean
}): ReactElement {
    return (
        <HStack gap="2" className={className} wrap={false}>
            <BriefcaseIcon aria-hidden fontSize="1.5rem" />
            <BodyShort>{getKategoriseringTekst(kategorisering, medOrgnummer)}</BodyShort>
        </HStack>
    )
}
