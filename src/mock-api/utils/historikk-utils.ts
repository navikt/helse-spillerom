import {
    SaksbehandlingsperiodeEndring,
    SaksbehandlingsperiodeEndringType,
    SaksbehandlingsperiodeStatus,
} from '@/schemas/saksbehandlingsperiode'
import { Person } from '@/mock-api/session'

export function leggTilHistorikkinnslag(
    person: Person,
    saksbehandlingsperiodeId: string,
    endringType: SaksbehandlingsperiodeEndringType,
    status: SaksbehandlingsperiodeStatus,
    endretAvNavIdent: string,
    beslutterNavIdent?: string | null,
    endringKommentar?: string | null,
): void {
    if (!person.historikk[saksbehandlingsperiodeId]) {
        person.historikk[saksbehandlingsperiodeId] = []
    }

    const historikkinnslag: SaksbehandlingsperiodeEndring = {
        saksbehandlingsperiodeId,
        status,
        beslutterNavIdent: beslutterNavIdent ?? null,
        endretTidspunkt: new Date().toISOString(),
        endretAvNavIdent,
        endringType,
        endringKommentar: endringKommentar ?? null,
    }

    person.historikk[saksbehandlingsperiodeId].push(historikkinnslag)
}
