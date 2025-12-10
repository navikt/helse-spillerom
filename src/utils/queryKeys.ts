/**
 * Type-safe query key factory for React Query
 *
 * Alle query keys skal defineres her for å sikre konsistens og type-sikkerhet.
 * Bruk funksjonene nedenfor for å generere query keys i queries og mutations.
 */

export const queryKeys = {
    // Saksbehandlingsperioder
    alleSaksbehandlingsperioder: () => ['alle-saksbehandlingsperioder'] as const,
    saksbehandlingsperioder: (personId: string) => ['saksbehandlingsperioder', personId] as const,
    saksbehandlingsperiodeHistorikk: (personId: string, behandlingId: string) =>
        ['saksbehandlingsperiode-historikk', personId, behandlingId] as const,

    // Yrkesaktivitet
    yrkesaktivitet: (personId: string, behandlingId: string) => [personId, 'yrkesaktivitet', behandlingId] as const,

    // Sykepengegrunnlag
    sykepengegrunnlag: (personId: string, behandlingId: string) =>
        ['sykepengegrunnlag', personId, behandlingId] as const,

    // Utbetalingsberegning
    utbetalingsberegning: (personId: string, behandlingId: string) =>
        [personId, 'utbetalingsberegning', behandlingId] as const,

    // Tidslinje
    tidslinje: (personId: string) => ['tidslinje', personId] as const,

    // Historikk
    history: (personId: string, behandlingId: string) => ['history', personId, behandlingId] as const,

    // Tilkommen inntekt
    tilkommenInntekt: (personId: string, behandlingId: string) => ['tilkommenInntekt', personId, behandlingId] as const,

    // Vilkårsvurderinger
    vilkaarsvurderinger: (personId: string, behandlingId: string) =>
        [personId, 'vilkaarsvurderinger', behandlingId] as const,

    // Dokumenter
    dokumenter: (personId: string, behandlingId: string) => ['dokumenter', personId, behandlingId] as const,

    // Inntektsmeldinger
    inntektsmeldinger: (personId: string, behandlingId: string, yrkesaktivitetId: string) =>
        ['inntektsmeldinger', personId, behandlingId, yrkesaktivitetId] as const,

    // Ainntekt yrkesaktivitet
    ainntektYrkesaktivitet: (personId: string, behandlingId: string, yrkesaktivitetId: string) =>
        ['ainntekt-yrkesaktivitet', personId, behandlingId, yrkesaktivitetId] as const,

    // Pensjonsgivende inntekt
    pensjonsgivendeInntekt: (personId: string, behandlingId: string, yrkesaktivitetId: string) =>
        ['pensjonsgivendeinntekt', personId, behandlingId, yrkesaktivitetId] as const,

    // Organisasjonsnavn
    organisasjonsnavn: (orgnummer: string) => ['organisasjonsnavn', orgnummer] as const,

    // Kodeverk
    kodeverk: () => ['kodeverk'] as const,

    // Saksbehandler UI
    saksbehandlerui: () => ['saksbehandlerui'] as const,

    // Beregningsregler
    beregningsregler: () => ['beregningsregler'] as const,

    // Kafka outbox
    kafkaOutbox: () => ['kafkaOutbox'] as const,

    // Testpersoner
    testpersoner: () => ['testpersoner'] as const,

    // Scenarier
    scenarioer: () => ['scenarioer'] as const,

    // Tilgjengelige brukere
    tilgjengeligeBrukere: () => ['tilgjengeligeBrukere'] as const,

    // Personinfo
    personinfo: (personId: string) => ['personinfo', personId] as const,

    // Søknader
    soknader: (personId: string, fom: string) => ['soknader', personId, fom] as const,
    soknad: (personId: string, soknadId: string) => ['soknad', personId, soknadId] as const,

    // Behandlingsperiode
    behandlingsperiode: (personId: string, behandlingId: string) =>
        ['behandlingsperiode', personId, behandlingId] as const,

    // Aktiv saksbehandlingsperiode
    aktivSaksbehandlingsperiode: (personId: string) => ['aktivSaksbehandlingsperiode', personId] as const,

    // Brukerinfo
    brukerinfo: () => ['brukerinfo'] as const,

    // Brukerroller
    brukerRoller: () => ['brukerRoller'] as const,

    // Kan saksbehandles
    kanSaksbehandles: (personId: string, behandlingId: string) => ['kanSaksbehandles', personId, behandlingId] as const,

    // Er beslutter
    erBeslutter: () => ['erBeslutter'] as const,
} as const

/**
 * Type for alle query keys
 */
export type QueryKey = ReturnType<(typeof queryKeys)[keyof typeof queryKeys]>
