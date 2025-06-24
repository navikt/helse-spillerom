import { v4 as uuidv4 } from 'uuid'

import { Dag, Dagoversikt } from '@/schemas/dagoversikt'
import { Saksbehandlingsperiode } from '@/schemas/saksbehandlingsperiode'
import { Inntektsforhold } from '@/schemas/inntektsforhold'
import { Søknad } from '@/schemas/søknad'
import { Dokument } from '@/schemas/dokument'

function erHelg(dato: Date): boolean {
    return dato.getDay() === 0 || dato.getDay() === 6
}

function initialiserDager(fom: string, tom: string): Dagoversikt {
    const dager: Dag[] = []
    const startDato = new Date(fom)
    const sluttDato = new Date(tom)

    const currentDato = new Date(startDato)
    while (currentDato <= sluttDato) {
        dager.push({
            dato: currentDato.toISOString().split('T')[0], // YYYY-MM-DD format
            dagtype: erHelg(currentDato) ? 'Helg' : 'Arbeidsdag',
            grad: null,
            avvistBegrunnelse: [],
            kilde: 'Saksbehandler',
        })

        currentDato.setDate(currentDato.getDate() + 1)
    }

    return dager
}

function oppdaterDagerMedSøknadsdata(dager: Dagoversikt, søknad: Søknad, fom: string, tom: string): Dagoversikt {
    const dagerMap = new Map(dager.map((dag) => [dag.dato, dag]))
    const startDato = new Date(fom)
    const sluttDato = new Date(tom)

    // Legg til sykedager fra søknadsperioder
    søknad.soknadsperioder?.forEach((periode) => {
        const periodeFom = new Date(periode.fom)
        const periodeTom = new Date(periode.tom)
        const overlappendeFom = new Date(Math.max(startDato.getTime(), periodeFom.getTime()))
        const overlappendeTom = new Date(Math.min(sluttDato.getTime(), periodeTom.getTime()))

        if (overlappendeFom <= overlappendeTom) {
            const currentDato = new Date(overlappendeFom)
            while (currentDato <= overlappendeTom) {
                const datoString = currentDato.toISOString().split('T')[0]
                const eksisterendeDag = dagerMap.get(datoString)
                if (eksisterendeDag && eksisterendeDag.dagtype !== 'Helg') {
                    dagerMap.set(datoString, {
                        ...eksisterendeDag,
                        dagtype: 'Syk',
                        grad: periode.faktiskGrad ?? periode.grad ?? periode.sykmeldingsgrad ?? null,
                        kilde: 'Søknad',
                    })
                }
                currentDato.setDate(currentDato.getDate() + 1)
            }
        }
    })

    // Legg til permisjon fra fraværslisten
    søknad.fravar
        ?.filter((fravar) => fravar.type === 'PERMISJON')
        ?.forEach((fravar) => {
            const fravarFom = new Date(fravar.fom)
            const fravarTom = new Date(fravar.tom || fravar.fom)
            const overlappendeFom = new Date(Math.max(startDato.getTime(), fravarFom.getTime()))
            const overlappendeTom = new Date(Math.min(sluttDato.getTime(), fravarTom.getTime()))

            if (overlappendeFom <= overlappendeTom) {
                const currentDato = new Date(overlappendeFom)
                while (currentDato <= overlappendeTom) {
                    const datoString = currentDato.toISOString().split('T')[0]
                    const eksisterendeDag = dagerMap.get(datoString)
                    if (eksisterendeDag && eksisterendeDag.dagtype !== 'Helg') {
                        dagerMap.set(datoString, {
                            ...eksisterendeDag,
                            dagtype: 'Permisjon',
                            grad: null,
                            kilde: 'Søknad',
                        })
                    }
                    currentDato.setDate(currentDato.getDate() + 1)
                }
            }
        })

    // Legg til ferie fra fraværslisten (tar presedens over permisjon)
    søknad.fravar
        ?.filter((fravar) => fravar.type === 'FERIE')
        ?.forEach((fravar) => {
            const fravarFom = new Date(fravar.fom)
            const fravarTom = new Date(fravar.tom || fravar.fom)
            const overlappendeFom = new Date(Math.max(startDato.getTime(), fravarFom.getTime()))
            const overlappendeTom = new Date(Math.min(sluttDato.getTime(), fravarTom.getTime()))

            if (overlappendeFom <= overlappendeTom) {
                const currentDato = new Date(overlappendeFom)
                while (currentDato <= overlappendeTom) {
                    const datoString = currentDato.toISOString().split('T')[0]
                    const eksisterendeDag = dagerMap.get(datoString)
                    if (eksisterendeDag && eksisterendeDag.dagtype !== 'Helg') {
                        dagerMap.set(datoString, {
                            ...eksisterendeDag,
                            dagtype: 'Ferie',
                            grad: null,
                            kilde: 'Søknad',
                        })
                    }
                    currentDato.setDate(currentDato.getDate() + 1)
                }
            }
        })

    // Håndter arbeidGjenopptatt - sett alle dager fra og med denne til arbeidsdager (med mindre det er helg)
    if (søknad.arbeidGjenopptatt) {
        const arbeidGjenopptattDato = new Date(søknad.arbeidGjenopptatt)
        if (arbeidGjenopptattDato <= sluttDato) {
            const currentDato = new Date(Math.max(startDato.getTime(), arbeidGjenopptattDato.getTime()))
            while (currentDato <= sluttDato) {
                const datoString = currentDato.toISOString().split('T')[0]
                const eksisterendeDag = dagerMap.get(datoString)
                if (eksisterendeDag && eksisterendeDag.dagtype !== 'Helg') {
                    dagerMap.set(datoString, {
                        ...eksisterendeDag,
                        dagtype: 'Arbeidsdag',
                        grad: null,
                        kilde: 'Søknad',
                    })
                }
                currentDato.setDate(currentDato.getDate() + 1)
            }
        }
    }

    return Array.from(dagerMap.values())
}

