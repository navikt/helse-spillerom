import { ReactElement } from 'react'
import { VStack, HStack, BodyShort } from '@navikt/ds-react'
import { BriefcaseIcon, PersonIcon } from '@navikt/aksel-icons'

import { useUtbetalingsberegning } from '@hooks/queries/useUtbetalingsberegning'
import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'
import { usePersoninfo } from '@hooks/queries/usePersoninfo'
import { useOrganisasjonsnavn } from '@hooks/queries/useOrganisasjonsnavn'
import { beregnUtbetalingssum, formaterUtbetalingssum } from '@utils/utbetalingsberegning'
import { formaterBeløpØre } from '@/schemas/sykepengegrunnlag'

interface ArbeidsgiverRadProps {
    orgnummer: string
    refusjon: string
}

function ArbeidsgiverRad({ orgnummer, refusjon }: ArbeidsgiverRadProps): ReactElement {
    const { data: organisasjonsnavn } = useOrganisasjonsnavn(orgnummer)

    return (
        <HStack justify="space-between">
            <HStack gap="2" align="center">
                <BriefcaseIcon aria-hidden fontSize="1rem" />
                <BodyShort size="small">{organisasjonsnavn || orgnummer}</BodyShort>
            </HStack>
            <BodyShort size="small">{refusjon}</BodyShort>
        </HStack>
    )
}

export function Utbetalingsinformasjon(): ReactElement {
    const { data: utbetalingsberegning } = useUtbetalingsberegning()
    const { data: yrkesaktivitet } = useYrkesaktivitet()
    const { data: personinfo } = usePersoninfo()

    // Beregn utbetalinger
    const utbetalingssum = beregnUtbetalingssum(utbetalingsberegning, yrkesaktivitet)
    const formatertUtbetalingssum = formaterUtbetalingssum(utbetalingssum)
    // Summert total fra utbetalingssum
    const totalUtbetaling =
        formatertUtbetalingssum.arbeidsgivere.reduce((acc, arbeidsgiver) => acc + arbeidsgiver.refusjonØre, 0) +
        utbetalingssum.direkteUtbetalingØre
    if (totalUtbetaling === 0) {
        return <></>
    }
    return (
        <div>
            <VStack gap="3">
                <HStack justify="space-between">
                    <BodyShort weight="semibold" size="small">
                        Beløp for perioden
                    </BodyShort>

                    <BodyShort weight="semibold" size="small">
                        {formaterBeløpØre(totalUtbetaling)}
                    </BodyShort>
                </HStack>

                {/* Vis arbeidsgivere med refusjonsutbetaling */}
                {formatertUtbetalingssum.arbeidsgivere.map((arbeidsgiver) => (
                    <ArbeidsgiverRad
                        key={arbeidsgiver.orgnummer}
                        orgnummer={arbeidsgiver.orgnummer}
                        refusjon={arbeidsgiver.refusjon}
                    />
                ))}

                {/* Vis direkteutbetaling til person */}
                {utbetalingssum.direkteUtbetalingØre > 0 && (
                    <HStack justify="space-between">
                        <HStack gap="2" align="center">
                            <PersonIcon aria-hidden fontSize="1rem" />
                            <BodyShort size="small">{personinfo?.navn || 'Ukjent person'}</BodyShort>
                        </HStack>
                        <BodyShort size="small">{formatertUtbetalingssum.direkteUtbetaling}</BodyShort>
                    </HStack>
                )}
            </VStack>
        </div>
    )
}
