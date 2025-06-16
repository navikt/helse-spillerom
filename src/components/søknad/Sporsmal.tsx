import dayjs from 'dayjs'
import React, { ReactElement } from 'react'
import { CheckmarkIcon } from '@navikt/aksel-icons'

import { NORSK_DATOFORMAT } from '@utils/date-format'
import { Sporsmal, Svartype } from '@/schemas/søknad'

interface SpørsmålProps {
    spørsmål: Sporsmal[]
    rotnivå?: boolean
}

export const Spørsmål = ({ spørsmål, rotnivå = true }: SpørsmålProps): ReactElement[] => {
    return spørsmål?.map((it) => {
        const underspørsmål = it.undersporsmal && it.undersporsmal.length > 0 ? it.undersporsmal : null

        return (
            <div
                key={it.tag}
                className={`flex flex-col gap-2 p-2 border-l-2 border-gray-200 ml-2 ${
                    rotnivå ? 'ml-0 border-l-0 pl-0' : ''
                } ${it.svar?.[0]?.verdi === 'CHECKED' ? 'flex items-center gap-2' : ''}`}
            >
                {it.svar && it.svartype && (
                    <div className="flex flex-col gap-2">
                        <h3 className="text-base font-semibold text-gray-900 m-0">{it.sporsmalstekst ?? ''}</h3>
                        <div className="text-sm text-gray-700 leading-6">{getSvarForVisning(it.svar, it.svartype)}</div>
                    </div>
                )}
                {underspørsmål && <Spørsmål spørsmål={underspørsmål} rotnivå={false} />}
            </div>
        )
    })
}

const getSvarForVisning = (svar: { verdi: string }[], svartype: Svartype) => {
    if (svar.length === 0 || !svar[0]?.verdi) return

    switch (svartype) {
        case 'CHECKBOX':
        case 'RADIO':
            return <CheckmarkIcon fill="#000" style={{ border: '1px solid #000' }} />
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
        case 'RADIO_GRUPPE_TIMER_PROSENT':
            return
        default:
            return svar[0]?.verdi
    }
}
