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
    saksbehandlingsperiodeHistorikk: (personId: string, saksbehandlingsperiodeId: string) =>
        ['saksbehandlingsperiode-historikk', personId, saksbehandlingsperiodeId] as const,

    // Yrkesaktivitet
    yrkesaktivitet: (personId: string, saksbehandlingsperiodeId: string) =>
        [personId, 'yrkesaktivitet', saksbehandlingsperiodeId] as const,

    // Sykepengegrunnlag
    sykepengegrunnlag: (personId: string, saksbehandlingsperiodeId: string) =>
        ['sykepengegrunnlag', personId, saksbehandlingsperiodeId] as const,

    // Utbetalingsberegning
    utbetalingsberegning: (personId: string, saksbehandlingsperiodeId: string) =>
        [personId, 'utbetalingsberegning', saksbehandlingsperiodeId] as const,

    // Tidslinje
    tidslinje: (personId: string) => ['tidslinje', personId] as const,

    // Historikk
    history: (personId: string, saksbehandlingsperiodeId: string) =>
        ['history', personId, saksbehandlingsperiodeId] as const,

    // Tilkommen inntekt
    tilkommenInntekt: (personId: string, saksbehandlingsperiodeId: string) =>
        ['tilkommenInntekt', personId, saksbehandlingsperiodeId] as const,

    // Vilkårsvurderinger
    vilkaarsvurderinger: (personId: string, saksbehandlingsperiodeId: string) =>
        [personId, 'vilkaarsvurderinger', saksbehandlingsperiodeId] as const,

    // Dokumenter
    dokumenter: (personId: string, saksbehandlingsperiodeId: string) =>
        ['dokumenter', personId, saksbehandlingsperiodeId] as const,

    // Inntektsmeldinger
    inntektsmeldinger: (personId: string, saksbehandlingsperiodeId: string, yrkesaktivitetId: string) =>
        ['inntektsmeldinger', personId, saksbehandlingsperiodeId, yrkesaktivitetId] as const,

    // Ainntekt yrkesaktivitet
    ainntektYrkesaktivitet: (personId: string, saksbehandlingsperiodeId: string, yrkesaktivitetId: string) =>
        ['ainntekt-yrkesaktivitet', personId, saksbehandlingsperiodeId, yrkesaktivitetId] as const,

    // Pensjonsgivende inntekt
    pensjonsgivendeInntekt: (personId: string, saksbehandlingsperiodeId: string, yrkesaktivitetId: string) =>
        ['pensjonsgivendeinntekt', personId, saksbehandlingsperiodeId, yrkesaktivitetId] as const,

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
    behandlingsperiode: (personId: string, saksbehandlingsperiodeId: string) =>
        ['behandlingsperiode', personId, saksbehandlingsperiodeId] as const,

    // Aktiv saksbehandlingsperiode
    aktivSaksbehandlingsperiode: (personId: string) => ['aktivSaksbehandlingsperiode', personId] as const,

    // Brukerinfo
    brukerinfo: () => ['brukerinfo'] as const,

    // Brukerroller
    brukerRoller: () => ['brukerRoller'] as const,

    // Kan saksbehandles
    kanSaksbehandles: (personId: string, saksbehandlingsperiodeId: string) =>
        ['kanSaksbehandles', personId, saksbehandlingsperiodeId] as const,

    // Er beslutter
    erBeslutter: () => ['erBeslutter'] as const,
} as const

/**
 * Type for alle query keys
 */
export type QueryKey = ReturnType<(typeof queryKeys)[keyof typeof queryKeys]>
