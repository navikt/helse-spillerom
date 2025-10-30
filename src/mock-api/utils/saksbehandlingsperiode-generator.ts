import { v4 as uuidv4 } from 'uuid'

import { Dagoversikt } from '@/schemas/dagoversikt'
import { Saksbehandlingsperiode } from '@/schemas/saksbehandlingsperiode'
import { Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { Søknad } from '@/schemas/søknad'
import { Dokument } from '@/schemas/dokument'
import { Bruker } from '@schemas/bruker'

import { genererDagoversikt } from './dagoversikt-generator'
import { lagKategorisering } from './kategorisering-generator'
import { genererDokumenterFraSøknader } from './dokument-generator'

/**
 * Oppretter en saksbehandlingsperiode med tilhørende yrkesaktivitet, dagoversikt og dokumenter
 * Matcher bakrommet sin logikk for å opprette perioder fra søknader
 */
export function opprettSaksbehandlingsperiode(
    spilleromPersonId: string,
    søknader: Søknad[],
    fom: string,
    tom: string,
    søknadIder: string[],
    uuid?: string,
    aktivBruker?: Bruker,
    skjæringstidspunkt?: string,
): {
    saksbehandlingsperiode: Saksbehandlingsperiode
    yrkesaktivitet: Yrkesaktivitet[]
    dagoversikt: Record<string, Dagoversikt>
    dokumenter: Dokument[]
} {
    const dagoversikt: Record<string, Dagoversikt> = {}

    // Opprett saksbehandlingsperiode
    const saksbehandlingsperiode: Saksbehandlingsperiode = {
        id: uuid || uuidv4(),
        spilleromPersonId: spilleromPersonId,
        opprettet: new Date().toISOString(),
        opprettetAvNavIdent: aktivBruker ? aktivBruker.navIdent : 'Z123456',
        opprettetAvNavn: aktivBruker ? aktivBruker.navn : 'Saks McBehandlersen',
        fom: fom,
        tom: tom,
        status: 'UNDER_BEHANDLING',
        skjæringstidspunkt: skjæringstidspunkt ?? fom,
        individuellBegrunnelse: undefined,
    }

    const yrkesaktivitet: Yrkesaktivitet[] = []

    // Automatisk opprettelse av yrkesaktivitet basert på valgte søknader
    if (søknadIder && søknadIder.length > 0) {
        const valgteSøknader = søknader.filter((søknad) => søknadIder.includes(søknad.id))

        // Grupper søknader basert på kategorisering (matcher bakrommet sin logikk)
        const kategorierOgSøknader = new Map<
            string,
            {
                kategorisering: import('@schemas/yrkesaktivitetKategorisering').YrkesaktivitetKategorisering
                søknader: Søknad[]
            }
        >()

        valgteSøknader.forEach((søknad) => {
            const kategorisering = lagKategorisering(søknad)
            const key = JSON.stringify(kategorisering)

            if (!kategorierOgSøknader.has(key)) {
                kategorierOgSøknader.set(key, {
                    kategorisering,
                    søknader: [],
                })
            }
            kategorierOgSøknader.get(key)!.søknader.push(søknad)
        })

        kategorierOgSøknader.forEach(({ kategorisering, søknader: søknaderForKategori }) => {
            // Beregn dekningsgrad basert på kategorisering

            const nyttInntektsforhold: Yrkesaktivitet = {
                id: uuidv4(),
                kategorisering,
                dagoversikt: [],
                generertFraDokumenter: søknaderForKategori.map((s) => s.id),
                perioder: null,
            }

            yrkesaktivitet.push(nyttInntektsforhold)

            // Opprett dagoversikt fra søknader (matcher bakrommet sin logikk)
            dagoversikt[nyttInntektsforhold.id] = genererDagoversikt(fom, tom, søknaderForKategori)
        })
    }

    // Generer dokumenter fra søknadene
    const dokumenter = genererDokumenterFraSøknader(søknader, søknadIder)

    return {
        saksbehandlingsperiode,
        yrkesaktivitet,
        dagoversikt,
        dokumenter,
    }
}

/**
 * Genererer flere saksbehandlingsperioder basert på en liste av perioder
 * Nyttig for å opprette testdata med flere perioder
 */
export function genererSaksbehandlingsperioder(
    spilleromPersonId: string,
    søknader: Søknad[],
    perioder: Array<{ fom: string; tom: string; søknadIder: string[]; uuid?: string }>,
): {
    saksbehandlingsperioder: Saksbehandlingsperiode[]
    yrkesaktivitet: Record<string, Yrkesaktivitet[]>
    dagoversikt: Record<string, Dagoversikt>
    dokumenter: Record<string, Dokument[]>
} {
    const saksbehandlingsperioder: Saksbehandlingsperiode[] = []
    const alleInntektsforhold: Record<string, Yrkesaktivitet[]> = {}
    const alleDagoversikt: Record<string, Dagoversikt> = {}
    const alleDokumenter: Record<string, Dokument[]> = {}

    perioder.forEach((periode) => {
        const resultat = opprettSaksbehandlingsperiode(
            spilleromPersonId,
            søknader,
            periode.fom,
            periode.tom,
            periode.søknadIder,
            periode.uuid,
        )

        saksbehandlingsperioder.push(resultat.saksbehandlingsperiode)

        // Inkluder dagoversikt i yrkesaktivitet (matcher logikken i saksbehandlingsperiode-handlers.ts)
        alleInntektsforhold[resultat.saksbehandlingsperiode.id] = resultat.yrkesaktivitet.map((forhold) => ({
            ...forhold,
            dagoversikt: resultat.dagoversikt[forhold.id] || [],
        }))

        // Kombiner dagoversikt
        Object.assign(alleDagoversikt, resultat.dagoversikt)

        // Legg til dokumenter for denne saksbehandlingsperioden
        if (resultat.dokumenter.length > 0) {
            alleDokumenter[resultat.saksbehandlingsperiode.id] = resultat.dokumenter
        }
    })

    return {
        saksbehandlingsperioder,
        yrkesaktivitet: alleInntektsforhold,
        dagoversikt: alleDagoversikt,
        dokumenter: alleDokumenter,
    }
}
