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
    return queryClient.invalidateQueries({ queryKey: queryKeys.alleBehandlinger() })
}

/**
 * Invaliderer saksbehandlingsperioder for en spesifikk person
 */
export function invaliderSaksbehandlingsperioder(queryClient: QueryClient, pseudoId: string): Promise<void> {
    return queryClient.invalidateQueries({ queryKey: queryKeys.behandlinger(pseudoId) })
}

/**
 * Invaliderer historikk for en spesifikk saksbehandlingsperiode
 */
export function invaliderSaksbehandlingsperiodeHistorikk(
    queryClient: QueryClient,
    pseudoId: string,
    behandlingId: string,
): Promise<void> {
    return queryClient.invalidateQueries({
        queryKey: queryKeys.behandlingHistorikk(pseudoId, behandlingId),
    })
}

/**
 * Invaliderer yrkesaktivitet queries for en spesifikk periode
 */
export function invaliderYrkesaktivitet(
    queryClient: QueryClient,
    pseudoId: string,
    behandlingId: string,
): Promise<void> {
    return queryClient.invalidateQueries({ queryKey: queryKeys.yrkesaktivitet(pseudoId, behandlingId) })
}

/**
 * Invaliderer sykepengegrunnlag queries for en spesifikk periode
 */
export function invaliderSykepengegrunnlag(
    queryClient: QueryClient,
    pseudoId: string,
    behandlingId: string,
): Promise<void> {
    return queryClient.invalidateQueries({
        queryKey: queryKeys.sykepengegrunnlag(pseudoId, behandlingId),
    })
}

/**
 * Invaliderer utbetalingsberegning queries for en spesifikk periode
 */
export function invaliderUtbetalingsberegning(
    queryClient: QueryClient,
    pseudoId: string,
    behandlingId: string,
): Promise<void> {
    return queryClient.invalidateQueries({
        queryKey: queryKeys.utbetalingsberegning(pseudoId, behandlingId),
    })
}

/**
 * Invaliderer tidslinje queries for en spesifikk person
 */
export function invaliderTidslinje(queryClient: QueryClient, pseudoId: string): Promise<void> {
    return queryClient.invalidateQueries({ queryKey: queryKeys.tidslinje(pseudoId) })
}

/**
 * Invaliderer historikk queries for en spesifikk periode
 */
export function invaliderHistory(queryClient: QueryClient, pseudoId: string, behandlingId: string): Promise<void> {
    return queryClient.invalidateQueries({ queryKey: queryKeys.history(pseudoId, behandlingId) })
}

/**
 * Invaliderer tilkommen inntekt queries for en spesifikk periode
 */
export function invaliderTilkommenInntekt(
    queryClient: QueryClient,
    pseudoId: string,
    behandlingId: string,
): Promise<void> {
    return queryClient.invalidateQueries({
        queryKey: queryKeys.tilkommenInntekt(pseudoId, behandlingId),
    })
}

/**
 * Invaliderer vilkårsvurderinger queries for en spesifikk periode
 */
export function invaliderVilkaarsvurderinger(
    queryClient: QueryClient,
    pseudoId: string,
    behandlingId: string,
): Promise<void> {
    return queryClient.invalidateQueries({
        queryKey: queryKeys.vilkaarsvurderinger(pseudoId, behandlingId),
    })
}

/**
 * Invaliderer dokumenter queries for en spesifikk periode
 */
export function invaliderDokumenter(queryClient: QueryClient, pseudoId: string, behandlingId: string): Promise<void> {
    return queryClient.invalidateQueries({ queryKey: queryKeys.dokumenter(pseudoId, behandlingId) })
}

/**
 * Invaliderer alle queries relatert til en saksbehandlingsperiode
 * Dette inkluderer: yrkesaktivitet, sykepengegrunnlag, utbetalingsberegning, historikk, tidslinje
 */
