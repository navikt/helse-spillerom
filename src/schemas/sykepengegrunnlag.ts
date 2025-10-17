// Utility functions for converting between kroner and øre
export function kronerTilØrer(kroner: number | string): number {
    return Math.round(Number(String(kroner).replace(',', '.')) * 100)
}

export function ørerTilKroner(ører: number): number {
    return ører / 100
}

export function øreTilDisplay(øre?: number): string {
    return øre == null ? '' : String(øre / 100).replace('.', ',')
}

export function formaterBeløpØre(ører: number | undefined, desimaler: number = 2): string {
    if (ører === undefined) return '-'
    return new Intl.NumberFormat('nb-NO', {
        style: 'currency',
        currency: 'NOK',
        minimumFractionDigits: desimaler,
        maximumFractionDigits: desimaler,
    }).format(ørerTilKroner(ører))
}

export function formaterBeløpKroner(kroner: number | undefined, desimaler: number = 2): string {
    if (kroner === undefined || kroner === null) return '-'
    return new Intl.NumberFormat('nb-NO', {
        style: 'currency',
        currency: 'NOK',
        minimumFractionDigits: desimaler,
        maximumFractionDigits: desimaler,
    }).format(kroner)
}
