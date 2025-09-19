import { describe, it, expect } from 'vitest'

import { BeregningResponse } from '@/schemas/utbetalingsberegning'
import { Yrkesaktivitet } from '@/schemas/yrkesaktivitet'

import { beregnUtbetalingssum, formaterUtbetalingssum } from './utbetalingsberegning'

describe('utbetalingsberegning', () => {
    describe('beregnUtbetalingssum', () => {
        it('skal returnere tom sum når ingen data er tilgjengelig', () => {
            const resultat = beregnUtbetalingssum(null, null)

            expect(resultat).toEqual({
                arbeidsgivere: [],
                direkteUtbetalingØre: 0,
            })
        })

        it('skal beregne utbetalinger korrekt for én arbeidsgiver med refusjon', () => {
            const mockUtbetalingsberegning: BeregningResponse = {
                id: 'test-id',
                saksbehandlingsperiodeId: 'test-periode',
                beregningData: {
                    yrkesaktiviteter: [
                        {
                            yrkesaktivitetId: 'ya-1',
                            dager: [
                                { dato: '2023-01-01', utbetalingØre: 1000, refusjonØre: 500, totalGrad: 100 },
                                { dato: '2023-01-02', utbetalingØre: 1000, refusjonØre: 500, totalGrad: 100 },
                            ],
                        },
                    ],
                    sporing: ['REGEL_1', 'REGEL_2'],
                },
                opprettet: '2023-01-01T00:00:00Z',
                opprettetAv: 'test',
                sistOppdatert: '2023-01-01T00:00:00Z',
            }

            const mockYrkesaktivitet: Yrkesaktivitet[] = [
                {
                    id: 'ya-1',
                    kategorisering: {
                        ORGNUMMER: '123456789',
                        NAVN: 'Test Bedrift AS',
                    },
                    dagoversikt: null,
                    generertFraDokumenter: [],
                    dekningsgrad: 100,
                },
            ]

            const resultat = beregnUtbetalingssum(mockUtbetalingsberegning, mockYrkesaktivitet)

            expect(resultat.direkteUtbetalingØre).toBe(2000)
            expect(resultat.arbeidsgivere).toHaveLength(1)
            expect(resultat.arbeidsgivere[0]).toEqual({
                orgnummer: '123456789',
                refusjonØre: 1000,
            })
        })

        it('skal ikke inkludere arbeidsgivere uten refusjon', () => {
            const mockUtbetalingsberegning: BeregningResponse = {
                id: 'test-id',
                saksbehandlingsperiodeId: 'test-periode',
                beregningData: {
                    yrkesaktiviteter: [
                        {
                            yrkesaktivitetId: 'ya-1', // Kun direkte utbetaling
                            dager: [{ dato: '2023-01-01', utbetalingØre: 1000, refusjonØre: 0, totalGrad: 100 }],
                        },
                        {
                            yrkesaktivitetId: 'ya-2', // Med refusjon
                            dager: [{ dato: '2023-01-01', utbetalingØre: 500, refusjonØre: 1000, totalGrad: 100 }],
                        },
                    ],
                    sporing: ['REGEL_3'],
                },
                opprettet: '2023-01-01T00:00:00Z',
                opprettetAv: 'test',
                sistOppdatert: '2023-01-01T00:00:00Z',
            }

            const mockYrkesaktivitet: Yrkesaktivitet[] = [
                {
                    id: 'ya-1',
                    kategorisering: {
                        ORGNUMMER: '111111111',
                        NAVN: 'Bedrift A',
                    },
                    dagoversikt: null,
                    generertFraDokumenter: [],
                    dekningsgrad: 100,
                },
                {
                    id: 'ya-2',
                    kategorisering: {
                        ORGNUMMER: '222222222',
                        NAVN: 'Bedrift B',
                    },
                    dagoversikt: null,
                    generertFraDokumenter: [],
                    dekningsgrad: 100,
                },
            ]

            const resultat = beregnUtbetalingssum(mockUtbetalingsberegning, mockYrkesaktivitet)

            // Kun Bedrift B skal være inkludert (har refusjon)
            expect(resultat.arbeidsgivere).toHaveLength(1)
            expect(resultat.arbeidsgivere[0].orgnummer).toBe('222222222')
            expect(resultat.arbeidsgivere[0].refusjonØre).toBe(1000)

            // Direkteutbetaling skal være summen av alle utbetalinger
            expect(resultat.direkteUtbetalingØre).toBe(1500) // 1000 + 500
        })

        it('skal sortere arbeidsgivere etter refusjonsbeløp (høyest først)', () => {
            const mockUtbetalingsberegning: BeregningResponse = {
                id: 'test-id',
                saksbehandlingsperiodeId: 'test-periode',
                beregningData: {
                    yrkesaktiviteter: [
                        {
                            yrkesaktivitetId: 'ya-1',
                            dager: [{ dato: '2023-01-01', utbetalingØre: 500, refusjonØre: 500, totalGrad: 100 }],
                        },
                        {
                            yrkesaktivitetId: 'ya-2',
                            dager: [{ dato: '2023-01-01', utbetalingØre: 500, refusjonØre: 1000, totalGrad: 100 }],
                        },
                    ],
                    sporing: ['REGEL_4', 'REGEL_5'],
                },
                opprettet: '2023-01-01T00:00:00Z',
                opprettetAv: 'test',
                sistOppdatert: '2023-01-01T00:00:00Z',
            }

            const mockYrkesaktivitet: Yrkesaktivitet[] = [
                {
                    id: 'ya-1',
                    kategorisering: {
                        ORGNUMMER: '111111111',
                        NAVN: 'Bedrift A',
                    },
                    dagoversikt: null,
                    generertFraDokumenter: [],
                    dekningsgrad: 100,
                },
                {
                    id: 'ya-2',
                    kategorisering: {
                        ORGNUMMER: '222222222',
                        NAVN: 'Bedrift B',
                    },
                    dagoversikt: null,
                    generertFraDokumenter: [],
                    dekningsgrad: 100,
                },
            ]

            const resultat = beregnUtbetalingssum(mockUtbetalingsberegning, mockYrkesaktivitet)

            // Bedrift B (1000 kr refusjon) skal komme før Bedrift A (500 kr refusjon)
            expect(resultat.arbeidsgivere[0].orgnummer).toBe('222222222')
            expect(resultat.arbeidsgivere[1].orgnummer).toBe('111111111')
        })
    })

    describe('formaterUtbetalingssum', () => {
        it('skal formatere beløp korrekt', () => {
            const mockUtbetalingssum = {
                arbeidsgivere: [
                    {
                        orgnummer: '123456789',
                        refusjonØre: 1000,
                    },
                ],
                direkteUtbetalingØre: 2000,
            }

            const resultat = formaterUtbetalingssum(mockUtbetalingssum)

            expect(resultat.direkteUtbetaling).toMatch(/20,00.*kr/)
            expect(resultat.arbeidsgivere[0].refusjon).toMatch(/10,00.*kr/)
        })
    })
})
