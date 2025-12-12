import { ReactElement } from 'react'
import { BodyShort, HStack } from '@navikt/ds-react'
import { BriefcaseIcon } from '@navikt/aksel-icons'

import { maybeOrgnummer, YrkesaktivitetKategorisering } from '@schemas/yrkesaktivitetKategorisering'
import { OrgMedCopyButton } from '@components/organisasjon/OrgMedCopyButton'

function getKategoriseringTekst(
    kategorisering: YrkesaktivitetKategorisering,
    maybeOrgnavn: string | null,
    medOrgnummer: boolean,
): ReactElement {
    const orgnummer = maybeOrgnummer(kategorisering)
    const orgnavn = maybeOrgnavn ?? 'ukjent organisasjon'

    switch (kategorisering.inntektskategori) {
        case 'ARBEIDSTAKER':
            if (!orgnummer) return <>Arbeidstaker</>
            if (medOrgnummer) return <OrgMedCopyButton orgnummer={orgnummer} orgnavn={orgnavn} />
            return <>{orgnavn}</>
        case 'FRILANSER':
            if (!orgnummer) return <>Frilanser</>
            if (medOrgnummer) return <OrgMedCopyButton orgnummer={orgnummer} orgnavn={`Frilanser hos ${orgnavn}`} />
            return <>Frilanser hos {orgnavn}</>
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

interface NavnOgIkonProps {
    kategorisering: YrkesaktivitetKategorisering
    orgnavn: string | null
    className?: string
    medOrgnummer?: boolean
}

export function NavnOgIkon({
    kategorisering,
    orgnavn,
    className,
    medOrgnummer = false,
}: NavnOgIkonProps): ReactElement {
    return (
        <HStack gap="2" className={className} wrap={false}>
            <BriefcaseIcon aria-hidden fontSize="1.5rem" />
            <BodyShort as="span">{getKategoriseringTekst(kategorisering, orgnavn, medOrgnummer)}</BodyShort>
        </HStack>
    )
}
