export function formaterBeløpKroner(kroner: number | undefined, desimaler: number = 2): string {
    if (kroner === undefined || kroner === null) return '-'
    return new Intl.NumberFormat('nb-NO', {
        style: 'currency',
        currency: 'NOK',
        minimumFractionDigits: desimaler,
        maximumFractionDigits: desimaler,
    }).format(kroner)
}
