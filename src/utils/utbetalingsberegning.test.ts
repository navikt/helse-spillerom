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
                            utbetalingstidslinje: {
                                dager: [
                                    {
                                        '@type': 'NavDagDto',
                                        dato: '2023-01-01',
                                        økonomi: {
                                            grad: { prosentDesimal: 1 },
                                            totalGrad: { prosentDesimal: 1 },
                                            utbetalingsgrad: { prosentDesimal: 1 },
                                            arbeidsgiverRefusjonsbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 500 },
                                            },
                                            aktuellDagsinntekt: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                            inntektjustering: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            dekningsgrad: { prosentDesimal: 1 },
                                            arbeidsgiverbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            personbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                            reservertArbeidsgiverbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            reservertPersonbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                        },
                                    },
                                    {
                                        '@type': 'NavDagDto',
                                        dato: '2023-01-02',
                                        økonomi: {
                                            grad: { prosentDesimal: 1 },
                                            totalGrad: { prosentDesimal: 1 },
                                            utbetalingsgrad: { prosentDesimal: 1 },
                                            arbeidsgiverRefusjonsbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 500 },
                                            },
                                            aktuellDagsinntekt: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                            inntektjustering: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            dekningsgrad: { prosentDesimal: 1 },
                                            arbeidsgiverbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            personbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                            reservertArbeidsgiverbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            reservertPersonbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                        },
                                    },
                                ],
                            },
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
                    dagoversikt: null,
                    perioder: null,
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
                            utbetalingstidslinje: {
                                dager: [
                                    {
                                        '@type': 'NavDagDto',
                                        dato: '2023-01-01',
                                        økonomi: {
                                            grad: { prosentDesimal: 1 },
                                            totalGrad: { prosentDesimal: 1 },
                                            utbetalingsgrad: { prosentDesimal: 1 },
                                            arbeidsgiverRefusjonsbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            aktuellDagsinntekt: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                            inntektjustering: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            dekningsgrad: { prosentDesimal: 1 },
                                            arbeidsgiverbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            personbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                            reservertArbeidsgiverbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            reservertPersonbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            yrkesaktivitetId: 'ya-2', // Med refusjon
                            utbetalingstidslinje: {
                                dager: [
                                    {
                                        '@type': 'NavDagDto',
                                        dato: '2023-01-01',
                                        økonomi: {
                                            grad: { prosentDesimal: 1 },
                                            totalGrad: { prosentDesimal: 1 },
                                            utbetalingsgrad: { prosentDesimal: 1 },
                                            arbeidsgiverRefusjonsbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                            aktuellDagsinntekt: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                            inntektjustering: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            dekningsgrad: { prosentDesimal: 1 },
                                            arbeidsgiverbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            personbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 500 },
                                            },
                                            reservertArbeidsgiverbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            reservertPersonbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                        },
                                    },
                                ],
                            },
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
                    dagoversikt: null,
                    perioder: null,
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
                    perioder: null,
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
                            utbetalingstidslinje: {
                                dager: [
                                    {
                                        '@type': 'NavDagDto',
                                        dato: '2023-01-01',
                                        økonomi: {
                                            grad: { prosentDesimal: 1 },
                                            totalGrad: { prosentDesimal: 1 },
                                            utbetalingsgrad: { prosentDesimal: 1 },
                                            arbeidsgiverRefusjonsbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 500 },
                                            },
                                            aktuellDagsinntekt: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                            inntektjustering: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            dekningsgrad: { prosentDesimal: 1 },
                                            arbeidsgiverbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            personbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 500 },
                                            },
                                            reservertArbeidsgiverbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            reservertPersonbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            yrkesaktivitetId: 'ya-2',
                            utbetalingstidslinje: {
                                dager: [
                                    {
                                        '@type': 'NavDagDto',
                                        dato: '2023-01-01',
                                        økonomi: {
                                            grad: { prosentDesimal: 1 },
                                            totalGrad: { prosentDesimal: 1 },
                                            utbetalingsgrad: { prosentDesimal: 1 },
                                            arbeidsgiverRefusjonsbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                            aktuellDagsinntekt: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                            inntektjustering: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            dekningsgrad: { prosentDesimal: 1 },
                                            arbeidsgiverbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            personbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 500 },
                                            },
                                            reservertArbeidsgiverbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 0 },
                                            },
                                            reservertPersonbeløp: {
                                                årlig: { beløp: 0 },
                                                månedligDouble: { beløp: 0 },
                                                dagligDouble: { beløp: 0 },
                                                dagligInt: { beløp: 1000 },
                                            },
                                        },
                                    },
                                ],
                            },
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
                    dagoversikt: null,
                    perioder: null,
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
                    perioder: null,
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
                        refusjonØre: 10,
                    },
                ],
                direkteUtbetalingØre: 20,
            }

            const resultat = formaterUtbetalingssum(mockUtbetalingssum)

            expect(resultat.direkteUtbetaling).toMatch(/20,00.*kr/)
            expect(resultat.arbeidsgivere[0].refusjon).toMatch(/10,00.*kr/)
        })
    })
})
