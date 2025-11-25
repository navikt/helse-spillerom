import React, { ReactElement } from 'react'

import { YrkesaktivitetKategorisering } from '@schemas/yrkesaktivitetKategorisering'
import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'

export function getInntektsforholdDisplayText(kategorisering: YrkesaktivitetKategorisering): ReactElement {
    let typeText: string
    let orgnummer: string | undefined

    switch (kategorisering.inntektskategori) {
        case 'ARBEIDSTAKER': {
            const type = kategorisering.typeArbeidstaker
            orgnummer = 'orgnummer' in type ? type.orgnummer : undefined
            switch (type.type) {
                case 'ORDINÆR':
                    typeText = 'Ordinært arbeidsforhold'
                    break
                case 'MARITIM':
                    typeText = 'Maritimt arbeidsforhold'
                    break
                case 'FISKER':
                    typeText = 'Fisker (arbeidstaker)'
                    break
                case 'DIMMITERT_VERNEPLIKTIG':
                    typeText = 'Vernepliktig'
                    break
                case 'PRIVAT_ARBEIDSGIVER':
                    typeText = 'Privat arbeidsgiver'
                    break
                default:
                    typeText = 'Arbeidstaker'
            }
            break
        }
        case 'FRILANSER':
            orgnummer = kategorisering.orgnummer
            typeText = 'Frilanser'
            break
        case 'SELVSTENDIG_NÆRINGSDRIVENDE': {
            switch (kategorisering.typeSelvstendigNæringsdrivende.type) {
                case 'FISKER':
                    typeText = 'Fisker (selvstendig)'
                    break
                case 'JORDBRUKER':
                    typeText = 'Jordbruker'
                    break
                case 'REINDRIFT':
                    typeText = 'Reindrift'
                    break
                case 'BARNEPASSER_EGET_HJEM':
                    typeText = 'Barnepasser i eget hjem'
                    break
                default:
                    typeText = 'Selvstendig næringsdrivende'
            }
            break
        }
        case 'INAKTIV':
            typeText = 'Inaktiv'
            break
        case 'ARBEIDSLEDIG':
            typeText = 'Arbeidsledig'
            break
        default:
            typeText = 'Ukjent'
    }

    // Hvis det finnes orgnummer, vis organisasjonsnavn
    if (orgnummer) {
        return (
            <div className="text-center">
                <div className="text-sm font-medium">
                    <Organisasjonsnavn orgnummer={orgnummer} />
                </div>
                <div className="text-gray-600 text-xs">{typeText}</div>
            </div>
        )
    }

    return <span>{typeText}</span>
}