export function invaliderAllePeriodeQueries(
    queryClient: QueryClient,
    pseudoId: string,
    behandlingId: string,
): Promise<void[]> {
    return Promise.all([
        invaliderYrkesaktivitet(queryClient, pseudoId, behandlingId),
        invaliderSykepengegrunnlag(queryClient, pseudoId, behandlingId),
        invaliderUtbetalingsberegning(queryClient, pseudoId, behandlingId),
        invaliderHistory(queryClient, pseudoId, behandlingId),
        invaliderSaksbehandlingsperiodeHistorikk(queryClient, pseudoId, behandlingId),
        invaliderTidslinje(queryClient, pseudoId),
    ])
}

/**
 * Invaliderer alle queries relatert til saksbehandlingsperioder (inkludert liste og historikk)
 */
export function invaliderAlleSaksbehandlingsperiodeQueries(
    queryClient: QueryClient,
    pseudoId: string,
    behandlingId: string,
): Promise<void[]> {
    return Promise.all([
        invaliderAlleSaksbehandlingsperioder(queryClient),
        invaliderSaksbehandlingsperioder(queryClient, pseudoId),
        invaliderSaksbehandlingsperiodeHistorikk(queryClient, pseudoId, behandlingId),
        invaliderTidslinje(queryClient, pseudoId),
    ])
}

/**
 * Invaliderer yrkesaktivitet-relaterte queries
 * Brukes når yrkesaktivitet endres (opprett, oppdater, slett)
 * Inkluderer: yrkesaktivitet, sykepengegrunnlag, utbetalingsberegning, tidslinje
 */
export function invaliderYrkesaktivitetRelaterteQueries(
    queryClient: QueryClient,
    pseudoId: string,
    behandlingId: string,
): Promise<void[]> {
    return Promise.all([
        invaliderYrkesaktivitet(queryClient, pseudoId, behandlingId),
        invaliderSykepengegrunnlag(queryClient, pseudoId, behandlingId),
        invaliderUtbetalingsberegning(queryClient, pseudoId, behandlingId),
        invaliderTidslinje(queryClient, pseudoId),
    ])
}

/**
 * Invaliderer beregningsrelaterte queries
 * Brukes når sykepengegrunnlag eller beregninger endres
 * Inkluderer: sykepengegrunnlag, utbetalingsberegning, history, tidslinje
 */
export function invaliderBeregningsrelaterteQueries(
    queryClient: QueryClient,
    pseudoId: string,
    behandlingId: string,
): Promise<void[]> {
    return Promise.all([
        invaliderSykepengegrunnlag(queryClient, pseudoId, behandlingId),
        invaliderUtbetalingsberegning(queryClient, pseudoId, behandlingId),
        invaliderHistory(queryClient, pseudoId, behandlingId),
        invaliderTidslinje(queryClient, pseudoId),
    ])
}

/**
 * Invaliderer tilkommen inntekt-relaterte queries
 * Brukes når tilkommen inntekt endres (opprett, slett)
 * Inkluderer: tilkommenInntekt, history, utbetalingsberegning, tidslinje
 */
export function invaliderTilkommenInntektRelaterteQueries(
    queryClient: QueryClient,
    pseudoId: string,
    behandlingId: string,
): Promise<void[]> {
    return Promise.all([
        invaliderTilkommenInntekt(queryClient, pseudoId, behandlingId),
        invaliderHistory(queryClient, pseudoId, behandlingId),
        invaliderUtbetalingsberegning(queryClient, pseudoId, behandlingId),
        invaliderTidslinje(queryClient, pseudoId),
    ])
}

/**
 * Invaliderer saksbehandlingsperiode status-relaterte queries
 * Brukes når status på saksbehandlingsperiode endres (godkjenn, send til beslutning, etc.)
 * Inkluderer: alleSaksbehandlingsperioder, saksbehandlingsperioder, saksbehandlingsperiodeHistorikk, tidslinje
 */
export function invaliderSaksbehandlingsperiodeStatusQueries(
    queryClient: QueryClient,
    pseudoId: string,
    behandlingId: string,
): Promise<void[]> {
    return Promise.all([
        invaliderAlleSaksbehandlingsperioder(queryClient),
        invaliderSaksbehandlingsperioder(queryClient, pseudoId),
        invaliderSaksbehandlingsperiodeHistorikk(queryClient, pseudoId, behandlingId),
        invaliderTidslinje(queryClient, pseudoId),
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
