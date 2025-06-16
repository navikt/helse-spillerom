import dayjs from 'dayjs'
import React, { ReactElement } from 'react'
import { CheckmarkIcon } from '@navikt/aksel-icons'

import { NORSK_DATOFORMAT } from '@utils/date-format'
import { Sporsmal } from '@/schemas/søknad'

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

const hentSvar = (sporsmal: Sporsmal): string | null => {
    if (!sporsmal.svar || sporsmal.svar.length === 0) return null
    return sporsmal.svar[0]?.verdi
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
                <div
                    key={it.tag}
                    className={`ml-2 flex flex-col gap-2 border-l-2 border-gray-200 p-2 ${
                        rotnivå ? 'ml-0 border-l-0 pl-0' : ''
                    }`}
                >
                    <div className="flex flex-col gap-2">
                        <h3 className="m-0 text-sm font-semibold text-gray-900">{it.sporsmalstekst ?? ''}</h3>
                        <div className="text-sm leading-6 text-gray-700">
                            <SporsmalVarianter sporsmal={it} />
                        </div>
                    </div>
                    {valgteRadioer.map((radio) => (
                        <div key={radio.id} className="ml-4">
                            <h4 className="text-sm font-medium text-gray-800">{radio.sporsmalstekst}</h4>
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
                <div
                    key={it.tag}
                    className={`ml-2 flex flex-col gap-2 border-l-2 border-gray-200 p-2 ${
                        rotnivå ? 'ml-0 border-l-0 pl-0' : ''
                    }`}
                >
                    <div className="flex flex-col gap-2">
                        <h3 className="m-0 text-sm font-semibold text-gray-900">{it.sporsmalstekst ?? ''}</h3>
                        <div className="text-sm leading-6 text-gray-700">
                            <SporsmalVarianter sporsmal={it} />
                        </div>
                    </div>
                    {valgteCheckboxer.map((checkbox) => (
                        <div key={checkbox.id} className="ml-4">
                            <h4 className="text-sm font-medium text-gray-800">{checkbox.sporsmalstekst}</h4>
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
                <div
                    key={it.tag}
                    className={`ml-2 flex flex-col gap-2 border-l-2 border-gray-200 p-2 ${
                        rotnivå ? 'ml-0 border-l-0 pl-0' : ''
                    }`}
                >
                    <div className="flex flex-col gap-2">
                        <h3 className="m-0 text-sm font-semibold text-gray-900">{it.sporsmalstekst ?? ''}</h3>
                        <div className="text-sm leading-6 text-gray-700">
                            <SporsmalVarianter sporsmal={it} />
                        </div>
                    </div>
                    {besvarteUndersporsmal.map((us) => (
                        <div key={us.id} className="ml-4">
                            <h4 className="text-sm font-medium text-gray-800">{us.sporsmalstekst}</h4>
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

        return (
            <div
                key={it.tag}
                className={`ml-2 flex flex-col gap-2 border-l-2 border-gray-200 p-2 ${
                    rotnivå ? 'ml-0 border-l-0 pl-0' : ''
                } ${it.svar?.[0]?.verdi === 'CHECKED' ? 'flex items-center gap-2' : ''}`}
            >
                {it.svar && it.svartype && (
                    <div className="flex flex-col gap-2">
                        <h3 className="m-0 text-sm font-semibold text-gray-900">{it.sporsmalstekst ?? ''}</h3>
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
            return (
                <span className="inline-flex items-center gap-2">
                    <CheckmarkIcon fill="#000" style={{ border: '1px solid #000' }} />
                </span>
            )
        case 'RADIO':
            return (
                <span className="inline-flex items-center gap-2">
                    <CheckmarkIcon fill="#000" style={{ border: '1px solid #000' }} />
                </span>
            )
        case 'BELOP':
            return `${Number(svar[0]?.verdi) / 100} kr`
        case 'DATO':
        case 'RADIO_GRUPPE_UKEKALENDER':
            return dayjs(svar[0]?.verdi).format(NORSK_DATOFORMAT)
        case 'DATOER':
        case 'INFO_BEHANDLINGSDAGER':
            return svar
                .map((it) => dayjs(it.verdi).format(NORSK_DATOFORMAT))
                .join(', ')
                .replace(/,(?=[^,]*$)/, ' og')
        case 'PERIODE':
            return `${dayjs(JSON.parse(svar[0]?.verdi).fom).format(NORSK_DATOFORMAT)} – ${dayjs(
                JSON.parse(svar[0]?.verdi).tom,
            ).format(NORSK_DATOFORMAT)}`
        case 'PERIODER':
            return svar
                .map((it) => {
                    if (!it.verdi) return
                    const periode = JSON.parse(it.verdi)
                    return `${dayjs(periode.fom).format(NORSK_DATOFORMAT)} – ${dayjs(periode.tom).format(
                        NORSK_DATOFORMAT,
                    )}`
                })
                .join(', ')
                .replace(/,(?=[^,]*$)/, ' og')
        case 'CHECKBOX_GRUPPE':
        case 'COMBOBOX_MULTI':
            return svar
                .map((it) => it.verdi)
                .join(', ')
                .replace(/,(?=[^,]*$)/, ' og')
        case 'PROSENT':
            return `${svar[0]?.verdi} prosent`
        case 'TIMER':
            return `${svar[0]?.verdi} timer`
        case 'KILOMETER':
            return `${svar[0]?.verdi} km`
        case 'JA_NEI':
            return svar[0]?.verdi === 'JA' ? 'Ja' : 'Nei'
        case 'RADIO_GRUPPE':
        case 'RADIO_GRUPPE_TIMER_PROSENT':
            return hentSvar(sporsmal)
        case 'GRUPPE_AV_UNDERSPORSMAL':
        case 'IKKE_RELEVANT':
            return null
        default:
            return svar[0]?.verdi
    }
}
