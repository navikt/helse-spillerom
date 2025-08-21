import { describe, it, expect } from 'vitest'

import { beregn6GØre, finnGrunnbeløpVirkningstidspunkt } from './grunnbelop'

describe('grunnbelop', () => {
    describe('beregn6GØre', () => {
        it('skal beregne riktig 6G for 2024-01-01 (bruker 2023 grunnbeløp)', () => {
            const resultat = beregn6GØre('2024-01-01')
            expect(resultat).toBe(71172000) // 6 * 118620 * 100 (2023 grunnbeløp)
        })

        it('skal beregne riktig 6G for 2024-06-01 (bruker 2024 grunnbeløp)', () => {
            const resultat = beregn6GØre('2024-06-01')
            expect(resultat).toBe(74416800) // 6 * 124028 * 100 (2024 grunnbeløp)
        })

        it('skal beregne riktig 6G for 2023-06-01', () => {
            const resultat = beregn6GØre('2023-06-01')
            expect(resultat).toBe(71172000) // 6 * 118620 * 100
        })
    })

    describe('finnGrunnbeløpVirkningstidspunkt', () => {
        it('skal finne riktig virkningstidspunkt for 2024-01-01 (bruker 2023 grunnbeløp)', () => {
            const resultat = finnGrunnbeløpVirkningstidspunkt('2024-01-01')
            expect(resultat).toBe('2023-05-01')
        })

        it('skal finne riktig virkningstidspunkt for 2024-06-01 (bruker 2024 grunnbeløp)', () => {
            const resultat = finnGrunnbeløpVirkningstidspunkt('2024-06-01')
            expect(resultat).toBe('2024-05-01')
        })

        it('skal finne riktig virkningstidspunkt for 2023-06-01', () => {
            const resultat = finnGrunnbeløpVirkningstidspunkt('2023-06-01')
            expect(resultat).toBe('2023-05-01')
        })
    })
})
