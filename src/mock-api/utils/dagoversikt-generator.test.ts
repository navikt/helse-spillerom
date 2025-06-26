import { describe, it, expect } from 'vitest'

import { Bosse } from '../testpersoner/BosseBunntrål'

import { genererDagoversikt } from './dagoversikt-generator'

describe('dagoversikt-generator', () => {
    describe('genererDagoversikt', () => {
        it('skal generere korrekt dagoversikt for Bosse Bunntrål sin fiskersøknad', () => {
            // Bosse har en søknad for perioden 9. - 15. juni 2025
            const fom = '2025-06-09'
            const tom = '2025-06-15'
            const søknader = [Bosse.soknader[0]]

            const resultat = genererDagoversikt(fom, tom, søknader)

            expect(resultat).toHaveLength(7)
            expect(resultat[0].dato).toBe('2025-06-09')
            expect(resultat[6].dato).toBe('2025-06-15')

            // Sjekk at sykedager er satt korrekt (mandag-fredag)
            const sykedager = resultat.filter((dag) => dag.dagtype === 'Syk')
            expect(sykedager.length).toBe(5) // Mandag til fredag

            // Sjekk at helgedager ikke er overskrevet (lørdag og søndag)
            const helgedager = resultat.filter((dag) => dag.dagtype === 'Helg')
            expect(helgedager.length).toBe(2) // Lørdag og søndag

            // Sjekk at sykedagene har riktig grad (100 - faktiskGrad = 100 - 11 = 89)
            sykedager.forEach((dag) => {
                expect(dag.grad).toBe(89)
                expect(dag.kilde).toBe('Søknad')
            })

            // Sjekk at alle dager har riktig struktur
            resultat.forEach((dag) => {
                expect(dag).toHaveProperty('dato')
                expect(dag).toHaveProperty('dagtype')
                expect(dag).toHaveProperty('grad')
                expect(dag).toHaveProperty('avvistBegrunnelse')
                expect(dag).toHaveProperty('kilde')
            })
        })
    })
})
