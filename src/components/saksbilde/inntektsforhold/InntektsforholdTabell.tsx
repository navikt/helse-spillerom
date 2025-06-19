'use client'

import { ReactElement, useState } from 'react'
import { Alert, BodyShort, Box, Button, Table, VStack } from '@navikt/ds-react'
import { Modal } from '@navikt/ds-react'
import {
    TableBody,
    TableDataCell,
    TableExpandableRow,
    TableHeader,
    TableHeaderCell,
    TableRow,
} from '@navikt/ds-react/Table'
import { PlusIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons'
import { AnimatePresence, motion } from 'motion/react'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'
import { useSlettInntektsforhold } from '@hooks/mutations/useSlettInntektsforhold'
import InntektsforholdForm from '@components/saksbilde/inntektsforhold/InntektsforholdForm'

export function InntektsforholdTabell({ value }: { value: string }): ReactElement {
    const [visOpprettForm, setVisOpprettForm] = useState(false)
    const [slettModalOpen, setSlettModalOpen] = useState(false)
    const [inntektsforholdTilSlett, setInntektsforholdTilSlett] = useState<string | null>(null)
    const { data: inntektsforhold, isLoading, isError } = useInntektsforhold()
    const slettMutation = useSlettInntektsforhold()

    if (isLoading) return <SaksbildePanel value={value}>Laster...</SaksbildePanel>
    if (isError)
        return (
            <SaksbildePanel value={value}>
                <Alert variant="error">Kunne ikke laste inntektsforhold</Alert>
            </SaksbildePanel>
        )

    const handleSlett = (inntektsforholdId: string) => {
        setInntektsforholdTilSlett(inntektsforholdId)
        setSlettModalOpen(true)
    }

    const confirmSlett = () => {
        if (inntektsforholdTilSlett) {
            slettMutation.mutate({ inntektsforholdId: inntektsforholdTilSlett })
            setSlettModalOpen(false)
            setInntektsforholdTilSlett(null)
        }
    }

    const cancelSlett = () => {
        setSlettModalOpen(false)
        setInntektsforholdTilSlett(null)
    }

    return (
        <SaksbildePanel value={value}>
            <VStack gap="6">
                <Button
                    className="w-fit"
                    variant="secondary"
                    size="small"
                    icon={<PlusIcon aria-hidden />}
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
                                <TableHeaderCell className="ignore-axe" />
                                <TableHeaderCell>Inntektsforhold</TableHeaderCell>
                                <TableHeaderCell>Organisasjon</TableHeaderCell>
                                <TableHeaderCell>Sykmeldt</TableHeaderCell>
                                <TableHeaderCell className="ignore-axe" />
                                <TableHeaderCell className="ignore-axe" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inntektsforhold.map((forhold) => (
                                <TableExpandableRow key={forhold.id} expandOnRowClick content="placeholder">
                                    <TableDataCell>
                                        <BodyShort>{getInntektsforholdDisplayText(forhold.kategorisering)}</BodyShort>
                                    </TableDataCell>
                                    <TableDataCell>
                                        <VStack gap="1">
                                            {forhold.kategorisering['ORGNAVN'] && (
                                                <BodyShort weight="semibold">
                                                    {forhold.kategorisering['ORGNAVN']}
                                                </BodyShort>
                                            )}
                                            {forhold.kategorisering['ORGNUMMER'] && (
                                                <BodyShort className="font-mono text-sm text-gray-600">
                                                    {forhold.kategorisering['ORGNUMMER']}
                                                </BodyShort>
                                            )}
                                            {!forhold.kategorisering['ORGNUMMER'] &&
                                                !forhold.kategorisering['ORGNAVN'] && (
                                                    <BodyShort className="text-gray-500">-</BodyShort>
                                                )}
                                        </VStack>
                                    </TableDataCell>
                                    <TableDataCell>
                                        <BodyShort>
                                            {forhold.kategorisering['ER_SYKMELDT'] === 'ER_SYKMELDT_JA' ? 'Ja' : 'Nei'}
                                        </BodyShort>
                                    </TableDataCell>
                                    <TableDataCell>
                                        <Button variant="tertiary" size="small" icon={<PencilIcon aria-hidden />}>
                                            Rediger
                                        </Button>
                                    </TableDataCell>
                                    <TableDataCell>
                                        <Button
                                            className="text-red-500"
                                            variant="tertiary"
                                            size="small"
                                            icon={<TrashIcon aria-hidden />}
                                            onClick={() => handleSlett(forhold.id)}
                                            disabled={slettMutation.isPending}
                                        >
                                            Slett
                                        </Button>
                                    </TableDataCell>
                                </TableExpandableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Alert variant="info">
                        <BodyShort>Ingen inntektsforhold registrert for denne saksbehandlingsperioden.</BodyShort>
                    </Alert>
                )}
            </VStack>

            <Modal
                open={slettModalOpen}
                onClose={cancelSlett}
                header={{
                    heading: 'Slett inntektsforhold',
                }}
            >
                <Modal.Body>
                    <BodyShort>
                        Er du sikker på at du vil slette dette inntektsforholdet? Denne handlingen kan ikke angres.
                    </BodyShort>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={confirmSlett} loading={slettMutation.isPending}>
                        Slett
                    </Button>
                    <Button variant="secondary" onClick={cancelSlett} disabled={slettMutation.isPending}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </SaksbildePanel>
    )
}

function getInntektsforholdDisplayText(kategorisering: Record<string, string | string[]>): string {
    const inntektskategori = kategorisering['INNTEKTSKATEGORI'] as string

    switch (inntektskategori) {
        case 'ARBEIDSTAKER': {
            const typeArbeidstaker = kategorisering['TYPE_ARBEIDSTAKER']
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
            const typeSelvstendig = kategorisering['TYPE_SELVSTENDIG_NÆRINGSDRIVENDE']
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
