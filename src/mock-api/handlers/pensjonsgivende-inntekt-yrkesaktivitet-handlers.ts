import { NextResponse } from 'next/server'

import { InaktivPensjonsgivende, SelvstendigNæringsdrivendePensjonsgivende } from '@schemas/inntektData'

// Mock data for beregnet pensjonsgivende inntekt for selvstendig næringsdrivende
const mockSelvstendigNæringsdrivendePensjonsgivende: SelvstendigNæringsdrivendePensjonsgivende = {
    inntektstype: 'SELVSTENDIG_NÆRINGSDRIVENDE_PENSJONSGIVENDE',
    omregnetÅrsinntekt: 587500,
    sporing: 'Beregnet fra pensjonsgivende inntekt hos Sigrun',
    pensjonsgivendeInntekt: {
        omregnetÅrsinntekt: 587500,
        anvendtGrunnbeløp: 124028,
        pensjonsgivendeInntekt: [
            {
                år: '2024',
                rapportertinntekt: 600000,
                justertÅrsgrunnlag: 620140,
                antallGKompensert: 5.0,
                snittG: 118455,
            },
            {
                år: '2023',
                rapportertinntekt: 550000,
                justertÅrsgrunnlag: 558126,
                antallGKompensert: 4.5,
                snittG: 116340,
            },
            {
                år: '2022',
                rapportertinntekt: 580000,
                justertÅrsgrunnlag: 583931,
                antallGKompensert: 4.71,
                snittG: 114543,
            },
        ],
    },
}

// Mock data for beregnet pensjonsgivende inntekt for inaktiv
const mockInaktivPensjonsgivende: InaktivPensjonsgivende = {
    inntektstype: 'INAKTIV_PENSJONSGIVENDE',
    omregnetÅrsinntekt: 425000,
    sporing: 'Beregnet fra pensjonsgivende inntekt hos Sigrun',
    pensjonsgivendeInntekt: {
        omregnetÅrsinntekt: 425000,
        anvendtGrunnbeløp: 124028,
        pensjonsgivendeInntekt: [
            {
                år: '2024',
                rapportertinntekt: 450000,
                justertÅrsgrunnlag: 496112,
                antallGKompensert: 4.0,
                snittG: 118455,
            },
            {
                år: '2023',
                rapportertinntekt: 420000,
                justertÅrsgrunnlag: 465360,
                antallGKompensert: 4.0,
                snittG: 116340,
            },
            {
                år: '2022',
                rapportertinntekt: 400000,
                justertÅrsgrunnlag: 344629,
                antallGKompensert: 3.01,
                snittG: 114543,
            },
        ],
    },
}

// Respons type som kan være enten success eller error
type PensjonsgivendeInntektResponse =
    | {
          success: true
          data: InaktivPensjonsgivende | SelvstendigNæringsdrivendePensjonsgivende
      }
    | {
          success: false
          feilmelding: string
      }

export async function handleGetPensjonsgivendeInntektForYrkesaktivitet(yrkesaktivitetId: string): Promise<Response> {
    // Simuler at vi henter data basert på yrkesaktivitetId
    // I en ekte implementasjon ville dette sjekket kategori fra yrkesaktiviteten
    // og returnert riktig data eller en feilmelding

    // For demo formål, la oss returnere selvstendig for de fleste tilfeller
    // og inaktiv for spesifikke IDs
    const erInaktiv = yrkesaktivitetId.startsWith('inaktiv') || yrkesaktivitetId.includes('9999')

    // Simuler noen feiltilfeller basert på ID
    if (yrkesaktivitetId.includes('feil')) {
        const response: PensjonsgivendeInntektResponse = {
            success: false,
            feilmelding: 'Kunne ikke hente pensjonsgivende inntekt fra Sigrun for denne perioden',
        }
        return NextResponse.json(response)
    }

    if (yrkesaktivitetId.includes('mangler')) {
        const response: PensjonsgivendeInntektResponse = {
            success: false,
            feilmelding: 'Mangler pensjonsgivende inntekt for de siste tre årene',
        }
        return NextResponse.json(response)
    }

    // Returner suksess respons med data
    const response: PensjonsgivendeInntektResponse = {
        success: true,
        data: erInaktiv ? mockInaktivPensjonsgivende : mockSelvstendigNæringsdrivendePensjonsgivende,
    }

    return NextResponse.json(response)
}
