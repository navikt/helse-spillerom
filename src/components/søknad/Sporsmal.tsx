import React, { ReactElement } from 'react'
import { BodyShort, VStack } from '@navikt/ds-react'

import { Sporsmal } from '@/schemas/søknad'
import { getFormattedDateString } from '@utils/date-format'

import Avkrysset from './Avkrysset'

interface SpørsmålProps {
    spørsmål: Sporsmal[]
    rotnivå?: boolean
}

const skalVisesIOppsummering = (sporsmal: Sporsmal) => {
    switch (sporsmal.tag) {
        case 'ANSVARSERKLARING':
        case 'BEKREFT_OPPLYSNINGER':
        case 'VAER_KLAR_OVER_AT':
        case 'BEKREFT_OPPLYSNINGER_UTLAND_INFO':
        case 'IKKE_SOKT_UTENLANDSOPPHOLD_INFORMASJON':
        case 'TIL_SLUTT':
            return false
        default:
            return true
    }
}

const erUndersporsmalStilt = (sporsmal: Sporsmal): boolean => {
    if (!sporsmal.svar || sporsmal.svar.length === 0) return false
    if (sporsmal.kriterieForVisningAvUndersporsmal) {
        return sporsmal.svar.some((s) => s.verdi === sporsmal.kriterieForVisningAvUndersporsmal)
    }
    return sporsmal.svar.some((s) => s.verdi && s.verdi !== '')
}

export const Spørsmål = ({ spørsmål, rotnivå = true }: SpørsmålProps): ReactElement => {
    return (
        <>
            {spørsmål?.filter(skalVisesIOppsummering).map((it) => {
                const wrapperClass = rotnivå ? '' : 'ml-4'
                // RADIO_GRUPPE og RADIO_GRUPPE_TIMER_PROSENT
                if (
                    (it.svartype === 'RADIO_GRUPPE' || it.svartype === 'RADIO_GRUPPE_TIMER_PROSENT') &&
                    it.undersporsmal &&
                    it.undersporsmal.length > 0
                ) {
                    const valgteRadioer = it.undersporsmal.filter((us) => us.svar?.[0]?.verdi === 'CHECKED')
                    return (
                        <div key={it.tag} className={wrapperClass}>
                            <VStack gap="2">
                                <BodyShort size="small" className="font-bold">
                                    {it.sporsmalstekst ?? ''}
                                </BodyShort>
                                <SporsmalVarianter sporsmal={it} />
                                {valgteRadioer.map((radio) => (
                                    <div key={radio.id} className="ml-4">
                                        <VStack gap="2">
                                            {!(radio.svartype === 'CHECKBOX' || radio.svartype === 'RADIO') && (
                                                <BodyShort size="small" className="font-semibold text-gray-800">
                                                    {radio.sporsmalstekst}
                                                </BodyShort>
                                            )}
                                            <SporsmalVarianter sporsmal={radio} />
                                            {radio.undersporsmal && radio.undersporsmal.length > 0 && (
                                                <Spørsmål spørsmål={radio.undersporsmal} rotnivå={false} />
                                            )}
                                        </VStack>
                                    </div>
                                ))}
                            </VStack>
                        </div>
                    )
                }
                // CHECKBOX_GRUPPE
                if (it.svartype === 'CHECKBOX_GRUPPE' && it.undersporsmal && it.undersporsmal.length > 0) {
                    const valgteCheckboxer = it.undersporsmal.filter((us) => us.svar?.[0]?.verdi === 'CHECKED')
                    return (
                        <div key={it.tag} className={wrapperClass}>
                            <VStack gap="2">
                                <BodyShort size="small" className="font-bold">
                                    {it.sporsmalstekst ?? ''}
                                </BodyShort>
                                <SporsmalVarianter sporsmal={it} />
                                {valgteCheckboxer.map((checkbox) => (
                                    <div key={checkbox.id} className="ml-4">
                                        <VStack gap="2">
                                            {!(checkbox.svartype === 'CHECKBOX' || checkbox.svartype === 'RADIO') && (
                                                <BodyShort size="small" className="font-semibold text-gray-800">
                                                    {checkbox.sporsmalstekst}
                                                </BodyShort>
                                            )}
                                            <SporsmalVarianter sporsmal={checkbox} />
                                            {checkbox.undersporsmal && checkbox.undersporsmal.length > 0 && (
                                                <Spørsmål spørsmål={checkbox.undersporsmal} rotnivå={false} />
                                            )}
                                        </VStack>
                                    </div>
                                ))}
                            </VStack>
                        </div>
                    )
                }
                // GRUPPE_AV_UNDERSPORSMAL og IKKE_RELEVANT
                if (
                    (it.svartype === 'GRUPPE_AV_UNDERSPORSMAL' || it.svartype === 'IKKE_RELEVANT') &&
                    it.undersporsmal &&
                    it.undersporsmal.length > 0
                ) {
                    const besvarteUndersporsmal = it.undersporsmal.filter(
                        (us) => us.svar && us.svar.length > 0 && us.svar[0]?.verdi && us.svar[0]?.verdi !== '',
                    )
                    return (
                        <div key={it.tag} className={wrapperClass}>
                            <VStack gap="2">
                                <BodyShort size="small" className="font-bold">
                                    {it.sporsmalstekst ?? ''}
                                </BodyShort>
                                <SporsmalVarianter sporsmal={it} />
                                {besvarteUndersporsmal.map((us) => (
                                    <div key={us.id} className="ml-4">
                                        <VStack gap="2">
                                            {!(us.svartype === 'CHECKBOX' || us.svartype === 'RADIO') && (
                                                <BodyShort size="small" className="font-semibold text-gray-800">
                                                    {us.sporsmalstekst}
                                                </BodyShort>
                                            )}
                                            <SporsmalVarianter sporsmal={us} />
                                            {us.undersporsmal && us.undersporsmal.length > 0 && (
                                                <Spørsmål spørsmål={us.undersporsmal} rotnivå={false} />
                                            )}
                                        </VStack>
                                    </div>
                                ))}
                            </VStack>
                        </div>
                    )
                }
                // For alle andre typer
                const erCheckboxEllerRadio = it.svartype === 'CHECKBOX' || it.svartype === 'RADIO'
                return (
                    <div key={it.tag} className={wrapperClass}>
                        <VStack gap="2">
                            {it.svar && it.svartype && (
                                <>
                                    {!erCheckboxEllerRadio && (
                                        <BodyShort size="small" className="font-bold">
                                            {it.sporsmalstekst ?? ''}
                                        </BodyShort>
                                    )}
                                    <SporsmalVarianter sporsmal={it} />
                                </>
                            )}
                            {it.undersporsmal && it.undersporsmal.length > 0 && erUndersporsmalStilt(it) && (
                                <Spørsmål spørsmål={it.undersporsmal} rotnivå={false} />
                            )}
                        </VStack>
                    </div>
                )
            })}
        </>
    )
}

