'use client'

import React, { ReactElement, useState } from 'react'
import { PageBlock } from '@navikt/ds-react/Page'
import {
    RadioGroup,
    Radio,
    VStack,
    HStack,
    Heading,
    BodyShort,
    TextField,
    Button,
    Alert,
    Textarea,
    Checkbox,
} from '@navikt/ds-react'

type Inntektskategori = 'ARBEIDSTAKER' | 'SELVSTENDIG_NÆRINGSDRIVENDE' | 'FRILANSER' | 'ARBEIDSLEDIG' | 'INAKTIV'

const inntektskategorier = [
    { value: 'ARBEIDSTAKER', label: 'Arbeidstaker' },
    { value: 'SELVSTENDIG_NÆRINGSDRIVENDE', label: 'Selvstendig næringsdrivende' },
    { value: 'FRILANSER', label: 'Frilanser' },
    { value: 'ARBEIDSLEDIG', label: 'Arbeidsledig' },
    { value: 'INAKTIV', label: 'Inaktiv' },
] as const

const ArbeidstakerKomponent = () => {
    const [valgtKilde, setValgtKilde] = useState<string>('')
    const [valgtInntektsmelding, setValgtInntektsmelding] = useState<string>('')
    const [månedsbeløp, setMånedsbeløp] = useState<string>('')
    const [årsak, setÅrsak] = useState<string>('')
    const [begrunnelse, setBegrunnelse] = useState<string>('')
    const [harRefusjon, setHarRefusjon] = useState<boolean>(false)
    const [refusjonFom, setRefusjonFom] = useState<string>('')
    const [refusjonTom, setRefusjonTom] = useState<string>('')
    const [refusjonBeløp, setRefusjonBeløp] = useState<string>('')
    const [manueltMånedsbeløp, setManueltMånedsbeløp] = useState<string>('')
    const [manueltBegrunnelse, setManueltBegrunnelse] = useState<string>('')

    const inntektsmeldinger = [
        {
            id: 'im1',
            periode: '01.01.2024 - 31.01.2024',
            bestemmendeFraværsdag: '15.01.2024',
            månedsinntekt: '45 000 kr',
            refusjonsopplysninger: 'Refusjon: 0 kr',
        },
        {
            id: 'im2',
            periode: '01.02.2024 - 29.02.2024',
            bestemmendeFraværsdag: '14.02.2024',
            månedsinntekt: '47 500 kr',
            refusjonsopplysninger: 'Refusjon: 2 500 kr',
        },
        {
            id: 'im3',
            periode: '01.03.2024 - 31.03.2024',
            bestemmendeFraværsdag: '18.03.2024',
            månedsinntekt: '52 000 kr',
            refusjonsopplysninger: 'Refusjon: 0 kr',
        },
    ]

    return (
        <div className="border-gray-300 bg-white rounded-lg border p-6 shadow-sm">
            <VStack gap="4" align="start">
                <VStack gap="4" align="start" className="w-full">
                    <RadioGroup
                        legend="Velg kilde for inntektsdata"
                        value={valgtKilde}
                        onChange={(value) => setValgtKilde(value)}
                    >
                        <VStack gap="2" align="start">
                            <Radio value="INNTEKTSMELDING">Inntektsmelding</Radio>
                            <Radio value="AINNTEKT">Hent fra A-inntekt</Radio>
                            <Radio value="SKJONNSFASTSETTELSE">Skjønnsfastsatt</Radio>
                            <Radio value="MANUELLT_FASTSATT">Manuelt fastsatt grunnet ingen systemstøtte</Radio>
                        </VStack>
                    </RadioGroup>

                    {valgtKilde === 'INNTEKTSMELDING' && (
                        <VStack gap="4" align="start" className="w-full">
                            <RadioGroup
                                legend="Velg inntektsmelding"
                                value={valgtInntektsmelding}
                                onChange={(value) => setValgtInntektsmelding(value)}
                            >
                                <VStack gap="3" align="start">
                                    {inntektsmeldinger.map((melding) => (
                                        <div key={melding.id} className="w-full">
                                            <Radio value={melding.id} className="w-full">
                                                <div className="border-gray-300 bg-gray-50 hover:bg-gray-100 w-full rounded-lg border p-4 transition-colors">
                                                    <VStack gap="2" align="start">
                                                        <BodyShort className="font-semibold">
                                                            Periode: {melding.periode}
                                                        </BodyShort>
                                                        <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                                                            <div>
                                                                <span className="font-medium">
                                                                    Bestemmende fraværsdag:
                                                                </span>
                                                                <br />
                                                                <span className="text-gray-700">
                                                                    {melding.bestemmendeFraværsdag}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Månedsinntekt:</span>
                                                                <br />
                                                                <span className="text-gray-700">
                                                                    {melding.månedsinntekt}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">
                                                                    Refusjonsopplysninger:
                                                                </span>
                                                                <br />
                                                                <span className="text-gray-700">
                                                                    {melding.refusjonsopplysninger}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </VStack>
                                                </div>
                                            </Radio>
                                        </div>
                                    ))}
                                </VStack>
                            </RadioGroup>
                        </VStack>
                    )}

                    {valgtKilde === 'AINNTEKT' && (
                        <Alert variant="info">
                            <BodyShort>
                                Vi henter automatisk inn de siste 3 månedenes A-inntekt data programmatisk i bakrommet.
                                Resulatet vises til brukeren etter lagring. Hvis det feiler eller ikke er registrert noe
                                så viser vi feilmelding slik at saksbehandleren kan bytte til skjønnsfastsettelse.
                            </BodyShort>
                        </Alert>
                    )}

                    {valgtKilde === 'SKJONNSFASTSETTELSE' && (
                        <VStack gap="4" align="start" className="w-full">
                            <TextField
                                label="Månedsbeløp (kr)"
                                placeholder="50000"
                                value={månedsbeløp}
                                onChange={(e) => setMånedsbeløp(e.target.value)}
                                className="w-48"
                            />

                            <RadioGroup
                                legend="Årsak til skjønnsfastsettelse"
                                value={årsak}
                                onChange={(value) => setÅrsak(value)}
                            >
                                <VStack gap="2" align="start">
                                    <Radio value="AVVIK_25_PROSENT">
                                        Skjønnsfastsettelse ved mer enn 25 % avvik (§ 8-30 andre ledd)
                                    </Radio>
                                    <Radio value="MANGFULL_RAPPORTERING">
                                        Skjønnsfastsettelse ved mangelfull eller uriktig rapportering (§ 8-30 tredje
                                        ledd)
                                    </Radio>
                                    <Radio value="TIDSAVGRENSET">
                                        Skjønnsfastsettelse ved tidsbegrenset arbeidsforhold under 6 måneder (§ 8-30
                                        fjerde ledd)
                                    </Radio>
                                </VStack>
                            </RadioGroup>

                            <Textarea
                                label="Begrunnelse for skjønnsfastsettelse"
                                placeholder="Beskriv begrunnelsen for skjønnsfastsettelsen..."
                                value={begrunnelse}
                                onChange={(e) => setBegrunnelse(e.target.value)}
                                className="w-full"
                                rows={3}
                            />

                            <VStack gap="3" align="start" className="w-full">
                                <Checkbox checked={harRefusjon} onChange={(e) => setHarRefusjon(e.target.checked)}>
                                    Har refusjon
                                </Checkbox>

                                {harRefusjon && (
                                    <VStack gap="3" align="start" className="w-full pl-6">
                                        <HStack gap="4" align="end" wrap={false} className="w-full">
                                            <TextField
                                                label="Refusjon fra (dato)"
                                                placeholder="01.01.2024"
                                                value={refusjonFom}
                                                onChange={(e) => setRefusjonFom(e.target.value)}
                                                className="w-32"
                                            />
                                            <TextField
                                                label="Refusjon til (dato)"
                                                placeholder="31.01.2024"
                                                value={refusjonTom}
                                                onChange={(e) => setRefusjonTom(e.target.value)}
                                                className="w-32"
                                            />
                                            <TextField
                                                label="Refusjonsbeløp (kr)"
                                                placeholder="2500"
                                                value={refusjonBeløp}
                                                onChange={(e) => setRefusjonBeløp(e.target.value)}
                                                className="w-32"
                                            />
                                        </HStack>
                                    </VStack>
                                )}
                            </VStack>
                        </VStack>
                    )}

                    {valgtKilde === 'MANUELLT_FASTSATT' && (
                        <VStack gap="4" align="start" className="w-full">
                            <Alert variant="info">
                                <BodyShort>
                                    Denne kan typisk brukes for vernepliktige om vi aldri lager spesifikk støtte for
                                    det. Eller i utviklingsfasen frem til vi lager inntektsmelding og ainntekt import.
                                </BodyShort>
                            </Alert>

                            <TextField
                                label="Månedsbeløp (kr)"
                                placeholder="50000"
                                value={manueltMånedsbeløp}
                                onChange={(e) => setManueltMånedsbeløp(e.target.value)}
                                className="w-48"
                            />

                            <Textarea
                                label="Begrunnelse"
                                placeholder="Beskriv begrunnelsen for manuell fastsettelse..."
                                value={manueltBegrunnelse}
                                onChange={(e) => setManueltBegrunnelse(e.target.value)}
                                className="w-full"
                                rows={3}
                            />
                        </VStack>
                    )}
                </VStack>
            </VStack>
        </div>
    )
}

