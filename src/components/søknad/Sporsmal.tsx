import React, { ReactElement } from 'react'

import { Sporsmal } from '@/schemas/søknad'

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
            return false
        default:
            return true
    }
}

const erUndersporsmalStilt = (sporsmal: Sporsmal): boolean => {
    if (!sporsmal.svar || sporsmal.svar.length === 0) return false
    if (sporsmal.kriterieForVisningAvUndersporsmal) {
        // Hvis det finnes en kriterie, vis kun hvis svaret matcher kriteriet
        return sporsmal.svar.some((s) => s.verdi === sporsmal.kriterieForVisningAvUndersporsmal)
    }
    // Hvis det ikke finnes kriterie, vis hvis det finnes et besvart svar
    return sporsmal.svar.some((s) => s.verdi && s.verdi !== '')
}

export const Spørsmål = ({ spørsmål, rotnivå = true }: SpørsmålProps): ReactElement[] => {
    return spørsmål?.filter(skalVisesIOppsummering).map((it) => {
        // Spesialhåndtering for RADIO_GRUPPE og RADIO_GRUPPE_TIMER_PROSENT
        if (
            (it.svartype === 'RADIO_GRUPPE' || it.svartype === 'RADIO_GRUPPE_TIMER_PROSENT') &&
            it.undersporsmal &&
            it.undersporsmal.length > 0
        ) {
            const valgteRadioer = it.undersporsmal.filter((us) => us.svar?.[0]?.verdi === 'CHECKED')
            return (
                <div key={it.tag} className={`ml-2 flex flex-col gap-2 p-2 ${rotnivå ? 'ml-0 pl-0' : ''}`}>
                    <div className="flex flex-col gap-2">
                        <h3 className="m-0 text-sm font-semibold text-gray-900">{it.sporsmalstekst ?? ''}</h3>
                        <div className="text-sm leading-6 text-gray-700">
                            <SporsmalVarianter sporsmal={it} />
                        </div>
                    </div>
                    {valgteRadioer.map((radio) => (
                        <div key={radio.id} className="ml-4">
                            {!(radio.svartype === 'CHECKBOX' || radio.svartype === 'RADIO') && (
                                <h4 className="text-sm font-medium text-gray-800">{radio.sporsmalstekst}</h4>
                            )}
                            <SporsmalVarianter sporsmal={radio} />
                            {radio.undersporsmal && radio.undersporsmal.length > 0 && (
                                <Spørsmål spørsmål={radio.undersporsmal} rotnivå={false} />
                            )}
                        </div>
                    ))}
                </div>
            )
        }

        // Spesialhåndtering for CHECKBOX_GRUPPE
        if (it.svartype === 'CHECKBOX_GRUPPE' && it.undersporsmal && it.undersporsmal.length > 0) {
            const valgteCheckboxer = it.undersporsmal.filter((us) => us.svar?.[0]?.verdi === 'CHECKED')
            return (
                <div key={it.tag} className={`ml-2 flex flex-col gap-2 p-2 ${rotnivå ? 'ml-0 pl-0' : ''}`}>
                    <div className="flex flex-col gap-2">
                        <h3 className="m-0 text-sm font-semibold text-gray-900">{it.sporsmalstekst ?? ''}</h3>
                        <div className="text-sm leading-6 text-gray-700">
                            <SporsmalVarianter sporsmal={it} />
                        </div>
                    </div>
                    {valgteCheckboxer.map((checkbox) => (
                        <div key={checkbox.id} className="ml-4">
                            {!(checkbox.svartype === 'CHECKBOX' || checkbox.svartype === 'RADIO') && (
                                <h4 className="text-sm font-medium text-gray-800">{checkbox.sporsmalstekst}</h4>
                            )}
                            <SporsmalVarianter sporsmal={checkbox} />
                            {checkbox.undersporsmal && checkbox.undersporsmal.length > 0 && (
                                <Spørsmål spørsmål={checkbox.undersporsmal} rotnivå={false} />
                            )}
                        </div>
                    ))}
                </div>
            )
        }

        // Spesialhåndtering for GRUPPE_AV_UNDERSPORSMAL og IKKE_RELEVANT
        if (
            (it.svartype === 'GRUPPE_AV_UNDERSPORSMAL' || it.svartype === 'IKKE_RELEVANT') &&
            it.undersporsmal &&
            it.undersporsmal.length > 0
        ) {
            // Vis alle underspørsmål som har svar
            const besvarteUndersporsmal = it.undersporsmal.filter(
                (us) => us.svar && us.svar.length > 0 && us.svar[0]?.verdi && us.svar[0]?.verdi !== '',
            )
            return (
                <div key={it.tag} className={`ml-2 flex flex-col gap-2 p-2 ${rotnivå ? 'ml-0 pl-0' : ''}`}>
                    <div className="flex flex-col gap-2">
                        <h3 className="m-0 text-sm font-semibold text-gray-900">{it.sporsmalstekst ?? ''}</h3>
                        <div className="text-sm leading-6 text-gray-700">
                            <SporsmalVarianter sporsmal={it} />
                        </div>
                    </div>
                    {besvarteUndersporsmal.map((us) => (
                        <div key={us.id} className="ml-4">
                            {!(us.svartype === 'CHECKBOX' || us.svartype === 'RADIO') && (
                                <h4 className="text-sm font-medium text-gray-800">{us.sporsmalstekst}</h4>
                            )}
                            <SporsmalVarianter sporsmal={us} />
                            {us.undersporsmal && us.undersporsmal.length > 0 && (
                                <Spørsmål spørsmål={us.undersporsmal} rotnivå={false} />
                            )}
                        </div>
                    ))}
                </div>
            )
        }

        const skalViseUnderspørsmål = it.undersporsmal && it.undersporsmal.length > 0 && erUndersporsmalStilt(it)

        // For alle andre typer
        const erCheckboxEllerRadio = it.svartype === 'CHECKBOX' || it.svartype === 'RADIO'
        return (
            <div
                key={it.tag}
                className={`ml-2 flex flex-col gap-2 p-2 ${
                    rotnivå ? 'ml-0 pl-0' : ''
                } ${it.svar?.[0]?.verdi === 'CHECKED' ? 'flex items-center gap-2' : ''}`}
            >
                {it.svar && it.svartype && (
                    <div className="flex flex-col gap-2">
                        {!erCheckboxEllerRadio && (
                            <h3 className="m-0 text-sm font-semibold text-gray-900">{it.sporsmalstekst ?? ''}</h3>
                        )}
                        <div className="text-sm leading-6 text-gray-700">
                            <SporsmalVarianter sporsmal={it} />
                        </div>
                    </div>
                )}
                {skalViseUnderspørsmål && it.undersporsmal && <Spørsmål spørsmål={it.undersporsmal} rotnivå={false} />}
            </div>
        )
    })
}

interface SporsmalVarianterProps {
    sporsmal: Sporsmal
}

const SporsmalVarianter = ({ sporsmal }: SporsmalVarianterProps) => {
    const { svar, svartype } = sporsmal
    if (!svar || svar.length === 0 || !svar[0]?.verdi) return null

    switch (svartype) {
        case 'CHECKBOX':
        case 'RADIO':
            return <Avkrysset tekst={sporsmal.sporsmalstekst ?? ''} />
        case 'BELOP':
            return `${Number(svar[0]?.verdi) / 100} kr`
        default:
            return svar[0]?.verdi
    }
}
