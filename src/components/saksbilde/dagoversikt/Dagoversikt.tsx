'use client'

import { ReactElement, useState } from 'react'
import { Alert, BodyShort, Button, Heading, HStack, Table, Tabs, Checkbox, Select, VStack } from '@navikt/ds-react'
import { TabsList, TabsPanel, TabsTab } from '@navikt/ds-react/Tabs'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'
import { BandageIcon, PersonPencilIcon } from '@navikt/aksel-icons'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'
import { useOppdaterInntektsforholdDagoversikt } from '@hooks/mutations/useOppdaterInntektsforhold'
import { getFormattedDateString } from '@utils/date-format'
import { kildeIcon } from '@components/ikoner/kilde/kildeIcon'
import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'
import { Dag, Dagtype } from '@/schemas/dagoversikt'

interface DagoversiktProps {
    value: string
}

export function Dagoversikt({ value }: DagoversiktProps): ReactElement {
    const {
        data: inntektsforhold,
        isLoading: inntektsforholdLoading,
        isError: inntektsforholdError,
    } = useInntektsforhold()

    const oppdaterDagoversiktMutation = useOppdaterInntektsforholdDagoversikt()

    // Filtrer kun inntektsforhold hvor personen har dagoversikt med innhold
    const sykmeldingsforhold =
        inntektsforhold?.filter((forhold) => forhold.dagoversikt && forhold.dagoversikt.length > 0) || []

    const [aktivtInntektsforholdId, setAktivtInntektsforholdId] = useState<string>()
    const [erIRedigeringsmodus, setErIRedigeringsmodus] = useState(false)
    const [valgteDataer, setValgteDataer] = useState<Set<string>>(new Set())
    const [nyDagtype, setNyDagtype] = useState<Dagtype>('Syk')
    const [nyGrad, setNyGrad] = useState<string>('')

    // Sett første sykmeldingsforhold som aktivt hvis det ikke er sett
    const aktivtForhold = aktivtInntektsforholdId
        ? sykmeldingsforhold.find((f) => f.id === aktivtInntektsforholdId)
        : sykmeldingsforhold[0]

    const handleDatoToggle = (dato: string, valgt: boolean) => {
        const nyeValgteDataer = new Set(valgteDataer)
        if (valgt) {
            nyeValgteDataer.add(dato)
        } else {
            nyeValgteDataer.delete(dato)
        }
        setValgteDataer(nyeValgteDataer)
    }

    const handleAvbrytRedigering = () => {
        setErIRedigeringsmodus(false)
        setValgteDataer(new Set())
        setNyDagtype('Syk')
        setNyGrad('')
    }

    const handleFerdigRedigering = async () => {
        if (!aktivtForhold || valgteDataer.size === 0) return

        const oppdaterteDager: Dag[] = []

        // Opprett kun de dagene som skal oppdateres
        valgteDataer.forEach((dato) => {
            const eksisterendeDag = aktivtForhold.dagoversikt?.find((d) => d.dato === dato)
            if (eksisterendeDag) {
                oppdaterteDager.push({
                    ...eksisterendeDag,
                    dagtype: nyDagtype,
                    grad: nyGrad ? parseInt(nyGrad) : null,
                    kilde: 'Saksbehandler',
                })
            }
        })

        try {
            await oppdaterDagoversiktMutation.mutateAsync({
                inntektsforholdId: aktivtForhold.id,
                dager: oppdaterteDager,
            })

            // Tilbakestill state etter vellykket oppdatering
            handleAvbrytRedigering()
        } catch (error) {
            // Feilen blir håndtert av mutation-hooken
        }
    }

    const getInntektsforholdDisplayText = (kategorisering: Record<string, string | string[]>): ReactElement => {
        const inntektskategori = kategorisering['INNTEKTSKATEGORI'] as string
        const orgnummer = kategorisering['ORGNUMMER'] as string

        let typeText = ''
        switch (inntektskategori) {
            case 'ARBEIDSTAKER': {
                const typeArbeidstaker = kategorisering['TYPE_ARBEIDSTAKER']
                switch (typeArbeidstaker) {
                    case 'ORDINÆRT_ARBEIDSFORHOLD':
                        typeText = 'Ordinært arbeidsforhold'
                        break
                    case 'MARITIMT_ARBEIDSFORHOLD':
                        typeText = 'Maritimt arbeidsforhold'
                        break
                    case 'FISKER':
                        typeText = 'Fisker (arbeidstaker)'
                        break
                    case 'VERNEPLIKTIG':
                        typeText = 'Vernepliktig'
                        break
                    default:
                        typeText = 'Arbeidstaker'
                }
                break
            }
            case 'FRILANSER':
                typeText = 'Frilanser'
                break
            case 'SELVSTENDIG_NÆRINGSDRIVENDE': {
                // TODO Her må det gjøres noe
                const typeSelvstendig = kategorisering['TYPE_SELVSTENDIG_NÆRINGSDRIVENDE']
                switch (typeSelvstendig) {
                    case 'FISKER':
                        typeText = 'Fisker (selvstendig)'
                        break
                    case 'JORDBRUKER':
                        typeText = 'Jordbruker'
                        break
                    case 'REINDRIFT':
                        typeText = 'Reindrift'
                        break
                    default:
                        typeText = 'Selvstendig næringsdrivende'
                }
                break
            }
            case 'INAKTIV':
                typeText = 'Inaktiv'
                break
            default:
                typeText = inntektskategori || 'Ukjent'
        }

        // Hvis det finnes orgnummer, vis organisasjonsnavn
        if (orgnummer) {
            return (
                <div className="text-center">
                    <div className="text-sm font-medium">
                        <Organisasjonsnavn orgnummer={orgnummer} />
                    </div>
                    <div className="text-xs text-gray-600">{typeText}</div>
                </div>
            )
        }

        return <span>{typeText}</span>
    }

    const getDagtypeText = (type: string): string => {
        switch (type) {
            case 'Syk':
                return 'Syk'
            case 'SykNav':
                return 'Syk (NAV)'
            case 'Helg':
                return 'Helg'
            case 'Ferie':
                return 'Ferie'
            case 'Arbeidsdag':
                return 'Arbeid'
            case 'Permisjon':
                return 'Permisjon'
            case 'Foreldet':
                return 'Foreldet'
            case 'Avvist':
                return 'Avvist'
            default:
                return type
        }
    }

    if (inntektsforholdLoading) {
        return <SaksbildePanel value={value}>Laster inntektsforhold...</SaksbildePanel>
    }

    if (inntektsforholdError) {
        return (
            <SaksbildePanel value={value}>
                <Alert variant="error">Kunne ikke laste inntektsforhold</Alert>
            </SaksbildePanel>
        )
    }

    if (sykmeldingsforhold.length === 0) {
        return (
            <SaksbildePanel value={value}>
                <Alert variant="info">
                    <Heading size="small">Ingen dagoversikt funnet</Heading>
                    <BodyShort>
                        Det finnes ingen inntektsforhold for denne saksbehandlingsperioden med dagoversikt.
                    </BodyShort>
                </Alert>
            </SaksbildePanel>
        )
    }

    return (
        <SaksbildePanel value={value}>
            <Tabs
                value={aktivtForhold?.id || sykmeldingsforhold[0]?.id}
                onChange={(value) => setAktivtInntektsforholdId(value)}
            >
                <TabsList>
                    {sykmeldingsforhold.map((forhold) => (
                        <TabsTab
                            key={forhold.id}
                            value={forhold.id}
                            label={getInntektsforholdDisplayText(forhold.kategorisering)}
                        />
                    ))}
                </TabsList>

                {sykmeldingsforhold.map((forhold) => (
                    <TabsPanel key={forhold.id} value={forhold.id}>
                        {forhold.dagoversikt && forhold.dagoversikt.length > 0 && (
                            <>
                                <Button
                                    size="small"
                                    type="button"
                                    variant="tertiary"
                                    className="my-6"
                                    icon={<PersonPencilIcon />}
                                    onClick={() =>
                                        erIRedigeringsmodus ? handleAvbrytRedigering() : setErIRedigeringsmodus(true)
                                    }
                                >
                                    {erIRedigeringsmodus ? 'Avbryt' : 'Endre dager'}
                                </Button>
                                <Table size="small">
                                    <TableHeader>
                                        <TableRow>
                                            {erIRedigeringsmodus && <TableHeaderCell>Velg</TableHeaderCell>}
                                            <TableHeaderCell>Dato</TableHeaderCell>
                                            <TableHeaderCell>Dagtype</TableHeaderCell>
                                            <TableHeaderCell align="right">Grad</TableHeaderCell>
                                            <TableHeaderCell>Kilde</TableHeaderCell>
                                            <TableHeaderCell align="right">Total grad</TableHeaderCell>
                                            <TableHeaderCell align="right">Refusjon</TableHeaderCell>
                                            <TableHeaderCell align="right">Utbetaling</TableHeaderCell>
                                            <TableHeaderCell align="right">Dager igjen</TableHeaderCell>
                                            <TableHeaderCell>Merknader</TableHeaderCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {forhold.dagoversikt.map((dag, i) => (
                                            <TableRow key={i}>
                                                {erIRedigeringsmodus && (
                                                    <TableDataCell>
                                                        <Checkbox
                                                            value={dag.dato}
                                                            checked={valgteDataer.has(dag.dato)}
                                                            onChange={(e) =>
                                                                handleDatoToggle(dag.dato, e.target.checked)
                                                            }
                                                            hideLabel
                                                        >
                                                            Velg dag
                                                        </Checkbox>
                                                    </TableDataCell>
                                                )}
                                                <TableDataCell>
                                                    <BodyShort>{getFormattedDateString(dag.dato)}</BodyShort>
                                                </TableDataCell>
                                                <TableDataCell>
                                                    <HStack wrap={false} gap="2" align="center">
                                                        {getDagtypeIcon(dag.dagtype)}
                                                        <BodyShort>{getDagtypeText(dag.dagtype)}</BodyShort>
                                                    </HStack>
                                                </TableDataCell>
                                                <TableDataCell align="right">
                                                    <BodyShort>{dag.grad ? `${dag.grad} %` : '-'}</BodyShort>
                                                </TableDataCell>
                                                <TableDataCell>
                                                    <div className="ml-2">{kildeIcon[dag.kilde]}</div>
                                                </TableDataCell>
                                                <TableDataCell align="right">
                                                    <BodyShort>-</BodyShort>
                                                </TableDataCell>
                                                <TableDataCell align="right">
                                                    <BodyShort>-</BodyShort>
                                                </TableDataCell>
                                                <TableDataCell align="right">
                                                    <BodyShort>-</BodyShort>
                                                </TableDataCell>
                                                <TableDataCell align="right">
                                                    <BodyShort>-</BodyShort>
                                                </TableDataCell>
                                                <TableDataCell />
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {erIRedigeringsmodus && valgteDataer.size > 0 && (
                                    <div className="mt-6 rounded-lg border bg-gray-50 p-4">
                                        <Heading size="small" className="mb-4">
                                            Fyll inn hva de {valgteDataer.size} valgte dagene skal endres til
                                        </Heading>
                                        <VStack gap="4">
                                            <Select
                                                label="Dagtype"
                                                value={nyDagtype}
                                                onChange={(e) => setNyDagtype(e.target.value as Dagtype)}
                                            >
                                                <option value="Syk">Syk</option>
                                                <option value="SykNav">Syk (NAV)</option>
                                                <option value="Arbeidsdag">Arbeidsdag</option>
                                                <option value="Helg">Helg</option>
                                                <option value="Ferie">Ferie</option>
                                                <option value="Permisjon">Permisjon</option>
                                                <option value="Foreldet">Foreldet</option>
                                                <option value="Avvist">Avvist</option>
                                            </Select>

                                            <Select
                                                label="Grad"
                                                value={nyGrad}
                                                onChange={(e) => setNyGrad(e.target.value)}
                                            >
                                                <option value="">Ingen grad</option>
                                                <option value="20">20%</option>
                                                <option value="40">40%</option>
                                                <option value="50">50%</option>
                                                <option value="60">60%</option>
                                                <option value="80">80%</option>
                                                <option value="100">100%</option>
                                            </Select>

                                            <div className="text-sm text-gray-600">
                                                Begrunn hvorfor det er gjort endringer i sykdomstidslinjen. Teksten
                                                vises ikke til den sykmeldte, men den blir henvist til for behandlers
                                                egen kreditering.
                                            </div>

                                            <HStack gap="2">
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    onClick={handleFerdigRedigering}
                                                    loading={oppdaterDagoversiktMutation.isPending}
                                                    disabled={valgteDataer.size === 0}
                                                >
                                                    Ferdig
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={handleAvbrytRedigering}
                                                >
                                                    Avbryt
                                                </Button>
                                            </HStack>
                                        </VStack>
                                    </div>
                                )}
                            </>
                        )}

                        {(!forhold.dagoversikt || forhold.dagoversikt.length === 0) && (
                            <Alert variant="info">Ingen dagoversikt funnet for dette inntektsforholdet.</Alert>
                        )}
                    </TabsPanel>
                ))}
            </Tabs>
        </SaksbildePanel>
    )
}

function getDagtypeIcon(dagtype: string): ReactElement {
    switch (dagtype) {
        case 'Syk':
        case 'SykNav':
            return <BandageIcon />
        default:
            return <span className="w-[18px]" />
    }
}
