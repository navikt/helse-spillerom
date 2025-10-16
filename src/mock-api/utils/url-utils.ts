export function hentPersonIdFraUrl(url: string): string {
    const parts = url.split('/')
    // Finn indeksen til 'v1' eller 'v2' og ta neste del som er personId
    const versionIndex = parts.findIndex((part) => part === 'v1' || part === 'v2')
    if (versionIndex === -1 || versionIndex + 1 >= parts.length) {
        throw new Error('Kunne ikke finne personId i URL')
    }
    return parts[versionIndex + 1]
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
    // Finn indeksen til 'yrkesaktivitet' og ta neste del som er uuid
    const yrkesaktivitetIndex = parts.findIndex((part) => part === 'yrkesaktivitet')
    if (yrkesaktivitetIndex === -1 || yrkesaktivitetIndex + 1 >= parts.length) {
        throw new Error('Kunne ikke finne yrkesaktivitet UUID i URL')
    }
    return parts[yrkesaktivitetIndex + 1]
}

export function hentSoknadUuidFraUrl(url: string): string {
    const parts = url.split('/')
    const soknaderIndex = parts.findIndex((part) => part === 'soknader')
    if (soknaderIndex === -1 || soknaderIndex + 1 >= parts.length) {
        throw new Error('Kunne ikke finne søknad UUID i URL')
    }
    return parts[soknaderIndex + 1]
}
