export interface RSSoknad {
    id: string
    soknadstype: RSSoknadstypeType
    status: RSSoknadstatusType
    arbeidssituasjon: RSArbeidssituasjonType | null
    fom: string | null
    tom: string | null
    korrigerer: string | null
    korrigertAv: string | null
    avbruttDato: string | null
    sykmeldingUtskrevet: string | null
    startSykeforlop: string | null
    opprettetDato: string
    sendtTilNAVDato: string | null
    sendtTilArbeidsgiverDato: string | null
    arbeidsgiver: Arbeidsgiver | null
    soknadPerioder: RSSoknadsperiode[]
}

export type RSArbeidssituasjonType =
    | 'NAERINGSDRIVENDE'
    | 'FRILANSER'
    | 'ARBEIDSTAKER'
    | 'ARBEIDSLEDIG'
    | 'ANNET'
    | 'FISKER'
    | 'JORDBRUKER'
export interface Arbeidsgiver {
    navn: string
    orgnummer: string
}
export interface RSSoknadsperiode {
    fom: string
    tom: string
    grad: number
    sykmeldingstype: string
}
export type RSSoknadstatusType =
    | 'NY'
    | 'SENDT'
    | 'FREMTIDIG'
    | 'UTKAST_TIL_KORRIGERING'
    | 'KORRIGERT'
    | 'AVBRUTT'
    | 'SLETTET'
    | 'UTGAATT'

export type RSSoknadstypeType =
    | 'SELVSTENDIGE_OG_FRILANSERE'
    | 'OPPHOLD_UTLAND'
    | 'ARBEIDSTAKERE'
    | 'ARBEIDSLEDIG'
    | 'BEHANDLINGSDAGER'
    | 'ANNET_ARBEIDSFORHOLD'
    | 'REISETILSKUDD'
    | 'GRADERT_REISETILSKUDD'
    | 'FRISKMELDT_TIL_ARBEIDSFORMIDLING'
