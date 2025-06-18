'use client'

import { ReactElement, useState } from 'react'
import { Alert, BodyShort, Box, Button, Table, VStack } from '@navikt/ds-react'
import {
    TableBody,
    TableDataCell,
    TableExpandableRow,
    TableHeader,
    TableHeaderCell,
    TableRow,
} from '@navikt/ds-react/Table'
import { PlusIcon } from '@navikt/aksel-icons'
import { AnimatePresence, motion } from 'motion/react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'
import InntektsforholdForm from '@components/saksbilde/inntektsforhold/InntektsforholdForm'

export function Inntektsforhold({ value }: { value: string }): ReactElement {
    const [visOpprettForm, setVisOpprettForm] = useState(false)
    const { data: inntektsforhold, isLoading, isError } = useInntektsforhold()

    if (isLoading) return <SaksbildePanel value={value}>Laster...</SaksbildePanel>
    if (isError)
        return (
            <SaksbildePanel value={value}>
                <Alert variant="error">Kunne ikke laste inntektsforhold</Alert>
            </SaksbildePanel>
        )

    return (
        <SaksbildePanel value={value}>
            <VStack gap="6">
                <Button
                    className="w-fit"
                    variant="secondary"
                    size="small"
                    icon={<PlusIcon />}
                    onClick={() => setVisOpprettForm((prev) => !prev)}
                >
                    Legg til inntektsforhold
                </Button>
                <AnimatePresence initial={false}>
                    {visOpprettForm && (
                        <motion.div
                            key="opprett-inntektsforhold"
                            transition={{
                                type: 'tween',
                                duration: 0.2,
                                ease: 'easeInOut',
                            }}
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                        >
                            <Box
                                background="surface-selected"
                                padding="8"
                                borderRadius="medium"
                                borderColor="border-subtle"
                                borderWidth="1"
                            >
                                <InntektsforholdForm closeForm={() => setVisOpprettForm(false)} />
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>

                {inntektsforhold && inntektsforhold.length > 0 ? (
                    <Table size="medium">
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell />
                                <TableHeaderCell>Type</TableHeaderCell>
                                <TableHeaderCell>Organisasjon</TableHeaderCell>
                                <TableHeaderCell>Sykmeldt fra forholdet</TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inntektsforhold.map((forhold) => {
                                console.log(forhold.svar['ER_SYKMELDT'])
                                return (
                                    <TableExpandableRow key={forhold.id} expandOnRowClick content="placeholder">
                                        <TableDataCell>
                                            <BodyShort>{getInntektsforholdDisplayText(forhold.svar)}</BodyShort>
                                        </TableDataCell>
                                        <TableDataCell>
                                            <VStack gap="1">
                                                {forhold.svar['ORGNAVN'] && (
                                                    <BodyShort weight="semibold">{forhold.svar['ORGNAVN']}</BodyShort>
                                                )}
                                                {forhold.svar['ORGNUMMER'] && (
                                                    <BodyShort className="font-mono text-sm text-gray-600">
                                                        {forhold.svar['ORGNUMMER']}
                                                    </BodyShort>
                                                )}
                                                {!forhold.svar['ORGNUMMER'] && !forhold.svar['ORGNAVN'] && (
                                                    <BodyShort className="text-gray-500">-</BodyShort>
                                                )}
                                            </VStack>
                                        </TableDataCell>
                                        <TableDataCell>
                                            <BodyShort>
                                                {forhold.svar['ER_SYKMELDT'] === 'ER_SYKMELDT_JA' ? 'Ja' : 'Nei'}
                                            </BodyShort>
                                        </TableDataCell>
                                    </TableExpandableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                ) : (
                    <Alert variant="info">
                        <BodyShort>Ingen inntektsforhold registrert for denne saksbehandlingsperioden.</BodyShort>
                    </Alert>
                )}
            </VStack>
        </SaksbildePanel>
    )
}

function getInntektsforholdDisplayText(svar: Record<string, string | string[]>): string {
    const inntektskategori = svar['INNTEKTSKATEGORI'] as string

    switch (inntektskategori) {
        case 'ARBEIDSTAKER': {
            const typeArbeidstaker = svar['TYPE_ARBEIDSTAKER']
            switch (typeArbeidstaker) {
                case 'ORDINÆRT_ARBEIDSFORHOLD':
                    return 'Ordinært arbeidsforhold'
                case 'MARITIMT_ARBEIDSFORHOLD':
                    return 'Maritimt arbeidsforhold'
                case 'FISKER':
                    return 'Fisker (arbeidstaker)'
                default:
                    return 'Arbeidstaker'
            }
        }
        case 'FRILANSER':
            return 'Frilanser'
        case 'SELVSTENDIG_NÆRINGSDRIVENDE': {
            // TODO her må det vel gjøres noe
            const typeSelvstendig = svar['TYPE_SELVSTENDIG_NÆRINGSDRIVENDE']
            switch (typeSelvstendig) {
                case 'FISKER':
                    return 'Fisker (selvstendig)'
                case 'JORDBRUKER':
                    return 'Jordbruker'
                case 'REINDRIFT':
                    return 'Reindrift'
                default:
                    return 'Selvstendig næringsdrivende'
            }
        }
        case 'INAKTIV':
            return 'Inaktiv'
        default:
            return inntektskategori || 'Ukjent'
    }
}
