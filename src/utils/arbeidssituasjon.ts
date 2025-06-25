export function formaterArbeidssituasjon(arbeidssituasjon: string | null | undefined): string {
    if (!arbeidssituasjon) {
        return ''
    }
    if (arbeidssituasjon === 'SELVSTENDIG_NARINGSDRIVENDE') {
        return 'Selvstendig næringsdrivende'
    }

    // Konverterer arbeidssituasjon fra UPPERCASE til camelCase
    return arbeidssituasjon
        .toLowerCase()
        .split('_')
        .map((word, index) => {
            if (index === 0) {
                return word.charAt(0).toUpperCase() + word.slice(1)
            }
            return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .join(' ')
}