const PensjonsgivendeInntektKomponent = () => {
    const [valgtKilde, setValgtKilde] = useState<string>('')
    const [årsak, setÅrsak] = useState<string>('')
    const [årsinntekt, setÅrsinntekt] = useState<string>('')
    const [begrunnelse, setBegrunnelse] = useState<string>('')

    return (
        <div className="border-gray-300 bg-white rounded-lg border p-6 shadow-sm">
            <VStack gap="4" align="start">
                <VStack gap="4" align="start" className="w-full">
                    <RadioGroup
                        legend="Velg kilde for inntektsdata"
                        value={valgtKilde}
                        onChange={(value) => setValgtKilde(value)}
                    >
                        <VStack gap="2" align="start">
                            <Radio value="PENSJONSGIVENDE_INNTEKT">Bruk pensjonsgivende inntekt fra skatteetaten</Radio>
                            <Radio value="SKJONNSFASTSETTELSE">Skjønnsfastsettelse</Radio>
                        </VStack>
                    </RadioGroup>

                    {valgtKilde === 'PENSJONSGIVENDE_INNTEKT' && (
                        <Alert variant="info">
                            <BodyShort>
                                Vi henter automatisk inn de siste 3 års pensjonsgivende inntekt fra sigrun programmatisk
                                i bakrommet. Vi G regulerer og regner ut snittet. Resulatet og regnestykket vises til
                                brukeren etter lagring. Hvis det feiler eller ikke er registrert noe så viser vi
                                feilmelding slik at saksbehandleren kan bytte til skjønnsfastsettelse.
                            </BodyShort>
                        </Alert>
                    )}

                    {valgtKilde === 'SKJONNSFASTSETTELSE' && (
                        <VStack gap="4" align="start" className="w-full">
                            <RadioGroup
                                legend="Årsak for skjønnsfastsettelse"
                                value={årsak}
                                onChange={(value) => setÅrsak(value)}
                            >
                                <VStack gap="2" align="start">
                                    <Radio value="AVVIK_25_PROSENT_VARIG_ENDRING">25% avvik og varig endring</Radio>
                                    <Radio value="MANGLENDE_OPPLYSNINGER">Manglende opplysninger</Radio>
                                    <Radio value="FEILAKTIGE_OPPLYSNINGER">Feilaktige opplysninger</Radio>
                                </VStack>
                            </RadioGroup>

                            <TextField
                                label="Skjønnsfastsatt pensjonsgivende årsinntekt (kr)"
                                placeholder="500000"
                                value={årsinntekt}
                                onChange={(e) => setÅrsinntekt(e.target.value)}
                                className="w-48"
                            />

                            <Textarea
                                label="Begrunnelse for skjønnsfastsettelse"
                                placeholder="Beskriv begrunnelsen for skjønnsfastsettelsen..."
                                value={begrunnelse}
                                onChange={(e) => setBegrunnelse(e.target.value)}
                                className="w-full"
                                rows={3}
                            />

                            <Button variant="secondary">Legg til</Button>
                        </VStack>
                    )}
                </VStack>
            </VStack>
        </div>
    )
}

