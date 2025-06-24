import { describe, test, expect } from 'vitest'

import { Bosse } from '../testpersoner/BosseBunntrål'

import { genererDagoversikt } from './data-generators'

describe('data-generators', () => {
    describe('genererDagoversikt', () => {
        test('skal generere korrekt dagoversikt for Bosse Bunntrål sin fiskersøknad', () => {
            // Bosse har en søknad for perioden 9. - 15. juni 2025
            const fom = '2025-06-09'
            const tom = '2025-06-15'
            const søknad = Bosse.soknader[0]

            const dagoversikt = genererDagoversikt(fom, tom, [søknad])

            // Verifiser at vi har riktig antall dager
            expect(dagoversikt).toHaveLength(7)

            // Verifiser at helgedagene er korrekte (14. og 15. juni 2025 er lørdag og søndag)
            const helgedager = dagoversikt.filter((dag) => dag.dagtype === 'Helg')
            expect(helgedager).toHaveLength(2)
            expect(helgedager[0].dato).toBe('2025-06-14')
            expect(helgedager[1].dato).toBe('2025-06-15')

            // Verifiser at hverdagene er sykedager med riktig grad
            const sykedager = dagoversikt.filter((dag) => dag.dagtype === 'Syk')
            expect(sykedager).toHaveLength(5)
            sykedager.forEach((dag) => {
                expect(dag.grad).toBe(11) // Faktisk grad fra søknaden
                expect(dag.kilde).toBe('Søknad')
            })

            // Verifiser at første dag er en sykedag
            const førstedag = dagoversikt[0]
            expect(førstedag.dato).toBe('2025-06-09')
            expect(førstedag.dagtype).toBe('Syk')
            expect(førstedag.grad).toBe(11)
            expect(førstedag.kilde).toBe('Søknad')

            // Verifiser at siste hverdag er en sykedag
            const sisteHverdag = dagoversikt[4]
            expect(sisteHverdag.dato).toBe('2025-06-13')
            expect(sisteHverdag.dagtype).toBe('Syk')
            expect(sisteHverdag.grad).toBe(11)
            expect(sisteHverdag.kilde).toBe('Søknad')
        })
    })
})
