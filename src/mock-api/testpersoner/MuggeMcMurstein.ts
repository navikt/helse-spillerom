import { Testperson } from '@/mock-api/testpersoner/testpersoner'
import { Søknad } from '@/schemas/søknad'

const muggeGrunndata = {
    personId: 'mugge',
    personinfo: {
        fødselsnummer: '01020304050',
        aktørId: '0102030405099',
        navn: 'Mugge McMurstein',
        alder: 65,
    },
    soknader: [] as Søknad[],
}

// Definer to arbeidsgivere
const arbeidsgiver1 = { navn: 'Murstein AS', orgnummer: '999999991' }
const arbeidsgiver2 = { navn: 'Betongbygg AS', orgnummer: '999999992' }

// Startdato for første arbeidsforhold
const start1 = new Date('2025-01-01')
const start2 = new Date('2025-01-08') // én uke etter første

function addDays(date: Date, days: number) {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
}
function toISO(date: Date) {
    return date.toISOString().slice(0, 10)
}

// Generer 5 søknader for hvert arbeidsforhold, 2 uker lange, kant-i-kant
let prevTom1 = new Date(start1)
let prevTom2 = new Date(start2)
for (let i = 0; i < 5; i++) {
    // Arbeidsforhold 1
    const fom1 = i === 0 ? new Date(start1) : addDays(prevTom1, 1)
    const tom1 = addDays(fom1, 13)
    muggeGrunndata.soknader.push({
        id: `mugge-1-${i + 1}`,
        type: 'ARBEIDSTAKERE',
        status: 'NY',
        arbeidssituasjon: 'ARBEIDSTAKER',
        fom: toISO(fom1),
        tom: toISO(tom1),
        korrigerer: null,
        korrigertAv: null,
        sykmeldingSkrevet: toISO(fom1),
        startSyketilfelle: toISO(fom1),
        opprettet: toISO(fom1),
        sendtNav: toISO(fom1),
        sendtArbeidsgiver: toISO(fom1),
        arbeidsgiver: arbeidsgiver1,
        soknadsperioder: [
            {
                fom: toISO(fom1),
                tom: toISO(tom1),
                grad: 100,
                sykmeldingstype: 'Sykemldingstype',
            },
        ],
    })
    prevTom1 = new Date(tom1)
    // Arbeidsforhold 2
    const fom2 = i === 0 ? new Date(start2) : addDays(prevTom2, 1)
    const tom2 = addDays(fom2, 13)
    muggeGrunndata.soknader.push({
        id: `mugge-2-${i + 1}`,
        type: 'ARBEIDSTAKERE',
        status: 'NY',
        arbeidssituasjon: 'ARBEIDSTAKER',
        fom: toISO(fom2),
        tom: toISO(tom2),
        korrigerer: null,
        korrigertAv: null,
        sykmeldingSkrevet: toISO(fom2),
        startSyketilfelle: toISO(fom2),
        opprettet: toISO(fom2),
        sendtNav: toISO(fom2),
        sendtArbeidsgiver: toISO(fom2),
        arbeidsgiver: arbeidsgiver2,
        soknadsperioder: [
            {
                fom: toISO(fom2),
                tom: toISO(tom2),
                grad: 100,
                sykmeldingstype: 'Sykemldingstype',
            },
        ],
    })
    prevTom2 = new Date(tom2)
}

// Saksbehandlingsperioder: én for hver søknad

export const Mugge: Testperson = {
    ...muggeGrunndata,
    saksbehandlingsperioder: [],
    yrkesaktivitet: {},
    dagoversikt: {},
    dokumenter: {},
}
