import { QueryClient, QueryKey } from '@tanstack/react-query'

import { queryKeys } from './queryKeys'

/**
 * Type-safe hjelpefunksjoner for invalidering av React Query caches
 *
 * Disse funksjonene gir type-sikkerhet og konsistens ved invalidering av queries.
 * Bruk disse i stedet for å manuelt konstruere query keys i mutations.
 */

/**
 * Invaliderer alle saksbehandlingsperioder queries
 */
export function invaliderAlleSaksbehandlingsperioder(queryClient: QueryClient): Promise<void> {
    return queryClient.invalidateQueries({ queryKey: queryKeys.alleSaksbehandlingsperioder() })
}

/**
 * Invaliderer saksbehandlingsperioder for en spesifikk person
 */
export function invaliderSaksbehandlingsperioder(queryClient: QueryClient, personId: string): Promise<void> {
    return queryClient.invalidateQueries({ queryKey: queryKeys.saksbehandlingsperioder(personId) })
}

/**
 * Invaliderer historikk for en spesifikk saksbehandlingsperiode
 */
export function invaliderSaksbehandlingsperiodeHistorikk(
    queryClient: QueryClient,
    personId: string,
    saksbehandlingsperiodeId: string,
): Promise<void> {
    return queryClient.invalidateQueries({
        queryKey: queryKeys.saksbehandlingsperiodeHistorikk(personId, saksbehandlingsperiodeId),
    })
}

/**
 * Invaliderer yrkesaktivitet queries for en spesifikk periode
 */
export function invaliderYrkesaktivitet(
    queryClient: QueryClient,
    personId: string,
    saksbehandlingsperiodeId: string,
): Promise<void> {
    return queryClient.invalidateQueries({ queryKey: queryKeys.yrkesaktivitet(personId, saksbehandlingsperiodeId) })
}

/**
 * Invaliderer sykepengegrunnlag queries for en spesifikk periode
 */
export function invaliderSykepengegrunnlag(
    queryClient: QueryClient,
    personId: string,
    saksbehandlingsperiodeId: string,
): Promise<void> {
    return queryClient.invalidateQueries({
        queryKey: queryKeys.sykepengegrunnlag(personId, saksbehandlingsperiodeId),
    })
}

/**
 * Invaliderer utbetalingsberegning queries for en spesifikk periode
 */
export function invaliderUtbetalingsberegning(
    queryClient: QueryClient,
    personId: string,
    saksbehandlingsperiodeId: string,
): Promise<void> {
    return queryClient.invalidateQueries({
        queryKey: queryKeys.utbetalingsberegning(personId, saksbehandlingsperiodeId),
    })
}

/**
 * Invaliderer tidslinje queries for en spesifikk person
 */
export function invaliderTidslinje(queryClient: QueryClient, personId: string): Promise<void> {
    return queryClient.invalidateQueries({ queryKey: queryKeys.tidslinje(personId) })
}

/**
 * Invaliderer historikk queries for en spesifikk periode
 */
export function invaliderHistory(
    queryClient: QueryClient,
    personId: string,
    saksbehandlingsperiodeId: string,
): Promise<void> {
    return queryClient.invalidateQueries({ queryKey: queryKeys.history(personId, saksbehandlingsperiodeId) })
}

/**
 * Invaliderer tilkommen inntekt queries for en spesifikk periode
 */
export function invaliderTilkommenInntekt(
    queryClient: QueryClient,
    personId: string,
    saksbehandlingsperiodeId: string,
): Promise<void> {
    return queryClient.invalidateQueries({
        queryKey: queryKeys.tilkommenInntekt(personId, saksbehandlingsperiodeId),
    })
}

/**
 * Invaliderer vilkårsvurderinger queries for en spesifikk periode
 */
export function invaliderVilkaarsvurderinger(
    queryClient: QueryClient,
    personId: string,
    saksbehandlingsperiodeId: string,
): Promise<void> {
    return queryClient.invalidateQueries({
        queryKey: queryKeys.vilkaarsvurderinger(personId, saksbehandlingsperiodeId),
    })
}

/**
 * Invaliderer dokumenter queries for en spesifikk periode
 */
export function invaliderDokumenter(
    queryClient: QueryClient,
    personId: string,
    saksbehandlingsperiodeId: string,
): Promise<void> {
    return queryClient.invalidateQueries({ queryKey: queryKeys.dokumenter(personId, saksbehandlingsperiodeId) })
}

/**
 * Invaliderer alle queries relatert til en saksbehandlingsperiode
 * Dette inkluderer: yrkesaktivitet, sykepengegrunnlag, utbetalingsberegning, historikk, tidslinje
 */
