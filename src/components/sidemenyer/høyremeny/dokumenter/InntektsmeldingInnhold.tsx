import { PropsWithChildren, ReactElement } from 'react'
import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react'
import { BriefcaseIcon } from '@navikt/aksel-icons'

import {
    EndringIRefusjon,
    GjenopptakelseNaturalytelse,
    InntektEndringÅrsak,
    Inntektsmelding,
    OpphørAvNaturalYtelse,
    Periode,
    Refusjon as RefusjonType,
} from '@schemas/inntektsmelding'
import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date-format'
import { formaterBeløpKroner } from '@schemas/øreUtils'
import { useDokumentVisningContext } from '@/app/person/[pseudoId]/dokumentVisningContext'
import { Maybe, notNull } from '@utils/tsUtils'

export function InntektsmeldingInnhold({ inntektsmelding }: { inntektsmelding: Inntektsmelding }): ReactElement {
    const { dokumentStateMap, selectDokument } = useDokumentVisningContext()
    const { isSelected = false, showSelectButton = false } = dokumentStateMap?.[inntektsmelding.inntektsmeldingId] ?? {}

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
                    'Arbeidsgiver'
                )}
            </HStack>

            <Details label="Virksomhetsnummer">{inntektsmelding.virksomhetsnummer}</Details>
            <Details label="Arbeidsforhold-id">{inntektsmelding.arbeidsforholdId}</Details>
            <InntektEndringsÅrsaker årsaker={inntektsmelding.inntektEndringAarsaker ?? []} />
            {inntektsmelding.foersteFravaersdag && (
                <Details label="Bestemmende fraværsdag">
                    {getFormattedDateString(inntektsmelding.foersteFravaersdag)}
                </Details>
            )}
            <Perioder label="Arbeidsgiverperioder" perioder={inntektsmelding.arbeidsgiverperioder ?? []} />
            {inntektsmelding.bruttoUtbetalt && (
                <Details label="Brutto utbetalt i AGP">{formaterBeløpKroner(inntektsmelding.bruttoUtbetalt)}</Details>
            )}
            {inntektsmelding.begrunnelseForReduksjonEllerIkkeUtbetalt && (
                <Details label="Begrunnelse for reduksjon eller ikke utbetalt">
                    {begrunnelseForReduksjonEllerIkkeUtbetaltMapper(
                        inntektsmelding.begrunnelseForReduksjonEllerIkkeUtbetalt,
                    )}
                </Details>
            )}
            {inntektsmelding.beregnetInntekt && (
                <Details label="Beregnet inntekt">
                    Beløp pr mnd: {formaterBeløpKroner(inntektsmelding.beregnetInntekt)}
                </Details>
            )}
            <Refusjon refusjon={inntektsmelding.refusjon} />
            <EndringIRefusjoner endringer={inntektsmelding.endringIRefusjoner ?? []} />
            <Perioder label="Ferieperioder" perioder={inntektsmelding.ferieperioder ?? []} />
            <Naturalytelser
                label="Opphør av naturalytelser"
                naturalytelser={inntektsmelding.opphoerAvNaturalytelser ?? []}
            />
            <Naturalytelser
                label="Gjenopptakelse naturalytelser"
                naturalytelser={inntektsmelding.gjenopptakelseNaturalytelser ?? []}
            />
            {inntektsmelding.naerRelasjon && (
                <Details label="Nær relasjon">{inntektsmelding.naerRelasjon ? 'Ja' : 'Nei'}</Details>
            )}
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

export function Details({ label, children }: PropsWithChildren<{ label: string }>): Maybe<ReactElement> {
    if (children == null) return null

    return (
        <VStack gap="1">
            <BodyShort weight="semibold" size="small">
                {label}
            </BodyShort>
            <BodyShort size="small">{children}</BodyShort>
        </VStack>
    )
}

function InntektEndringsÅrsaker({ årsaker }: { årsaker: InntektEndringÅrsak[] }): Maybe<ReactElement> {
    if (årsaker.length === 0) return null
    return (
        <VStack gap="1">
            <BodyShort weight="semibold" size="small">
                Endringsårsaker
            </BodyShort>
            <ul className="[&_li:not(:last-child)]:mb-1">
                {årsaker.map((årsak, i) => (
                    <li className="ml-4 list-item list-disc" key={i}>
                        <VStack gap="1-alt">
                            <BodyShort size="small">{årsakmapper(årsak.aarsak)}</BodyShort>
                            {årsak.perioder && (
                                <VStack>
                                    <BodyShort size="small">Perioder: </BodyShort>
                                    <div>
                                        {årsak.perioder.map((periode, j) => (
                                            <BodyShort key={j} size="small">
                                                {getFormattedDateString(periode.fom)} –{' '}
                                                {periode.tom && getFormattedDateString(periode.tom)}
                                            </BodyShort>
                                        ))}
                                    </div>
                                </VStack>
                            )}
                            {årsak.gjelderFra && (
                                <BodyShort size="small">
                                    Gjelder fra: {getFormattedDateString(årsak.gjelderFra)}
                                </BodyShort>
                            )}
                            {årsak.bleKjent && (
                                <BodyShort size="small">Ble kjent: {getFormattedDateString(årsak.bleKjent)}</BodyShort>
                            )}
                        </VStack>
                    </li>
                ))}
            </ul>
        </VStack>
    )
}

