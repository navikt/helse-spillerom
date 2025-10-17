import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

import { Person } from '@/mock-api/session'
import { Saksbehandlingsperiode } from '@/schemas/saksbehandlingsperiode'

import { handlePostSaksbehandlingsperioder } from './saksbehandlingsperiode-handlers'

// Mock session-modulen for å unngå cookies-problemer i tester
vi.mock('@/mock-api/session', async () => {
    const actual = await vi.importActual('@/mock-api/session')
    return {
        ...actual,
        hentAktivBruker: vi.fn().mockResolvedValue({
            navIdent: 'Z123456',
            navn: 'Saks McBehandlersen',
            roller: ['saksbehandler'],
        }),
        getSession: vi.fn().mockResolvedValue({
            testpersoner: [],
        }),
    }
})

// Mock testpersoner-modulen
vi.mock('@/mock-api/testpersoner/testpersoner', () => ({
    finnPerson: vi.fn().mockReturnValue({
        personId: 'test-person-id',
        soknader: [],
    }),
}))

describe('saksbehandlingsperiode-handlers', () => {
    describe('handlePostSaksbehandlingsperioder', () => {
        let testPerson: Person

        beforeEach(() => {
            // Opprett en testperson med en eksisterende saksbehandlingsperiode
            const eksisterendePeriode: Saksbehandlingsperiode = {
                id: 'test-periode-1',
                spilleromPersonId: 'test-person-id',
                opprettet: '2024-01-01T00:00:00Z',
                opprettetAvNavIdent: 'Z123456',
                opprettetAvNavn: 'Saks McBehandlersen',
                fom: '2024-01-01',
                tom: '2024-01-31',
                status: 'UNDER_BEHANDLING',
            }

            testPerson = {
                personId: 'test-person-id',
                fnr: '12345678901',
                personinfo: {
                    fødselsnummer: '12345678901',
                    aktørId: '1234567890100',
                    navn: 'Test Person',
                    alder: 30,
                },
                saksbehandlingsperioder: [eksisterendePeriode],
                vilkaarsvurderinger: {},
                yrkesaktivitet: {},
                dagoversikt: {},
                dokumenter: {},
                historikk: {},
                utbetalingsberegning: {},
            }
        })

        it('skal returnere 400 BadRequest når perioder overlapper helt', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'POST',
                body: JSON.stringify({
                    fom: '2024-01-01',
                    tom: '2024-01-31',
                    søknader: [],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePostSaksbehandlingsperioder(request, testPerson, 'test-person-id')
            const responseData = await response.json()

            expect(response.status).toBe(400)
            expect(response.headers.get('Content-Type')).toBe('application/problem+json')
            expect(responseData.title).toBe('Angitte datoer overlapper med en eksisterende periode')
            expect(responseData.type).toBe('https://spillerom.ansatt.nav.no/validation/input')
            expect(responseData.status).toBe(400)
        })

        it('skal returnere 400 BadRequest når ny periode overlapper delvis med eksisterende', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'POST',
                body: JSON.stringify({
                    fom: '2024-01-15',
                    tom: '2024-02-15',
                    søknader: [],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePostSaksbehandlingsperioder(request, testPerson, 'test-person-id')
            const responseData = await response.json()

            expect(response.status).toBe(400)
            expect(responseData.title).toBe('Angitte datoer overlapper med en eksisterende periode')
        })

        it('skal returnere 400 BadRequest når eksisterende periode ligger innenfor ny periode', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'POST',
                body: JSON.stringify({
                    fom: '2023-12-01',
                    tom: '2024-02-29',
                    søknader: [],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePostSaksbehandlingsperioder(request, testPerson, 'test-person-id')
            const responseData = await response.json()

            expect(response.status).toBe(400)
            expect(responseData.title).toBe('Angitte datoer overlapper med en eksisterende periode')
        })

        it('skal returnere 400 BadRequest når fom er etter tom', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'POST',
                body: JSON.stringify({
                    fom: '2024-02-15',
                    tom: '2024-02-01',
                    søknader: [],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePostSaksbehandlingsperioder(request, testPerson, 'test-person-id')
            const responseData = await response.json()

            expect(response.status).toBe(400)
            expect(responseData.title).toBe('Fom-dato kan ikke være etter tom-dato')
        })

        it('skal tillate periode som ikke overlapper', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'POST',
                body: JSON.stringify({
                    fom: '2024-02-01',
                    tom: '2024-02-28',
                    søknader: [],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePostSaksbehandlingsperioder(request, testPerson, 'test-person-id')

            expect(response.status).toBe(201)
            expect(testPerson.saksbehandlingsperioder).toHaveLength(2)
        })

        it('skal tillate periode som grenser til eksisterende uten overlapp', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'POST',
                body: JSON.stringify({
                    fom: '2024-02-01',
                    tom: '2024-02-15',
                    søknader: [],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePostSaksbehandlingsperioder(request, testPerson, 'test-person-id')

            expect(response.status).toBe(201)
            expect(testPerson.saksbehandlingsperioder).toHaveLength(2)
        })

        it('skal returnere 404 når person ikke finnes', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'POST',
                body: JSON.stringify({
                    fom: '2024-02-01',
                    tom: '2024-02-28',
                    søknader: [],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePostSaksbehandlingsperioder(request, undefined, 'ikke-eksisterende-id')

            expect(response.status).toBe(404)
        })
    })
})
