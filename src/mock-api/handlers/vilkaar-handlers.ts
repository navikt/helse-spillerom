import { NextResponse } from 'next/server'

import { Person } from '@/mock-api/session'
import { Vilkaarsvurdering } from '@/schemas/vilkaarsvurdering'

export async function handleGetVilkaar(person: Person | undefined, uuid: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }
    if (!person.vilkaarsvurderinger) {
        person.vilkaarsvurderinger = {}
    }
    return NextResponse.json(person.vilkaarsvurderinger[uuid] || [])
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

    // Create V2 vurdering object
    const nyVurdering: Vilkaarsvurdering = {
        hovedspørsmål: kode,
        vurdering: body.vurdering,
        underspørsmål: body.underspørsmål,
        notat: body.notat,
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