const FrilanserKomponent = () => {
    const [valgtKilde, setValgtKilde] = useState<string>('')
    const [månedsbeløp, setMånedsbeløp] = useState<string>('')
    const [årsak, setÅrsak] = useState<string>('')
    const [begrunnelse, setBegrunnelse] = useState<string>('')

    return (
        <div className="border-gray-300 bg-white rounded-lg border p-6 shadow-sm">
            <VStack gap="4" align="start">
                <VStack gap="4" align="start" className="w-full">
                    <RadioGroup
                        legend="Velg kilde for inntektsdata"
                        value={valgtKilde}
                        onChange={(value) => setValgtKilde(value)}
                    >
                        <VStack gap="2" align="start">
                            <Radio value="AINNTEKT">Hent fra A-inntekt</Radio>
                            <Radio value="SKJONNSFASTSETTELSE">Skjønnsfastsatt</Radio>
                        </VStack>
                    </RadioGroup>

                    {valgtKilde === 'AINNTEKT' && (
                        <Alert variant="info">
                            <BodyShort>
                                Vi henter automatisk inn de siste 3 månedenes A-inntekt data programmatisk i bakrommet.
                                Resultatet vises til brukeren etter lagring. Hvis det feiler eller ikke er registrert
                                noe så viser vi feilmelding slik at saksbehandleren kan bytte til skjønnsfastsettelse.
                            </BodyShort>
                        </Alert>
                    )}

                    {valgtKilde === 'SKJONNSFASTSETTELSE' && (
                        <VStack gap="4" align="start" className="w-full">
                            <TextField
                                label="Månedsbeløp (kr)"
                                placeholder="30000"
                                value={månedsbeløp}
                                onChange={(e) => setMånedsbeløp(e.target.value)}
                                className="w-48"
                            />

                            <RadioGroup
                                legend="Årsak til skjønnsfastsettelse"
                                value={årsak}
                                onChange={(value) => setÅrsak(value)}
                            >
                                <VStack gap="2" align="start">
                                    <Radio value="AVVIK_25_PROSENT">
                                        Skjønnsfastsettelse ved mer enn 25 % avvik (§ 8-30 andre ledd)
                                    </Radio>
                                    <Radio value="MANGFULL_RAPPORTERING">
                                        Skjønnsfastsettelse ved mangelfull eller uriktig rapportering (§ 8-30 tredje
                                        ledd)
                                    </Radio>
                                </VStack>
                            </RadioGroup>

                            <Textarea
                                label="Begrunnelse for skjønnsfastsettelse"
                                placeholder="Beskriv begrunnelsen for skjønnsfastsettelsen..."
                                value={begrunnelse}
                                onChange={(e) => setBegrunnelse(e.target.value)}
                                className="w-full"
                                rows={3}
                            />
                        </VStack>
                    )}
                </VStack>
            </VStack>
        </div>
    )
}

