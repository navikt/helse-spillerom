export function hentPersonIdFraUrl(url: string): string {
    const parts = url.split('/')
    // Finn indeksen til 'v1' og ta neste del som er personId
    const v1Index = parts.findIndex((part) => part === 'v1')
    if (v1Index === -1 || v1Index + 1 >= parts.length) {
        throw new Error('Kunne ikke finne personId i URL')
    }
    return parts[v1Index + 1]
}

export function hentUuidFraUrl(url: string): string {
    const parts = url.split('/')
    // Finn indeksen til 'saksbehandlingsperioder' og ta neste del som er uuid
    const periodeIndex = parts.findIndex((part) => part === 'saksbehandlingsperioder')
    if (periodeIndex === -1 || periodeIndex + 1 >= parts.length) {
        throw new Error('Kunne ikke finne UUID i URL')
    }
    return parts[periodeIndex + 1]
}

export function hentInntektsforholdUuidFraUrl(url: string): string {
    const parts = url.split('/')
    // Finn indeksen til 'inntektsforhold' og ta neste del som er uuid
    const inntektsforholdIndex = parts.findIndex((part) => part === 'inntektsforhold')
    if (inntektsforholdIndex === -1 || inntektsforholdIndex + 1 >= parts.length) {
        throw new Error('Kunne ikke finne inntektsforhold UUID i URL')
    }
    return parts[inntektsforholdIndex + 1]
}
