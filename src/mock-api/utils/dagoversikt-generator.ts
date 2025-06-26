import { Dag, Dagoversikt } from '@/schemas/dagoversikt'
import { Søknad } from '@/schemas/søknad'

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
                        grad:
                            periode.faktiskGrad !== null && periode.faktiskGrad !== undefined
                                ? 100 - periode.faktiskGrad
                                : (periode.grad ?? periode.sykmeldingsgrad ?? null),
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

/**
 * Genererer dagoversikt basert på søknader for en gitt periode
 * Matcher bakrommet sin logikk for å opprette dager fra søknadsdata
 */
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