const ArbeidsledigKomponent = () => {
    const [valgtKilde, setValgtKilde] = useState<string>('')
    const [dagpengerPerUke, setDagpengerPerUke] = useState<string>('')
    const [månedligBeløp, setMånedligBeløp] = useState<string>('')

    return (
        <div className="border-gray-300 bg-white rounded-lg border p-6 shadow-sm">
            <VStack gap="4" align="start">
                <VStack gap="4" align="start" className="w-full">
                    <RadioGroup
                        legend="Velg type inntekt"
                        value={valgtKilde}
                        onChange={(value) => setValgtKilde(value)}
                    >
                        <VStack gap="2" align="start">
                            <Radio value="DAGPENGER">Dagpenger</Radio>
                            <Radio value="VENTELØNN">Ventelønn</Radio>
                            <Radio value="VARTPENGER">Vartpenger</Radio>
                        </VStack>
                    </RadioGroup>

                    {valgtKilde === 'DAGPENGER' && (
                        <VStack gap="4" align="start" className="w-full">
                            <TextField
                                label="Beløp per uke (kr)"
                                placeholder="5000"
                                value={dagpengerPerUke}
                                onChange={(e) => setDagpengerPerUke(e.target.value)}
                                className="w-48"
                            />
                        </VStack>
                    )}

                    {(valgtKilde === 'VENTELØNN' || valgtKilde === 'VARTPENGER') && (
                        <VStack gap="4" align="start" className="w-full">
                            <TextField
                                label="Månedlig beløp (kr)"
                                placeholder="20000"
                                value={månedligBeløp}
                                onChange={(e) => setMånedligBeløp(e.target.value)}
                                className="w-48"
                            />
                        </VStack>
                    )}
                </VStack>
            </VStack>
        </div>
    )
}

export default function Page(): ReactElement {
    const [valgtKategori, setValgtKategori] = useState<Inntektskategori | null>(null)

    const renderKategoriKomponent = () => {
        switch (valgtKategori) {
            case 'ARBEIDSTAKER':
                return <ArbeidstakerKomponent />
            case 'SELVSTENDIG_NÆRINGSDRIVENDE':
                return <PensjonsgivendeInntektKomponent />
            case 'FRILANSER':
                return <FrilanserKomponent />
            case 'ARBEIDSLEDIG':
                return <ArbeidsledigKomponent />
            case 'INAKTIV':
                return <PensjonsgivendeInntektKomponent />
            default:
                return null
        }
    }

    return (
        <PageBlock as="main" className="h-[calc(100vh-58px)] p-40">
            <VStack gap="6" align="start" className="pb-40">
                <Heading size="large">Sykepengegrunnlag</Heading>

                <VStack gap="4" align="start">
                    <Heading size="medium">Velg inntektskategori</Heading>
                    <RadioGroup
                        value={valgtKategori || ''}
                        onChange={(value) => setValgtKategori(value as Inntektskategori)}
                        legend="Inntektskategorier"
                        hideLegend
                    >
                        <VStack gap="2" align="start">
                            {inntektskategorier.map((kategori) => (
                                <Radio key={kategori.value} value={kategori.value}>
                                    {kategori.label}
                                </Radio>
                            ))}
                        </VStack>
                    </RadioGroup>
                </VStack>

                {valgtKategori && (
                    <VStack gap="4" align="start" className="w-full">
                        <Heading size="medium">
                            {inntektskategorier.find((k) => k.value === valgtKategori)?.label}
                        </Heading>
                        {renderKategoriKomponent()}
                        <Button variant="secondary">Lagre</Button>
                    </VStack>
                )}
            </VStack>
        </PageBlock>
    )
}
