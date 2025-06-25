import { formaterArbeidssituasjon } from './arbeidssituasjon'

describe('formaterArbeidssituasjon', () => {
    it('skal konvertere ARBEIDSTAKER til Arbeidstaker', () => {
        expect(formaterArbeidssituasjon('ARBEIDSTAKER')).toBe('Arbeidstaker')
    })

    it('skal konvertere FRILANSER til Frilanser', () => {
        expect(formaterArbeidssituasjon('FRILANSER')).toBe('Frilanser')
    })

    it('skal konvertere SELVSTENDIG_NARINGSDRIVENDE til Selvstendig næringsdrivende', () => {
        expect(formaterArbeidssituasjon('SELVSTENDIG_NARINGSDRIVENDE')).toBe('Selvstendig næringsdrivende')
    })

    it('skal konvertere ARBEIDSLEDIG til Arbeidsledig', () => {
        expect(formaterArbeidssituasjon('ARBEIDSLEDIG')).toBe('Arbeidsledig')
    })

    it('skal konvertere FISKER til Fisker', () => {
        expect(formaterArbeidssituasjon('FISKER')).toBe('Fisker')
    })

    it('skal konvertere JORDBRUKER til Jordbruker', () => {
        expect(formaterArbeidssituasjon('JORDBRUKER')).toBe('Jordbruker')
    })

    it('skal konvertere ANNET til Annet', () => {
        expect(formaterArbeidssituasjon('ANNET')).toBe('Annet')
    })

    it('skal håndtere tom streng', () => {
        expect(formaterArbeidssituasjon('')).toBe('')
    })

    it('skal håndtere null', () => {
        expect(formaterArbeidssituasjon(null)).toBe('')
    })

    it('skal håndtere undefined', () => {
        expect(formaterArbeidssituasjon(undefined)).toBe('')
    })
})
