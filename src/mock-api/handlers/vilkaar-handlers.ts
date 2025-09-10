import { NextResponse } from 'next/server'

import { Person } from '@/mock-api/session'
import { Vilkaarsvurdering, Vurdering, VilkaarsvurderingUnderspørsmål } from '@/schemas/vilkaarsvurdering'

export async function handleGetVilkaar(person: Person | undefined, uuid: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }
    if (!person.vilkaarsvurderinger) {
        person.vilkaarsvurderinger = {}
    }
    return NextResponse.json(person.vilkaarsvurderinger[uuid] || [])
}

/**
 * Ren funksjon som setter opp vilkårsvurdering på en person og returnerer den nye vurderingen
 * Kan gjenbrukes i testdata-oppsett og andre steder
 */
export function settOppVilkaarsvurderingPåPerson(
    person: Person,
    uuid: string,
    kode: string,
    vurdering: Vurdering,
    underspørsmål: VilkaarsvurderingUnderspørsmål[] = [],
    notat?: string,
): Vilkaarsvurdering {
    // Create V2 vurdering object
    const nyVurdering: Vilkaarsvurdering = {
        hovedspørsmål: kode,
        vurdering,
        underspørsmål,
        notat,
    }

    if (!person.vilkaarsvurderinger) {
        person.vilkaarsvurderinger = {}
    }
    if (!person.vilkaarsvurderinger[uuid]) {
        person.vilkaarsvurderinger[uuid] = []
    }

    const existingIndex = person.vilkaarsvurderinger[uuid].findIndex((v) => v.hovedspørsmål === kode)
    if (existingIndex >= 0) {
        person.vilkaarsvurderinger[uuid][existingIndex] = nyVurdering
    } else {
        person.vilkaarsvurderinger[uuid].push(nyVurdering)
    }

    return nyVurdering
}

export async function handlePutVilkaar(
    request: Request,
    person: Person | undefined,
    uuid: string,
    kode: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const body = await request.json()

    // Konverter gammelt format til nytt format hvis nødvendig
    let underspørsmål: VilkaarsvurderingUnderspørsmål[] = []
    if (Array.isArray(body.underspørsmål)) {
        underspørsmål = body.underspørsmål
    } else if (typeof body.underspørsmål === 'object' && body.underspørsmål !== null) {
        // Konverter Record<string, string> til VilkaarsvurderingUnderspørsmål[]
        underspørsmål = Object.entries(body.underspørsmål).map(([spørsmål, svar]) => ({
            spørsmål,
            svar: svar as string,
        }))
    }

    // Bruk den rene funksjonen
    const nyVurdering = settOppVilkaarsvurderingPåPerson(
        person,
        uuid,
        kode,
        body.vurdering as Vurdering,
        underspørsmål,
        body.notat,
    )

    return NextResponse.json(nyVurdering, { status: 201 })
}

export async function handleDeleteVilkaar(person: Person | undefined, uuid: string, kode: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    if (!person.vilkaarsvurderinger?.[uuid]) {
        return NextResponse.json({ message: 'Vilkaarsvurdering not found' }, { status: 404 })
    }

    const existingIndex = person.vilkaarsvurderinger[uuid].findIndex((v) => v.hovedspørsmål === kode)
    if (existingIndex >= 0) {
        person.vilkaarsvurderinger[uuid].splice(existingIndex, 1)
        return new NextResponse(null, { status: 204 })
    }

    return NextResponse.json({ message: 'Vilkaarsvurdering not found' }, { status: 404 })
}
