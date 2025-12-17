import { ReactElement } from 'react'
import { BodyShort, HStack, VStack } from '@navikt/ds-react'
import { BriefcaseIcon, PersonIcon } from '@navikt/aksel-icons'

import { useUtbetalingsberegning } from '@hooks/queries/useUtbetalingsberegning'
import { usePersoninfo } from '@hooks/queries/usePersoninfo'
import { useOrganisasjonsnavn } from '@hooks/queries/useOrganisasjonsnavn'
import { formaterBeløpØre } from '@schemas/pengerUtils'

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
                <BodyShort data-sensitive size="small">
                    {organisasjonsnavn || orgnummer}
                </BodyShort>
            </HStack>
            <BodyShort size="small">{refusjon}</BodyShort>
        </HStack>
    )
}

export function BeløpForPerioden(): ReactElement {
    const { data: utbetalingsberegning } = useUtbetalingsberegning()
    const { data: personinfo } = usePersoninfo()

    // Hent oppdrag fra spilleromOppdrag
    const oppdrag = utbetalingsberegning?.beregningData?.spilleromOppdrag?.oppdrag || []

    // Filtrer oppdrag basert på fagområde
    const personUtbetalinger = oppdrag.filter((oppdrag) => oppdrag.fagområde === 'SP')
    const arbeidsgiverUtbetalinger = oppdrag.filter((oppdrag) => oppdrag.fagområde === 'SPREF')

    // Beregn total beløp ved å bruke totalbeløp direkte fra oppdragene
    const totalPersonUtbetaling = personUtbetalinger.reduce((sum, oppdrag) => sum + oppdrag.totalbeløp, 0)
    const totalArbeidsgiverUtbetaling = arbeidsgiverUtbetalinger.reduce((sum, oppdrag) => sum + oppdrag.totalbeløp, 0)
    const totalUtbetaling = totalPersonUtbetaling + totalArbeidsgiverUtbetaling

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
                        {formaterBeløpØre(totalUtbetaling * 100)}
                    </BodyShort>
                </HStack>

                {/* Vis arbeidsgivere med refusjonsutbetaling */}
                {arbeidsgiverUtbetalinger.map((oppdrag) => (
                    <ArbeidsgiverRad
                        key={oppdrag.mottaker}
                        orgnummer={oppdrag.mottaker}
                        refusjon={formaterBeløpØre(oppdrag.totalbeløp * 100)}
                    />
                ))}

                {/* Vis direkteutbetaling til person */}
                {totalPersonUtbetaling > 0 && (
                    <HStack justify="space-between">
                        <HStack gap="2" align="center">
                            <PersonIcon aria-hidden fontSize="1rem" />
                            <BodyShort data-sensitive size="small">
                                {personinfo?.navn || 'Ukjent person'}
                            </BodyShort>
                        </HStack>
                        <BodyShort size="small">{formaterBeløpØre(totalPersonUtbetaling * 100)}</BodyShort>
                    </HStack>
                )}
            </VStack>
        </div>
    )
}
