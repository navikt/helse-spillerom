import { ReactElement } from 'react'
import { BodyShort, HStack } from '@navikt/ds-react'
import { BriefcaseIcon } from '@navikt/aksel-icons'

import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'
import { YrkesaktivitetKategorisering, maybeOrgnummer } from '@schemas/yrkesaktivitetKategorisering'

function getKategoriseringTekst(kategorisering: YrkesaktivitetKategorisering, medOrgnummer: boolean): ReactElement {
    switch (kategorisering.inntektskategori) {
        case 'ARBEIDSTAKER': {
            const orgNr = maybeOrgnummer(kategorisering)
            if (!orgNr) {
                return <>Arbeidstaker</>
            }
            return <Organisasjonsnavn orgnummer={orgNr} medOrgnummer={medOrgnummer} />
        }
        case 'FRILANSER': {
            const orgNr = maybeOrgnummer(kategorisering)
            if (!orgNr) {
                return <>Frilanser</>
            }
            return (
                <>
                    Frilanser hos <Organisasjonsnavn orgnummer={orgNr} />
                </>
            )
        }
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
    kategorisering: YrkesaktivitetKategorisering
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