function Perioder({ label, perioder }: { label: string; perioder: Periode[] }): Maybe<ReactElement> {
    if (perioder.length === 0) return null

    return (
        <VStack gap="1">
            <BodyShort weight="semibold" size="small">
                {label}
            </BodyShort>
            {perioder.map((periode, i) => (
                <BodyShort key={i} size="small">
                    {getFormattedDateString(periode.fom)} – {periode.tom && getFormattedDateString(periode.tom)}
                </BodyShort>
            ))}
        </VStack>
    )
}

function EndringIRefusjoner({ endringer }: { endringer: EndringIRefusjon[] }): Maybe<ReactElement> {
    if (endringer.length === 0) return null
    return (
        <VStack gap="1">
            <BodyShort weight="semibold" size="small">
                Endring i refusjon
            </BodyShort>
            <VStack gap="1-alt">
                {endringer.map((endring, i) => (
                    <VStack key={i}>
                        {endring.endringsdato && (
                            <BodyShort size="small">
                                Endringsdato: {getFormattedDateString(endring.endringsdato)}
                            </BodyShort>
                        )}
                        {notNull(endring.beloep) && (
                            <BodyShort size="small">Beløp pr mnd: {formaterBeløpKroner(endring.beloep)}</BodyShort>
                        )}
                    </VStack>
                ))}
            </VStack>
        </VStack>
    )
}

function Refusjon({ refusjon }: { refusjon: RefusjonType }): Maybe<ReactElement> {
    return (
        <VStack gap="1">
            <BodyShort weight="semibold" size="small">
                Refusjon
            </BodyShort>
            {notNull(refusjon.beloepPrMnd) && (
                <BodyShort size="small">Beløp pr mnd: {formaterBeløpKroner(refusjon.beloepPrMnd)}</BodyShort>
            )}
            {refusjon.opphoersdato && (
                <BodyShort size="small">Opphørsdato: {getFormattedDateString(refusjon.opphoersdato)}</BodyShort>
            )}
        </VStack>
    )
}

function Naturalytelser({
    label,
    naturalytelser,
}: {
    label: string
    naturalytelser: OpphørAvNaturalYtelse[] | GjenopptakelseNaturalytelse[]
}): Maybe<ReactElement> {
    if (naturalytelser.length === 0) return null
    const normalized = naturalytelser.map((ytelse) => ({
        naturalytelse: 'naturalytelse' in ytelse ? ytelse.naturalytelse : ytelse.naturalYtelse,
        fom: ytelse.fom,
        beloepPrMnd: ytelse.beloepPrMnd,
    }))
    return (
        <VStack gap="1">
            <BodyShort weight="semibold" size="small">
                {label}
            </BodyShort>
            {normalized.map((ytelse, i) => (
                <VStack key={i}>
                    {ytelse.naturalytelse && <BodyShort size="small">{ytelse.naturalytelse}</BodyShort>}
                    {ytelse.fom && <BodyShort size="small">Gjelder fra: {ytelse.fom}</BodyShort>}
                    {notNull(ytelse.beloepPrMnd) && (
                        <BodyShort size="small">Beløp pr mnd: {ytelse.beloepPrMnd}</BodyShort>
                    )}
                </VStack>
            ))}
        </VStack>
    )
}

function årsakmapper(aarsak: string): string {
    switch (aarsak) {
        case 'NyStilling':
            return 'Ny stilling'
        case 'NyStillingsprosent':
            return 'Ny stillingsprosent'
        case 'Sykefravaer':
            return 'Sykefravær'
        case 'VarigLonnsendring':
            return 'Varig lønnsendring'
    }
    return aarsak
}

function begrunnelseForReduksjonEllerIkkeUtbetaltMapper(begrunnelse: string): string {
    switch (begrunnelse) {
        case 'ArbeidOpphoert':
            return 'Arbeid opphørt'
        case 'BeskjedGittForSent':
            return 'Beskjed gitt for sent'
        case 'BetvilerArbeidsufoerhet':
            return 'Betviler arbeidsuførhet'
        case 'FerieEllerAvspasering':
            return 'Ferie eller avspasering'
        case 'FiskerMedHyre':
            return 'Fisker med hyre'
        case 'FravaerUtenGyldigGrunn':
            return 'Fravær uten gyldig grunn'
        case 'IkkeFravaer':
            return 'Ikke fravær'
        case 'IkkeFullStillingsandel':
            return 'Ikke full stillingsandel'
        case 'IkkeLoenn':
            return 'Ikke lønn'
        case 'LovligFravaer':
            return 'Lovlig fravær'
        case 'ManglerOpptjening':
            return 'Mangler opptjening'
        case 'Saerregler':
            return 'Særregler'
        case 'StreikEllerLockout':
            return 'Streik eller lockout'
        case 'TidligereVirksomhet':
            return 'Tidligere virksomhet'
    }
    return begrunnelse
}