export function genererDagoversikt(fom: string, tom: string, søknader?: Søknad[]): Dagoversikt {
    let dager = initialiserDager(fom, tom)

    if (søknader && søknader.length > 0) {
        // Sorter søknader etter sendtNav eller opprettet, nyeste først
        const sorterteSøknader = søknader.sort((a, b) => {
            const aTid = a.sendtNav || a.opprettet
            const bTid = b.sendtNav || b.opprettet
            return new Date(bTid).getTime() - new Date(aTid).getTime()
        })

        // Oppdater dager med data fra hver søknad
        dager = sorterteSøknader.reduce(
            (oppdaterteDager, søknad) => oppdaterDagerMedSøknadsdata(oppdaterteDager, søknad, fom, tom),
            dager,
        )
    }

    return dager
}

export function mapArbeidssituasjonTilSvar(arbeidssituasjon: string): Record<string, string> {
    switch (arbeidssituasjon) {
        case 'ARBEIDSTAKER':
            return {
                INNTEKTSKATEGORI: 'ARBEIDSTAKER',
                TYPE_ARBEIDSTAKER: 'ORDINÆRT_ARBEIDSFORHOLD',
                ER_SYKMELDT: 'ER_SYKMELDT_JA',
            }
        case 'FRILANSER':
            return {
                INNTEKTSKATEGORI: 'FRILANSER',
                ER_SYKMELDT: 'ER_SYKMELDT_JA',
            }
        case 'SELVSTENDIG_NARINGSDRIVENDE':
            return {
                INNTEKTSKATEGORI: 'SELVSTENDIG_NÆRINGSDRIVENDE',
                TYPE_SELVSTENDIG_NÆRINGSDRIVENDE: 'ORDINÆR_SELVSTENDIG_NÆRINGSDRIVENDE',
                ER_SYKMELDT: 'ER_SYKMELDT_JA',
            }
        case 'FISKER':
            return {
                INNTEKTSKATEGORI: 'SELVSTENDIG_NÆRINGSDRIVENDE',
                TYPE_SELVSTENDIG_NÆRINGSDRIVENDE: 'FISKER',
                FISKER_BLAD: 'FISKER_BLAD_B',
                ER_SYKMELDT: 'ER_SYKMELDT_JA',
            }
        case 'JORDBRUKER':
            return {
                INNTEKTSKATEGORI: 'SELVSTENDIG_NÆRINGSDRIVENDE',
                TYPE_SELVSTENDIG_NÆRINGSDRIVENDE: 'JORDBRUKER',
                ER_SYKMELDT: 'ER_SYKMELDT_JA',
            }
        case 'ARBEIDSLEDIG':
            return {
                INNTEKTSKATEGORI: 'ARBEIDSLEDIG',
                ER_SYKMELDT: 'ER_SYKMELDT_JA',
            }
        case 'ANNET':
            return {
                INNTEKTSKATEGORI: 'ANNET',
            }
        default:
            return {
                INNTEKTSKATEGORI: 'ANNET',
            }
    }
}

