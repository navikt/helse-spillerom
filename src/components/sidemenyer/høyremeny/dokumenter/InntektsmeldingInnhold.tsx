import { PropsWithChildren, ReactElement } from 'react'
import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react'
import { BriefcaseIcon } from '@navikt/aksel-icons'

import { Inntektsmelding } from '@schemas/inntektsmelding'
import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date-format'
import { formaterBeløpKroner } from '@schemas/øreUtils'
import { useDokumentVisningContext } from '@/app/person/[personId]/dokumentVisningContext'

export function InntektsmeldingInnhold({ inntektsmelding }: { inntektsmelding: Inntektsmelding }): ReactElement {
    const { dokumentStateMap, selectDokument } = useDokumentVisningContext()
    const { isSelected = false, showSelectButton = false } = dokumentStateMap[inntektsmelding.inntektsmeldingId]

    return (
        <VStack
            gap="4"
            role="region"
            aria-label={`Innhold for inntektsmelding mottat: ${getFormattedDatetimeString(inntektsmelding.mottattDato)}`}
        >
            <HStack gap="2" wrap={false}>
                <BriefcaseIcon aria-hidden fontSize="1.5rem" />
                {inntektsmelding.virksomhetsnummer ? (
                    <BodyShort>
                        <Organisasjonsnavn orgnummer={inntektsmelding.virksomhetsnummer} />
                    </BodyShort>
                ) : (
                    'Arbeidstaker'
                )}
            </HStack>

            <Details label="Virksomhetsnummer">{inntektsmelding.virksomhetsnummer}</Details>
            <Details label="Arbeidsforhold-id">{inntektsmelding.arbeidsforholdId}</Details>
            <Details label="Bestemmende fraværsdag">
                {inntektsmelding.foersteFravaersdag ? getFormattedDateString(inntektsmelding.foersteFravaersdag) : '-'}
            </Details>
            {/*<Details label="Arbeidsgiverperioder">{inntektsmelding.arbeids}</Details>*/}
            <Details label="Brutto utbetalt i AGP">{formaterBeløpKroner(inntektsmelding.bruttoUtbetalt)}</Details>
            <Details label="Beregnet inntekt">{formaterBeløpKroner(inntektsmelding.beregnetInntekt)}</Details>
            {/*<Details label="Refusjon">{inntektsmelding.refusjon}</Details>*/}
            <Details label="Innsender fullt navn">{inntektsmelding.innsenderFulltNavn}</Details>
            <Details label="Innsender telefon">{inntektsmelding.innsenderTelefon}</Details>
            <Details label="Avsendersystem">{inntektsmelding.avsenderSystem?.navn}</Details>
            {showSelectButton && (
                <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={() => selectDokument(inntektsmelding.inntektsmeldingId)}
                    disabled={isSelected}
                >
                    {isSelected ? 'Valgt' : 'Velg'}
                </Button>
            )}
        </VStack>
    )
}

function Details({ label, children }: PropsWithChildren<{ label: string }>): ReactElement {
    return (
        <VStack gap="1">
            <BodyShort weight="semibold" size="small">
                {label}
            </BodyShort>
            <BodyShort size="small">{children || '-'}</BodyShort>
        </VStack>
    )
}