export function invaliderAllePeriodeQueries(
    queryClient: QueryClient,
    personId: string,
    saksbehandlingsperiodeId: string,
): Promise<void[]> {
    return Promise.all([
        invaliderYrkesaktivitet(queryClient, personId, saksbehandlingsperiodeId),
        invaliderSykepengegrunnlag(queryClient, personId, saksbehandlingsperiodeId),
        invaliderUtbetalingsberegning(queryClient, personId, saksbehandlingsperiodeId),
        invaliderHistory(queryClient, personId, saksbehandlingsperiodeId),
        invaliderSaksbehandlingsperiodeHistorikk(queryClient, personId, saksbehandlingsperiodeId),
        invaliderTidslinje(queryClient, personId),
    ])
}

/**
 * Invaliderer alle queries relatert til saksbehandlingsperioder (inkludert liste og historikk)
 */
export function invaliderAlleSaksbehandlingsperiodeQueries(
    queryClient: QueryClient,
    personId: string,
    saksbehandlingsperiodeId: string,
): Promise<void[]> {
    return Promise.all([
        invaliderAlleSaksbehandlingsperioder(queryClient),
        invaliderSaksbehandlingsperioder(queryClient, personId),
        invaliderSaksbehandlingsperiodeHistorikk(queryClient, personId, saksbehandlingsperiodeId),
        invaliderTidslinje(queryClient, personId),
    ])
}

/**
 * Invaliderer yrkesaktivitet-relaterte queries
 * Brukes når yrkesaktivitet endres (opprett, oppdater, slett)
 * Inkluderer: yrkesaktivitet, sykepengegrunnlag, utbetalingsberegning, tidslinje
 */
export function invaliderYrkesaktivitetRelaterteQueries(
    queryClient: QueryClient,
    personId: string,
    saksbehandlingsperiodeId: string,
): Promise<void[]> {
    return Promise.all([
        invaliderYrkesaktivitet(queryClient, personId, saksbehandlingsperiodeId),
        invaliderSykepengegrunnlag(queryClient, personId, saksbehandlingsperiodeId),
        invaliderUtbetalingsberegning(queryClient, personId, saksbehandlingsperiodeId),
        invaliderTidslinje(queryClient, personId),
    ])
}

/**
 * Invaliderer beregningsrelaterte queries
 * Brukes når sykepengegrunnlag eller beregninger endres
 * Inkluderer: sykepengegrunnlag, utbetalingsberegning, history, tidslinje
 */
export function invaliderBeregningsrelaterteQueries(
    queryClient: QueryClient,
    personId: string,
    saksbehandlingsperiodeId: string,
): Promise<void[]> {
    return Promise.all([
        invaliderSykepengegrunnlag(queryClient, personId, saksbehandlingsperiodeId),
        invaliderUtbetalingsberegning(queryClient, personId, saksbehandlingsperiodeId),
        invaliderHistory(queryClient, personId, saksbehandlingsperiodeId),
        invaliderTidslinje(queryClient, personId),
    ])
}

/**
 * Invaliderer tilkommen inntekt-relaterte queries
 * Brukes når tilkommen inntekt endres (opprett, slett)
 * Inkluderer: tilkommenInntekt, history, utbetalingsberegning, tidslinje
 */
export function invaliderTilkommenInntektRelaterteQueries(
    queryClient: QueryClient,
    personId: string,
    saksbehandlingsperiodeId: string,
): Promise<void[]> {
    return Promise.all([
        invaliderTilkommenInntekt(queryClient, personId, saksbehandlingsperiodeId),
        invaliderHistory(queryClient, personId, saksbehandlingsperiodeId),
        invaliderUtbetalingsberegning(queryClient, personId, saksbehandlingsperiodeId),
        invaliderTidslinje(queryClient, personId),
    ])
}

/**
 * Invaliderer saksbehandlingsperiode status-relaterte queries
 * Brukes når status på saksbehandlingsperiode endres (godkjenn, send til beslutning, etc.)
 * Inkluderer: alleSaksbehandlingsperioder, saksbehandlingsperioder, saksbehandlingsperiodeHistorikk, tidslinje
 */
export function invaliderSaksbehandlingsperiodeStatusQueries(
    queryClient: QueryClient,
    personId: string,
    saksbehandlingsperiodeId: string,
): Promise<void[]> {
    return Promise.all([
        invaliderAlleSaksbehandlingsperioder(queryClient),
        invaliderSaksbehandlingsperioder(queryClient, personId),
        invaliderSaksbehandlingsperiodeHistorikk(queryClient, personId, saksbehandlingsperiodeId),
        invaliderTidslinje(queryClient, personId),
    ])
}

/**
 * Generisk funksjon for å invaliderer queries med en query key
 * Bruk denne hvis du trenger å invaliderer en query key direkte
 */
export function invaliderQuery(queryClient: QueryClient, queryKey: QueryKey): Promise<void> {
    return queryClient.invalidateQueries({ queryKey })
}

/**
 * Refetcher queries med en query key
 */
export function refetchQuery(queryClient: QueryClient, queryKey: QueryKey): Promise<void> {
    return queryClient.refetchQueries({ queryKey })
}
