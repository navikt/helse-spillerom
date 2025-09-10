import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

import { Person } from '@/mock-api/session'

// Mock env modulen for tester
vi.mock('@/env', () => ({
    erLokal: true,
    erDev: false,
    erDemo: false,
    erProd: false,
}))

import {
    handleGetSykepengegrunnlag,
    handlePutSykepengegrunnlag,
    handleDeleteSykepengegrunnlag,
} from './sykepengegrunnlag-handlers'

describe('sykepengegrunnlag-handlers', () => {
    let testPerson: Person
    const testUuid = 'test-periode-uuid'

    beforeEach(() => {
        testPerson = {
            personId: 'test-person-id',
            fnr: '12345678901',
            personinfo: {
                fødselsnummer: '12345678901',
                aktørId: '1234567890100',
                navn: 'Test Person',
                alder: 30,
            },
            saksbehandlingsperioder: [
                {
                    id: testUuid,
                    spilleromPersonId: 'test-person-id',
                    opprettet: '2024-01-01T00:00:00Z',
                    opprettetAvNavIdent: 'Z123456',
                    opprettetAvNavn: 'Saks McBehandlersen',
                    fom: '2024-01-01',
                    tom: '2024-12-31',
                    status: 'UNDER_BEHANDLING',
                    skjæringstidspunkt: '2024-01-01', // Legg til skjæringstidspunkt
                },
            ],
            vilkaarsvurderinger: {},
            yrkesaktivitet: {},
            dagoversikt: {},
            dokumenter: {},
            historikk: {},
            sykepengegrunnlag: {},
            utbetalingsberegning: {},
        }
    })

    describe('handleGetSykepengegrunnlag', () => {
        it('skal returnere 404 når person ikke finnes', async () => {
            const response = await handleGetSykepengegrunnlag(undefined, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(404)
            expect(responseData.message).toBe('Person not found')
        })

        it('skal returnere null når sykepengegrunnlag ikke finnes', async () => {
            const response = await handleGetSykepengegrunnlag(testPerson, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(200)
            expect(responseData).toBeNull()
        })

        it('skal returnere sykepengegrunnlag når det finnes', async () => {
            const eksisterendeGrunnlag = {
                id: 'test-grunnlag-id',
                saksbehandlingsperiodeId: testUuid,
                inntekter: [],
                totalInntektØre: 0,
                grunnbeløpØre: 12402800,
                grunnbeløp6GØre: 74416800,
                begrensetTil6G: false,
                sykepengegrunnlagØre: 0,
                grunnbeløpVirkningstidspunkt: '2024-05-01',
                opprettet: '2024-01-01T00:00:00Z',
                opprettetAv: 'Z123456',
                sistOppdatert: '2024-01-01T00:00:00Z',
            }

            testPerson.sykepengegrunnlag[testUuid] = eksisterendeGrunnlag

            const response = await handleGetSykepengegrunnlag(testPerson, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(200)
            expect(responseData).toEqual(eksisterendeGrunnlag)
        })
    })

    describe('handlePutSykepengegrunnlag', () => {
        it('skal returnere 404 når person ikke finnes', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [
                        {
                            yrkesaktivitetId: 'test-inntekt-id',
                            beløpPerMånedØre: 5000000, // 50 000 kr
                            kilde: 'AINNTEKT',
                        },
                    ],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, undefined, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(404)
            expect(responseData.message).toBe('Person not found')
        })

        it('skal returnere 404 når saksbehandlingsperiode ikke finnes', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [
                        {
                            yrkesaktivitetId: 'test-inntekt-id',
                            beløpPerMånedØre: 5000000,
                            kilde: 'AINNTEKT',
                        },
                    ],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, testPerson, 'ukjent-uuid')
            const responseData = await response.json()

            expect(response.status).toBe(404)
            expect(responseData.message).toBe('Saksbehandlingsperiode not found')
        })

        it('skal returnere 400 når periode mangler skjæringstidspunkt', async () => {
            // Fjern skjæringstidspunkt fra testperioden
            testPerson.saksbehandlingsperioder[0].skjæringstidspunkt = undefined

            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [
                        {
                            yrkesaktivitetId: 'test-inntekt-id',
                            beløpPerMånedØre: 5000000,
                            kilde: 'AINNTEKT',
                        },
                    ],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, testPerson, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(400)
            expect(responseData.message).toBe('Periode mangler skjæringstidspunkt')
        })

        it('skal returnere 400 når inntekter mangler', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, testPerson, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(400)
            expect(responseData.message).toBe('Må ha minst én inntekt')
        })

        it('skal returnere 400 når beløp er negativt', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [
                        {
                            yrkesaktivitetId: 'test-inntekt-id',
                            beløpPerMånedØre: -1000,
                            kilde: 'AINNTEKT',
                        },
                    ],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, testPerson, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(400)
            expect(responseData.message).toBe('Beløp per måned kan ikke være negativt (inntekt 0)')
        })

        it('skal returnere 400 når kilde er ugyldig', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [
                        {
                            yrkesaktivitetId: 'test-inntekt-id',
                            beløpPerMånedØre: 5000000,
                            kilde: 'UGYLDIG_KILDE',
                        },
                    ],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, testPerson, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(400)
            expect(responseData.message).toBe('Ugyldig kilde: UGYLDIG_KILDE (inntekt 0)')
        })

        it('skal returnere 400 når skjønnsfastsettelse mangler begrunnelse', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [
                        {
                            yrkesaktivitetId: 'test-inntekt-id',
                            beløpPerMånedØre: 5000000,
                            kilde: 'SKJONNSFASTSETTELSE',
                        },
                    ],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, testPerson, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(400)
            expect(responseData.message).toBe('Skjønnsfastsettelse krever begrunnelse')
        })

        it('skal opprette sykepengegrunnlag med gyldig request', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [
                        {
                            yrkesaktivitetId: 'test-inntekt-id',
                            beløpPerMånedØre: 5000000, // 50 000 kr
                            kilde: 'AINNTEKT',
                        },
                    ],
                    begrunnelse: 'Test begrunnelse',
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, testPerson, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(200)
            expect(responseData.saksbehandlingsperiodeId).toBe(testUuid)
            expect(responseData.inntekter).toHaveLength(1)

            expect(responseData.totalInntektØre).toBe(60000000) // 50 000 * 12 * 100
            expect(responseData.begrensetTil6G).toBe(false)
            expect(responseData.begrunnelse).toBe('Test begrunnelse')
            expect(responseData.opprettetAv).toBe('Saks McBehandlersen')
            expect(responseData.grunnbeløpVirkningstidspunkt).toBe('2023-05-01') // For 2024-01-01 skjæringstidspunkt bruker 2023 grunnbeløp

            // Verifiser at grunnlaget ble lagret i session
            expect(testPerson.sykepengegrunnlag[testUuid]).toBeDefined()
        })

        it('skal begrense til 6G når inntekt overstiger 6G', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [
                        {
                            yrkesaktivitetId: 'test-inntekt-id',
                            beløpPerMånedØre: 10000000, // 100 000 kr
                            kilde: 'AINNTEKT',
                        },
                    ],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, testPerson, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(200)
            expect(responseData.begrensetTil6G).toBe(true)
            expect(responseData.sykepengegrunnlagØre).toBe(71172000) // 6G for 2023 (bruker 2023 grunnbeløp for 2024-01-01)
        })

        it('skal akseptere skjønnsfastsettelse kilde med begrunnelse', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [
                        {
                            yrkesaktivitetId: 'test-inntekt-id',
                            beløpPerMånedØre: 5000000, // 50 000 kr
                            kilde: 'SKJONNSFASTSETTELSE',
                        },
                    ],
                    begrunnelse: 'Skjønnsfastsettelse begrunnelse',
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, testPerson, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(200)
            expect(responseData.inntekter[0].kilde).toBe('SKJONNSFASTSETTELSE')
            expect(responseData.begrunnelse).toBe('Skjønnsfastsettelse begrunnelse')
        })

        it('skal bruke riktig grunnbeløp basert på skjæringstidspunkt', async () => {
            // Endre skjæringstidspunkt til 2023
            testPerson.saksbehandlingsperioder[0].skjæringstidspunkt = '2023-06-01'

            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [
                        {
                            yrkesaktivitetId: 'test-inntekt-id',
                            beløpPerMånedØre: 10000000, // 100 000 kr
                            kilde: 'AINNTEKT',
                        },
                    ],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, testPerson, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(200)
            expect(responseData.begrensetTil6G).toBe(true)
            expect(responseData.sykepengegrunnlagØre).toBe(71172000) // 6G for 2023 (711720 kr)
            expect(responseData.grunnbeløpVirkningstidspunkt).toBe('2023-05-01') // For 2023 skjæringstidspunkt
        })

        it('skal akseptere refusjon med tomme datoer når alle felter er tomme', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [
                        {
                            yrkesaktivitetId: 'test-inntekt-id',
                            beløpPerMånedØre: 5000000, // 50 000 kr
                            kilde: 'AINNTEKT',
                            refusjon: [
                                {
                                    fom: '',
                                    tom: null,
                                    beløpØre: 0,
                                },
                            ],
                        },
                    ],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, testPerson, testUuid)

            expect(response.status).toBe(200)
        })

        it('skal akseptere refusjon med kun fom-dato satt', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [
                        {
                            yrkesaktivitetId: 'test-inntekt-id',
                            beløpPerMånedØre: 5000000, // 50 000 kr
                            kilde: 'AINNTEKT',
                            refusjon: [
                                {
                                    fom: '2024-01-01',
                                    tom: null, // Tom tom-dato
                                    beløpØre: 1000000, // 10 000 kr
                                },
                            ],
                        },
                    ],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, testPerson, testUuid)

            expect(response.status).toBe(200)
        })

        it('skal avvise refusjon uten fom-dato', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [
                        {
                            yrkesaktivitetId: 'test-inntekt-id',
                            beløpPerMånedØre: 5000000, // 50 000 kr
                            kilde: 'AINNTEKT',
                            refusjon: [
                                {
                                    fom: '', // Tom fom-dato
                                    tom: '2024-12-31',
                                    beløpØre: 1000000, // 10 000 kr
                                },
                            ],
                        },
                    ],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, testPerson, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(400)
            expect(responseData.message).toBe('Fra-dato må være fylt ut (inntekt 0, refusjon 0)')
        })

        it('skal avvise refusjon med ugyldig fom-dato format', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [
                        {
                            yrkesaktivitetId: 'test-inntekt-id',
                            beløpPerMånedØre: 5000000, // 50 000 kr
                            kilde: 'AINNTEKT',
                            refusjon: [
                                {
                                    fom: 'ugyldig-dato', // Ugyldig fom-dato format
                                    tom: '2024-12-31',
                                    beløpØre: 1000000, // 10 000 kr
                                },
                            ],
                        },
                    ],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, testPerson, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(400)
            expect(responseData.message).toBe('Ugyldig fra-dato format (inntekt 0, refusjon 0)')
        })

        it('skal avvise refusjon med ugyldig tom-dato format når tom er satt', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [
                        {
                            yrkesaktivitetId: 'test-inntekt-id',
                            beløpPerMånedØre: 5000000, // 50 000 kr
                            kilde: 'AINNTEKT',
                            refusjon: [
                                {
                                    fom: '2024-01-01',
                                    tom: 'ugyldig-dato', // Ugyldig tom-dato format
                                    beløpØre: 1000000, // 10 000 kr
                                },
                            ],
                        },
                    ],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, testPerson, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(400)
            expect(responseData.message).toBe('Ugyldig til-dato format (inntekt 0, refusjon 0)')
        })

        it('skal akseptere refusjon med null som tom-dato', async () => {
            const request = new NextRequest('http://localhost/test', {
                method: 'PUT',
                body: JSON.stringify({
                    inntekter: [
                        {
                            yrkesaktivitetId: 'test-inntekt-id',
                            beløpPerMånedØre: 5000000, // 50 000 kr
                            kilde: 'AINNTEKT',
                            refusjon: [
                                {
                                    fom: '2024-01-01',
                                    tom: null, // Null tom-dato
                                    beløpØre: 1000000, // 10 000 kr
                                },
                            ],
                        },
                    ],
                }),
                headers: { 'Content-Type': 'application/json' },
            })

            const response = await handlePutSykepengegrunnlag(request, testPerson, testUuid)

            expect(response.status).toBe(200)
        })
    })

    describe('handleDeleteSykepengegrunnlag', () => {
        it('skal returnere 404 når person ikke finnes', async () => {
            const response = await handleDeleteSykepengegrunnlag(undefined, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(404)
            expect(responseData.message).toBe('Person not found')
        })

        it('skal returnere 404 når sykepengegrunnlag ikke finnes', async () => {
            const response = await handleDeleteSykepengegrunnlag(testPerson, testUuid)
            const responseData = await response.json()

            expect(response.status).toBe(404)
            expect(responseData.message).toBe('Sykepengegrunnlag not found')
        })

        it('skal slette sykepengegrunnlag når det finnes', async () => {
            testPerson.sykepengegrunnlag[testUuid] = {
                id: 'test-grunnlag-id',
                saksbehandlingsperiodeId: testUuid,
                inntekter: [],
                totalInntektØre: 0,
                grunnbeløpØre: 12402800,
                grunnbeløp6GØre: 74416800,
                begrensetTil6G: false,
                sykepengegrunnlagØre: 0,
                grunnbeløpVirkningstidspunkt: '2024-05-01',
                opprettet: '2024-01-01T00:00:00Z',
                opprettetAv: 'Z123456',
                sistOppdatert: '2024-01-01T00:00:00Z',
            }

            const response = await handleDeleteSykepengegrunnlag(testPerson, testUuid)

            expect(response.status).toBe(204)
            expect(testPerson.sykepengegrunnlag[testUuid]).toBeUndefined()
        })
    })
})