// Ny funksjon som matcher bakrommet sin kategorisering
function lagKategorisering(søknad: Søknad): Record<string, string> {
    const kategorisering = mapArbeidssituasjonTilSvar(søknad.arbeidssituasjon || 'ANNET')

    const orgnummer = søknad.arbeidsgiver?.orgnummer

    if (orgnummer) {
        kategorisering.ORGNUMMER = orgnummer
    }

    return kategorisering
}

export function genererDokumenterFraSøknader(søknader: Søknad[], søknadIder: string[]): Dokument[] {
    const valgteSøknader = søknader.filter((søknad) => søknadIder.includes(søknad.id))

    return valgteSøknader.map(
        (søknad): Dokument => ({
            id: uuidv4(),
            dokumentType: 'SØKNAD',
            eksternId: søknad.id,
            innhold: søknad,
            opprettet: new Date().toISOString(),
            request: {
                kilde: 'mock-api',
                tidsstempel: new Date().toISOString(),
            },
        }),
    )
}

export function opprettSaksbehandlingsperiode(
    spilleromPersonId: string,
    søknader: Søknad[],
    fom: string,
    tom: string,
    søknadIder: string[],
    uuid?: string,
): {
    saksbehandlingsperiode: Saksbehandlingsperiode
    inntektsforhold: Inntektsforhold[]
    dagoversikt: Record<string, Dagoversikt>
    dokumenter: Dokument[]
} {
    const dagoversikt: Record<string, Dagoversikt> = {}

    // Opprett saksbehandlingsperiode
    const saksbehandlingsperiode: Saksbehandlingsperiode = {
        id: uuid || uuidv4(),
        spilleromPersonId: spilleromPersonId,
        opprettet: new Date().toISOString(),
        opprettetAvNavIdent: 'Z123456',
        opprettetAvNavn: 'Test Testesen',
        fom: fom,
        tom: tom,
    }

    const inntektsforhold: Inntektsforhold[] = []

    // Automatisk opprettelse av inntektsforhold basert på valgte søknader
    if (søknadIder && søknadIder.length > 0) {
        const valgteSøknader = søknader.filter((søknad) => søknadIder.includes(søknad.id))

        // Grupper søknader basert på kategorisering (matcher bakrommet sin logikk)
        const kategorierOgSøknader = new Map<string, { kategorisering: Record<string, string>; søknader: Søknad[] }>()

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
            const nyttInntektsforhold: Inntektsforhold = {
                id: uuidv4(),
                kategorisering,
                dagoversikt: [],
                generertFraDokumenter: søknaderForKategori.map((s) => s.id),
            }

            inntektsforhold.push(nyttInntektsforhold)

            // Opprett dagoversikt fra søknader (matcher bakrommet sin logikk)
            dagoversikt[nyttInntektsforhold.id] = genererDagoversikt(fom, tom, søknaderForKategori)
        })
    }

    // Generer dokumenter fra søknadene
    const dokumenter = genererDokumenterFraSøknader(søknader, søknadIder)

    return {
        saksbehandlingsperiode,
        inntektsforhold,
        dagoversikt,
        dokumenter,
    }
}

export function genererSaksbehandlingsperioder(
    spilleromPersonId: string,
    søknader: Søknad[],
    perioder: Array<{ fom: string; tom: string; søknadIder: string[]; uuid?: string }>,
): {
    saksbehandlingsperioder: Saksbehandlingsperiode[]
    inntektsforhold: Record<string, Inntektsforhold[]>
    dagoversikt: Record<string, Dagoversikt>
    dokumenter: Record<string, Dokument[]>
} {
    const saksbehandlingsperioder: Saksbehandlingsperiode[] = []
    const alleInntektsforhold: Record<string, Inntektsforhold[]> = {}
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
        alleInntektsforhold[resultat.saksbehandlingsperiode.id] = resultat.inntektsforhold

        // Kombiner dagoversikt
        Object.assign(alleDagoversikt, resultat.dagoversikt)

        // Legg til dokumenter for denne saksbehandlingsperioden
        if (resultat.dokumenter.length > 0) {
            alleDokumenter[resultat.saksbehandlingsperiode.id] = resultat.dokumenter
        }
    })

    return {
        saksbehandlingsperioder,
        inntektsforhold: alleInntektsforhold,
        dagoversikt: alleDagoversikt,
        dokumenter: alleDokumenter,
    }
}
