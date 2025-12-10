/**
 * Type-safe query key factory for React Query
 *
 * Alle query keys skal defineres her for å sikre konsistens og type-sikkerhet.
 * Bruk funksjonene nedenfor for å generere query keys i queries og mutations.
 */

export const queryKeys = {
    alleBehandlinger: () => ['alle-behandlinger'] as const,
    behandlinger: (personId: string) => ['behandlinger', personId] as const,
    behandlingHistorikk: (personId: string, behandlingId: string) =>
        ['behandling-historikk', personId, behandlingId] as const,

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
    history: (personId: string, behandlingId: string) => ['historikk', personId, behandlingId] as const,

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

    organisasjonsnavn: (orgnummer: string) => ['organisasjonsnavn', orgnummer] as const,

    kodeverk: () => ['kodeverk'] as const,

    saksbehandlerui: () => ['saksbehandlerui'] as const,
    beregningsregler: () => ['beregningsregler'] as const,

    kafkaOutbox: () => ['kafkaOutbox'] as const,

    testpersoner: () => ['testpersoner'] as const,

    scenarioer: () => ['scenarioer'] as const,

    tilgjengeligeBrukere: () => ['tilgjengeligeBrukere'] as const,
    personinfo: (personId: string) => ['personinfo', personId] as const,
    soknader: (personId: string, fom: string) => ['soknader', personId, fom] as const,
    soknad: (personId: string, soknadId: string) => ['soknad', personId, soknadId] as const,

    behandling: (personId: string, behandlingId: string) => ['behandling', personId, behandlingId] as const,

    aktivBehandling: (personId: string) => ['aktivBehandling', personId] as const,

    brukerinfo: () => ['brukerinfo'] as const,

    brukerRoller: () => ['brukerRoller'] as const,

    kanSaksbehandles: (personId: string, behandlingId: string) => ['kanSaksbehandles', personId, behandlingId] as const,

    erBeslutter: () => ['erBeslutter'] as const,
} as const

/**
 * Type for alle query keys
 */
export type QueryKey = ReturnType<(typeof queryKeys)[keyof typeof queryKeys]>
