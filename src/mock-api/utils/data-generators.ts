import { v4 as uuidv4 } from 'uuid'

import { Dagoversikt, Dag } from '@/schemas/dagoversikt'

export function genererDagoversikt(fom: string, tom: string): Dagoversikt {
    const dager: Dag[] = []
    const startDato = new Date(fom)
    const sluttDato = new Date(tom)

    // Generer dager fra fom til tom
    const currentDato = new Date(startDato)
    while (currentDato <= sluttDato) {
        const erHelg = currentDato.getDay() === 0 || currentDato.getDay() === 6

        dager.push({
            id: uuidv4(),
            type: erHelg ? 'HELGEDAG' : 'SYKEDAG',
            dato: currentDato.toISOString().split('T')[0], // YYYY-MM-DD format
        })

        // Gå til neste dag
        currentDato.setDate(currentDato.getDate() + 1)
    }

    return dager
}

export function getOrgnavn(orgnummer?: string, fallbackNavn?: string): string | undefined {
    if (!orgnummer) return fallbackNavn

    const mockOrganisasjoner: Record<string, string> = {
        '123456789': 'Arbeidsgivernavn 2', // Brukt av Kalle og Mattis (men Mattis kaller det 'Danskebåten')
        '987654321': 'Arbeidsgivernavn 1',
    }

    return mockOrganisasjoner[orgnummer] || fallbackNavn || `Organisasjon ${orgnummer}`
}

export function mapArbeidssituasjonTilInntektsforholdtype(arbeidssituasjon: string): 'ORDINÆRT_ARBEIDSFORHOLD' | 'FRILANSER' | 'SELVSTENDIG_NÆRINGSDRIVENDE' | 'ARBEIDSLEDIG' {
    switch (arbeidssituasjon) {
        case 'ARBEIDSTAKER':
            return 'ORDINÆRT_ARBEIDSFORHOLD'
        case 'FRILANSER':
            return 'FRILANSER'
        case 'NAERINGSDRIVENDE':
            return 'SELVSTENDIG_NÆRINGSDRIVENDE'
        case 'ARBEIDSLEDIG':
            return 'ARBEIDSLEDIG'
        default:
            return 'ORDINÆRT_ARBEIDSFORHOLD'
    }
}
