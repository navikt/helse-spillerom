import { describe, it, expect } from 'vitest'

import { BeregningResponse } from '@/schemas/utbetalingsberegning'
import { Yrkesaktivitet } from '@/schemas/yrkesaktivitet'

import { beregnUtbetalingssum, formaterUtbetalingssum } from './utbetalingsberegning'

describe('utbetalingsberegning', () => {
    describe('beregnUtbetalingssum', () => {
        it('skal returnere tom sum når ingen data er tilgjengelig', () => {
            const resultat = beregnUtbetalingssum(null, null)

            expect(resultat).toEqual({
                totalUtbetalingØre: 0,
                totalRefusjonØre: 0,
                totalBeløpØre: 0,
                arbeidsgivere: [],
                direkteUtbetalingØre: 0,
            })
        })

        it('skal beregne utbetalinger korrekt for én arbeidsgiver', () => {
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
                    kategoriseringGenerert: null,
                    dagoversikt: null,
                    dagoversiktGenerert: null,
                    saksbehandlingsperiodeId: 'test-periode',
                    opprettet: '2023-01-01T00:00:00Z',
                    generertFraDokumenter: [],
                },
            ]

            const resultat = beregnUtbetalingssum(mockUtbetalingsberegning, mockYrkesaktivitet)

            expect(resultat.totalUtbetalingØre).toBe(2000)
            expect(resultat.totalRefusjonØre).toBe(1000)
            expect(resultat.totalBeløpØre).toBe(3000)
            expect(resultat.arbeidsgivere).toHaveLength(1)
            expect(resultat.arbeidsgivere[0]).toEqual({
                orgnummer: '123456789',
                navn: 'Test Bedrift AS',
                refusjonØre: 1000,
                utbetalingØre: 2000,
                totalBeløpØre: 3000,
            })
        })

        it('skal sortere arbeidsgivere med refusjon først', () => {
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
                    kategoriseringGenerert: null,
                    dagoversikt: null,
                    dagoversiktGenerert: null,
                    saksbehandlingsperiodeId: 'test-periode',
                    opprettet: '2023-01-01T00:00:00Z',
                    generertFraDokumenter: [],
                },
                {
                    id: 'ya-2',
                    kategorisering: {
                        ORGNUMMER: '222222222',
                        NAVN: 'Bedrift B',
                    },
                    kategoriseringGenerert: null,
                    dagoversikt: null,
                    dagoversiktGenerert: null,
                    saksbehandlingsperiodeId: 'test-periode',
                    opprettet: '2023-01-01T00:00:00Z',
                    generertFraDokumenter: [],
                },
            ]

            const resultat = beregnUtbetalingssum(mockUtbetalingsberegning, mockYrkesaktivitet)

            // Bedrift B (med refusjon) skal komme før Bedrift A (kun direkte utbetaling)
            expect(resultat.arbeidsgivere[0].navn).toBe('Bedrift B')
            expect(resultat.arbeidsgivere[1].navn).toBe('Bedrift A')
        })
    })

    describe('formaterUtbetalingssum', () => {
        it('skal formatere beløp korrekt', () => {
            const mockUtbetalingssum = {
                totalUtbetalingØre: 2000,
                totalRefusjonØre: 1000,
                totalBeløpØre: 3000,
                arbeidsgivere: [
                    {
                        orgnummer: '123456789',
                        navn: 'Test Bedrift AS',
                        refusjonØre: 1000,
                        utbetalingØre: 2000,
                        totalBeløpØre: 3000,
                    },
                ],
                direkteUtbetalingØre: 2000,
            }

            const resultat = formaterUtbetalingssum(mockUtbetalingssum)

            expect(resultat.totalUtbetaling).toMatch(/20,00.*kr/)
            expect(resultat.totalRefusjon).toMatch(/10,00.*kr/)
            expect(resultat.totalBeløp).toMatch(/30,00.*kr/)
            expect(resultat.arbeidsgivere[0].totalBeløp).toMatch(/30,00.*kr/)
        })
    })
})