interface SporsmalVarianterProps {
    sporsmal: Sporsmal
}

const SporsmalVarianter = ({ sporsmal }: SporsmalVarianterProps) => {
    const { svar, svartype } = sporsmal
    if (!svar || svar.length === 0 || !svar[0]?.verdi) return null

    const verdi = svar[0]?.verdi.trim().toUpperCase()
    if (verdi === 'JA' || verdi === 'NEI') {
        return <Avkrysset tekst={verdi.charAt(0) + verdi.slice(1).toLowerCase()} />
    }

    switch (svartype) {
        case 'CHECKBOX':
        case 'RADIO':
            return <Avkrysset tekst={sporsmal.sporsmalstekst ?? ''} />
        case 'BELOP':
            return <BodyShort size="small">{`${Number(svar[0]?.verdi) / 100} kr`}</BodyShort>
        case 'PERIODER':
        case 'PERIODE': {
            try {
                const verdi = JSON.parse(svar[0]?.verdi ?? '')
                const perioder = Array.isArray(verdi) ? verdi : [verdi]
                return (
                    <BodyShort size="small">
                        {perioder
                            .filter((p) => p && p.fom)
                            .map((p) => {
                                const fom = getFormattedDateString(p.fom)
                                const tom = getFormattedDateString(p.tom)
                                return tom && tom !== fom ? `${fom} - ${tom}` : fom
                            })
                            .join(', ')}
                    </BodyShort>
                )
            } catch {
                return <BodyShort size="small">{svar[0]?.verdi}</BodyShort>
            }
        }
        default:
            return <BodyShort size="small">{svar[0]?.verdi}</BodyShort>
    }
}
